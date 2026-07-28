import type { Dispatch, SetStateAction } from "react";
import { METRIC_META } from "../../data/types";
import { METRIC_COLORS } from "../../theme";
import type { Metric, MetricMeta } from "../../data/types";
import type { Summary } from "../../data/stats";
import "./MetricControls.scss";

interface MetricControlsProps {
  metric: Metric;
  setMetric: Dispatch<SetStateAction<Metric>>;
  setSelected: Dispatch<SetStateAction<number | null>>;
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
      <div className="method-toggle" role="tablist">
        {(Object.keys(METRIC_META) as Metric[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={metric === m}
            className={`method-btn ${metric === m ? "is-active" : ""}`}
            style={
              metric === m
                ? { borderColor: METRIC_COLORS[m], color: METRIC_COLORS[m] }
                : undefined
            }
            onClick={() => {
              setMetric(m);
              setSelected(null);
            }}
          >
            <span
              className="method-dot"
              style={{ background: METRIC_COLORS[m] }}
            />
            {METRIC_META[m].label}
            <span className="method-sub">{METRIC_META[m].description}</span>
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
