/**
 * Unit tests for the /books/[id] detail SSR entry point. This route calls
 * `fetch` directly (no data helper), so the module boundary mocked here is
 * `global.fetch`. Every branch resolves to either the book props or a 404 —
 * there are no redirects or cache headers on this route.
 */
import { getServerSideProps } from '../../../pages/books/[id]';
import { Book } from '../../../interfaces/books';
import { createMockContext } from '../../../test-utils/ssrContext';

// jsdom ships no global.fetch, so jest.spyOn(global, 'fetch') has nothing to spy
// on. We capture the original (undefined here) and restore it in afterEach so the
// mock genuinely does NOT leak across suites — the concern restoreAllMocks alone
// would silently miss for a direct reassignment.
const originalFetch = global.fetch;

const setFetch = (impl: jest.Mock): void => {
  global.fetch = impl as unknown as typeof global.fetch;
};

const mockFetchResolving = (body: unknown, ok = true): jest.Mock => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok,
    json: async () => body,
  });
  setFetch(fetchMock);
  return fetchMock;
};

// A book only needs an `_id` to pass the route's guard; the rest of the shape is
// irrelevant to getServerSideProps, which forwards the whole object verbatim.
const bookFixture = { _id: 'book-1', title: 'Un libro' } as unknown as Book;

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('books/[id] getServerSideProps', () => {
  it('returns notFound when the API responds not ok', async () => {
    mockFetchResolving({}, false);
    const context = createMockContext({ params: { id: 'missing' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
  });

  it('returns notFound when the body carries no book', async () => {
    mockFetchResolving({ book: undefined });
    const context = createMockContext({ params: { id: 'book-1' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
  });

  it('returns notFound when the book lacks an _id', async () => {
    mockFetchResolving({ book: { title: 'Sin id' } });
    const context = createMockContext({ params: { id: 'book-1' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
  });

  it('returns notFound when the fetch throws', async () => {
    setFetch(jest.fn().mockRejectedValue(new Error('network down')));
    const context = createMockContext({ params: { id: 'book-1' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ notFound: true });
  });

  it('returns the book as props when the API returns one with an _id', async () => {
    mockFetchResolving({ book: bookFixture });
    const context = createMockContext({ params: { id: 'book-1' } });

    const result = await getServerSideProps(context);

    expect(result).toEqual({ props: { book: bookFixture } });
  });
});
