export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return '0,00 €';
  return `${price.toFixed(2).replace('.', ',')} €`;
};
