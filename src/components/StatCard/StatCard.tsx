import "./StatCard.scss";

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  /** Tint the value with `color` and add a glow. */
  accent?: boolean;
  /** Style the value as a warning (points of interest). */
  warn?: boolean;
  color?: string;
}

export function StatCard({
  label,
  value,
  unit,
  accent,
  warn,
  color,
}: StatCardProps) {
  return (
    <div className="stat glass">
      <p className="stat__label">{label}</p>
      <p
        className={`stat__value ${accent ? "stat__value--accent" : ""} ${
          warn ? "stat__value--warn" : ""
        }`}
        style={accent && color ? { color } : undefined}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit && <span className="stat__unit">{unit}</span>}
      </p>
    </div>
  );
}
