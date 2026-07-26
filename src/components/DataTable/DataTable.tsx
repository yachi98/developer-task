import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { SurveyReading } from "../../data/types";
import { METHOD_META } from "../../data/types";
import type { Summary } from "../../data/stats";
import "./DataTable.scss";

interface Props {
  readings: SurveyReading[];
  summary: Summary;
  selectedSection: number | null;
  onSelect: (section: number | null) => void;
}

type SortKey = "section" | "chainage" | "value";

function DataTableImpl({
  readings,
  summary,
  selectedSection,
  onSelect,
}: Props) {
  const meta = METHOD_META[readings[0]?.method ?? "MPD"];
  const [sortKey, setSortKey] = useState<SortKey>("section");
  const [desc, setDesc] = useState(false);
  const selectedRef = useRef<HTMLTableRowElement | null>(null);

  const sortedReadings = useMemo(() => {
    const sorted = [...readings];
    sorted.sort((a, b) => (a[sortKey] - b[sortKey]) * (desc ? -1 : 1));
    return sorted;
  }, [readings, sortKey, desc]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedSection]);

  const setSort = (key: SortKey) => {
    if (key === sortKey) setDesc((d) => !d);
    else {
      setSortKey(key);
      setDesc(key === "value");
    }
  };

  const arrow = (key: SortKey) => {
    if (key !== sortKey) return " ▴"; // neutral sort icon
    return desc ? " ▾" : " ▴";
  };

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => setSort("section")}>
              Section{arrow("section")}
            </th>

            <th onClick={() => setSort("chainage")}>
              Chainage (m){arrow("chainage")}
            </th>

            <th onClick={() => setSort("value")}>
              {meta.label} ({meta.unit}){arrow("value")}
            </th>

            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {sortedReadings.map((r) => {
            const isHigh = r.value >= summary.threshold;
            const isSelected = r.section === selectedSection;
            return (
              <tr
                key={r.section}
                ref={isSelected ? selectedRef : null}
                className={`${isHigh ? "row-high" : ""} ${
                  isSelected ? "row-selected" : ""
                }`}
                onClick={() => onSelect(isSelected ? null : r.section)}
              >
                <td className="num">{r.section}</td>
                <td className="num">
                  {r.start}–{r.end}
                </td>
                <td className={isHigh ? "accent-warn" : "accent"}>
                  {r.value.toFixed(2)}
                  {isHigh && (
                    <span className="poi-dot" title="Point of interest" />
                  )}
                </td>
                <td className="num">{r.latitude.toFixed(6)}</td>
                <td className="num">{r.longitude.toFixed(6)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = memo(DataTableImpl);
