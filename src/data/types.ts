export type Method = "MPD" | "UKRI";

/** A single survey reading, normalised across both file formats. */
export interface SurveyReading {
  method: Method;
  /** Section / row reference within its file. */
  section: number;
  /** Chainage start (m). */
  start: number;
  /** Chainage end (m). */
  end: number;
  /** Midpoint chainage (m) — handy as a chart x-axis. */
  chainage: number;
  /** Measured value: mm for MPD (texture depth), m/km for UKRI (ride index). */
  value: number;
  latitude: number;
  longitude: number;
}

export const METHOD_META: Record<
  Method,
  { label: string; unit: string; description: string }
> = {
  MPD: {
    label: "MPD",
    unit: "mm",
    description: "Mean Profile Depth — texture depth",
  },
  UKRI: {
    label: "UKRI",
    unit: "m/km",
    description: "UK Ride Index — surface irregularity",
  },
};
