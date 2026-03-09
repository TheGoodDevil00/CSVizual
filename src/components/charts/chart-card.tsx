import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description: string
  option: EChartsOption
  height?: number
  onOpen?: () => void
}

export function ChartCard({ title, description, option, height = 320, onOpen }: ChartCardProps) {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {onOpen ? (
            <Button size="sm" variant="outline" onClick={onOpen}>
              <ArrowUpRight className="h-4 w-4" />
              Open
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <ReactECharts option={option} style={{ height }} notMerge lazyUpdate />
      </CardContent>
    </Card>
  )
}
