import { homeHighlights as HOME_HIGHLIGHTS_URL } from '../../config/routes';

/**
 * A book in the "featured" block, exactly as the API returns it.
 *
 * The payload is deliberately thin (no cover, no synopsis): it feeds a
 * text-only card, not the full Book shape used by /books.
 */
export interface HighlightBook {
  id: string;
  title: string;
  /**
   * Author name already flattened by the API (`name + lastName`). It is `null`
   * when the author account was deleted, and real data contains double spaces
   * (e.g. "Eric  Marreros"), so it is whitespace-normalized on the way in.
   */
  author: string | null;
  /** Internal 3-letter DB genre code (e.g. "HIF"). Translated at the SSR boundary. */
  genre: string;
  /** Available copies. The API already filters out books with 0 copies. */
  copies: number;
}

/** A genre in the "top genres" block, with the raw DB code the API returns. */
export interface HighlightGenre {
  code: string;
  totalBooks: number;
}

export interface GetHomeHighlightsResult {
  /**
   * Whether the fetch actually reached the API and returned a valid response.
   * `true` for any real response — including legitimately empty blocks.
   * `false` only on a network/HTTP/parse failure. The home page uses this to
   * avoid emitting a cacheable response built on a broken fetch.
   */
  ok: boolean;
  featuredBooks: HighlightBook[];
  topGenres: HighlightGenre[];
}

// Failure sentinel: empty blocks flagged as a fetch failure (ok: false).
const FAILED_RESULT: GetHomeHighlightsResult = {
  ok: false,
  featuredBooks: [],
  topGenres: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

/** Collapses runs of whitespace, which the flattened author names do contain. */
const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

/**
 * Entries are validated field by field (rather than cast) because these values
 * end up in `getServerSideProps` props: a missing key would surface as
 * `undefined` and make Next throw a serialization error at render time.
 */
const parseBook = (raw: unknown): HighlightBook | null => {
  if (!isRecord(raw)) return null;

  const {
    id, title, author, genre, copies,
  } = raw;

  if (typeof id !== 'string' || typeof title !== 'string') return null;
  if (typeof genre !== 'string' || typeof copies !== 'number') return null;

  const normalizedAuthor = typeof author === 'string' ? normalizeWhitespace(author) : '';

  return {
    id,
    title: normalizeWhitespace(title),
    author: normalizedAuthor || null,
    genre,
    copies,
  };
};

const parseGenre = (raw: unknown): HighlightGenre | null => {
  if (!isRecord(raw)) return null;

  const { code, totalBooks } = raw;
  if (typeof code !== 'string' || typeof totalBooks !== 'number') return null;

  return { code, totalBooks };
};

const parseList = <T>(raw: unknown, parseItem: (item: unknown) => T | null): T[] => (
  Array.isArray(raw)
    ? raw.map(parseItem).filter((item): item is T => item !== null)
    : []
);

/**
 * Total budget for the call. `fetch` has no default timeout, and this request
 * blocks the SSR of the site root: without a deadline, a hanging API would hang
 * the home itself. Failing fast just drops the two blocks (see FAILED_RESULT).
 */
const FETCH_TIMEOUT_MS = 2500;

/**
 * Server-side fetcher for the home highlights blocks (featured books + top
 * genres). The endpoint is public and already caches for 24h on the backend,
 * so a single call per home render is cheap.
 *
 * On any network/parse/timeout error it resolves to a failure result
 * (`ok: false`) instead of throwing: the home must never 500 because the API
 * blipped, it just renders without these two blocks.
 */
export const getHomeHighlights = async (): Promise<GetHomeHighlightsResult> => {
  try {
    const response = await fetch(HOME_HIGHLIGHTS_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      // The page answers 200 without the blocks, so this log is the only trace
      // a permanently broken endpoint leaves in the server logs.
      // eslint-disable-next-line no-console
      console.error(
        `[getHomeHighlights] ${HOME_HIGHLIGHTS_URL} responded ${response.status}; rendering the home without highlights`,
      );
      return FAILED_RESULT;
    }

    const json: unknown = await response.json();
    if (!isRecord(json)) {
      // The most diagnostic of the three failures: a 200 whose body is not an
      // object means either the API contract changed or something else (a proxy,
      // an HTML error page) is answering for it.
      // eslint-disable-next-line no-console
      console.error(
        `[getHomeHighlights] ${HOME_HIGHLIGHTS_URL} returned a non-object payload; rendering the home without highlights`,
      );
      return FAILED_RESULT;
    }

    return {
      ok: true,
      featuredBooks: parseList(json.featuredBooks, parseBook),
      topGenres: parseList(json.topGenres, parseGenre),
    };
  } catch (error) {
    // Network error, timeout (AbortError) or invalid JSON. Same reasoning as
    // above: silent degradation would be invisible in production.
    // eslint-disable-next-line no-console
    console.error(
      `[getHomeHighlights] ${HOME_HIGHLIGHTS_URL} failed; rendering the home without highlights`,
      error,
    );
    return FAILED_RESULT;
  }
};
