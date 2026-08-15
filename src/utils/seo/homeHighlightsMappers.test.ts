/**
 * Tests for the SSR mapping of the highlights payload. The interesting rule is
 * asymmetric: an unknown genre code costs a book its tag but keeps the card,
 * while it drops a genre tile entirely (no slug, no landing page to link to).
 */
import { HighlightBook, HighlightGenre } from './getHomeHighlights';
import { toFeaturedBook, toTopGenre, mapDefined } from './homeHighlightsMappers';

const BOOK: HighlightBook = {
  id: '684cc507aa5f1100147f757c',
  title: 'Bastión, El Conocimiento Poderoso',
  author: 'Eric Marreros',
  genre: 'TER',
  copies: 22,
};

const GENRE: HighlightGenre = { code: 'FAN', totalBooks: 11 };

// A code that used to exist in the DB but is not in the facets table.
const UNKNOWN_CODE = 'ZZZ';

describe('toFeaturedBook', () => {
  it('resolves the DB genre code to its display name', () => {
    expect(toFeaturedBook(BOOK)).toEqual({
      id: '684cc507aa5f1100147f757c',
      title: 'Bastión, El Conocimiento Poderoso',
      author: 'Eric Marreros',
      genreName: 'Terror',
      copies: 22,
    });
  });

  it('keeps the book and omits only the tag when the genre is unknown', () => {
    const mapped = toFeaturedBook({ ...BOOK, genre: UNKNOWN_CODE });

    expect(mapped.id).toBe(BOOK.id);
    expect(mapped.title).toBe(BOOK.title);
    expect(mapped.copies).toBe(22);
    // Omitted, not undefined: Next cannot serialize `undefined` into props.
    expect(mapped).not.toHaveProperty('genreName');
  });

  it('keeps a null author as null', () => {
    expect(toFeaturedBook({ ...BOOK, author: null }).author).toBeNull();
  });
});

describe('toTopGenre', () => {
  it('resolves the code to the public slug and its display name', () => {
    expect(toTopGenre(GENRE)).toEqual({
      slug: 'fantasia',
      name: 'Fantasía',
      totalBooks: 11,
    });
  });

  it('drops the tile when the genre is unknown', () => {
    // Without a slug there is no /libros/genero/<slug> to point at.
    expect(toTopGenre({ ...GENRE, code: UNKNOWN_CODE })).toBeNull();
  });
});

describe('mapDefined', () => {
  it('drops only the rejected entries and keeps the rest of the list', () => {
    const genres: HighlightGenre[] = [
      GENRE,
      { code: UNKNOWN_CODE, totalBooks: 99 },
      { code: 'THR', totalBooks: 7 },
    ];

    expect(mapDefined(genres, toTopGenre)).toEqual([
      { slug: 'fantasia', name: 'Fantasía', totalBooks: 11 },
      { slug: 'thriller', name: 'Thriller', totalBooks: 7 },
    ]);
  });

  it('returns an empty list when every entry is rejected', () => {
    expect(mapDefined([{ code: UNKNOWN_CODE, totalBooks: 1 }], toTopGenre)).toEqual([]);
  });
});
