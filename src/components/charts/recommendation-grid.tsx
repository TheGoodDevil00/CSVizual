import { useMemo } from 'react'
import { buildChartOption } from '@/lib/chart-engine'
import type { ChartSpec, ColumnProfile, DataRow } from '@/types/data'
import { ChartCard } from '@/components/charts/chart-card'

interface RecommendationGridProps {
  recommendations: ChartSpec[]
  rows: DataRow[]
  profiles: ColumnProfile[]
  onOpenRecommendation: (recommendationId: string) => void
}

export function RecommendationGrid({
  recommendations,
  rows,
  profiles,
  onOpenRecommendation,
}: RecommendationGridProps) {
  const chartOptions = useMemo(
    () =>
      recommendations.map((recommendation) => ({
        recommendation,
        option: buildChartOption(recommendation, rows, profiles),
      })),
    [recommendations, rows, profiles],
  )

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {chartOptions.map(({ recommendation, option }) => (
        <ChartCard
          key={recommendation.id}
          title={recommendation.title}
          description={recommendation.description}
          option={option}
          onOpen={() => onOpenRecommendation(recommendation.id)}
        />
      ))}
    </div>
  )
}
