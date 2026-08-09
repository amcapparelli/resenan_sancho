import { SITE_NAME } from '../constants/seo';
import { getGenreLabel } from './facets';
import { ListFacets } from './listSeo';

/**
 * SEO builders for the /reviewers listing. They reuse the shared `ListFacets`
 * shape from listSeo.ts but differ from the /books builders in two ways that
 * are reviewer-specific by design:
 *
 *  1. Genre-only indexable. Only genre facets are indexable/self-canonical/in
 *     the sitemap. Format stays a working filter and can appear in the URL, but
 *     any URL carrying a `format` facet is noindex,follow (see
 *     `computeReviewerListIndexing`). So there is no format-based title/copy.
 *  2. The free-text `searchText` filter is client-only and never reaches these
 *     builders — it is not part of `ListFacets` and never enters the URL.
 */

export interface ReviewerListIndexing {
  indexable: boolean;
}

/**
 * Indexing decision for the reviewers listing.
 *
 * Policy (S4b): indexable ⇔ format is ABSENT AND totalElements > 0.
 *  - No facet, or genre-only, with results → indexable, self-canonical.
 *  - Any `format` present → noindex,follow (format is a working filter, not a
 *    landing page).
 *  - Empty results → noindex,follow (a dead-end for search), keeping `follow`
 *    so link equity still flows through.
 */
export const computeReviewerListIndexing = (
  facets: ListFacets,
  totalElements: number,
): ReviewerListIndexing => {
  const indexable = !facets.format && totalElements > 0;
  return { indexable };
};

/**
 * Unique <title> per facet combination, in Spanish (the indexable locale).
 * A page > 1 gets a " (página N)" suffix so paginated URLs stay self-canonical
 * without colliding titles. Format never specializes the title: format URLs are
 * noindex, so their <title> only needs to be non-empty, not unique.
 */
export const buildReviewerListTitle = (facets: ListFacets): string => {
  const genreLabel = facets.genre ? getGenreLabel(facets.genre, 'es') : undefined;

  const base = genreLabel
    ? `Reseñadores de ${genreLabel}`
    : 'Reseñadores literarios';

  const paged = facets.page > 1 ? `${base} (página ${facets.page})` : base;
  return `${paged} | ${SITE_NAME}`;
};

/** Meta description per facet combination, specialized by genre when present. */
export const buildReviewerListDescription = (facets: ListFacets): string => {
  const genreLabel = facets.genre ? getGenreLabel(facets.genre, 'es') : undefined;

  if (genreLabel) {
    return `Encuentra reseñadores literarios de ${genreLabel} para tu libro: booktubers, bookstagrammers y blogs especializados. Conecta con quien mejor encaje con tu obra en ${SITE_NAME}.`;
  }
  return 'Encuentra reseñadores literarios para tu libro: booktubers, bookstagrammers y blogs especializados. Filtra por género y conecta con quien mejor encaje con tu obra.';
};

/**
 * Canonical/current path for the listing, with a DETERMINISTIC param order
 * (genre, format, page) so the self-canonical URL is stable regardless of the
 * order params arrived in. Page 1 is never emitted (normalized upstream).
 *
 * Format is included when present so a noindex format URL still self-canonicals
 * to itself rather than folding into the bare /reviewers.
 */
export const buildReviewerListPath = (facets: ListFacets): string => {
  const params: string[] = [];
  if (facets.genre) params.push(`genre=${facets.genre}`);
  if (facets.format) params.push(`format=${facets.format}`);
  if (facets.page > 1) params.push(`page=${facets.page}`);

  return params.length > 0 ? `/reviewers?${params.join('&')}` : '/reviewers';
};
