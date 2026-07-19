const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

// Single formatter for every amount shown to the user. The service card and the
// payment button must never disagree on what something costs, and money is a
// bad place for two copies of the same rounding rules to drift apart.
const formatPriceCents = (priceCents: number): string => priceFormatter.format(priceCents / 100);

export default formatPriceCents;
