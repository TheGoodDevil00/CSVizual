import type {
  CellValue,
  ColumnProfile,
  ColumnType,
  DataRow,
  DatasetModel,
  DatasetSummary,
} from '@/types/data'
import type { ParsedCsvPayload } from '@/lib/csv-parser'

function isDateLike(value: string) {
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp)
}

function inferColumnType(values: CellValue[]): ColumnType {
  const nonNullValues = values.filter((value): value is Exclude<CellValue, null> => value !== null)
  if (nonNullValues.length === 0) {
    return 'string'
  }

  const numberCount = nonNullValues.filter((value) => typeof value === 'number').length
  if (numberCount === nonNullValues.length) {
    return 'number'
  }

  const booleanCount = nonNullValues.filter((value) => typeof value === 'boolean').length
  if (booleanCount === nonNullValues.length) {
    return 'boolean'
  }

  const dateLikeCount = nonNullValues.filter((value) => typeof value === 'string' && isDateLike(value)).length
  if (dateLikeCount / nonNullValues.length >= 0.8) {
    return 'date'
  }

  return 'string'
}

function buildColumnProfile(column: string, rows: DataRow[]): ColumnProfile {
  const values = rows.map((row) => row[column] ?? null)
  const missingCount = values.filter((value) => value === null).length
  const nonNullValues = values.filter((value): value is Exclude<CellValue, null> => value !== null)
  const uniqueCount = new Set(nonNullValues.map((value) => String(value))).size
  const sampleValues = Array.from(
    new Set(
      nonNullValues
        .map((value) => String(value))
        .filter((value) => value.trim().length > 0)
        .slice(0, 4),
    ),
  )

  const type = inferColumnType(values)
  const profile: ColumnProfile = {
    name: column,
    type,
    missingCount,
    uniqueCount,
    sampleValues,
  }

  if (type === 'number') {
    const numericValues = nonNullValues.filter((value): value is number => typeof value === 'number')
    if (numericValues.length > 0) {
      const total = numericValues.reduce((sum, value) => sum + value, 0)
      profile.min = Math.min(...numericValues)
      profile.max = Math.max(...numericValues)
      profile.mean = total / numericValues.length
    }
  }

  return profile
}

function buildSummary(columns: string[], rows: DataRow[], profiles: ColumnProfile[]): DatasetSummary {
  const numericColumns = profiles.filter((profile) => profile.type === 'number').length
  const dateColumns = profiles.filter((profile) => profile.type === 'date').length
  const categoricalColumns = profiles.filter((profile) => profile.type === 'string' || profile.type === 'boolean').length
  const missingCells = profiles.reduce((sum, profile) => sum + profile.missingCount, 0)

  return {
    rowCount: rows.length,
    columnCount: columns.length,
    numericColumns,
    categoricalColumns,
    dateColumns,
    missingCells,
  }
}

export function analyzeDataset(parsed: ParsedCsvPayload): DatasetModel {
  const profiles = parsed.columns.map((column) => buildColumnProfile(column, parsed.rows))
  return {
    meta: parsed.meta,
    columns: parsed.columns,
    rows: parsed.rows,
    profiles,
    summary: buildSummary(parsed.columns, parsed.rows, profiles),
    parseErrors: parsed.parseErrors,
  }
}
