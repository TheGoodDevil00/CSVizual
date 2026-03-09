# CSVizual Product + UI Design Specification

## 1. Product Overview
**Name:** CSVizual

CSVizual is a browser-based analytics workspace for turning raw CSV files into understandable, interactive visual stories. The core experience is designed around a progressive analysis loop:

1. **CSV upload**  
   User drags/drops or selects a `.csv` file from the landing screen.
2. **Data understanding**  
   CSVizual parses the file, infers column types, surfaces quality signals (missing values, cardinality, numeric ranges), and previews the dataset in a virtualized table.
3. **Visualization**  
   The app recommends chart types from schema patterns (numeric trends, category comparisons, distributions, correlations).
4. **Exploration**  
   User applies filters, switches views, and builds custom charts by selecting chart type + dimensions + aggregations.

The product should feel like a modern analytics notebook: clean, card-driven, contextual controls, and low-friction iterative analysis.

## 2. User Flow
1. **Landing page**
   - User sees value proposition, feature highlights, and upload call-to-action.
2. **Upload CSV**
   - Drag/drop zone or file picker accepts CSV file.
   - Upload state confirms selected file name and size.
3. **Dataset parsing**
   - Parser reads CSV, converts rows to records, infers column data types.
   - Validation status shown (row count, parsing errors if any).
4. **Dataset overview**
   - KPI cards: rows, columns, numeric columns, categorical columns, missing cells.
   - Column intelligence panel with type + completeness.
5. **Interactive data table**
   - Sortable/filterable table preview with virtualization for large datasets.
6. **Visualization recommendations**
   - Auto-generated chart cards based on detected schema patterns.
   - User can open charts in expanded explorer view.
7. **Custom visualization builder**
   - Builder lets user choose chart type, X axis, Y axis, and aggregation.
   - Live chart preview updates instantly.
8. **Data filtering**
   - Filter panel supports categorical contains and numeric range constraints.
   - All charts + table respond to active filters.

## 3. Screen Breakdown
### A. Landing Screen
**Purpose:** onboarding + file upload.

**Components**
- Hero block (name, value proposition, short subtitle)
- UploadZone card (drag/drop + file input)
- Feature highlights (analysis, recommendations, chart builder)

### B. Dataset Dashboard
**Purpose:** high-level understanding and first insights.

**Components**
- TopNavigation
- DatasetOverview cards
- ColumnInspector panel
- Recommendation carousel/grid of chart cards
- Quick filter summary chip row

### C. Chart Explorer
**Purpose:** compare and inspect auto-generated charts.

**Components**
- FilterPanel (left)
- Chart grid (center/right)
- Chart detail modal/panel (optional expansion)

### D. Visualization Editor
**Purpose:** manual chart creation.

**Components**
- ChartBuilder form controls
- Live chart preview card
- Configuration summary and reset action
- DataTableCard for validation against raw rows

## 4. Layout System
### Global layout
- **Top navigation bar:** fixed height, brand + dataset status + upload reset action.
- **Left sidebar:** primary navigation and analysis context.
- **Main workspace:** responsive grid of cards and visualization panels.

### Grid model
- 12-column responsive CSS grid.
- Breakpoints:
  - Mobile: single column stacking.
  - Tablet: 12-column grid with collapsed sidebar.
  - Desktop: full 12-column split.

### Desktop composition
- Sidebar: **3 columns**
- Main workspace: **9 columns**

### Internal workspace patterns
- KPI row: 4 cards each spans 3 columns.
- Dual panel: 4/8 split for metadata + visualization.
- Triple chart layout: three cards each spans 4 columns.

## 5. Component Hierarchy
### AppLayout
- **Purpose:** shared shell with top nav + sidebar + workspace.
- **Inputs:** current route/view, dataset loaded flag.
- **Outputs:** selected view change events.

### TopNavigation
- **Purpose:** app branding and file/session controls.
- **Inputs:** dataset name, row/column counts, callbacks.
- **Outputs:** upload new file action, reset dataset action.

### Sidebar
- **Purpose:** navigation across Dashboard, Explorer, Editor, Table.
- **Inputs:** active view, dataset availability.
- **Outputs:** view selection action.

### UploadZone
- **Purpose:** CSV input via drag/drop and picker.
- **Inputs:** accepted types, loading state.
- **Outputs:** selected File object.

