/**
 * Unit tests for the /reviewers SSR entry point (`getServerSideProps`). Mirrors
 * the /books tests except there is no legacy ?book redirect: reviewers have no
 * detail page. `getReviewers` is mocked at the module boundary; the slug/path
 * helpers run for real so redirect destinations are verified end to end.
 */
import { getServerSideProps } from './reviewers';
import { getReviewers, GetReviewersResult } from '../utils/seo/getReviewers';
import { createMockContext } from '../test-utils/ssrContext';

jest.mock('../utils/seo/getReviewers');

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

describe('reviewers getServerSideProps — unknown facets 404', () => {
  it('returns notFound for an unknown genre slug', async () => {
    const context = createMockContext({ query: { genre: 'not-a-genre' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetReviewers).not.toHaveBeenCalled();
  });

  it('returns notFound for an unknown format slug', async () => {
    const context = createMockContext({ query: { format: 'not-a-format' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
    expect(mockedGetReviewers).not.toHaveBeenCalled();
  });
});

describe('reviewers getServerSideProps — genre promoted to path (phase S6b)', () => {
  it('redirects a valid genre to its /resenadores/genero/<slug> landing', async () => {
    const context = createMockContext({ query: { genre: 'romantica' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: { destination: '/resenadores/genero/romantica', permanent: true },
    });
  });

  it('carries a valid format and page>1 into the landing, dropping genre & page=1', async () => {
    const context = createMockContext({
      query: { genre: 'terror', format: 'papel', page: '4' },
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: {
        destination: '/resenadores/genero/terror?format=papel&page=4',
        permanent: true,
      },
    });
  });
});

describe('reviewers getServerSideProps — page normalization redirect', () => {
  it.each([
    ['1', '/reviewers'],
    ['0', '/reviewers'],
    ['-2', '/reviewers'],
    ['abc', '/reviewers'],
  ])('redirects a present page=%s to the clean path', async (page, destination) => {
    const context = createMockContext({ query: { page } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ redirect: { destination, permanent: true } });
    expect(mockedGetReviewers).not.toHaveBeenCalled();
  });

  it('keeps a validated format while dropping page=1', async () => {
    const context = createMockContext({ query: { format: 'papel', page: '1' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: { destination: '/reviewers?format=papel', permanent: true },
    });
  });
});

describe('reviewers getServerSideProps — happy path', () => {
  it('returns props and a short-lived cache header on a successful fetch', async () => {
    mockedGetReviewers.mockResolvedValue(okResult());
    const context = createMockContext();

    const result = await getServerSideProps(context);

    expect(mockedGetReviewers).toHaveBeenCalledWith({
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
});

describe('reviewers getServerSideProps — fetch failure', () => {
  it('serves 503 with no-store and still returns props on ok:false', async () => {
    mockedGetReviewers.mockResolvedValue(failedResult);
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
