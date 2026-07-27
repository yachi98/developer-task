import { StatCard } from "../StatCard";

export function StatsGrid({ items }: { items: any[] }) {
  return (
    <div className="dashboard__stats">
      {items.map((item, i) => (
        <StatCard key={i} {...item} />
      ))}
    </div>
  );
}
