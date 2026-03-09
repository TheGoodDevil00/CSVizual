import { DataTableCard } from '@/components/data/data-table-card'
import { FilterPanel } from '@/components/filters/filter-panel'
import type { DatasetModel, DataRow, FilterState } from '@/types/data'

interface TableScreenProps {
  dataset: DatasetModel
  filteredRows: DataRow[]
  filters: FilterState
  onUpdateFilter: (column: string, filter: FilterState[string]) => void
  onClearFilter: (column: string) => void
  onClearAllFilters: () => void
}

export function TableScreen({
  dataset,
  filteredRows,
  filters,
  onUpdateFilter,
  onClearFilter,
  onClearAllFilters,
}: TableScreenProps) {
  return (
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
        <DataTableCard rows={filteredRows} columns={dataset.columns} />
      </div>
    </div>
  )
}
