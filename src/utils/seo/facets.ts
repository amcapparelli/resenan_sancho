/**
 * Single source of truth for the public, indexable listing facets.
 *
 * The listing URLs (the /libros/genero/<slug> genre landing and the
 * /books?format=<value> format facet) are part of the SEO surface, so the slugs
 * are STABLE public identifiers and must never drift.
 * They are decoupled from the internal genre `code` the API/DB uses (ADV, ROM…)
 * and from the i18n keys used elsewhere in the UI: a URL slug is ASCII,
 * accent-free and human-readable, whereas the code is an opaque DB value.
 *
 * Everything a caller needs to translate between the three representations
 * (slug ↔ code ↔ display label) lives here, plus validation helpers so the
 * SSR layer can reject unknown facets with a 404 instead of serving garbage.
 */

export type Locale = 'es' | 'en';

interface GenreFacet {
  /** Stable public URL slug, e.g. "romantica". */
  slug: string;
  /** Internal API/DB genre code, e.g. "ROM". */
  code: string;
  /**
   * Long enum name from `AvailableGenres` (the i18n key), e.g. "romantic".
   * Books store the genre as a single `code`, but a Reviewer's `genres` array
   * holds these long names instead, so the reviewers sitemap needs to translate
   * name → slug (see `genreNameToSlug`).
   */
  name: string;
  /** Display labels for titles/copy. UI text is es-default, en-secondary. */
  label: { es: string; en: string };
}

interface FormatFacet {
  /** The format value is used verbatim as both slug and DB value. */
  value: string;
  label: { es: string; en: string };
}

// Approved slug ↔ code map (see S4 spec). Order is the canonical display order.
export const GENRE_FACETS: readonly GenreFacet[] = [
  { slug: 'aventura', code: 'ADV', name: 'adventure', label: { es: 'aventura', en: 'adventure' } },
  { slug: 'biografia', code: 'BIO', name: 'biography', label: { es: 'biografía', en: 'biography' } },
  { slug: 'ciencia-ficcion', code: 'CIF', name: 'cienceFiction', label: { es: 'ciencia ficción', en: 'science fiction' } },
  { slug: 'crimen', code: 'CRI', name: 'crime', label: { es: 'novela negra', en: 'crime' } },
  { slug: 'erotica', code: 'ERO', name: 'erotica', label: { es: 'erótica', en: 'erotica' } },
  { slug: 'fantasia', code: 'FAN', name: 'fantasy', label: { es: 'fantasía', en: 'fantasy' } },
  { slug: 'infantil', code: 'FCH', name: 'forChildren', label: { es: 'infantil', en: 'children\'s' } },
  { slug: 'juvenil', code: 'JUV', name: 'juvenile', label: { es: 'juvenil', en: 'young adult' } },
  { slug: 'novela-historica', code: 'HIF', name: 'historicalFiction', label: { es: 'novela histórica', en: 'historical fiction' } },
  { slug: 'humor', code: 'HUM', name: 'humor', label: { es: 'humor', en: 'humor' } },
  { slug: 'poesia', code: 'POE', name: 'poetry', label: { es: 'poesía', en: 'poetry' } },
  { slug: 'policiaca', code: 'POL', name: 'policial', label: { es: 'policíaca', en: 'crime fiction' } },
  { slug: 'drama-psicologico', code: 'PSD', name: 'psychologicalDrama', label: { es: 'drama psicológico', en: 'psychological drama' } },
  { slug: 'romantica', code: 'ROM', name: 'romantic', label: { es: 'romántica', en: 'romance' } },
  { slug: 'suspense', code: 'SUS', name: 'suspense', label: { es: 'suspense', en: 'suspense' } },
  { slug: 'terror', code: 'TER', name: 'terror', label: { es: 'terror', en: 'horror' } },
  { slug: 'thriller', code: 'THR', name: 'thriller', label: { es: 'thriller', en: 'thriller' } },
];

// Formats double as their own slug AND their DB value, so there is no mapping to
// invert — only labels to attach.
export const FORMAT_FACETS: readonly FormatFacet[] = [
  { value: 'papel', label: { es: 'papel', en: 'paperback' } },
  { value: 'epub', label: { es: 'epub', en: 'epub' } },
  { value: 'mobi', label: { es: 'mobi', en: 'mobi' } },
  { value: 'pdf', label: { es: 'pdf', en: 'pdf' } },
  { value: 'audiolibro', label: { es: 'audiolibro', en: 'audiobook' } },
];

// O(1) lookups built once at module load. The lists are tiny, but the indexes
// keep the helpers readable and avoid repeated linear scans in the sitemap,
// which iterates over every book.
const genreBySlug = new Map(GENRE_FACETS.map((g) => [g.slug, g]));
const genreByCode = new Map(GENRE_FACETS.map((g) => [g.code, g]));
const genreByName = new Map(GENRE_FACETS.map((g) => [g.name, g]));
const formatByValue = new Map(FORMAT_FACETS.map((f) => [f.value, f]));

// ─── Genre helpers ───────────────────────────────────────────────────────────

export const isValidGenreSlug = (slug: string): boolean => genreBySlug.has(slug);

/** Maps a public slug to the internal API/DB code, or undefined if unknown. */
export const genreSlugToCode = (slug: string): string | undefined =>
  genreBySlug.get(slug)?.code;

/** Maps an internal API/DB code back to its public slug, or undefined if unknown. */
export const genreCodeToSlug = (code: string): string | undefined =>
  genreByCode.get(code)?.slug;

/**
 * Maps a long genre enum name (an `AvailableGenres` value, e.g. "romantic") to
 * its public slug, or undefined if unknown. Needed by the reviewers sitemap:
 * a Reviewer's `genres` array stores these long names rather than the DB codes
 * that books use.
 */
export const genreNameToSlug = (name: string): string | undefined =>
  genreByName.get(name)?.slug;

export const getGenreLabel = (slug: string, locale: Locale = 'es'): string | undefined =>
  genreBySlug.get(slug)?.label[locale];

// ─── Format helpers ──────────────────────────────────────────────────────────

export const isValidFormatSlug = (slug: string): boolean => formatByValue.has(slug);

export const getFormatLabel = (value: string, locale: Locale = 'es'): string | undefined =>
  formatByValue.get(value)?.label[locale];
