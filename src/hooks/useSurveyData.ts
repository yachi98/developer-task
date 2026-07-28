import { useEffect, useState } from "react";
import type { SurveyReading } from "../data/types";
import { parseMpd, parseUkri } from "../data/parseCSV";

const BASE = "/data/A602 Trial Area_1_EB_Matt Harris R1_202606011457";
const UKRI_FILE = `${BASE}.csv`;
const MPD_FILE = `${BASE}_Texture_1_10.csv`;

interface SurveyData {
  mpd: SurveyReading[];
  ukri: SurveyReading[];
  loading: boolean;
  error: string | null;
}

export function useSurveyData(): SurveyData {
  const [mpd, setMpd] = useState<SurveyReading[]>([]);
  const [ukri, setUkri] = useState<SurveyReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches two CSV files from /public/data, parses them into SurveyReading[]
  // using parseMpd/parseUkri, and returns the results with loading/error state.
  // Files are fetched in parallel; any failure sets an error message.
  useEffect(() => {
    async function load() {
      try {
        const [mpdText, ukriText] = await Promise.all([
          fetch(MPD_FILE).then((r) => r.text()),
          fetch(UKRI_FILE).then((r) => r.text()),
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
