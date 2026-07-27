import { memo, useMemo, useRef } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Chart,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { SurveyReading } from "../../data/types";
import { METRIC_META } from "../../data/types";
import type { Summary } from "../../data/stats";
import { POI_COLOR, SELECTED_COLOR } from "../../theme";
import "./MethodChart.scss";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

interface Props {
  readings: SurveyReading[];
  summary: Summary;
  color: string;
  selectedSection: number | null;
  onSelect: (section: number | null) => void;
}

function MethodChartImpl({
  readings,
  summary,
  color,
  selectedSection,
  onSelect,
}: Props) {
  const meta = METRIC_META[readings[0]?.metric ?? "MPD"];
  const chartRef = useRef<Chart<"line"> | null>(null);

  const data = useMemo<ChartData<"line">>(() => {
    const points = readings.map((r) => ({ x: r.chainage, y: r.value }));
    const xs = readings.map((r) => r.chainage);
    const min = xs.length ? Math.min(...xs) : 0;
    const max = xs.length ? Math.max(...xs) : 0;

    return {
      datasets: [
        // Threshold reference line (points of interest cutoff)
        {
          label: "threshold",
          data: [
            { x: min, y: summary.threshold },
            { x: max, y: summary.threshold },
          ],
          borderColor: color,
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        },
        // The survey readings
        {
          label: meta.label,
          data: points,
          borderColor: color,
          borderWidth: 1.5,
          tension: 0.3,
          fill: true,
          backgroundColor: (ctx) => {
            const { chart } = ctx;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return "transparent";
            const g = c.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            g.addColorStop(0, `${color}59`); // ~0.35 alpha
            g.addColorStop(1, `${color}00`);
            return g;
          },
          pointRadius: readings.map((r) =>
            r.section === selectedSection
              ? 5
              : r.value >= summary.threshold
                ? 3.5
                : 0,
          ),
          pointBackgroundColor: readings.map((r) =>
            r.section === selectedSection
              ? SELECTED_COLOR
              : r.value >= summary.threshold
                ? POI_COLOR
                : color,
          ),
          pointBorderWidth: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [readings, summary.threshold, color, meta.label, selectedSection]);

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      parsing: false,
      normalized: true,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      onClick: (_evt, _els, chart) => {
        const items = chart.getActiveElements();
        if (!items.length) return onSelect(null);
        // index into the readings dataset (dataset 1)
        const hit = items.find((i) => i.datasetIndex === 1) ?? items[0];
        const r = readings[hit.index];
        onSelect(r ? r.section : null);
      },
      scales: {
        x: {
          type: "linear",
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: {
            color: "#94a3b8",
            font: { size: 11 },
            maxTicksLimit: 6,
            callback: (v) => `${v}m`,
          },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#94a3b8", font: { size: 11 } },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (item) => item.datasetIndex === 1,
          backgroundColor: "rgba(15,23,42,0.95)",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => {
              const r = readings[items[0].dataIndex];
              return r ? `Section ${r.section}` : "";
            },
            label: (item) => {
              const r = readings[item.dataIndex];
              return r
                ? `${r.value.toFixed(2)} ${meta.unit}  ·  ${r.chainage.toFixed(0)} m`
                : "";
            },
          },
        },
      },
    }),
    [readings, meta.unit, onSelect],
  );

  return (
    <div className="method-chart">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

export const MethodChart = memo(MethodChartImpl);
