import { Book } from '../../interfaces/books';
import { SITE_URL, SITE_NAME } from '../constants/seo';

// Target length for the meta description. Search engines truncate around
// 155-160 chars, so we aim for that and cut on a word boundary.
const DESCRIPTION_MAX_LENGTH = 158;

/**
 * Builds a human-readable author name, collapsing empty/missing parts so we
 * never render stray spaces (e.g. when only the first name is present).
 */
export const buildAuthorName = (author?: Book['author']): string => {
  if (!author) return '';
  return [author.name, author.lastName]
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .join(' ');
};

/**
 * Page <title> for a book detail page:
 * "<title> — <author> | Reseñan Sancho".
 * Falls back gracefully when the author is unknown.
 */
export const buildBookTitle = (book: Book): string => {
  const author = buildAuthorName(book.author);
  const titleWithAuthor = author ? `${book.title} — ${author}` : book.title;
  return `${titleWithAuthor} | ${SITE_NAME}`;
};

/**
 * Meta description derived from the synopsis, trimmed to ~155-160 chars on a
 * word boundary with an ellipsis. Falls back to a generic copy that still
 * mentions the title when no synopsis is available.
 */
export const buildBookDescription = (book: Book): string => {
  const synopsis = (book.synopsis || '').trim();

  if (!synopsis) {
    return `Descubre «${book.title}» en ${SITE_NAME}: género, formato y cómo pedir un ejemplar gratuito para reseñarlo.`;
  }

  if (synopsis.length <= DESCRIPTION_MAX_LENGTH) {
    return synopsis;
  }

  const truncated = synopsis.slice(0, DESCRIPTION_MAX_LENGTH);
  const lastSpace = truncated.lastIndexOf(' ');
  // Cut on the last whole word to avoid breaking mid-word; fall back to the
  // hard slice if there is no space (e.g. a single very long token).
  const trimmed = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return `${trimmed.trimEnd()}…`;
};

/**
 * Absolute URL of a book detail page, built from the canonical origin so it
 * stays consistent with the rest of the SEO metadata.
 */
export const buildBookUrl = (id: string): string => `${SITE_URL}/books/${id}`;

/**
 * schema.org/Book structured data for the book detail page.
 */
export const buildBookJsonLd = (book: Book): Record<string, unknown> => {
  const author = buildAuthorName(book.author);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    url: buildBookUrl(book._id),
  };

  if (author) {
    jsonLd.author = { '@type': 'Person', name: author };
  }
  if (book.genre) jsonLd.genre = book.genre;
  if (book.cover) jsonLd.image = book.cover;
  if (book.synopsis) jsonLd.description = book.synopsis.trim();

  return jsonLd;
};

/**
 * schema.org/BreadcrumbList structured data: Inicio › Libros › <title>.
 * All item URLs are absolute, as required by the spec.
 */
export const buildBreadcrumbJsonLd = (book: Book): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Libros',
      item: `${SITE_URL}/books`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: book.title,
      item: buildBookUrl(book._id),
    },
  ],
});
