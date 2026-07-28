import { useEffect, useState } from "react";
import type { SurveyReading } from "../lib/types";
import { parseMpd, parseUkri } from "../lib/parseCSV";

const BASE = "/surveys/A602 Trial Area_1_EB_Matt Harris R1_202606011457";
const UKRI_FILE = `${BASE}.csv`;
const MPD_FILE = `${BASE}_Texture_1_10.csv`;

interface SurveyData {
  mpd: SurveyReading[];
  ukri: SurveyReading[];
  loading: boolean;
  error: string | null;
}

// A failed fetch (e.g. a renamed/missing file) still resolves — the server
// returns a 404 HTML page with a 200-less status. Without this check the HTML
// body would flow into the CSV parser as garbage; instead we surface an error.
async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (HTTP ${res.status})`);
  }
  return res.text();
}

export function useSurveyData(): SurveyData {
  const [mpd, setMpd] = useState<SurveyReading[]>([]);
  const [ukri, setUkri] = useState<SurveyReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches two CSV files from /public/surveys, parses them into SurveyReading[]
  // using parseMpd/parseUkri, and returns the results with loading/error state.
  // Files are fetched in parallel; any failure sets an error message.
  useEffect(() => {
    async function load() {
      try {
        const [mpdText, ukriText] = await Promise.all([
          fetchCsv(MPD_FILE),
          fetchCsv(UKRI_FILE),
        ]);

        setMpd(parseMpd(mpdText));
        setUkri(parseUkri(ukriText));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load survey data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { mpd, ukri, loading, error };
}
