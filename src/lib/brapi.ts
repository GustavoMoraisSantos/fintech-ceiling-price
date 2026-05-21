import Brapi from "brapi";

let _client: Brapi | null = null;

export function getBrapiClient(): Brapi {
  if (!_client) {
    _client = new Brapi({
      apiKey: process.env.BRAPI_API_KEY ?? "free-tier",
    });
  }
  return _client;
}
