// Sibling of formatAvailableCopies: single source for the "books to review"
// count shown next to a genre, with the singular handled so it never renders
// "1 libros para reseñar".
const formatBookCount = (books: number): string => (
  `${books} ${books === 1 ? 'libro para reseñar' : 'libros para reseñar'}`
);

export default formatBookCount;
