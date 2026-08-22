import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

/**
 * Minimal mock of the `res` object that a `getServerSideProps` receives. The SSR
 * routes only touch `statusCode` and `setHeader` (and, for the sitemap, `write`
 * / `end`), so those are the only members stubbed. Every method is a `jest.fn`
 * so tests can assert the exact side effects (status codes, cache headers, the
 * streamed XML body) the way they would observe them over the wire.
 */
export interface MockSsrResponse {
  statusCode: number;
  setHeader: jest.Mock;
  write: jest.Mock;
  end: jest.Mock;
}

export const createMockResponse = (): MockSsrResponse => ({
  // Next initializes a 200 before getServerSideProps runs; the failure branches
  // mutate this to 503, so the default mirrors the real starting value.
  statusCode: 200,
  setHeader: jest.fn(),
  write: jest.fn(),
  end: jest.fn(),
});

interface MockContextOptions {
  query?: ParsedUrlQuery;
  params?: ParsedUrlQuery;
  res?: MockSsrResponse;
}

/**
 * Builds a `getServerSideProps` context carrying just the members the SSR routes
 * read (`query`, `params`, `res`). The cast is deliberate: reconstructing the
 * full `GetServerSidePropsContext` (req, resolvedUrl, preview flags…) would be
 * noise no route under test ever reads.
 */
export const createMockContext = ({
  query = {},
  params = {},
  res = createMockResponse(),
}: MockContextOptions = {}): GetServerSidePropsContext & { res: MockSsrResponse } => ({
  query,
  params,
  res,
} as unknown as GetServerSidePropsContext & { res: MockSsrResponse });
