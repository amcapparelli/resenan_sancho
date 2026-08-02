import { SITE_NAME } from '../constants/seo';
import { getGenreLabel, getFormatLabel } from './facets';

/** Normalized, validated facets as they arrive from getServerSideProps. */
export interface ListFacets {
  /** Valid genre slug, or null when absent. */
  genre: string | null;
  /** Valid format value, or null when absent. */
  format: string | null;
  /** Current page (>= 1). Page 1 is normalized away from the URL upstream. */
  page: number;
}

/**
 * Indexing decision for a listing view, computed on the server so the emitted
 * robots tag matches what a crawler fetching the raw HTML sees.
 *
 * Policy (S4):
 *  - 0 or 1 active facet AND totalElements > 0 → indexable, self-canonical.
 *  - 2 active facets OR empty results          → noindex, follow.
 * "Active facet" counts present facets among { genre, format }.
 */
export interface ListIndexing {
  indexable: boolean;
}

export const getActiveFacetCount = (facets: ListFacets): number =>
  (facets.genre ? 1 : 0) + (facets.format ? 1 : 0);

export const computeListIndexing = (
  facets: ListFacets,
  totalElements: number,
): ListIndexing => {
  const activeFacets = getActiveFacetCount(facets);
  // Two combined facets slice the catalogue too thin to be worth indexing as a
  // landing page, and an empty result set is a dead-end for search — both stay
  // out of the index but keep `follow` so link equity still flows through.
  const indexable = activeFacets <= 1 && totalElements > 0;
  return { indexable };
};

/**
 * Unique <title> per facet combination, in Spanish (the indexable locale).
 * A page > 1 gets a " (página N)" suffix so paginated URLs stay self-canonical
 * without colliding titles.
 */
export const buildListTitle = (facets: ListFacets): string => {
  const genreLabel = facets.genre ? getGenreLabel(facets.genre, 'es') : undefined;
  const formatLabel = facets.format ? getFormatLabel(facets.format, 'es') : undefined;

  let base: string;
  if (genreLabel) {
    base = `Libros de ${genreLabel} para reseñar`;
  } else if (formatLabel) {
    base = `Libros en ${formatLabel} para reseñar`;
  } else {
    base = 'Libros para reseñar';
  }

  const paged = facets.page > 1 ? `${base} (página ${facets.page})` : base;
  return `${paged} | ${SITE_NAME}`;
};

/** Meta description per facet combination, mirroring the title's facet logic. */
export const buildListDescription = (facets: ListFacets): string => {
  const genreLabel = facets.genre ? getGenreLabel(facets.genre, 'es') : undefined;
  const formatLabel = facets.format ? getFormatLabel(facets.format, 'es') : undefined;

  if (genreLabel) {
    return `Encuentra libros de ${genreLabel} gratis para reseñar en tu blog, booktube o bookstagram. Pide tu ejemplar en ${SITE_NAME}.`;
  }
  if (formatLabel) {
    return `Encuentra libros en ${formatLabel} gratis para reseñar en tu blog, booktube o bookstagram. Pide tu ejemplar en ${SITE_NAME}.`;
  }
  return 'Encuentra libros gratis para reseñar en tu blog, booktube o bookstagram. Filtra por género y formato y elige tu próxima lectura en Reseñan Sancho.';
};

/**
 * Canonical/current path for the listing, with a DETERMINISTIC param order
 * (genre, format, page) so the self-canonical URL is stable regardless of the
 * order params arrived in. Page 1 is never emitted (normalized upstream).
 */
export const buildListPath = (facets: ListFacets): string => {
  const params: string[] = [];
  if (facets.genre) params.push(`genre=${facets.genre}`);
  if (facets.format) params.push(`format=${facets.format}`);
  if (facets.page > 1) params.push(`page=${facets.page}`);

  return params.length > 0 ? `/books?${params.join('&')}` : '/books';
};
