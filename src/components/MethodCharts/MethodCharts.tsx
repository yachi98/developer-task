import { METHOD_COLORS } from "../../theme";
import { MethodChart } from "../MethodChart";
import { Panel } from "../Panel";

export function MethodCharts({
  mpd,
  mpdSummary,
  ukri,
  ukriSummary,
  method,
  selected,
  selectMpd,
  selectUkri,
}) {
  return (
    <div className="grid-2">
      <Panel title="MPD — texture depth vs chainage" tag="mm">
        <MethodChart
          readings={mpd}
          summary={mpdSummary}
          color={METHOD_COLORS.MPD}
          selectedSection={method === "MPD" ? selected : null}
          onSelect={selectMpd}
        />
      </Panel>

      <Panel title="UKRI — ride index vs chainage" tag="m/km">
        <MethodChart
          readings={ukri}
          summary={ukriSummary}
          color={METHOD_COLORS.UKRI}
          selectedSection={method === "UKRI" ? selected : null}
          onSelect={selectUkri}
        />
      </Panel>
    </div>
  );
}
