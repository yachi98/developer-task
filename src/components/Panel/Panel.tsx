import type { ReactNode } from "react";
import "./Panel.scss";

interface PanelProps {
  title: string;
  tag?: string;
  noPad?: boolean;
  children: ReactNode;
}

export function Panel({ title, tag, noPad, children }: PanelProps) {
  return (
    <div className="panel glass">
      <div className="panel__head">
        <h2 className="panel__title">{title}</h2>
        {tag && <span className="panel__tag">{tag}</span>}
      </div>
      <div className={noPad ? "panel__body--flush" : "panel__body"}>
        {children}
      </div>
    </div>
  );
}
