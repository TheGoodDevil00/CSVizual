import type { EChartsOption } from 'echarts'
import type {
  Aggregation,
  BuilderConfig,
  ChartSpec,
  ColumnProfile,
  DataRow,
  DatasetModel,
} from '@/types/data'

const palette = ['#1f6feb', '#0f9b8e', '#f59e0b', '#ef4444', '#8b5cf6']

interface GroupPoint {
  key: string
  value: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function toNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function aggregateValues(values: number[], aggregation: Aggregation) {
  if (values.length === 0) {
    return 0
  }

  switch (aggregation) {
    case 'sum':
      return values.reduce((sum, value) => sum + value, 0)
    case 'avg':
      return values.reduce((sum, value) => sum + value, 0) / values.length
    case 'count':
      return values.length
    case 'min':
      return Math.min(...values)
    case 'max':
      return Math.max(...values)
    default:
      return 0
  }
}

function aggregateByKey(rows: DataRow[], keyColumn: string, valueColumn: string, aggregation: Aggregation): GroupPoint[] {
  const grouped = new Map<string, number[]>()

  for (const row of rows) {
    const key = row[keyColumn]
    const rawValue = row[valueColumn]
    const numericValue = toNumber(rawValue)
    if (key === null || key === undefined || numericValue === null) {
      continue
    }

    const bucket = grouped.get(String(key)) ?? []
    bucket.push(numericValue)
    grouped.set(String(key), bucket)
  }

  return Array.from(grouped.entries())
    .map(([key, values]) => ({ key, value: aggregateValues(values, aggregation) }))
    .sort((a, b) => b.value - a.value)
}

function buildBaseGrid() {
  return {
    left: 48,
    right: 24,
    top: 40,
    bottom: 40,
    containLabel: true,
  }
}

function buildBarOrLineOption(spec: ChartSpec, rows: DataRow[]) {
  if (!spec.xColumn || !spec.yColumn) {
    return {}
  }

  const points = aggregateByKey(rows, spec.xColumn, spec.yColumn, spec.aggregation ?? 'avg').slice(0, 24)
  const seriesType = spec.chartType === 'line' ? 'line' : 'bar'
  if (seriesType === 'line') {
    points.sort((a, b) => {
      const left = Date.parse(a.key)
      const right = Date.parse(b.key)
      if (Number.isFinite(left) && Number.isFinite(right)) {
        return left - right
      }
      return a.key.localeCompare(b.key)
    })
  }

  return {
    color: palette,
    grid: buildBaseGrid(),
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: points.map((point) => point.key),
      axisLabel: { hideOverlap: true },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: spec.yColumn,
        type: seriesType,
        smooth: seriesType === 'line',
        data: points.map((point) => Number(point.value.toFixed(3))),
      },
    ],
  } satisfies EChartsOption
}

function buildScatterOption(spec: ChartSpec, rows: DataRow[]) {
  if (!spec.xColumn || !spec.yColumn) {
    return {}
  }

  const points = rows
    .map((row) => {
      const x = toNumber(row[spec.xColumn!])
      const y = toNumber(row[spec.yColumn!])
      return x !== null && y !== null ? [x, y] : null
    })
    .filter((value): value is [number, number] => value !== null)

  return {
    color: [palette[0]],
    grid: buildBaseGrid(),
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value', name: spec.xColumn },
    yAxis: { type: 'value', name: spec.yColumn },
    series: [
      {
        type: 'scatter',
        symbolSize: 10,
        data: points,
        emphasis: { scale: 1.3 },
      },
    ],
  } satisfies EChartsOption
}

function buildHistogramOption(spec: ChartSpec, rows: DataRow[]) {
  if (!spec.xColumn) {
    return {}
  }

  const values = rows
    .map((row) => toNumber(row[spec.xColumn!]))
    .filter((value): value is number => value !== null)

  if (values.length === 0) {
    return {}
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) {
    return {
      grid: buildBaseGrid(),
      xAxis: { type: 'category', data: [String(min)] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [values.length], itemStyle: { color: palette[0] } }],
    } satisfies EChartsOption
  }

  const bins = clamp(Math.round(Math.sqrt(values.length)), 6, 18)
  const step = (max - min) / bins
  const counts = Array.from({ length: bins }, () => 0)

  for (const value of values) {
    const index = clamp(Math.floor((value - min) / step), 0, bins - 1)
    counts[index] += 1
  }

  const labels = counts.map((_, index) => {
    const start = min + index * step
    const end = start + step
    return `${start.toFixed(1)}-${end.toFixed(1)}`
  })

  return {
    color: [palette[1]],
    grid: buildBaseGrid(),
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels, axisLabel: { rotate: 30 } },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: counts, barMaxWidth: 28 }],
  } satisfies EChartsOption
}

