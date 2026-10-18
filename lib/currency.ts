import { useSyncExternalStore } from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

export type CurrencyConfig = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  name: string;
  budgetRanges: string[];
};

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    label: "INR (₹)",
    name: "Indian Rupee",
    budgetRanges: [
      "< ₹20,000",
      "₹20,000 – ₹35,000",
      "₹35,000 – ₹50,000",
      "₹50,000 – ₹1,00,000",
      "₹1,00,000+",
      "Not sure / Let's discuss",
    ],
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    name: "US Dollar",
    budgetRanges: [
      "< $250",
      "$250 – $500",
      "$500 – $750",
      "$750 – $1,500",
      "$1,500+",
      "Not sure / Let's discuss",
    ],
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    name: "Euro",
    budgetRanges: [
      "< €250",
      "€250 – €500",
      "€500 – €750",
      "€750 – €1,500",
      "€1,500+",
      "Not sure / Let's discuss",
    ],
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    label: "GBP (£)",
    name: "British Pound",
    budgetRanges: [
      "< £200",
      "£200 – £400",
      "£400 – £600",
      "£600 – £1,200",
      "£1,200+",
      "Not sure / Let's discuss",
    ],
  },
  AED: {
    code: "AED",
    symbol: "AED",
    label: "AED",
    name: "UAE Dirham",
    budgetRanges: [
      "< AED 1,000",
      "AED 1,000 – AED 2,000",
      "AED 2,000 – AED 3,500",
      "AED 3,500 – AED 5,000",
      "AED 5,000+",
      "Not sure / Let's discuss",
    ],
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

const STORAGE_KEY = "krypton_currency";

/**
 * Detect initial currency:
 * 1. Stored user preference in localStorage
 * 2. Timezone/locale heuristics (INR for India, GBP for UK, EUR for Europe, AED for UAE, USD for North America)
 * 3. Default to INR as the base company currency
 */
export function detectInitialCurrency(): CurrencyCode {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;

  try {
    const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved && saved in CURRENCIES) return saved;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    if (timeZone.includes("Calcutta") || timeZone.includes("Kolkata") || timeZone.includes("Colombo")) {
      return "INR";
    }
    if (timeZone.includes("London") || timeZone.includes("Belfast")) {
      return "GBP";
    }
    if (timeZone.includes("Dubai")) {
      return "AED";
    }
    if (timeZone.startsWith("Europe/")) {
      return "EUR";
    }
    if (timeZone.startsWith("America/")) {
      return "USD";
    }
  } catch {
    // fallback
  }

  return DEFAULT_CURRENCY;
}

export function saveCurrency(currency: CurrencyCode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    // ignore quota/private browsing errors
  }
}

let activeCurrency: CurrencyCode | null = null;
const currencyListeners = new Set<() => void>();

function emitCurrencyChange() {
  currencyListeners.forEach((listener) => listener());
}

export function setGlobalCurrency(currency: CurrencyCode): void {
  activeCurrency = currency;
  saveCurrency(currency);
  emitCurrencyChange();
}

export function useCurrency(): [CurrencyCode, (currency: CurrencyCode) => void] {
  const currency = useSyncExternalStore(
    (callback) => {
      currencyListeners.add(callback);
      return () => {
        currencyListeners.delete(callback);
      };
    },
    () => {
      if (!activeCurrency) {
        activeCurrency = detectInitialCurrency();
      }
      return activeCurrency;
    },
    () => DEFAULT_CURRENCY
  );

  return [currency, setGlobalCurrency];
}
