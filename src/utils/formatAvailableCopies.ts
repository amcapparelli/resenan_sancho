// Single source for the "available copies" sentence. It is shown in three
// places (book detail, my books row, promote modal) and it is easy to forget
// the singular, which used to render "1 ejemplares disponibles" in production.
const formatAvailableCopies = (copies: number): string => (
  `${copies} ${copies === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}`
);

export default formatAvailableCopies;
