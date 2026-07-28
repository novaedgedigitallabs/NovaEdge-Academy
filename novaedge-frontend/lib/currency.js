import { getCountryMeta } from "@novaedgedigitallabs/citykit";

/**
 * Detect user's country code based on browser locale and timezone
 */
export function getUserCountry() {
  if (typeof window === "undefined") return "IN";

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (timeZone.startsWith("Asia/Kolkata") || timeZone.startsWith("Asia/Calcutta")) {
      return "IN";
    }

    const lang = navigator.language || "";
    if (lang.endsWith("-IN") || lang.endsWith("_IN")) {
      return "IN";
    }

    return "IN";
  } catch (e) {
    return "IN";
  }
}

/**
 * Get currency code (INR, USD, EUR, etc.) from CityKit for given country
 */
export function getCurrencyForCountry(countryCode = "IN") {
  try {
    const meta = getCountryMeta(countryCode.toUpperCase());
    if (meta && meta.currency) {
      return meta.currency;
    }
  } catch (e) {}
  return "INR";
}

/**
 * Format price according to localized city/country currency using CityKit
 * @param {number|string} price 
 * @param {string} [countryCode] 
 * @returns {string} e.g. "₹999", "Free", "$999"
 */
export function formatCurrency(price, countryCode) {
  const numPrice = Number(price) || 0;
  if (numPrice === 0) {
    return "Free";
  }

  const country = countryCode || getUserCountry();
  const currency = getCurrencyForCountry(country);

  try {
    const localeMap = {
      INR: "en-IN",
      USD: "en-US",
      EUR: "de-DE",
      GBP: "en-GB",
    };
    const locale = localeMap[currency] || "en-IN";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(numPrice);
  } catch (e) {
    return currency === "INR" ? `₹${numPrice}` : `$${numPrice}`;
  }
}
