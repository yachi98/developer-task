import { it, expect } from "vitest";
import type { SurveyReading } from "./types";
import { calculateMetricStats } from "./stats";

// Test reading helper
const reading = (value: number): SurveyReading => ({
  metric: "MPD",
  section: 0,
  start: 0,
  end: 0,
  chainage: 0,
  value,
  latitude: 0,
  longitude: 0,
});

// Give the function four readings (values 2, 4, 6, 8) and check the summary
// object it returns. `.toEqual` compares the whole object field by field.
it("calculateMetricStats summarises a list of readings", () => {
  const readings = [2, 4, 6, 8].map(reading);
  expect(calculateMetricStats(readings, 50)).toEqual({
    count: 4, // number of readings
    min: 2, // smallest value
    max: 8, // largest value
    avg: 5, // average: (2 + 4 + 6 + 8) / 4
    threshold: 5, // the 50th-percentile value
  });
});

// Edge case: with no readings at all, every stat should just be 0 rather than
// crash or return NaN.
it("calculateMetricStats returns all zeros for an empty list", () => {
  expect(calculateMetricStats([], 50)).toEqual({
    count: 0,
    min: 0,
    max: 0,
    avg: 0,
    threshold: 0,
  });
});

// Bad data: NaN and Infinity aren't real measurements, so they get filtered
// out first. Here only 2 and 4 count, so the stats are based on those two.
it("calculateMetricStats ignores non-finite values", () => {
  const readings = [2, NaN, 4, Infinity].map(reading);
  expect(calculateMetricStats(readings, 50)).toEqual({
    count: 2, // just 2 and 4
    min: 2,
    max: 4,
    avg: 3, // (2 + 4) / 2
    threshold: 3,
  });
});
