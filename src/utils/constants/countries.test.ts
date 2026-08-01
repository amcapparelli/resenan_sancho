/**
 * The country list is generated code: these assertions guard the invariants the
 * UI relies on (ISO alpha-2 values, no duplicates, pre-sorted in Spanish) so a
 * future regeneration cannot silently break the profile form.
 */
import { COUNTRIES, getCountryName } from './countries';

describe('COUNTRIES', () => {
  it('holds the full ISO 3166-1 alpha-2 list', () => {
    expect(COUNTRIES).toHaveLength(249);
  });

  it('exposes unique, well formed alpha-2 codes', () => {
    const codes = COUNTRIES.map(({ isoCode }) => isoCode);

    codes.forEach((isoCode) => expect(isoCode).toMatch(/^[A-Z]{2}$/));
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('is pre-sorted by Spanish name, so consumers never re-sort it', () => {
    const names = COUNTRIES.map(({ nameEs }) => nameEs);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'es'));

    expect(names).toEqual(sorted);
  });
});

describe('getCountryName', () => {
  it('translates a known code to its Spanish name', () => {
    expect(getCountryName('ES')).toBe('España');
  });

  // The markets the product actually serves: a bad generation would most likely
  // show up as a missing accent or an English name in one of these.
  it.each([
    ['ES', 'España'],
    ['MX', 'México'],
    ['AR', 'Argentina'],
    ['CO', 'Colombia'],
    ['US', 'Estados Unidos'],
  ])('translates %s to %s', (isoCode, expectedName) => {
    expect(getCountryName(isoCode)).toBe(expectedName);
  });

  it('returns undefined for an unknown code', () => {
    expect(getCountryName('ZZ')).toBeUndefined();
  });

  // The code comes from legacy free-text data, so it can collide with prototype
  // members. Returning `Object.prototype.toString` here would render a function
  // as a React child wherever the name is shown.
  it('does not leak prototype members for codes like "toString"', () => {
    expect(getCountryName('toString')).toBeUndefined();
    expect(getCountryName('constructor')).toBeUndefined();
  });

  it('returns undefined when there is no code at all', () => {
    expect(getCountryName(undefined)).toBeUndefined();
    expect(getCountryName('')).toBeUndefined();
  });
});
