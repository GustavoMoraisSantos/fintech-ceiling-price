export interface CashDividend {
  assetIssued: string;
  paymentDate: string;
  rate: number;
  relatedTo: string;
  approvedOn: string;
  isinCode: string;
  label: string;
  lastDatePrior: string;
  level: string;
}

export interface BrapiQuoteResult {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketDayRange: string;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: string;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  logourl: string;
  dividendsData?: {
    cashDividends: CashDividend[];
    stockDividends: unknown[];
    subscriptions: unknown[];
  };
}

export interface BrapiQuoteResponse {
  results: BrapiQuoteResult[];
  requestedAt: string;
  took: string;
}

export interface StockEntry {
  ticker: string;
  shortName: string;
  longName: string;
  logoUrl: string;
  currentPrice: number;
  avgAnnualDividend: number;
  ceilingPrice: number;
  dividendYield: number;
  targetYield: number;
  isBelowCeiling: boolean;
  lastUpdated: string;
  totalDividends6y: number;
  dividendYears: number;
}
