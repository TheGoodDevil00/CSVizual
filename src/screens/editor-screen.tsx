import type { EChartsOption } from 'echarts'
import { ChartBuilder } from '@/components/charts/chart-builder'
import { DataTableCard } from '@/components/data/data-table-card'
import { FilterPanel } from '@/components/filters/filter-panel'
import type { BuilderConfig, DatasetModel, DataRow, FilterState } from '@/types/data'

interface EditorScreenProps {
  dataset: DatasetModel
  filteredRows: DataRow[]
  filters: FilterState
  config: BuilderConfig
  chartOption: EChartsOption
  onUpdateFilter: (column: string, filter: FilterState[string]) => void
  onClearFilter: (column: string) => void
  onClearAllFilters: () => void
  onUpdateBuilder: (update: Partial<BuilderConfig>) => void
}

export function EditorScreen({
  dataset,
  filteredRows,
  filters,
  config,
  chartOption,
  onUpdateFilter,
  onClearFilter,
  onClearAllFilters,
  onUpdateBuilder,
}: EditorScreenProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:dashboard-grid">
        <div className="xl:col-span-3">
          <FilterPanel
            profiles={dataset.profiles}
            filters={filters}
            onUpdateFilter={onUpdateFilter}
            onClearFilter={onClearFilter}
            onClearAll={onClearAllFilters}
          />
        </div>
        <div className="xl:col-span-9">
          <ChartBuilder profiles={dataset.profiles} config={config} previewOption={chartOption} onUpdate={onUpdateBuilder} />
        </div>
      </div>

      <DataTableCard rows={filteredRows} columns={dataset.columns} />
    </div>
  )
}
