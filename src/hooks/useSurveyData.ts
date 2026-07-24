import type { SurveyRow } from "../data/types";
import { parseCsv } from "../data/parseCSV";
import { useEffect, useState } from "react";

export function useSurveyData() {
  const [data, setData] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const files = [
        "/data/A602 Trial Area_1_EB_Matt Harris R1_202606011457_Texture_1_10.csv",
        "/data/A602 Trial Area_1_EB_Matt Harris R1_202606011457.csv",
      ];

      const allData: SurveyRow[] = [];

      for (const file of files) {
        const response = await fetch(file);
        const text = await response.text();
        const parsed = parseCsv(text);
        allData.push(...parsed);
      }

      setData(allData);
      setLoading(false);
    }

    load();
  }, []);

  return { data, loading };
}
