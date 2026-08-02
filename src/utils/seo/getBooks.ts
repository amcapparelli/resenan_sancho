import { Book } from '../../interfaces/books';
import { books as BOOKS_URL } from '../../config/routes';
import { buildQueryString } from '../buildQueryString';
import { genreSlugToCode } from './facets';

/**
 * Result shape shared by the listing view, its SSR props and the sitemap.
 * Mirrors what the `booksListLoad` reducer already stores so SSR data can be
 * fed straight into the client state without reshaping.
 */
export interface GetBooksResult {
  /**
   * Whether the fetch actually reached the API and returned a valid response.
   * `true` for any real response — including a legitimate 0-result facet.
   * `false` only on a network/HTTP/parse failure. Callers use this to tell a
   * genuine empty listing (index as noindex,follow) apart from a transient API
   * blip (serve 503/no-store so a broken response never gets cached).
   */
  ok: boolean;
  books: Book[];
  totalElements: number;
  totalPages: number;
}

export interface GetBooksParams {
  /** Public genre slug (e.g. "romantica"). Mapped to the DB code internally. */
  genre?: string;
  /** Format value, used verbatim (e.g. "papel"). */
  format?: string;
  page?: number;
  /** Optional page size, forwarded to the API when a caller needs a wide pull. */
  size?: number;
}

// Failure sentinel: an empty result flagged as a fetch failure (ok: false).
const FAILED_RESULT: GetBooksResult = {
  ok: false,
  books: [],
  totalElements: 0,
  totalPages: 0,
};

/**
 * Server-side book list fetcher. Reusable by both the /books SSR page and the
 * sitemap (future genre landing routes will wrap it too). Accepts public SLUGS
 * and translates the genre slug to the DB code the API expects; the format
 * value is already the DB value.
 *
 * On any network/parse error it resolves to a failure result (`ok: false`)
 * instead of throwing so the caller (page or sitemap) can decide how to degrade
 * — neither should 500 because the API blipped. A real response with 0 books
 * resolves to `ok: true` so callers can distinguish it from a failure.
 */
export const getBooks = async ({
  genre,
  format,
  page,
  size,
}: GetBooksParams = {}): Promise<GetBooksResult> => {
  const query = buildQueryString({
    // Canonical param order: genre, format, page. The API ignores absent keys
    // (buildQueryString drops empty values), so undefined facets are omitted.
    genre: genre ? genreSlugToCode(genre) : undefined,
    format,
    page,
    size,
  });

  try {
    const response = await fetch(`${BOOKS_URL}?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return FAILED_RESULT;

    const json = await response.json();
    return {
      ok: true,
      books: Array.isArray(json?.books) ? json.books : [],
      totalElements: json?.totalElements ?? 0,
      totalPages: json?.totalPages ?? 0,
    };
  } catch {
    return FAILED_RESULT;
  }
};
