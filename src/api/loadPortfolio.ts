import type { PortfolioConfig } from "../types";
import { publicUrl } from "../lib/publicUrl";

const CONFIG_PATH = publicUrl("/portfolio.json") ?? "/portfolio.json";

export async function loadPortfolio(): Promise<PortfolioConfig> {
  const res = await fetch(CONFIG_PATH);
  if (!res.ok) throw new Error(`Failed to load ${CONFIG_PATH}`);
  return (await res.json()) as PortfolioConfig;
}
