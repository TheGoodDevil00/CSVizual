import type { ColumnProfile, DataRow, FilterState } from '@/types/data'

function profileMap(profiles: ColumnProfile[]) {
  return new Map(profiles.map((profile) => [profile.name, profile]))
}

export function hasActiveFilters(filters: FilterState) {
  return Object.values(filters).some((filter) => {
    if (filter.kind === 'numeric') {
      return filter.min !== undefined || filter.max !== undefined
    }
    return filter.query.trim().length > 0
  })
}

export function applyFilters(rows: DataRow[], filters: FilterState, profiles: ColumnProfile[]) {
  if (Object.keys(filters).length === 0) {
    return rows
  }

  const profilesByName = profileMap(profiles)

  return rows.filter((row) =>
    Object.entries(filters).every(([column, filter]) => {
      const profile = profilesByName.get(column)
      if (!profile) {
        return true
      }

      const value = row[column]
      if (value === null || value === undefined) {
        return false
      }

      if (filter.kind === 'numeric') {
        if (typeof value !== 'number') {
          return false
        }
        if (filter.min !== undefined && value < filter.min) {
          return false
        }
        if (filter.max !== undefined && value > filter.max) {
          return false
        }
        return true
      }

      const query = filter.query.trim().toLowerCase()
      if (query.length === 0) {
        return true
      }

      return String(value).toLowerCase().includes(query)
    }),
  )
}
