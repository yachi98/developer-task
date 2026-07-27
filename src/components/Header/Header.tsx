import "./Header.scss";

export function Header() {
  return (
    <div className="dashboard__header">
      <img
        className="dashboard__logo"
        src="/hds-logo.svg"
        alt="Highway Data Systems"
        width="20"
        height="20"
      />

      <div>
        <h1 className="dashboard__title">
          Highway <span>Survey Dashboard</span>
        </h1>
      </div>
    </div>
  );
}
