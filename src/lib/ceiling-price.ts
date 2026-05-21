import { CashDividend } from "@/types/stock";

const DEFAULT_TARGET_YIELD = 0.06;
const YEARS_TO_ANALYZE = 6;

export function calculateCeilingPrice(
  dividends: CashDividend[],
  currentPrice: number,
  targetYield: number = DEFAULT_TARGET_YIELD
) {
  const now = new Date();
  const cutoffDate = new Date(
    now.getFullYear() - YEARS_TO_ANALYZE,
    now.getMonth(),
    now.getDate()
  );

  const relevantDividends = dividends.filter(
    (d) => new Date(d.paymentDate) >= cutoffDate
  );

  const totalDividends = relevantDividends.reduce((sum, d) => sum + d.rate, 0);

  const yearsCovered = Math.min(
    YEARS_TO_ANALYZE,
    relevantDividends.length > 0
      ? (now.getTime() - new Date(relevantDividends[relevantDividends.length - 1].paymentDate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
      : 0
  );

  const effectiveYears = Math.max(yearsCovered, 1);
  const avgAnnualDividend = totalDividends / effectiveYears;
  const ceilingPrice = avgAnnualDividend / targetYield;
  const dividendYield = currentPrice > 0 ? avgAnnualDividend / currentPrice : 0;

  return {
    avgAnnualDividend: Math.round(avgAnnualDividend * 100) / 100,
    ceilingPrice: Math.round(ceilingPrice * 100) / 100,
    dividendYield: Math.round(dividendYield * 10000) / 10000,
    isBelowCeiling: currentPrice <= ceilingPrice,
    totalDividends6y: Math.round(totalDividends * 100) / 100,
    dividendYears: Math.round(effectiveYears * 10) / 10,
  };
}
