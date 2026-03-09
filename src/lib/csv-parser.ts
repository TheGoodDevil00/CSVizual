import Papa from 'papaparse'
import type { DataRow, DatasetMeta } from '@/types/data'

export interface ParsedCsvPayload {
  meta: DatasetMeta
  columns: string[]
  rows: DataRow[]
  parseErrors: string[]
}

function normalizeValue(value: unknown): DataRow[string] {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    return trimmed
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'boolean') {
    return value
  }

  return String(value)
}

export async function parseCsvFile(file: File): Promise<ParsedCsvPayload> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columns = results.meta.fields ?? []
        const rows: DataRow[] = results.data.map((row) => {
          const nextRow: DataRow = {}
          for (const column of columns) {
            nextRow[column] = normalizeValue(row[column])
          }
          return nextRow
        })

        const parseErrors = results.errors.map((error) => `${error.code}: ${error.message}`)
        resolve({
          meta: {
            fileName: file.name,
            fileSize: file.size,
            uploadedAtIso: new Date().toISOString(),
          },
          columns,
          rows,
          parseErrors,
        })
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}
