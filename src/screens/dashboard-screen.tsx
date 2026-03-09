import { AlertTriangle } from 'lucide-react'
import { RecommendationGrid } from '@/components/charts/recommendation-grid'
import { ColumnInspector } from '@/components/dashboard/column-inspector'
import { OverviewCards } from '@/components/dashboard/overview-cards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartSpec, DatasetModel, DataRow } from '@/types/data'

interface DashboardScreenProps {
  dataset: DatasetModel
  filteredRows: DataRow[]
  recommendations: ChartSpec[]
  onOpenRecommendation: (recommendationId: string) => void
}

export function DashboardScreen({
  dataset,
  filteredRows,
  recommendations,
  onOpenRecommendation,
}: DashboardScreenProps) {
  return (
    <div className="space-y-4">
      <OverviewCards summary={dataset.summary} filteredRowCount={filteredRows.length} />

      {dataset.parseErrors.length > 0 ? (
        <Card className="border-warning/30 bg-warning/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              Parse warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-warning">
            {dataset.parseErrors.slice(0, 3).map((error) => (
              <p key={error}>{error}</p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:dashboard-grid">
        <div className="xl:col-span-4">
          <ColumnInspector profiles={dataset.profiles} />
        </div>
        <div className="space-y-4 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Visualization Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <RecommendationGrid
                recommendations={recommendations.slice(0, 2)}
                rows={filteredRows}
                profiles={dataset.profiles}
                onOpenRecommendation={onOpenRecommendation}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
