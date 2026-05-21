import { NextRequest } from "next/server";

const BRAPI_BASE_URL = "https://brapi.dev/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  if (!ticker) {
    return Response.json({ error: "Ticker is required" }, { status: 400 });
  }

  const token = process.env.BRAPI_TOKEN ?? "";
  const tokenParam = token ? `&token=${token}` : "";

  try {
    const url = `${BRAPI_BASE_URL}/quote/${encodeURIComponent(ticker)}?range=6y&interval=1mo&dividends=true${tokenParam}`;
    const response = await fetch(url, { next: { revalidate: 0 } });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: `brapi.dev responded with ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `Failed to fetch stock data: ${message}` },
      { status: 500 }
    );
  }
}
