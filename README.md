# Fintech Ceiling Price

Dashboard for stock ceiling price calculation based on **Luis Barsi's methodology**. Built with Next.js, TypeScript, Tailwind CSS, and integrated with the [brapi.dev](https://brapi.dev) API for real-time B3 stock quotes.

## What is Ceiling Price (Barsi Method)?

The ceiling price is a valuation method popularized by Brazilian investor Luiz Barsi. It determines the maximum price you should pay for a stock based on its dividend history:

**Ceiling Price = Average Annual Dividend (last 6 years) / Target Dividend Yield**

- If the current stock price is **below** the ceiling price, it's considered a buying opportunity.
- If it's **above**, you should wait for a better entry point.

## Features

- Search and add B3 stocks by ticker code
- Real-time stock quotes via brapi.dev API
- Automatic ceiling price calculation
- Configurable target dividend yield (default: 6%)
- Visual buy/wait indicators
- Summary cards with portfolio overview
- Data persisted in localStorage (no database needed)
- Refresh individual stocks or all at once
- Responsive design with dark mode support

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables (Optional)

Create a `.env.local` file:

```env
BRAPI_API_KEY=your_brapi_token_here
```

A brapi.dev token is optional for basic usage (free tickers: PETR4, MGLU3, VALE3, ITUB4) but required for all other stocks. Get one at [brapi.dev/dashboard](https://brapi.dev/dashboard).

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [brapi SDK](https://www.npmjs.com/package/brapi) (official TypeScript SDK)
- localStorage for data persistence
