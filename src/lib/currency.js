

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
};

export const CURRENCY_NAMES = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  INR: "Indian Rupee",
};


export function getCurrencySymbol(currencyCode = "USD") {
  return CURRENCY_SYMBOLS[currencyCode] || "$";
}


export function formatCurrency(amount, currencyCode = "USD", includeDecimals = true) {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedAmount = includeDecimals
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString();

  return `${symbol}${formattedAmount}`;
}

export function getCurrencyName(currencyCode = "USD") {
  return CURRENCY_NAMES[currencyCode] || "US Dollar";
}
