/**
 * Currency utility functions for the expense tracker app
 */

// Cache for formatted currency values to avoid repeated calculations
const formatCache = new Map();
const CACHE_SIZE_LIMIT = 1000;

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

/**
 * Get the currency symbol for a given currency code
 * @param {string} currencyCode - The currency code (e.g., "USD", "INR")
 * @returns {string} - The currency symbol
 */
export function getCurrencySymbol(currencyCode = "USD") {
  return CURRENCY_SYMBOLS[currencyCode] || "$";
}

/**
 * Format an amount with the appropriate currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code
 * @param {boolean} includeDecimals - Whether to include decimal places
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currencyCode = "USD", includeDecimals = true) {
  // Create cache key
  const cacheKey = `${amount}-${currencyCode}-${includeDecimals}`;
  
  // Check cache first
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey);
  }

  const symbol = getCurrencySymbol(currencyCode);
  const formattedAmount = includeDecimals
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString();

  const result = `${symbol}${formattedAmount}`;
  
  // Store in cache with size limit
  if (formatCache.size >= CACHE_SIZE_LIMIT) {
    // Clear oldest entries (simple FIFO)
    const firstKey = formatCache.keys().next().value;
    formatCache.delete(firstKey);
  }
  formatCache.set(cacheKey, result);
  
  return result;
}

/**
 * Get currency name from code
 * @param {string} currencyCode - The currency code
 * @returns {string} - The currency name
 */
export function getCurrencyName(currencyCode = "USD") {
  return CURRENCY_NAMES[currencyCode] || "US Dollar";
}
