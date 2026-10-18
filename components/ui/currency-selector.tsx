"use client";

import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
  className?: string;
}

const ORDERED_CURRENCIES: CurrencyCode[] = ["INR", "USD", "EUR", "GBP", "AED"];

export function CurrencySelector({ value, onChange, className }: CurrencySelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select currency for project budget"
      className={cn("inline-flex items-center gap-1.5 p-1 bg-surface border border-border rounded-lg", className)}
    >
      {ORDERED_CURRENCIES.map((code) => {
        const config = CURRENCIES[code];
        const isSelected = value === code;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(code)}
            className={cn(
              "px-2.5 py-1 text-xs font-mono rounded-md transition-all",
              isSelected
                ? "bg-accent/15 text-accent border border-accent/30 font-semibold shadow-sm"
                : "text-fg-muted hover:text-fg hover:bg-white/5 border border-transparent"
            )}
            title={config.name}
          >
            <span>{config.symbol}</span>{" "}
            <span className="font-sans text-[11px] font-medium">{code}</span>
          </button>
        );
      })}
    </div>
  );
}
