import { GENRE_FACETS, getGenreLabel, getGenreDisplayName } from './facets';

describe('getGenreDisplayName', () => {
  it('uppercases only the first letter of a multi-word label', () => {
    // Guards the reason this helper exists: CSS `capitalize` would render
    // "Novela Histórica", which is wrong in Spanish.
    expect(getGenreDisplayName('novela-historica')).toBe('Novela histórica');
    expect(getGenreDisplayName('ciencia-ficcion')).toBe('Ciencia ficción');
  });

  it('handles accented first letters', () => {
    expect(getGenreDisplayName('erotica')).toBe('Erótica');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getGenreDisplayName('no-existe')).toBeUndefined();
  });

  it('honours the locale', () => {
    expect(getGenreDisplayName('novela-historica', 'en')).toBe('Historical fiction');
  });

  it('never returns an empty string for a known slug', () => {
    GENRE_FACETS.forEach(({ slug }) => {
      expect(getGenreDisplayName(slug)).toBeTruthy();
    });
  });

  it('leaves the lowercase labels untouched (they are used mid-sentence)', () => {
    expect(getGenreLabel('novela-historica')).toBe('novela histórica');
  });
});
