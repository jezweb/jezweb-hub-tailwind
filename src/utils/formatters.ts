/**
 * Formatters Utility
 *
 * This utility file provides formatting functions for various data types
 * such as currency, dates, and numbers. These functions help maintain
 * consistent formatting throughout the application.
 */

/**
 * Format a number as currency (AUD)
 *
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'en-AU')
 * @param currency - The currency code (default: 'AUD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en-AU',
  currency: string = 'AUD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string to a localised date format
 *
 * @param dateString - The date string to format
 * @param locale - The locale to use for formatting (default: 'en-AU')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locale: string = 'en-AU'
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format a date string to YYYY-MM-DD format for HTML date inputs
 *
 * @param dateString - The date string to format
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

/**
 * Format a number with thousand separators
 *
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'en-AU')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  locale: string = 'en-AU'
): string => {
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Format a percentage value
 *
 * @param value - The decimal value to format as percentage (e.g., 0.25 for 25%)
 * @param locale - The locale to use for formatting (default: 'en-AU')
 * @param digits - The number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  locale: string = 'en-AU',
  digits: number = 2
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
};