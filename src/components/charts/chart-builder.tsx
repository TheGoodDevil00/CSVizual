import type { EChartsOption } from 'echarts'
import { Sparkle } from 'lucide-react'
import { ChartCard } from '@/components/charts/chart-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import type { BuilderConfig, ColumnProfile } from '@/types/data'

interface ChartBuilderProps {
  profiles: ColumnProfile[]
  config: BuilderConfig
  previewOption: EChartsOption
  onUpdate: (update: Partial<BuilderConfig>) => void
}

const chartTypeOptions = [
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' },
  { label: 'Scatter', value: 'scatter' },
  { label: 'Histogram', value: 'histogram' },
  { label: 'Pie', value: 'pie' },
]

const aggregationOptions = [
  { label: 'Average', value: 'avg' },
  { label: 'Sum', value: 'sum' },
  { label: 'Count', value: 'count' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
]

export function ChartBuilder({ profiles, config, previewOption, onUpdate }: ChartBuilderProps) {
  const numericOptions = profiles
    .filter((profile) => profile.type === 'number')
    .map((profile) => ({ label: profile.name, value: profile.name }))
  const categoryOptions = profiles
    .filter((profile) => profile.type === 'string' || profile.type === 'boolean' || profile.type === 'date')
    .map((profile) => ({ label: profile.name, value: profile.name }))
  const allOptions = profiles.map((profile) => ({ label: profile.name, value: profile.name }))

  const xOptions =
    config.chartType === 'histogram' || config.chartType === 'scatter'
      ? numericOptions
      : config.chartType === 'pie'
        ? categoryOptions
        : categoryOptions.length > 0
          ? categoryOptions
          : allOptions

  const yOptions = config.chartType === 'scatter' || config.chartType === 'bar' || config.chartType === 'line' ? numericOptions : allOptions

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle className="h-4 w-4 text-accent" />
            Visualization Editor
          </CardTitle>
          <CardDescription>Choose chart type, dimensions, and aggregation. Preview updates instantly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Chart Type</Label>
            <Select
              value={config.chartType}
              options={chartTypeOptions}
              onChange={(event) => {
                const chartType = event.target.value as BuilderConfig['chartType']
                onUpdate({ chartType })
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>X Axis</Label>
            <Select
              value={config.xColumn}
              options={xOptions.length > 0 ? xOptions : [{ label: 'No compatible columns', value: '' }]}
              onChange={(event) => onUpdate({ xColumn: event.target.value })}
            />
          </div>

          {config.chartType !== 'histogram' && config.chartType !== 'pie' ? (
            <div className="space-y-2">
              <Label>Y Axis</Label>
              <Select
                value={config.yColumn}
                options={yOptions.length > 0 ? yOptions : [{ label: 'No compatible columns', value: '' }]}
                onChange={(event) => onUpdate({ yColumn: event.target.value })}
              />
            </div>
          ) : null}

          {config.chartType === 'bar' || config.chartType === 'line' ? (
            <div className="space-y-2">
              <Label>Aggregation</Label>
              <Select
                value={config.aggregation}
                options={aggregationOptions}
                onChange={(event) => onUpdate({ aggregation: event.target.value as BuilderConfig['aggregation'] })}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="xl:col-span-8">
        <ChartCard title="Custom Chart Preview" description="This chart uses your editor configuration." option={previewOption} height={380} />
      </div>
    </div>
  )
}
