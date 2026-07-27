import { StatCard, type StatCardProps } from "../StatCard/StatCard";
import "./StatsGrid.scss";

export function StatsGrid({ items }: { items: StatCardProps[] }) {
  return (
    <div className="dashboard__stats">
      {items.map((item, i) => (
        <StatCard key={i} {...item} />
      ))}
    </div>
  );
}
