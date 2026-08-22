/**
 * Unit tests for the /libros/genero/[slug] genre landing SSR entry point. The
 * data fetch (`getBooks`) is mocked at the module boundary; the slug/path
 * helpers run for real so the page-1 redirect destination is verified end to
 * end against `buildGenrePath`.
 */
import { getServerSideProps } from '../../../../pages/libros/genero/[slug]';
import { getBooks, GetBooksResult } from '../../../../utils/seo/getBooks';
import { createMockContext } from '../../../../test-utils/ssrContext';

jest.mock('../../../../utils/seo/getBooks');

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

describe('libros/genero/[slug] getServerSideProps — 404 branches', () => {
  it('returns notFound when the slug is missing', async () => {
    const context = createMockContext({ params: {} });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });

  it('returns notFound for an unknown genre slug', async () => {
    const context = createMockContext({ params: { slug: 'not-a-genre' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });

  it('returns notFound for an unknown format on a valid genre', async () => {
    const context = createMockContext({
      params: { slug: 'terror' },
      query: { format: 'not-a-format' },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });
});

describe('libros/genero/[slug] getServerSideProps — page normalization redirect', () => {
  it.each([
    ['1', '/libros/genero/terror'],
    ['0', '/libros/genero/terror'],
    ['abc', '/libros/genero/terror'],
  ])('redirects a present page=%s to the clean landing path', async (page, destination) => {
    const context = createMockContext({
      params: { slug: 'terror' },
      query: { page },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ redirect: { destination, permanent: true } });
    expect(mockedGetBooks).not.toHaveBeenCalled();
  });

  it('keeps the format facet while dropping page=1', async () => {
    const context = createMockContext({
      params: { slug: 'terror' },
      query: { format: 'papel', page: '1' },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: {
        destination: '/libros/genero/terror?format=papel',
        permanent: true,
      },
    });
  });
});

describe('libros/genero/[slug] getServerSideProps — happy path', () => {
  it('returns props and a short-lived cache header on a successful fetch', async () => {
    mockedGetBooks.mockResolvedValue(okResult());
    const context = createMockContext({ params: { slug: 'terror' } });

    const result = await getServerSideProps(context);

    expect(mockedGetBooks).toHaveBeenCalledWith({
      genre: 'terror',
      format: undefined,
      page: 1,
    });
    expect(result).toEqual({
      props: {
        facets: { genre: 'terror', format: null, page: 1 },
        initialData: okResult(),
      },
    });
    expect(context.res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300',
    );
    expect(context.res.statusCode).toBe(200);
  });
});

describe('libros/genero/[slug] getServerSideProps — fetch failure', () => {
  it('serves 503 with no-store and still returns props on ok:false', async () => {
    mockedGetBooks.mockResolvedValue(failedResult);
    const context = createMockContext({ params: { slug: 'terror' } });

    const result = await getServerSideProps(context);

    expect(context.res.statusCode).toBe(503);
    expect(context.res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(result).toEqual({
      props: {
        facets: { genre: 'terror', format: null, page: 1 },
        initialData: failedResult,
      },
    });
  });
});
