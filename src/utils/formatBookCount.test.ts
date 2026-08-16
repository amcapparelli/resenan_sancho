import formatBookCount from './formatBookCount';

describe('formatBookCount', () => {
  it('uses the singular for a single book', () => {
    expect(formatBookCount(1)).toBe('1 libro para reseñar');
  });

  it('uses the plural for several books', () => {
    expect(formatBookCount(11)).toBe('11 libros para reseñar');
  });

  it('uses the plural for zero books', () => {
    expect(formatBookCount(0)).toBe('0 libros para reseñar');
  });
});
