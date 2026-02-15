const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export const toToman = (amount: number, isRial = true): number => {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(isRial ? amount / 10 : amount);
};

export const formatPriceToman = (amount: number, isRial = true): string => {
  const toman = toToman(amount, isRial);
  return `${numberFormatter.format(toman)} تومان`;
};

