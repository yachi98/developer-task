import { METRIC_META } from "../../lib/types";
import { METRIC_COLORS } from "../../theme";
import type { Metric, MetricMeta } from "../../lib/types";
import type { Summary } from "../../lib/stats";
import "./MetricControls.scss";

interface MetricControlsProps {
  metric: Metric;
  setMetric: (metric: Metric) => void;
  setSelected: (id: string | null) => void;
  meta: MetricMeta;
  activeSummary: Summary;
}

export function MetricControls({
  metric,
  setMetric,
  setSelected,
  meta,
  activeSummary,
}: MetricControlsProps) {
  return (
    <div className="controls glass">
      <div className="metric-toggle" role="tablist">
        {(Object.keys(METRIC_META) as Metric[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={metric === m}
            className={`metric-btn ${metric === m ? "is-active" : ""}`}
            style={
              { "--metric-color": METRIC_COLORS[m] } as React.CSSProperties
            }
            onClick={() => {
              setMetric(m);
              setSelected(null);
            }}
          >
            <div className="metric-container">
              <span className="metric-dot"></span>
              {METRIC_META[m].label}{" "}
            </div>
            <span className="metric-sub">{METRIC_META[m].description}</span>
          </button>
        ))}
      </div>

      <div className="legend">
        <span className="legend__dot" />
        Points of interest — top 10% highest {meta.label} readings (≥{" "}
        {activeSummary.threshold.toFixed(2)} {meta.unit})
      </div>
    </div>
  );
}
