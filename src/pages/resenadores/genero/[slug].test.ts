/**
 * Unit tests for the /resenadores/genero/[slug] reviewer genre landing SSR entry
 * point. Mirror of the /libros/genero/[slug] tests: `getReviewers` is mocked at
 * the module boundary; the slug/path helpers run for real so the page-1 redirect
 * destination is verified end to end against `buildReviewerGenrePath`.
 */
import { getServerSideProps } from './[slug]';
import { getReviewers, GetReviewersResult } from '../../../utils/seo/getReviewers';
import { createMockContext } from '../../../test-utils/ssrContext';

jest.mock('../../../utils/seo/getReviewers');

const mockedGetReviewers = getReviewers as jest.MockedFunction<typeof getReviewers>;

const okResult = (overrides: Partial<GetReviewersResult> = {}): GetReviewersResult => ({
  ok: true,
  reviewers: [],
  totalElements: 5,
  totalPages: 1,
  ...overrides,
});

const failedResult: GetReviewersResult = {
  ok: false,
  reviewers: [],
  totalElements: 0,
  totalPages: 0,
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('resenadores/genero/[slug] getServerSideProps — 404 branches', () => {
  it('returns notFound when the slug is missing', async () => {
    const context = createMockContext({ params: {} });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetReviewers).not.toHaveBeenCalled();
  });

  it('returns notFound for an unknown genre slug', async () => {
    const context = createMockContext({ params: { slug: 'not-a-genre' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetReviewers).not.toHaveBeenCalled();
  });

  it('returns notFound for an unknown format on a valid genre', async () => {
    const context = createMockContext({
      params: { slug: 'romantica' },
      query: { format: 'not-a-format' },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetReviewers).not.toHaveBeenCalled();
  });
});

describe('resenadores/genero/[slug] getServerSideProps — page normalization redirect', () => {
  it.each([
    ['1', '/resenadores/genero/romantica'],
    ['0', '/resenadores/genero/romantica'],
    ['abc', '/resenadores/genero/romantica'],
  ])('redirects a present page=%s to the clean landing path', async (page, destination) => {
    const context = createMockContext({
      params: { slug: 'romantica' },
      query: { page },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ redirect: { destination, permanent: true } });
    expect(mockedGetReviewers).not.toHaveBeenCalled();
  });

  it('keeps the format facet while dropping page=1', async () => {
    const context = createMockContext({
      params: { slug: 'romantica' },
      query: { format: 'papel', page: '1' },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: {
        destination: '/resenadores/genero/romantica?format=papel',
        permanent: true,
      },
    });
  });
});

describe('resenadores/genero/[slug] getServerSideProps — happy path', () => {
  it('returns props and a short-lived cache header on a successful fetch', async () => {
    mockedGetReviewers.mockResolvedValue(okResult());
    const context = createMockContext({ params: { slug: 'romantica' } });

    const result = await getServerSideProps(context);

    expect(mockedGetReviewers).toHaveBeenCalledWith({
      genre: 'romantica',
      format: undefined,
      page: 1,
    });
    expect(result).toEqual({
      props: {
        facets: { genre: 'romantica', format: null, page: 1 },
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

describe('resenadores/genero/[slug] getServerSideProps — fetch failure', () => {
  it('serves 503 with no-store and still returns props on ok:false', async () => {
    mockedGetReviewers.mockResolvedValue(failedResult);
    const context = createMockContext({ params: { slug: 'romantica' } });

    const result = await getServerSideProps(context);

    expect(context.res.statusCode).toBe(503);
    expect(context.res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(result).toEqual({
      props: {
        facets: { genre: 'romantica', format: null, page: 1 },
        initialData: failedResult,
      },
    });
  });
});
