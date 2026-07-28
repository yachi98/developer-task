import "./StatCard.scss";

export interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  accent?: boolean;
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
