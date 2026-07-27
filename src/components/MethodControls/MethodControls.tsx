import { METHOD_META } from "../../data/types";
import { METHOD_COLORS } from "../../theme";
import type { Method } from "../../data/types";
import "./MethodControls.scss";

export function MethodControls({
  method,
  setMethod,
  setSelected,
  meta,
  activeSummary,
}) {
  return (
    <div className="controls glass">
      <div className="method-toggle" role="tablist">
        {(Object.keys(METHOD_META) as Method[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={method === m}
            className={`method-btn ${method === m ? "is-active" : ""}`}
            style={
              method === m
                ? { borderColor: METHOD_COLORS[m], color: METHOD_COLORS[m] }
                : undefined
            }
            onClick={() => {
              setMethod(m);
              setSelected(null);
            }}
          >
            <span
              className="method-dot"
              style={{ background: METHOD_COLORS[m] }}
            />
            {METHOD_META[m].label}
            <span className="method-sub">{METHOD_META[m].description}</span>
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
