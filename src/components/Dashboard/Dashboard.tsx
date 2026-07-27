import { useCallback, useMemo, useState } from "react";
import { useSurveyData } from "../../hooks/useSurveyData";
import { summarise } from "../../data/stats";
import type { Method } from "../../data/types";
import { METHOD_META } from "../../data/types";
import { METHOD_COLORS } from "../../theme";
import { MethodCharts } from "../MethodCharts/MethodCharts";
import { SurveyMap } from "../SurveyMap/SurveyMap";
import { DataTable } from "../DataTable/DataTable";
import { StatsGrid } from "../StatsGrid/StatsGrid";
import { MethodControls } from "../MethodControls/MethodControls";
import { Panel } from "../Panel/Panel";
import "./Dashboard.scss";
// import type { StatsGrid } from "../StatsGrid/StatsGrid";

// Readings in the top 10% are flagged as points of interest.
const HIGHLIGHT_PCT = 90;

export function Dashboard() {
  const { mpd, ukri, loading, error } = useSurveyData();
  const [method, setMethod] = useState<Method>("MPD");
  const [selected, setSelected] = useState<number | null>(null);

  // Flag the top 10% highest readings as "points of interest".
  const mpdSummary = useMemo(() => summarise(mpd, HIGHLIGHT_PCT), [mpd]);
  const ukriSummary = useMemo(() => summarise(ukri, HIGHLIGHT_PCT), [ukri]);

  // Stable handlers so the memoised chart/map/table skip needless re-renders.
  const handleSelect = useCallback((s: number | null) => setSelected(s), []);
  const selectMpd = useCallback((s: number | null) => {
    setMethod("MPD");
    setSelected(s);
  }, []);
  const selectUkri = useCallback((s: number | null) => {
    setMethod("UKRI");
    setSelected(s);
  }, []);

  const active = method === "MPD" ? mpd : ukri;
  const activeSummary = method === "MPD" ? mpdSummary : ukriSummary;
  const meta = METHOD_META[method];

  const poiCount = active.filter(
    (r) => r.value >= activeSummary.threshold,
  ).length;

  const statItems = [
    {
      label: `${meta.label} readings`,
      value: activeSummary.count,
    },
    {
      label: "Average",
      value: activeSummary.avg.toFixed(2),
      unit: meta.unit,
      accent: true,
      color: METHOD_COLORS[method],
    },
    {
      label: "Peak",
      value: activeSummary.max.toFixed(2),
      unit: meta.unit,
    },
    {
      label: "Points of interest",
      value: poiCount,
      warn: true,
    },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading glass">
          <span className="spinner" />
          Loading survey data…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading glass">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <img
          className="dashboard__logo"
          src="/hds-logo.svg"
          alt="Highway Data Systems"
          width="20"
          height="20"
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <div>
              <h1 className="dashboard__title">
                Highway <span>Survey Dashboard</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <MethodControls
        method={method}
        setMethod={setMethod}
        setSelected={setSelected}
        meta={meta}
        activeSummary={activeSummary}
      />

      <StatsGrid items={statItems} />

      {/* Charts — both methods always visible */}
      <MethodCharts
        mpd={mpd}
        mpdSummary={mpdSummary}
        ukri={ukri}
        ukriSummary={ukriSummary}
        method={method}
        selected={selected}
        selectMpd={selectMpd}
        selectUkri={selectUkri}
      />

      {/* Map + table for the active method */}
      <div className="grid-2 grid-2--map">
        <Panel
          title={`Route map · ${meta.label}  A602 Trial Area`}
          tag={`${poiCount} flagged`}
          noPad
        >
          <SurveyMap
            readings={active}
            summary={activeSummary}
            color={METHOD_COLORS[method]}
            selectedSection={selected}
            onSelect={handleSelect}
          />
        </Panel>
        <Panel
          title={`${meta.label} readings`}
          tag={`${active.length} rows`}
          noPad
        >
          <DataTable
            readings={active}
            summary={activeSummary}
            selectedSection={selected}
            onSelect={handleSelect}
          />
        </Panel>
      </div>
    </div>
  );
}
