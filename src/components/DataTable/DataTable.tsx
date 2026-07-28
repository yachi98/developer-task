import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { SurveyReading } from "../../lib/types";
import { METRIC_META } from "../../lib/types";
import type { Summary } from "../../lib/stats";
import "./DataTable.scss";

interface DataTableProps {
  readings: SurveyReading[];
  summary: Summary;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

type SortKey = "section" | "chainage" | "value";

function DataTableImpl({
  readings,
  summary,
  selectedId,
  onSelect,
}: DataTableProps) {
  const meta = METRIC_META[readings[0]?.metric ?? "MPD"];
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
  }, [selectedId]);

  const handleSort = (key: SortKey) => {
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

  const sortableCols: { key: SortKey; label: string }[] = [
    { key: "section", label: "Section" },
    { key: "chainage", label: "Chainage (m)" },
    { key: "value", label: `${meta.label} (${meta.unit})` },
  ];

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {sortableCols.map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label}
                {arrow(col.key)}
              </th>
            ))}

            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {sortedReadings.map((reading) => {
            const isHigh = reading.value >= summary.threshold;
            const isSelected = reading.id === selectedId;
            return (
              <tr
                key={reading.id}
                ref={isSelected ? selectedRef : null}
                className={`${isHigh ? "row-high" : ""} ${
                  isSelected ? "row-selected" : ""
                }`}
                onClick={() => onSelect(isSelected ? null : reading.id)}
              >
                <td className="num">{reading.section}</td>
                <td className="num">
                  {reading.start}–{reading.end}
                </td>
                <td className={isHigh ? "accent-warn" : "accent"}>
                  {reading.value.toFixed(2)}
                  {isHigh && (
                    <span className="poi-dot" title="Point of interest" />
                  )}
                </td>
                <td className="num">{reading.latitude.toFixed(6)}</td>
                <td className="num">{reading.longitude.toFixed(6)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = memo(DataTableImpl);
