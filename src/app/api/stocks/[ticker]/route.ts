import { NextRequest } from "next/server";
import { getBrapiClient } from "@/lib/brapi";
import {
  NotFoundError,
  RateLimitError,
  AuthenticationError,
  BadRequestError,
  APIError,
} from "brapi";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/stocks/[ticker]">
) {
  const { ticker } = await ctx.params;

  if (!ticker) {
    return Response.json({ error: "Ticker is required" }, { status: 400 });
  }

  try {
    const data = await getBrapiClient().quote.retrieve(ticker, {
      range: "10y",
      interval: "1mo",
      dividends: true,
    });

    return Response.json(data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return Response.json(
        { error: `Ticker '${ticker}' not found` },
        { status: 404 }
      );
    }
    if (error instanceof RateLimitError) {
      return Response.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }
    if (error instanceof AuthenticationError) {
      return Response.json(
        { error: "Invalid or missing API token" },
        { status: 401 }
      );
    }
    if (error instanceof BadRequestError) {
      return Response.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }
    if (error instanceof APIError) {
      return Response.json(
        { error: `brapi.dev error: ${error.message}` },
        { status: error.status }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Failed to fetch stock data: ${message}` },
      { status: 500 }
    );
  }
}
