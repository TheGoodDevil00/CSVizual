export type CellValue = string | number | boolean | null

export type ColumnType = 'number' | 'string' | 'boolean' | 'date'

export interface DataRow {
  [key: string]: CellValue
}

export interface DatasetMeta {
  fileName: string
  fileSize: number
  uploadedAtIso: string
}

export interface ColumnProfile {
  name: string
  type: ColumnType
  missingCount: number
  uniqueCount: number
  sampleValues: string[]
  min?: number
  max?: number
  mean?: number
}

export interface DatasetSummary {
  rowCount: number
  columnCount: number
  numericColumns: number
  categoricalColumns: number
  dateColumns: number
  missingCells: number
}

export interface DatasetModel {
  meta: DatasetMeta
  columns: string[]
  rows: DataRow[]
  profiles: ColumnProfile[]
  summary: DatasetSummary
  parseErrors: string[]
}

export type ChartType = 'bar' | 'line' | 'scatter' | 'histogram' | 'pie'

export type Aggregation = 'sum' | 'avg' | 'count' | 'min' | 'max'

export interface ChartSpec {
  id: string
  title: string
  description: string
  chartType: ChartType
  xColumn?: string
  yColumn?: string
  aggregation?: Aggregation
  score: number
}

export type ColumnFilter =
  | {
      kind: 'numeric'
      min?: number
      max?: number
    }
  | {
      kind: 'text'
      query: string
    }

export type FilterState = Record<string, ColumnFilter>

export interface BuilderConfig {
  chartType: ChartType
  xColumn: string
  yColumn: string
  aggregation: Aggregation
}

export type AppView = 'dashboard' | 'explorer' | 'editor' | 'table'
