import "./Header.scss";

export function Header() {
  return (
    <div className="dashboard__header">
      <div className="dashboard__logo">
        <img src="/hds-logo.svg" alt="Highway Data Systems" />
      </div>
      <div>
        <h1 className="dashboard__title">
          Highway <span>Survey Dashboard</span>
        </h1>
      </div>
    </div>
  );
}
