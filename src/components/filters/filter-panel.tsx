import { Funnel, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ColumnProfile, FilterState } from '@/types/data'

interface FilterPanelProps {
  profiles: ColumnProfile[]
  filters: FilterState
  onUpdateFilter: (column: string, filter: FilterState[string]) => void
  onClearFilter: (column: string) => void
  onClearAll: () => void
}

function parseMaybeNumber(value: string) {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return undefined
  }
  const numeric = Number(trimmed)
  return Number.isFinite(numeric) ? numeric : undefined
}

export function FilterPanel({ profiles, filters, onUpdateFilter, onClearFilter, onClearAll }: FilterPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Funnel className="h-4 w-4 text-primary" />
              Data Filters
            </CardTitle>
            <CardDescription>Apply filters that update table and charts in real time.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {profiles.map((profile) => {
          const activeFilter = filters[profile.name]
          const key = `filter-${profile.name}`
          return (
            <div key={key} className="space-y-2 rounded-md border border-border/80 p-3">
              <div className="flex items-center justify-between gap-2">
                <Label>{profile.name}</Label>
                {activeFilter ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => onClearFilter(profile.name)}
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </button>
                ) : null}
              </div>
              {profile.type === 'number' ? (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={activeFilter?.kind === 'numeric' && activeFilter.min !== undefined ? activeFilter.min : ''}
                    onChange={(event) =>
                      onUpdateFilter(profile.name, {
                        kind: 'numeric',
                        min: parseMaybeNumber(event.target.value),
                        max: activeFilter?.kind === 'numeric' ? activeFilter.max : undefined,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={activeFilter?.kind === 'numeric' && activeFilter.max !== undefined ? activeFilter.max : ''}
                    onChange={(event) =>
                      onUpdateFilter(profile.name, {
                        kind: 'numeric',
                        min: activeFilter?.kind === 'numeric' ? activeFilter.min : undefined,
                        max: parseMaybeNumber(event.target.value),
                      })
                    }
                  />
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="Contains..."
                  value={activeFilter?.kind === 'text' ? activeFilter.query : ''}
                  onChange={(event) =>
                    onUpdateFilter(profile.name, {
                      kind: 'text',
                      query: event.target.value,
                    })
                  }
                />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
