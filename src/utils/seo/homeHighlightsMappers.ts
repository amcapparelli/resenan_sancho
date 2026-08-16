/**
 * SSR boundary between the highlights API payload and the home view-models.
 *
 * The API speaks internal 3-letter genre codes (ADV, ROM…); the UI must never
 * see one. Everything here runs in `getServerSideProps`, so the components
 * receive display names and public slugs only.
 */
import type { HighlightBook, HighlightGenre } from './getHomeHighlights';
// `import type` keeps this server-side module from pulling styled-components and
// next/link into its graph the day the components barrel exports a value.
import type { FeaturedBook, TopGenre } from '../../components/HomeHighlights';
import { genreCodeToSlug, getGenreDisplayName } from './facets';

/** Resolves a DB genre code to its display name, or undefined if unknown. */
const codeToGenreName = (code: string): string | undefined => {
  const slug = genreCodeToSlug(code);
  return slug ? getGenreDisplayName(slug) : undefined;
};

/**
 * A code missing from the facets table only costs the book its genre label:
 * the link, title, author and copies are still valid, and dropping the whole
 * card would leave a hole in the grid and contradict the block's subtitle
 * ("Los cuatro libros con más ejemplares disponibles").
 */
export const toFeaturedBook = (book: HighlightBook): FeaturedBook => {
  const genreName = codeToGenreName(book.genre);

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    copies: book.copies,
    // The keys are omitted, not set to undefined: these objects travel as
    // getServerSideProps props and Next refuses to serialize `undefined`.
    ...(genreName ? { genreName } : {}),
    ...(book.cover ? { cover: book.cover } : {}),
  };
};

/**
 * Genre tiles do need the code: without a slug there is no landing page to link
 * to, so an unknown code drops the tile (the caller filters out the nulls).
 */
export const toTopGenre = ({ code, totalBooks }: HighlightGenre): TopGenre | null => {
  const slug = genreCodeToSlug(code);
  const name = slug ? getGenreDisplayName(slug) : undefined;
  if (!slug || !name) return null;

  return { slug, name, totalBooks };
};

/** Maps a list and drops the entries the mapper rejected, keeping the rest. */
export const mapDefined = <TSource, TResult>(
  items: TSource[],
  map: (item: TSource) => TResult | null,
): TResult[] => items.map(map).filter((item): item is TResult => item !== null);
