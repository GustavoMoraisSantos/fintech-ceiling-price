import { NextRequest } from "next/server";
import { getBrapiClient } from "@/lib/brapi";
import {
  RateLimitError,
  AuthenticationError,
  APIError,
} from "brapi";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return Response.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const data = await getBrapiClient().available.list({ search: query });
    return Response.json(data);
  } catch (error) {
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
    if (error instanceof APIError) {
      return Response.json(
        { error: `brapi.dev error: ${error.message}` },
        { status: error.status }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Failed to search stocks: ${message}` },
      { status: 500 }
    );
  }
}
