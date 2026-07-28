import type { Metric } from "./data/types";

/**
 * Reads a CSS custom property from :root so the palette has a single source
 * of truth in index.css. Charts (Recharts) and the map (Leaflet) need concrete
 * colour strings — they can't consume `var(--x)` directly — so we resolve them
 * here once. Fallbacks guard against the value being read before CSS loads.
 */
function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export const METRIC_COLORS: Record<Metric, string> = {
  MPD: cssVar("--metric-mpd", "#22d3ee"),
  UKRI: cssVar("--metric-ukri", "#a855f7"),
};

export const POI_COLOR = cssVar("--poi", "#f43f5e");
export const SELECTED_COLOR = cssVar("--selected", "#ffffff");
