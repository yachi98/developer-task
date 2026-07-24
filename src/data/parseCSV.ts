import type { SurveyRow } from "./types";

export function parseCsv(text: string): SurveyRow[] {
  const lines = text.trim().split("\n");
  const rows = lines.slice(1); // skip header

  return rows.map((line) => {
    const parts = line.split(",");

    const section = Number(parts[0]);
    const station = parts[1];
    const mpd = Number(parts[2]);

    const [latValue, latDir] = parts[3].split(" ");
    const latitude = latDir === "S" ? -Number(latValue) : Number(latValue);

    const [lonValue, lonDir] = parts[4].split(" ");
    const longitude = lonDir === "W" ? -Number(lonValue) : Number(lonValue);

    return {
      section,
      station,
      mpd,
      latitude,
      longitude,
    };
  });
}
