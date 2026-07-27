export type Method = "MPD" | "UKRI";

export interface SurveyReading {
  method: Method;
  section: number;
  start: number;
  end: number;
  chainage: number;
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
