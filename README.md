# A602 Road Survey Dashboard

A small web application that visualises a **road-surface condition survey** of the
A602 trial area. It reads two pavement-survey datasets — **MPD** (Mean Profile
Depth, surface texture) and **UKRI** (UK Ride Index, ride quality) — and lets you
switch between them, inspect summary statistics, explore the readings on line
charts and an interactive map, sort them in a table, and flag the worst sections
as "points of interest".

---

### Prerequisites

- Node.js 20+

No API key or backend is required — the survey data ships with the app as static
CSV files.

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173).

To produce a production build, run `npm run build` (type-checks with `tsc -b`
then bundles with Vite) and preview it with `npm run preview`.

## How it works

There is no server: the two survey CSVs live in `public/surveys/` and are fetched at
runtime, parsed in the browser, and rendered entirely client-side.

```text
public/surveys/*.csv  →  parseCSV (parseMpd / parseUkri)  →  useSurveyData  →  Dashboard
  (static assets)      (CSV text → SurveyReading[])       (fetch + state)    (charts / map / table)
```

Two metrics are surveyed, each in its own CSV:

- **MPD** — Mean Profile Depth (mm). A measure of surface **texture depth**.
- **UKRI** — UK Ride Index (m/km). A measure of surface **irregularity / ride
  quality**.

Each reading is keyed by `chainage` (distance along the route) and carries a
GPS coordinate, so the same data drives both the charts (value vs. chainage) and
the map (value at a location). "Points of interest" are the top 10% highest
readings, computed as the 90th percentile of the active metric.

---

## Assumptions

- The survey data is a fixed sample for the A602 trial area, so it is bundled
  with the app rather than fetched from a live source; swapping metrics never
  hits the network.
- "Points of interest" is interpreted as the **top 10% highest readings** (90th
  percentile) of whichever metric is active — the sections most likely to need
  attention.
- Only points of interest get their own map marker (the full route is drawn as a
  single polyline), since rendering a marker per reading would be needlessly
  heavy for little added insight.
- MPD and UKRI are surveyed independently, so their reading counts and sections
  differ; each metric is summarised on its own.

---

## Features

- **Metric toggle** — switch the whole dashboard between MPD and UKRI.
- **Summary stat cards** — reading count, average, peak, and number of points of
  interest for the active metric.
- **Line charts** — both metrics plotted against chainage, with the
  point-of-interest threshold drawn in and high readings emphasised.
- **Interactive map** — a Leaflet route polyline with a marker for each point of
  interest; click a marker to select that section.
- **Sortable data table** — click a header to sort ascending/descending; row
  selection stays in sync with the map.
- **Points of interest highlighting** — the worst 10% of readings are flagged in
  the table, on the map, and on the charts.
- **Loading and error states** for the data load.
- **Dark "glass" theme** — a navy + cyan glassmorphism palette driven by CSS
  custom properties.
- **Responsive** layout; the table scrolls horizontally on small screens.

---

## Tech choices

- Build tool: **Vite 8** — Fast dev server and build; raw CSV is served as a
  static asset and fetched at runtime.
- Framework: **React 19** — Component-driven UI with hooks.
- Language: **TypeScript** — Type safety across the data layer, hooks and
  components.
- Charts: **Chart.js** — Lightweight line charts with
  good control over the threshold line and point styling.
- Map: **Leaflet** — Simple, reliable slippy map for the
  route and point-of-interest markers.
- Styling: **SCSS** — One stylesheet per component, with a shared palette and
  glass surface defined as CSS custom properties in `index.css`.

---

## What I'd improve with more time

- **More features** — I would add more features such as search input component to search values, pagination component so it displays
  10
  per page which would be more efficient.
- **Adjustable threshold** — let the user change the point-of-interest percentile
  instead of hardcoding 90% (some groundwork for a slider already exists).
- **Data upload** — allow loading an arbitrary survey CSV rather than the bundled
  A602 sample.
- **Route heatmap** — colour the map route by reading value, not just mark the
  outliers.
- **Bundle splitting** — the map and chart libraries push the bundle over 500 kB;
  code-splitting them would improve first load.
- **Accessibility** — a fuller keyboard/screen-reader audit of the table, toggle
  and map controls.
- **Broader test coverage** — the current tests cover the pure logic (CSV
  parsing and statistics); with more time I'd add component/interaction tests
  for the table sorting, metric toggle and selection syncing between chart, map and table.
- **Resilient data loading** — an error boundary so a render failure in the
  chart or map degrades gracefully instead of blanking the page, plus a retry
  action on the existing error state.
- **CI pipeline** — run lint, type-check, tests and build on every push so
  regressions are caught automatically.
