/**
 * Unit tests for the /books SSR entry point (`getServerSideProps`). The route's
 * data fetch (`getBooks`) is mocked at the module boundary so these tests cover
 * only the route's own logic — facet validation, redirects, page normalization
 * and the cache/status headers — without touching the network. The slug/path
 * helpers (`facets`, `listSeo`) run for real so redirect destinations are
 * verified end to end against their true output.
 */
import { getServerSideProps } from '../../pages/books';
import { getBooks, GetBooksResult } from '../../utils/seo/getBooks';
import { createMockContext } from '../../test-utils/ssrContext';

jest.mock('../../utils/seo/getBooks');

const mockedGetBooks = getBooks as jest.MockedFunction<typeof getBooks>;

const okResult = (overrides: Partial<GetBooksResult> = {}): GetBooksResult => ({
  ok: true,
  books: [],
  totalElements: 5,
  totalPages: 1,
  ...overrides,
});

const failedResult: GetBooksResult = {
  ok: false,
  books: [],
  totalElements: 0,
  totalPages: 0,
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('books getServerSideProps — legacy detail redirect', () => {
  it('permanently redirects ?book=<id> to /books/<id>', async () => {
    const context = createMockContext({ query: { book: 'abc123' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: { destination: '/books/abc123', permanent: true },
    });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });
});

describe('books getServerSideProps — unknown facets 404', () => {
  it('returns notFound for an unknown genre slug', async () => {
    const context = createMockContext({ query: { genre: 'not-a-genre' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });

  it('returns notFound for an unknown format slug', async () => {
    const context = createMockContext({ query: { format: 'not-a-format' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });
});

describe('books getServerSideProps — genre promoted to path (phase S6)', () => {
  it('redirects a valid genre to its /libros/genero/<slug> landing', async () => {
    const context = createMockContext({ query: { genre: 'terror' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: { destination: '/libros/genero/terror', permanent: true },
    });
  });

  it('carries a valid format and page>1 into the landing, dropping genre & page=1', async () => {
    const context = createMockContext({
      query: { genre: 'fantasia', format: 'papel', page: '3' },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: {
        destination: '/libros/genero/fantasia?format=papel&page=3',
        permanent: true,
      },
    });
  });
});

describe('books getServerSideProps — page normalization redirect', () => {
  it.each([
    ['1', '/books'],
    ['0', '/books'],
    ['-2', '/books'],
    ['abc', '/books'],
  ])('redirects a present page=%s to the clean path', async (page, destination) => {
    const context = createMockContext({ query: { page } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ redirect: { destination, permanent: true } });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });

  it('keeps a validated format while dropping page=1', async () => {
    const context = createMockContext({ query: { format: 'papel', page: '1' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: { destination: '/books?format=papel', permanent: true },
    });
  });
});

describe('books getServerSideProps — happy path', () => {
  it('returns props and a short-lived cache header on a successful fetch', async () => {
    mockedGetBooks.mockResolvedValue(okResult());
    const context = createMockContext();

    const result = await getServerSideProps(context);

    expect(mockedGetBooks).toHaveBeenCalledWith({
      genre: undefined,
      format: undefined,
      page: 1,
    });
    expect(result).toEqual({
      props: {
        facets: { genre: null, format: null, page: 1 },
        initialData: okResult(),
      },
    });
    expect(context.res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300',
    );
    expect(context.res.statusCode).toBe(200);
  });

  it('forwards a page>1 with a validated format to the fetcher', async () => {
    mockedGetBooks.mockResolvedValue(okResult());
    const context = createMockContext({ query: { format: 'epub', page: '2' } });

    const result = await getServerSideProps(context);

    expect(mockedGetBooks).toHaveBeenCalledWith({
      genre: undefined,
      format: 'epub',
      page: 2,
    });
    expect(result).toEqual({
      props: {
        facets: { genre: null, format: 'epub', page: 2 },
        initialData: okResult(),
      },
    });
  });
});

describe('books getServerSideProps — fetch failure', () => {
  it('serves 503 with no-store and still returns props on ok:false', async () => {
    mockedGetBooks.mockResolvedValue(failedResult);
    const context = createMockContext();

    const result = await getServerSideProps(context);

    expect(context.res.statusCode).toBe(503);
    expect(context.res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(result).toEqual({
      props: {
        facets: { genre: null, format: null, page: 1 },
        initialData: failedResult,
      },
    });
  });
});
