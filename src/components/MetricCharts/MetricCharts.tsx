import { METRIC_COLORS } from "../../theme";
import type { Metric, SurveyReading } from "../../data/types";
import type { Summary } from "../../data/stats";
import { LineChart } from "../LineChart/LineChart";
import { Panel } from "../Panel/Panel";

interface MetricChartsProps {
  mpd: SurveyReading[];
  mpdSummary: Summary;
  ukri: SurveyReading[];
  ukriSummary: Summary;
  metric: Metric;
  selected: number | null;
  selectMpd: (section: number | null) => void;
  selectUkri: (section: number | null) => void;
}

export function MetricCharts({
  mpd,
  mpdSummary,
  ukri,
  ukriSummary,
  metric,
  selected,
  selectMpd,
  selectUkri,
}: MetricChartsProps) {
  return (
    <div className="grid-2">
      <Panel title="MPD — texture depth vs chainage" tag="mm">
        <LineChart
          readings={mpd}
          summary={mpdSummary}
          color={METRIC_COLORS.MPD}
          selectedSection={metric === "MPD" ? selected : null}
          onSelect={selectMpd}
        />
      </Panel>

      <Panel title="UKRI — ride index vs chainage" tag="m/km">
        <LineChart
          readings={ukri}
          summary={ukriSummary}
          color={METRIC_COLORS.UKRI}
          selectedSection={metric === "UKRI" ? selected : null}
          onSelect={selectUkri}
        />
      </Panel>
    </div>
  );
}
