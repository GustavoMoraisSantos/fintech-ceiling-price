"use client";

import { useState, useCallback, useEffect } from "react";
import { StockEntry, BrapiQuoteResponse } from "@/types/stock";
import { calculateCeilingPrice } from "@/lib/ceiling-price";
import { getStoredStocks, addStock, removeStock as removeStoredStock } from "@/lib/storage";
import Header from "./Header";
import StockTable from "./StockTable";
import AddStockModal from "./AddStockModal";

export default function Dashboard() {
  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshingTicker, setRefreshingTicker] = useState<string | null>(null);

  useEffect(() => {
    // Load stocks from localStorage only on client
    setStocks(getStoredStocks());
  }, []);

  const handleAddStock = useCallback((stock: StockEntry) => {
    const updated = addStock(stock);
    setStocks(updated);
  }, []);

  const handleRemoveStock = useCallback((ticker: string) => {
    const updated = removeStoredStock(ticker);
    setStocks(updated);
  }, []);

  const refreshStock = useCallback(async (ticker: string, targetYield: number) => {
    const res = await fetch(`/api/stocks/${encodeURIComponent(ticker)}`);
    if (!res.ok) throw new Error(`Failed to refresh ${ticker}`);

    const data: BrapiQuoteResponse = await res.json();
    const result = data.results?.[0];
    if (!result) throw new Error(`No data for ${ticker}`);

    const dividends = result.dividendsData?.cashDividends ?? [];
    const calc = calculateCeilingPrice(dividends, result.regularMarketPrice, targetYield);

    const entry: StockEntry = {
      ticker: result.symbol,
      shortName: result.shortName,
      longName: result.longName,
      logoUrl: result.logourl,
      currentPrice: result.regularMarketPrice,
      avgAnnualDividend: calc.avgAnnualDividend,
      ceilingPrice: calc.ceilingPrice,
      dividendYield: calc.dividendYield,
      targetYield,
      isBelowCeiling: calc.isBelowCeiling,
      lastUpdated: new Date().toISOString(),
      totalDividends6y: calc.totalDividends6y,
      dividendYears: calc.dividendYears,
    };

    return entry;
  }, []);

  const handleRefreshOne = useCallback(
    async (ticker: string) => {
      setRefreshingTicker(ticker);
      try {
        const stock = stocks.find((s) => s.ticker === ticker);
        if (!stock) return;
        const updated = await refreshStock(ticker, stock.targetYield);
        const newStocks = addStock(updated);
        setStocks(newStocks);
      } catch (err) {
        console.error("Refresh failed:", err);
      } finally {
        setRefreshingTicker(null);
      }
    },
    [stocks, refreshStock]
  );

  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      for (const stock of stocks) {
        try {
          const updated = await refreshStock(stock.ticker, stock.targetYield);
          addStock(updated);
        } catch (err) {
          console.error(`Failed to refresh ${stock.ticker}:`, err);
        }
      }
      setStocks(getStoredStocks());
    } finally {
      setIsRefreshing(false);
    }
  }, [stocks, refreshStock]);

  const summary = {
    total: stocks.length,
    buyable: stocks.filter((s) => s.isBelowCeiling).length,
    avgDy: stocks.length > 0
      ? stocks.reduce((sum, s) => sum + s.dividendYield, 0) / stocks.length
      : 0,
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header
        onAddStock={() => { setModalKey((k) => k + 1); setIsModalOpen(true); }}
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {stocks.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Tracked Stocks
              </p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {summary.total}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Below Ceiling (Buy)
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {summary.buyable}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Avg Dividend Yield
              </p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {(summary.avgDy * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <StockTable
            stocks={stocks}
            onRemove={handleRemoveStock}
            onRefresh={handleRefreshOne}
            refreshingTicker={refreshingTicker}
          />
        </div>

        {stocks.length > 0 && (
          <div className="mt-4 rounded-lg bg-zinc-100 px-4 py-3 text-xs text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
            <strong>Barsi Method:</strong> Ceiling Price = Average Annual Dividend (last 6 years) / Target Dividend Yield.
            If the current price is below the ceiling price, the stock is considered a good buy opportunity.
          </div>
        )}
      </main>

      <AddStockModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddStock}
      />
    </div>
  );
}
