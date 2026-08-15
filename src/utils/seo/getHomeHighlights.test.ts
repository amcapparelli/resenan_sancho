/**
 * Tests for the home highlights fetcher. The payloads below are copies of the
 * real production response (backend v3.4.0), including the double space in
 * "Eric  Marreros" that the flattened author name really carries.
 */
import { getHomeHighlights } from './getHomeHighlights';

const PRODUCTION_PAYLOAD = {
  featuredBooks: [
    {
      id: '684cc507aa5f1100147f757c',
      title: 'Bastión, El Conocimiento Poderoso',
      author: 'Eric  Marreros',
      genre: 'TER',
      copies: 22,
    },
    {
      id: '6534fd5e9208e90014391987',
      title: 'Astrid la Estrella del Norte',
      author: 'Juanjo Galvez Benavente',
      genre: 'HIF',
      copies: 17,
    },
  ],
  topGenres: [
    { code: 'FAN', totalBooks: 11 },
    { code: 'THR', totalBooks: 11 },
  ],
  cachedAt: '2026-08-15T12:36:07.461Z',
};

const mockFetchResolving = (payload: unknown, ok = true, status = 200): jest.Mock => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
  });
  global.fetch = fetchMock as unknown as typeof global.fetch;
  return fetchMock;
};

/** Silences the expected failure logs and lets the tests assert on them. */
const spyOnConsoleError = (): jest.SpyInstance => jest.spyOn(console, 'error').mockImplementation(() => {});

afterEach(() => {
  jest.restoreAllMocks();
  // In afterEach rather than inline: a failing assertion must not leak fake
  // timers into the rest of the file.
  jest.useRealTimers();
});

describe('getHomeHighlights — happy path', () => {
  it('maps both blocks and flags the fetch as successful', async () => {
    mockFetchResolving(PRODUCTION_PAYLOAD);

    const result = await getHomeHighlights();

    expect(result.ok).toBe(true);
    expect(result.featuredBooks).toHaveLength(2);
    expect(result.topGenres).toEqual([
      { code: 'FAN', totalBooks: 11 },
      { code: 'THR', totalBooks: 11 },
    ]);
  });

  it('collapses the double spaces real author names carry', async () => {
    mockFetchResolving(PRODUCTION_PAYLOAD);

    const { featuredBooks } = await getHomeHighlights();

    expect(featuredBooks[0].author).toBe('Eric Marreros');
  });

  it('resolves a deleted author to null', async () => {
    mockFetchResolving({
      ...PRODUCTION_PAYLOAD,
      featuredBooks: [{ ...PRODUCTION_PAYLOAD.featuredBooks[0], author: null }],
    });

    const { featuredBooks } = await getHomeHighlights();

    expect(featuredBooks[0].author).toBeNull();
  });

  it('resolves a whitespace-only author to null', async () => {
    mockFetchResolving({
      ...PRODUCTION_PAYLOAD,
      featuredBooks: [{ ...PRODUCTION_PAYLOAD.featuredBooks[0], author: '   ' }],
    });

    const { featuredBooks } = await getHomeHighlights();

    expect(featuredBooks[0].author).toBeNull();
  });
});

describe('getHomeHighlights — malformed data', () => {
  it('drops entries missing required fields instead of failing', async () => {
    // A book without `copies` would reach the page as `undefined` and break
    // Next's props serialization, so it must not survive the parse.
    mockFetchResolving({
      featuredBooks: [{
        id: 'x', title: 'Sin ejemplares', author: 'A', genre: 'TER',
      }],
      topGenres: [{ code: 'FAN' }, null],
    });

    const result = await getHomeHighlights();

    expect(result.ok).toBe(true);
    expect(result.featuredBooks).toEqual([]);
    expect(result.topGenres).toEqual([]);
  });

  it('returns empty blocks when the payload is not an object, and logs it', async () => {
    // A 200 with a non-object body points at a broken contract or at something
    // else answering for the API, so the log must say which failure it was.
    const consoleError = spyOnConsoleError();
    mockFetchResolving('nope');

    const result = await getHomeHighlights();

    expect(result).toEqual({ ok: false, featuredBooks: [], topGenres: [] });
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('non-object'));
  });
});

describe('getHomeHighlights — failures', () => {
  it('flags a non-2xx response as a failure and logs it', async () => {
    // The home answers 200 without the blocks, so the log is the only signal a
    // permanently broken endpoint leaves in the server logs.
    const consoleError = spyOnConsoleError();
    mockFetchResolving(PRODUCTION_PAYLOAD, false, 503);

    const result = await getHomeHighlights();

    expect(result).toEqual({ ok: false, featuredBooks: [], topGenres: [] });
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('503'));
  });

  it('never throws on a network error, and logs it', async () => {
    const consoleError = spyOnConsoleError();
    global.fetch = jest.fn().mockRejectedValue(new Error('ECONNRESET')) as unknown as typeof global.fetch;

    await expect(getHomeHighlights()).resolves.toEqual({
      ok: false,
      featuredBooks: [],
      topGenres: [],
    });
    expect(consoleError).toHaveBeenCalledWith(expect.any(String), expect.any(Error));
  });

  it('gives up on a hanging API instead of blocking the home render', async () => {
    const consoleError = spyOnConsoleError();
    type FetchInit = Parameters<typeof global.fetch>[1];
    // Never resolves: the only way out is the abort, and it rejects with the
    // signal's own `reason` — the same value the runtime produces — so the test
    // cannot pass on a made-up error that never went through the deadline.
    const hangUntilAborted = (_url: string, init?: FetchInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
    });
    const fetchMock = jest.fn(hangUntilAborted);
    global.fetch = fetchMock as unknown as typeof global.fetch;

    jest.useFakeTimers();
    const pending = getHomeHighlights();
    jest.advanceTimersByTime(3000);
    const result = await pending;

    expect(result).toEqual({ ok: false, featuredBooks: [], topGenres: [] });
    // Guards against a false green: without these, the test would also pass if
    // `AbortSignal.timeout` threw before `fetch` was ever called.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ name: 'TimeoutError' }),
    );
  });
});
