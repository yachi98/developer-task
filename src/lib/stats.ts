import type { SurveyReading } from "./types";

export interface Summary {
  count: number;
  min: number;
  max: number;
  avg: number;
  /** Value at the given percentile — used as the "point of interest" threshold. */
  threshold: number;
}

/** Linear‑interpolated percentile (percentileRank in 0..100). */
export function percentile(values: number[], percentileRank: number): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const idx = (percentileRank / 100) * (sorted.length - 1);

  const lowerIndex = Math.floor(idx);
  const upperIndex = Math.ceil(idx);

  if (lowerIndex === upperIndex) return sorted[lowerIndex];

  return (
    sorted[lowerIndex] +
    (sorted[upperIndex] - sorted[lowerIndex]) * (idx - lowerIndex)
  );
}

export function calculateMetricStats(
  readings: SurveyReading[],
  percentileRank: number,
): Summary {
  const values = readings
    .map((reading) => reading.value)
    .filter(Number.isFinite);

  if (values.length === 0) {
    return { count: 0, min: 0, max: 0, avg: 0, threshold: 0 };
  }

  const count = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, v) => sum + v, 0) / count;

  return {
    count,
    min,
    max,
    avg,
    threshold: percentile(values, percentileRank),
  };
}
