"use client";

interface HeaderProps {
  onAddStock: () => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
}

export default function Header({ onAddStock, onRefreshAll, isRefreshing }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg">
            $
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Ceiling Price
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Barsi Method
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
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
            {isRefreshing ? "Updating..." : "Refresh All"}
          </button>
          <button
            onClick={onAddStock}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Stock
          </button>
        </div>
      </div>
    </header>
  );
}