function buildPieOption(spec: ChartSpec, rows: DataRow[]) {
  if (!spec.xColumn) {
    return {}
  }

  const counts = new Map<string, number>()
  for (const row of rows) {
    const value = row[spec.xColumn]
    if (value === null || value === undefined) {
      continue
    }
    const key = String(value)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const sorted = Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const topItems = sorted.slice(0, 6)
  const remaining = sorted.slice(6).reduce((sum, item) => sum + item.value, 0)
  if (remaining > 0) {
    topItems.push({ name: 'Other', value: remaining })
  }

  return {
    color: palette,
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['42%', '74%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter: '{b}: {d}%',
        },
        data: topItems,
      },
    ],
  } satisfies EChartsOption
}

export function generateChartRecommendations(dataset: DatasetModel): ChartSpec[] {
  const numericColumns = dataset.profiles.filter((profile) => profile.type === 'number')
  const categoricalColumns = dataset.profiles.filter(
    (profile) => (profile.type === 'string' || profile.type === 'boolean') && profile.uniqueCount > 1 && profile.uniqueCount <= 30,
  )
  const dateColumns = dataset.profiles.filter((profile) => profile.type === 'date')

  const recommendations: ChartSpec[] = []

  if (categoricalColumns[0] && numericColumns[0]) {
    recommendations.push({
      id: 'bar-category-metric',
      title: `${numericColumns[0].name} by ${categoricalColumns[0].name}`,
      description: 'Compares aggregated values across categories.',
      chartType: 'bar',
      xColumn: categoricalColumns[0].name,
      yColumn: numericColumns[0].name,
      aggregation: 'avg',
      score: 0.97,
    })
  }

  if (dateColumns[0] && numericColumns[0]) {
    recommendations.push({
      id: 'line-time-trend',
      title: `${numericColumns[0].name} Trend Over ${dateColumns[0].name}`,
      description: 'Highlights time-based movement of numeric values.',
      chartType: 'line',
      xColumn: dateColumns[0].name,
      yColumn: numericColumns[0].name,
      aggregation: 'sum',
      score: 0.93,
    })
  }

  if (numericColumns.length >= 2) {
    recommendations.push({
      id: 'scatter-correlation',
      title: `${numericColumns[0].name} vs ${numericColumns[1].name}`,
      description: 'Reveals correlation and outliers between numeric fields.',
      chartType: 'scatter',
      xColumn: numericColumns[0].name,
      yColumn: numericColumns[1].name,
      score: 0.89,
    })
  }

  if (numericColumns[0]) {
    recommendations.push({
      id: 'histogram-distribution',
      title: `${numericColumns[0].name} Distribution`,
      description: 'Shows shape and spread of values in bins.',
      chartType: 'histogram',
      xColumn: numericColumns[0].name,
      score: 0.85,
    })
  }

  if (categoricalColumns[0]) {
    recommendations.push({
      id: 'pie-category-share',
      title: `${categoricalColumns[0].name} Share`,
      description: 'Summarizes record proportions by category.',
      chartType: 'pie',
      xColumn: categoricalColumns[0].name,
      score: 0.82,
    })
  }

  return recommendations.sort((a, b) => b.score - a.score)
}

export function builderConfigToSpec(config: BuilderConfig): ChartSpec {
  return {
    id: 'custom-chart',
    title: `Custom ${config.chartType[0].toUpperCase()}${config.chartType.slice(1)} Chart`,
    description: 'Generated from visualization editor controls.',
    chartType: config.chartType,
    xColumn: config.xColumn,
    yColumn: config.yColumn,
    aggregation: config.aggregation,
    score: 1,
  }
}

export function buildChartOption(spec: ChartSpec, rows: DataRow[], profiles: ColumnProfile[]): EChartsOption {
  const hasRows = rows.length > 0
  if (!hasRows) {
    return {
      title: {
        text: 'No rows match the active filters',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#64748b',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
    } satisfies EChartsOption
  }

  const columnsByName = new Map(profiles.map((profile) => [profile.name, profile]))
  const xExists = spec.xColumn ? columnsByName.has(spec.xColumn) : true
  const yExists = spec.yColumn ? columnsByName.has(spec.yColumn) : true
  if (!xExists || !yExists) {
    return {}
  }

  switch (spec.chartType) {
    case 'bar':
    case 'line':
      return buildBarOrLineOption(spec, rows)
    case 'scatter':
      return buildScatterOption(spec, rows)
    case 'histogram':
      return buildHistogramOption(spec, rows)
    case 'pie':
      return buildPieOption(spec, rows)
    default:
      return {}
  }
}
