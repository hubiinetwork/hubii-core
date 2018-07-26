export const formatFiat = (amount, currency) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency,
}).format(amount);

// Accurate within 1 cent USD worth of Eth as of July 2018
export const approxEth = (amount) => +amount.toFixed(5);

// Eth has max 18 decimal places
export const formatEthAmount = (amount) => +amount.toFixed(18);
