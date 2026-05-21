import { StockEntry } from "@/types/stock";

const STORAGE_KEY = "fintech-ceiling-price-stocks";

export function getStoredStocks(): StockEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as StockEntry[];
  } catch {
    return [];
  }
}

export function saveStocks(stocks: StockEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
}

export function addStock(stock: StockEntry): StockEntry[] {
  const stocks = getStoredStocks();
  const existingIndex = stocks.findIndex((s) => s.ticker === stock.ticker);
  if (existingIndex >= 0) {
    stocks[existingIndex] = stock;
  } else {
    stocks.push(stock);
  }
  saveStocks(stocks);
  return stocks;
}

export function removeStock(ticker: string): StockEntry[] {
  const stocks = getStoredStocks().filter((s) => s.ticker !== ticker);
  saveStocks(stocks);
  return stocks;
}
