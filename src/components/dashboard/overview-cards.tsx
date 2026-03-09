import type { ComponentType } from 'react'
import { Database, Hash, Tags, TriangleAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCompact } from '@/lib/utils'
import type { DatasetSummary } from '@/types/data'

interface OverviewCardsProps {
  summary: DatasetSummary
  filteredRowCount: number
}

interface StatCard {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
  helper: string
}

export function OverviewCards({ summary, filteredRowCount }: OverviewCardsProps) {
  const cards: StatCard[] = [
    {
      label: 'Rows',
      value: formatCompact(summary.rowCount),
      icon: Database,
      helper: `${formatCompact(filteredRowCount)} rows after filters`,
    },
    {
      label: 'Columns',
      value: formatCompact(summary.columnCount),
      icon: Hash,
      helper: `${summary.numericColumns} numeric + ${summary.categoricalColumns} categorical`,
    },
    {
      label: 'Date Fields',
      value: formatCompact(summary.dateColumns),
      icon: Tags,
      helper: 'Detected for time trend charts',
    },
    {
      label: 'Missing Cells',
      value: formatCompact(summary.missingCells),
      icon: TriangleAlert,
      helper: 'Data quality indicator',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="animate-fade-in-up">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                {card.label}
                <Icon className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-2xl font-bold tabular-nums text-foreground">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
