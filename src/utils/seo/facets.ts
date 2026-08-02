/**
 * Single source of truth for the public, indexable listing facets.
 *
 * The listing URLs (/books?genre=<slug>&format=<value>) are part of the SEO
 * surface, so the slugs are STABLE public identifiers and must never drift.
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
  { slug: 'aventura', code: 'ADV', label: { es: 'aventura', en: 'adventure' } },
  { slug: 'biografia', code: 'BIO', label: { es: 'biografía', en: 'biography' } },
  { slug: 'ciencia-ficcion', code: 'CIF', label: { es: 'ciencia ficción', en: 'science fiction' } },
  { slug: 'crimen', code: 'CRI', label: { es: 'novela negra', en: 'crime' } },
  { slug: 'erotica', code: 'ERO', label: { es: 'erótica', en: 'erotica' } },
  { slug: 'fantasia', code: 'FAN', label: { es: 'fantasía', en: 'fantasy' } },
  { slug: 'infantil', code: 'FCH', label: { es: 'infantil', en: 'children\'s' } },
  { slug: 'juvenil', code: 'JUV', label: { es: 'juvenil', en: 'young adult' } },
  { slug: 'novela-historica', code: 'HIF', label: { es: 'novela histórica', en: 'historical fiction' } },
  { slug: 'humor', code: 'HUM', label: { es: 'humor', en: 'humor' } },
  { slug: 'poesia', code: 'POE', label: { es: 'poesía', en: 'poetry' } },
  { slug: 'policiaca', code: 'POL', label: { es: 'policíaca', en: 'crime fiction' } },
  { slug: 'drama-psicologico', code: 'PSD', label: { es: 'drama psicológico', en: 'psychological drama' } },
  { slug: 'romantica', code: 'ROM', label: { es: 'romántica', en: 'romance' } },
  { slug: 'suspense', code: 'SUS', label: { es: 'suspense', en: 'suspense' } },
  { slug: 'terror', code: 'TER', label: { es: 'terror', en: 'horror' } },
  { slug: 'thriller', code: 'THR', label: { es: 'thriller', en: 'thriller' } },
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
const formatByValue = new Map(FORMAT_FACETS.map((f) => [f.value, f]));

// ─── Genre helpers ───────────────────────────────────────────────────────────

export const isValidGenreSlug = (slug: string): boolean => genreBySlug.has(slug);

/** Maps a public slug to the internal API/DB code, or undefined if unknown. */
export const genreSlugToCode = (slug: string): string | undefined =>
  genreBySlug.get(slug)?.code;

/** Maps an internal API/DB code back to its public slug, or undefined if unknown. */
export const genreCodeToSlug = (code: string): string | undefined =>
  genreByCode.get(code)?.slug;

export const getGenreLabel = (slug: string, locale: Locale = 'es'): string | undefined =>
  genreBySlug.get(slug)?.label[locale];

// ─── Format helpers ──────────────────────────────────────────────────────────

export const isValidFormatSlug = (slug: string): boolean => formatByValue.has(slug);

export const getFormatLabel = (value: string, locale: Locale = 'es'): string | undefined =>
  formatByValue.get(value)?.label[locale];
