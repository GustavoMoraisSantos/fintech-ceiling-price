"use client";

import Image from "next/image";
import { StockEntry } from "@/types/stock";

interface StockTableProps {
  stocks: StockEntry[];
  onRemove: (ticker: string) => void;
  onRefresh: (ticker: string) => void;
  refreshingTicker: string | null;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(2) + "%";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StockTable({
  stocks,
  onRemove,
  onRefresh,
  refreshingTicker,
}: StockTableProps) {
  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          No stocks added yet
        </h3>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Click &quot;Add Stock&quot; to search for B3 stocks and calculate their ceiling price using the Barsi method.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Stock
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Current Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Ceiling Price
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Avg Annual Div
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              DY
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Target DY
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Updated
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {stocks.map((stock) => (
            <tr
              key={stock.ticker}
              className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {stock.logoUrl ? (
                    <Image
                      src={stock.logoUrl}
                      alt={stock.ticker}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-lg object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {stock.ticker.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {stock.ticker}
                    </p>
                    <p className="max-w-50 truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {stock.shortName}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(stock.currentPrice)}
              </td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(stock.ceilingPrice)}
              </td>
              <td className="px-4 py-4 text-center">
                {stock.isBelowCeiling ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Buy
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Wait
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-right text-sm text-zinc-700 dark:text-zinc-300">
                {formatCurrency(stock.avgAnnualDividend)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-zinc-700 dark:text-zinc-300">
                {formatPercent(stock.dividendYield)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-zinc-700 dark:text-zinc-300">
                {formatPercent(stock.targetYield)}
              </td>
              <td className="px-4 py-4 text-right text-xs text-zinc-500 dark:text-zinc-400">
                {formatDate(stock.lastUpdated)}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onRefresh(stock.ticker)}
                    disabled={refreshingTicker === stock.ticker}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                    title="Refresh"
                  >
                    <svg
                      className={`h-4 w-4 ${refreshingTicker === stock.ticker ? "animate-spin" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onRemove(stock.ticker)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    title="Remove"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
