import { NextRequest } from "next/server";

const BRAPI_BASE_URL = "https://brapi.dev/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const token = process.env.BRAPI_TOKEN ?? "";
  const tokenParam = token ? `&token=${token}` : "";

  try {
    const url = `${BRAPI_BASE_URL}/available?search=${encodeURIComponent(query)}${tokenParam}`;
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
      { error: `Failed to search stocks: ${message}` },
      { status: 500 }
    );
  }
}
