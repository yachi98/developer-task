import { memo, useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip as LeafletTooltip,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import type { SurveyReading } from "../../lib/types";
import { METRIC_META } from "../../lib/types";
import type { Summary } from "../../lib/stats";
import { POI_COLOR, SELECTED_COLOR } from "../../theme";
import "leaflet/dist/leaflet.css";
import "./SurveyMap.scss";

interface SurveyMapProps {
  readings: SurveyReading[];
  summary: Summary;
  color: string;
  selectedSection: number | null;
  onSelect: (section: number | null) => void;
}

// zoom/position the map so all points are visible
function FitBounds({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [24, 24] });
  }, [bounds, map]);
  return null;
}

// smoothly move the map to the selected reading
function PanToSelected({ reading }: { reading: SurveyReading | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (reading) {
      map.panTo([reading.latitude, reading.longitude], { animate: true });
    }
  }, [reading, map]);
  return null;
}

function SurveyMapImpl({
  readings,
  summary,
  color,
  selectedSection,
  onSelect,
}: SurveyMapProps) {
  const meta = METRIC_META[readings[0]?.metric ?? "MPD"];

  const valid = useMemo(
    () =>
      readings.filter(
        (r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude),
      ),
    [readings],
  );

  // The full route as a single lightweight polyline (cheap vs. one marker each).
  const route = useMemo<LatLngExpression[]>(
    () => valid.map((r) => [r.latitude, r.longitude]),
    [valid],
  );

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (!valid.length) return null;
    const lats = valid.map((r) => r.latitude);
    const lons = valid.map((r) => r.longitude);
    return [
      [Math.min(...lats), Math.min(...lons)],
      [Math.max(...lats), Math.max(...lons)],
    ];
  }, [valid]);

  // Only points of interest get their own marker — this is what keeps it fast.
  const highlights = useMemo(
    () => valid.filter((r) => r.value >= summary.threshold),
    [valid, summary.threshold],
  );

  const selectedReading = valid.find((r) => r.section === selectedSection);

  return (
    <MapContainer
      className="survey-map"
      center={[51.94, -0.274]}
      zoom={15}
      scrollWheelZoom
      preferCanvas
    >
      <TileLayer
        url="https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <FitBounds bounds={bounds} />
      <PanToSelected reading={selectedReading} />

      <Polyline
        positions={route}
        pathOptions={{ color, weight: 4, opacity: 0.8 }}
      />

      {highlights.map((highlight) => (
        <CircleMarker
          key={highlight.section}
          center={[highlight.latitude, highlight.longitude]}
          radius={highlight.section === selectedSection ? 9 : 6}
          pathOptions={{
            color:
              highlight.section === selectedSection
                ? SELECTED_COLOR
                : POI_COLOR,
            fillColor:
              highlight.section === selectedSection
                ? SELECTED_COLOR
                : POI_COLOR,
            fillOpacity: 0.9,
            weight: highlight.section === selectedSection ? 3 : 1,
          }}
          eventHandlers={{ click: () => onSelect(highlight.section) }}
        >
          <LeafletTooltip>
            §{highlight.section} · {highlight.value.toFixed(2)} {meta.unit}
          </LeafletTooltip>
          <Popup>
            <strong>Section {highlight.section}</strong>
            <br />
            Chainage {highlight.start}–{highlight.end} m
            <br />
            {meta.label}: {highlight.value.toFixed(2)} {meta.unit}
            <br />
            <span style={{ color: POI_COLOR }}>⚠ Point of interest</span>
          </Popup>
        </CircleMarker>
      ))}

      {/* Selected point when it isn't already a flagged marker */}
      {selectedReading && selectedReading.value < summary.threshold && (
        <CircleMarker
          center={[selectedReading.latitude, selectedReading.longitude]}
          radius={9}
          pathOptions={{
            color: SELECTED_COLOR,
            fillColor: SELECTED_COLOR,
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <strong>Section {selectedReading.section}</strong>
            <br />
            {meta.label}: {selectedReading.value.toFixed(2)} {meta.unit}
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}

export const SurveyMap = memo(SurveyMapImpl);
