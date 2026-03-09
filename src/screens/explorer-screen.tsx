import { RecommendationGrid } from '@/components/charts/recommendation-grid'
import { FilterPanel } from '@/components/filters/filter-panel'
import type { ChartSpec, DatasetModel, DataRow, FilterState } from '@/types/data'

interface ExplorerScreenProps {
  dataset: DatasetModel
  filteredRows: DataRow[]
  recommendations: ChartSpec[]
  filters: FilterState
  onUpdateFilter: (column: string, filter: FilterState[string]) => void
  onClearFilter: (column: string) => void
  onClearAllFilters: () => void
  onOpenRecommendation: (recommendationId: string) => void
}

export function ExplorerScreen({
  dataset,
  filteredRows,
  recommendations,
  filters,
  onUpdateFilter,
  onClearFilter,
  onClearAllFilters,
  onOpenRecommendation,
}: ExplorerScreenProps) {
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
        <RecommendationGrid
          recommendations={recommendations}
          rows={filteredRows}
          profiles={dataset.profiles}
          onOpenRecommendation={onOpenRecommendation}
        />
      </div>
    </div>
  )
}
