export type Metric = "MPD" | "UKRI";

export interface SurveyReading {
  metric: Metric;
  section: number;
  start: number;
  end: number;
  chainage: number;
  value: number;
  latitude: number;
  longitude: number;
}

export interface MetricMeta {
  label: string;
  unit: string;
  description: string;
}

export const METRIC_META: Record<Metric, MetricMeta> = {
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
