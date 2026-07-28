import type { SurveyReading } from "./types";

export interface Summary {
  count: number;
  min: number;
  max: number;
  avg: number;
  /** Value at the given percentile — used as the "point of interest" threshold. */
  threshold: number;
}

/** Linear-interpolated percentile (p in 0..100). */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function calculateMetricStats(
  readings: SurveyReading[],
  p: number,
): Summary {
  const values = readings.map((r) => r.value).filter(Number.isFinite);
  if (values.length === 0) {
    return { count: 0, min: 0, max: 0, avg: 0, threshold: 0 };
  }
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: sum / values.length,
    threshold: percentile(values, p),
  };
}