### DatasetOverviewCard
- **Purpose:** present one top-level metric.
- **Inputs:** label, value, helper text, trend badge.
- **Outputs:** optional click event for drill-down.

### ColumnInspector
- **Purpose:** per-column type and quality diagnostics.
- **Inputs:** column metadata array.
- **Outputs:** selected column id (for builder prefill/filtering).

### DataTableCard
- **Purpose:** interactive and virtualized tabular preview.
- **Inputs:** filtered rows, column definitions, sort/filter state.
- **Outputs:** sort changes, row selection, column filter actions.

### ChartCard
- **Purpose:** reusable visualization container.
- **Inputs:** chart title, subtitle, ECharts option config, loading/error.
- **Outputs:** expand/save events.

### ChartRecommendations
- **Purpose:** render ranked suggested charts from analysis engine.
- **Inputs:** recommendation list.
- **Outputs:** choose recommendation for exploration/editing.

### ChartBuilder
- **Purpose:** custom chart config UI.
- **Inputs:** available columns, current builder state.
- **Outputs:** chart config changes, build/apply chart event.

### FilterPanel
- **Purpose:** dataset-wide filters.
- **Inputs:** column metadata, active filters.
- **Outputs:** add/remove/update filter events.

## 6. Visual Style System
### Color palette
- **Background:** warm neutral `#f5f7fb`
- **Surface:** white `#ffffff`
- **Primary:** cobalt `#1f6feb`
- **Primary hover:** deep cobalt `#1858bd`
- **Accent:** teal `#0f9b8e`
- **Text strong:** slate `#0f172a`
- **Text muted:** gray `#64748b`
- **Border:** cool gray `#dbe2ea`
- **Success:** `#16a34a`
- **Warning:** `#d97706`
- **Danger:** `#dc2626`

### Typography
- Heading font: **Manrope** (600/700)
- Body/UI font: **Plus Jakarta Sans** (400/500/600)
- Numeric emphasis: tabular numeral styling for KPIs.

### Spacing scale
- 4, 8, 12, 16, 20, 24, 32 px scale.
- Card padding defaults: 20 px.
- Section gap defaults: 16 px mobile, 24 px desktop.

### Card styles
- Radius: 14 px
- Border: 1 px solid neutral border
- Shadow: subtle layered shadow
- Header/footer slots for consistent rhythm

### Hover effects
- Cards: lift by 2 px and slightly stronger shadow.
- Buttons: color darken + 120 ms transition.
- Inputs: border tint + ring accent on focus.

### Transitions and motion
- Global transition: 120-180 ms ease-out.
- Staggered reveal for chart cards on first render.
- Skeleton placeholders during parse/recompute.

## 7. Data Flow Architecture
```
CSV File
  -> PapaParse Parser
  -> Normalizer (row typing + null handling)
  -> Dataset Store (Zustand)
  -> Analysis Engine (column profile + stats)
  -> Recommendation Engine (chart suggestions)
  -> View Models (table rows, chart options)
  -> UI Components (cards/table/charts/filter controls)
```

### State layers
- **Raw state:** file info, original rows.
- **Derived state:** inferred schema, stats, filtered rows.
- **Presentation state:** active view, selected chart, builder controls.

### Update loop
- Upload/filters/builder changes update Zustand state.
- Memoized selectors compute chart/table view models.
- React components consume selectors and render cards/charts.

## 8. Performance Strategy
- **Virtualized tables:** render only visible rows to keep DOM small.
- **Lazy computations:** expensive stats/chart derivations computed on demand.
- **Memoization:** selector-level memoization for filtered rows and chart options.
- **Chunked parsing option:** PapaParse worker mode prepared for very large files.
- **Progressive rendering:** show KPI shell first, then heavier chart cards.
- **Debounced filter updates:** reduce recompute thrashing during typing.

## 9. Extensibility Plan
### AI insights
- Add `insightEngine` module consuming schema + summary stats.
- Surface generated "insight cards" next to recommendations.

### Natural language queries
- Add query input translating intent into filter + chart builder state.
- Keep parser/analysis contracts stable so NL layer maps into existing actions.

### Dashboard sharing
- Serialize builder configs + filters into sharable state payload.
- Add export/import route with URL-safe compressed JSON.

### Multi-file comparison
- Extend store for multiple datasets and join/comparison modes.
- Introduce dataset tabs and side-by-side chart/table panels.

---
This specification is the implementation baseline for Phase 2.
