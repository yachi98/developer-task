import type { SurveyReading } from "./types";

/** Parse a coordinate like "51.9409 N" or "0.2744 W" into a signed decimal. */
function parseCoord(raw: string): number {
  const [value, dir] = raw.trim().split(/\s+/);
  const magnitude = Number(value);
  // South and West are the negative hemispheres.
  return dir === "S" || dir === "W" ? -magnitude : magnitude;
}

function splitLines(text: string): string[] {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1) // skip header
    .filter((l) => l.trim().length > 0);
}

/**
 * UKRI file: `Track, Segment, Start (m), End (m), UKRI (m/km), GPS`
 * GPS is a single field like "51.9409 N 0.2744 W".
 */
export function parseUkri(text: string): SurveyReading[] {
  return splitLines(text).map((line, index) => {
    const parts = line.split(",");
    const start = Number(parts[2]);
    const end = Number(parts[3]);
    const [lat, latDir, lon, lonDir] = parts[5].trim().split(/\s+/);

    return {
      id: `UKRI-${index}`,
      metric: "UKRI",
      section: Number(parts[1]),
      start,
      end,
      chainage: (start + end) / 2,
      value: Number(parts[4]),
      latitude: parseCoord(`${lat} ${latDir}`),
      longitude: parseCoord(`${lon} ${lonDir}`),
    };
  });
}

/**
 * MPD file: `Section #, Station (m), MPD (mm), Latitude, Longitude`
 * Station is a range like "0.0 to 10.0"; lat/lon are separate fields.
 */
export function parseMpd(text: string): SurveyReading[] {
  return splitLines(text).map((line, index) => {
    const parts = line.split(",");
    const [start, end] = parts[1].split(/\s*to\s*/).map(Number);

    return {
      id: `MPD-${index}`,
      metric: "MPD",
      section: Number(parts[0]),
      start,
      end,
      chainage: (start + end) / 2,
      value: Number(parts[2]),
      latitude: parseCoord(parts[3]),
      longitude: parseCoord(parts[4]),
    };
  });
}
