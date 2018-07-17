export const formatFiat = (amount, currency) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency,
}).format(amount);

export const formatEth = (amount) => amount.toFixed(5);
