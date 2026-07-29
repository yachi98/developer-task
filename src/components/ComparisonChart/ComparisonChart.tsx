import { memo, useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Chart,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Metric, SurveyReading } from "../../lib/types";
import { METRIC_META } from "../../lib/types";
import type { Summary } from "../../lib/stats";
import { METRIC_COLORS, POI_COLOR, SELECTED_COLOR } from "../../theme";
import "./ComparisonChart.scss";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ComparisonChartProps {
  mpd: SurveyReading[];
  ukri: SurveyReading[];
  mpdSummary: Summary;
  ukriSummary: Summary;
  metric: Metric;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

function ComparisonChartImpl({
  mpd,
  ukri,
  mpdSummary,
  ukriSummary,
  metric,
  selected,
  onSelect,
}: ComparisonChartProps) {
  const chartRef = useRef<Chart<"line"> | null>(null);

  const data = useMemo<ChartData<"line">>(() => {
    // Build one dataset per metric; each sits on its own y-axis because the
    // units differ (MPD in mm, UKRI in m/km).
    const series = (
      [
        {
          key: "MPD" as Metric,
          readings: mpd,
          threshold: mpdSummary.threshold,
          axis: "yMpd",
        },
        {
          key: "UKRI" as Metric,
          readings: ukri,
          threshold: ukriSummary.threshold,
          axis: "yUkri",
        },
      ] as const
    ).map(({ key, readings, threshold, axis }) => {
      const isActive = key === metric;
      const color = METRIC_COLORS[key];
      return {
        label: `${METRIC_META[key].label} (${METRIC_META[key].unit})`,
        yAxisID: axis,
        data: readings.map((r) => ({ x: r.chainage, y: r.value })),
        // Dim the non-active line so the toggle still means something.
        borderColor: isActive ? color : `${color}66`,
        borderWidth: isActive ? 2.2 : 1.3,
        tension: 0.3,
        fill: false,
        pointRadius: readings.map((r) =>
          isActive && r.id === selected ? 5 : r.value >= threshold ? 3.5 : 0,
        ),
        pointBackgroundColor: readings.map((r) =>
          isActive && r.id === selected
            ? SELECTED_COLOR
            : r.value >= threshold
              ? POI_COLOR
              : color,
        ),
        pointBorderWidth: 0,
        pointHoverRadius: 5,
      };
    });

    return { datasets: series };
  }, [
    mpd,
    ukri,
    mpdSummary.threshold,
    ukriSummary.threshold,
    metric,
    selected,
  ]);

  const options = useMemo<ChartOptions<"line">>(() => {
    // Dataset 0 = MPD, 1 = UKRI (matches the order built above).
    const readingsFor = (datasetIndex: number) =>
      datasetIndex === 0 ? mpd : ukri;
    const metaFor = (datasetIndex: number) =>
      METRIC_META[datasetIndex === 0 ? "MPD" : "UKRI"];

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      parsing: false,
      normalized: true,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      onClick: (_event, _elements, chart) => {
        // Only the active metric's line drives selection, so it stays in sync
        // with the map/table (which show the active metric).
        const activeDatasetIndex = metric === "MPD" ? 0 : 1;
        const hit = chart
          .getActiveElements()
          .find((el) => el.datasetIndex === activeDatasetIndex);
        if (!hit) return onSelect(null);
        onSelect(readingsFor(activeDatasetIndex)[hit.index]?.id ?? null);
      },
      scales: {
        x: {
          type: "linear",
          bounds: "data",
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: {
            color: "#94a3b8",
            font: { size: 11 },
            maxTicksLimit: 6,
            callback: (v) => `${v}m`,
          },
        },
        yMpd: {
          type: "linear",
          position: "left",
          title: { display: true, text: "MPD (mm)", color: METRIC_COLORS.MPD },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: METRIC_COLORS.MPD, font: { size: 11 } },
        },
        yUkri: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "UKRI (m/km)",
            color: METRIC_COLORS.UKRI,
          },
          // Don't draw a second grid over the first — keeps it readable.
          grid: { drawOnChartArea: false },
          ticks: { color: METRIC_COLORS.UKRI, font: { size: 11 } },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: { color: "#cbd5e1", usePointStyle: true, boxHeight: 7 },
        },
        tooltip: {
          backgroundColor: "rgba(15,23,42,0.95)",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => {
              const { datasetIndex, dataIndex } = items[0];
              const reading = readingsFor(datasetIndex)[dataIndex];
              return reading ? `Section ${reading.section}` : "";
            },
            label: (item) => {
              const { datasetIndex, dataIndex } = item;
              const reading = readingsFor(datasetIndex)[dataIndex];
              const meta = metaFor(datasetIndex);
              return reading
                ? `${meta.label}: ${reading.value.toFixed(2)} ${meta.unit}  ·  ${reading.chainage.toFixed(0)} m`
                : "";
            },
          },
        },
      },
    };
  }, [mpd, ukri, metric, onSelect]);

  return (
    <div className="comparison-chart">
      <Line
        ref={chartRef}
        data={data}
        options={options}
        aria-label={`Line chart of MPD and UKRI readings against chainage. The ${METRIC_META[metric].label} data is also listed in the readings table.`}
      />
    </div>
  );
}

export const ComparisonChart = memo(ComparisonChartImpl);
