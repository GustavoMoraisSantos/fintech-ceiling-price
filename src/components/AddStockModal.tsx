"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { BrapiQuoteResponse, StockEntry } from "@/types/stock";
import { calculateCeilingPrice } from "@/lib/ceiling-price";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (stock: StockEntry) => void;
}

interface SearchResult {
  stock: string;
}

export default function AddStockModal({ isOpen, onClose, onAdd }: AddStockModalProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetYield, setTargetYield] = useState(6);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const searchStocks = useCallback(async (q: string) => {
    if (q.length < 1) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      const stocks: string[] = data.stocks ?? [];
      setSearchResults(stocks.slice(0, 10).map((s: string) => ({ stock: s })));
    } catch {
      setError("Failed to search stocks. Try again.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value.toUpperCase());
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchStocks(value), 400);
  };

  const handleSelectStock = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    setQuery(ticker);

    try {
      const res = await fetch(`/api/stocks/${encodeURIComponent(ticker)}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ?? `Failed to fetch ${ticker}`);
      }
      const data: BrapiQuoteResponse = await res.json();
      const result = data.results?.[0];

      if (!result) {
        throw new Error(`No data found for ${ticker}`);
      }

      const dividends = result.dividendsData?.cashDividends ?? [];
      const targetDecimal = targetYield / 100;
      const calc = calculateCeilingPrice(dividends, result.regularMarketPrice, targetDecimal);

      const entry: StockEntry = {
        ticker: result.symbol,
        shortName: result.shortName,
        longName: result.longName,
        logoUrl: result.logourl,
        currentPrice: result.regularMarketPrice,
        avgAnnualDividend: calc.avgAnnualDividend,
        ceilingPrice: calc.ceilingPrice,
        dividendYield: calc.dividendYield,
        targetYield: targetDecimal,
        isBelowCeiling: calc.isBelowCeiling,
        lastUpdated: new Date().toISOString(),
        totalDividends6y: calc.totalDividends6y,
        dividendYears: calc.dividendYears,
      };

      onAdd(entry);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Add Stock
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Target Dividend Yield (%)
            </label>
            <input
              type="number"
              min={1}
              max={20}
              step={0.5}
              value={targetYield}
              onChange={(e) => setTargetYield(Number(e.target.value))}
              className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Search B3 Stock Code
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. BBAS3, PETR4, VALE3..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {isSearching && (
            <div className="flex items-center gap-2 py-3 text-sm text-zinc-500">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 py-3 text-sm text-zinc-500">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading stock data and calculating ceiling price...
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {searchResults.length > 0 && !isLoading && (
            <div className="max-h-60 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              {searchResults.map((result) => (
                <button
                  key={result.stock}
                  onClick={() => handleSelectStock(result.stock)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    B3
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {result.stock}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
