import buildFullName from './buildFullName';

describe('buildFullName', () => {
  it('joins both parts with a single space', () => {
    expect(buildFullName('Marina', 'López')).toBe('Marina López');
  });

  it('returns only the first name when the last name is missing', () => {
    expect(buildFullName('Marina', undefined)).toBe('Marina');
  });

  it('returns only the first name when the last name is an empty string', () => {
    expect(buildFullName('Marina', '')).toBe('Marina');
  });

  it('returns only the first name when the last name is whitespace-only', () => {
    expect(buildFullName('Marina', '   ')).toBe('Marina');
  });

  it('returns only the last name when the first name is missing', () => {
    expect(buildFullName(undefined, 'López')).toBe('López');
  });

  it('returns only the last name when the first name is whitespace-only', () => {
    expect(buildFullName('  ', 'López')).toBe('López');
  });

  it('returns an empty string when both parts are missing', () => {
    expect(buildFullName(undefined, undefined)).toBe('');
  });

  it('returns an empty string when both parts are blank', () => {
    expect(buildFullName('', '   ')).toBe('');
  });

  it('trims each part so surrounding whitespace cannot become an interior double space', () => {
    expect(buildFullName('Marina ', ' López')).toBe('Marina López');
  });

  it('keeps inner spaces of compound names untouched', () => {
    expect(buildFullName(' María José ', ' de la Torre ')).toBe('María José de la Torre');
  });
});
