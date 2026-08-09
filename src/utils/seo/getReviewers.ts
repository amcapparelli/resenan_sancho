import { Reviewer } from '../../interfaces/reviewer';
import { reviewers as REVIEWERS_URL } from '../../config/routes';
import { buildQueryString } from '../buildQueryString';
import { genreSlugToCode } from './facets';

/**
 * Result shape shared by the reviewers listing view, its SSR props and the
 * sitemap. Mirrors what the `reviewersListLoad` reducer already stores so SSR
 * data can be fed straight into the client state without reshaping.
 */
export interface GetReviewersResult {
  /**
   * Whether the fetch actually reached the API and returned a valid response.
   * `true` for any real response — including a legitimate 0-result facet.
   * `false` only on a network/HTTP/parse failure. Callers use this to tell a
   * genuine empty listing (index as noindex,follow) apart from a transient API
   * blip (serve 503/no-store so a broken response never gets cached).
   */
  ok: boolean;
  reviewers: Array<Reviewer & { _id?: string }>;
  totalElements: number;
  totalPages: number;
}

export interface GetReviewersParams {
  /** Public genre slug (e.g. "romantica"). Mapped to the DB code internally. */
  genre?: string;
  /** Format value, used verbatim (e.g. "papel"). */
  format?: string;
  page?: number;
  /** Optional page size, forwarded to the API when a caller needs a wide pull. */
  size?: number;
}

// Failure sentinel: an empty result flagged as a fetch failure (ok: false).
const FAILED_RESULT: GetReviewersResult = {
  ok: false,
  reviewers: [],
  totalElements: 0,
  totalPages: 0,
};

/**
 * Server-side reviewers list fetcher. Reusable by both the /reviewers SSR page
 * and the sitemap. Accepts public SLUGS and translates the genre slug to the DB
 * code the API expects (the genre <select> submits the same code); the format
 * value is already the DB value.
 *
 * Note: the reviewers UI has a free-text `searchText` filter, but it is
 * deliberately CLIENT-ONLY — it never reaches SSR or the URL, so this helper
 * intentionally exposes no `searchText` param.
 *
 * On any network/parse error it resolves to a failure result (`ok: false`)
 * instead of throwing so the caller (page or sitemap) can decide how to degrade.
 * A real response with 0 reviewers resolves to `ok: true`.
 */
export const getReviewers = async ({
  genre,
  format,
  page,
  size,
}: GetReviewersParams = {}): Promise<GetReviewersResult> => {
  const query = buildQueryString({
    // Canonical param order: genre, format, page. buildQueryString drops empty
    // values, so undefined facets are omitted.
    genre: genre ? genreSlugToCode(genre) : undefined,
    format,
    page,
    size,
  });

  try {
    const response = await fetch(`${REVIEWERS_URL}?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return FAILED_RESULT;

    const json = await response.json();
    return {
      ok: true,
      reviewers: Array.isArray(json?.reviewers) ? json.reviewers : [],
      totalElements: json?.totalElements ?? 0,
      totalPages: json?.totalPages ?? 0,
    };
  } catch {
    return FAILED_RESULT;
  }
};
