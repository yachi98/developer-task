import { useCallback, useMemo, useState } from "react";
import { useSurveyData } from "../../hooks/useSurveyData";
import { calculateMetricStats } from "../../lib/stats";
import type { Metric } from "../../lib/types";
import { METRIC_META } from "../../lib/types";
import { METRIC_COLORS } from "../../theme";
import { ComparisonChart } from "../ComparisonChart/ComparisonChart";
import { SurveyMap } from "../SurveyMap/SurveyMap";
import { DataTable } from "../DataTable/DataTable";
import { StatsGrid } from "../StatsGrid/StatsGrid";
import { MetricControls } from "../MetricControls/MetricControls";
import { Header } from "../Header/Header";
import { Panel } from "../Panel/Panel";
import "./Dashboard.scss";

// Readings in the top 10% are flagged as points of interest.
const HIGHLIGHT_PCT = 90;

export function Dashboard() {
  const { mpd, ukri, loading, error } = useSurveyData();
  const [metric, setMetric] = useState<Metric>("MPD");
  const [selected, setSelected] = useState<number | null>(null);

  // Flag the top 10% highest readings as "points of interest".
  const mpdSummary = useMemo(
    () => calculateMetricStats(mpd, HIGHLIGHT_PCT),
    [mpd],
  );
  const ukriSummary = useMemo(
    () => calculateMetricStats(ukri, HIGHLIGHT_PCT),
    [ukri],
  );

  // Stable handler so the memoised chart/map/table skip needless re-renders.
  const handleSelect = useCallback((s: number | null) => setSelected(s), []);

  const activeMetric = metric === "MPD" ? mpd : ukri;
  const activeSummary = metric === "MPD" ? mpdSummary : ukriSummary;
  const meta = METRIC_META[metric];

  const poiCount = activeMetric.filter(
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
      color: METRIC_COLORS[metric],
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
      <Header />
      <MetricControls
        metric={metric}
        setMetric={setMetric}
        setSelected={setSelected}
        meta={meta}
        activeSummary={activeSummary}
      />
      <StatsGrid items={statItems} />
      <Panel title="MPD vs UKRI along the route" tag={`${meta.label} focused`}>
        <ComparisonChart
          mpd={mpd}
          ukri={ukri}
          mpdSummary={mpdSummary}
          ukriSummary={ukriSummary}
          metric={metric}
          selected={selected}
          onSelect={handleSelect}
        />
      </Panel>
      <div className="grid-2 grid-2--map">
        <Panel
          title={`Route map · ${meta.label}  A602 Trial Area`}
          tag={`${poiCount} flagged`}
          noPad
        >
          <SurveyMap
            readings={activeMetric}
            summary={activeSummary}
            color={METRIC_COLORS[metric]}
            selectedSection={selected}
            onSelect={handleSelect}
          />
        </Panel>
        <Panel
          title={`${meta.label} readings`}
          tag={`${activeMetric.length} rows`}
          noPad
        >
          <DataTable
            readings={activeMetric}
            summary={activeSummary}
            selectedSection={selected}
            onSelect={handleSelect}
          />
        </Panel>
      </div>
    </div>
  );
}
