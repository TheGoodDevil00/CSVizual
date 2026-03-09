# CSVizual

CSVizual is a modern CSV analytics dashboard that takes users from raw upload to interactive data understanding, chart recommendations, and custom visualization building.

Built with:
- React + TypeScript + Vite
- TailwindCSS + shadcn-style UI primitives
- Zustand state management
- TanStack Table + TanStack Virtual
- PapaParse
- ECharts

## Quick Start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Example Datasets

Use the CSV files in:
- `examples/sales_performance.csv`
- `examples/marketing_funnel.csv`

Upload either file from the landing screen.

## Product Flow

1. Upload CSV from landing page.
2. CSV parsing + schema inference + quality profiling.
3. Dataset dashboard with KPI cards + column inspector.
4. Chart Explorer with recommendation cards.
5. Visualization Editor with custom chart controls.
6. Filter-aware table + charts for iterative exploration.

## Screen Map

- Landing
- Dataset Dashboard
- Chart Explorer
- Visualization Editor
- Data Table

## Project Structure

```text
src/
  components/
    charts/
    dashboard/
    data/
    filters/
    layout/
    ui/
    upload/
  lib/
    chart-engine.ts
    csv-parser.ts
    data-analysis.ts
    filtering.ts
    utils.ts
  screens/
    dashboard-screen.tsx
    editor-screen.tsx
    explorer-screen.tsx
    landing-screen.tsx
    table-screen.tsx
  store/
    use-dataset-store.ts
  types/
    data.ts
  App.tsx
  main.tsx
  index.css
docs/
  PRODUCT_UI_SPEC.md
examples/
  sales_performance.csv
  marketing_funnel.csv
```

## Architecture Notes

- Parsing pipeline: `File -> PapaParse -> Normalization -> Analysis -> Zustand store`
- Analysis produces:
  - Column profiles
  - Dataset summary
  - Chart recommendations
- Filtering applies globally to both table and charts.
- Data table uses row virtualization for large datasets.
- Chart rendering is generated from chart specs and builder configuration.

## Performance Strategy Implemented

- Virtualized row rendering in table view.
- Memoized filtered rows and chart options.
- Lightweight derived selectors in Zustand-backed app flow.

## Future Extensibility Hooks

- AI insight card module alongside chart recommendations.
- Natural language query layer mapping into filters + builder state.
- Shareable dashboard state serialization.
- Multi-dataset comparison mode.
