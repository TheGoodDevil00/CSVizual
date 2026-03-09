import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ColumnProfile } from '@/types/data'

interface ColumnInspectorProps {
  profiles: ColumnProfile[]
}

function typeToBadgeVariant(type: ColumnProfile['type']): 'default' | 'secondary' | 'success' | 'warning' {
  switch (type) {
    case 'number':
      return 'default'
    case 'date':
      return 'success'
    case 'boolean':
      return 'warning'
    default:
      return 'secondary'
  }
}

export function ColumnInspector({ profiles }: ColumnInspectorProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Column Inspector</CardTitle>
        <CardDescription>Type inference and quality diagnostics for each field.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {profiles.map((profile) => (
          <div key={profile.name} className="rounded-md border border-border/80 bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{profile.name}</p>
              <Badge variant={typeToBadgeVariant(profile.type)}>{profile.type}</Badge>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Missing: <span className="font-medium text-foreground">{profile.missingCount}</span>
              </p>
              <p>
                Unique: <span className="font-medium text-foreground">{profile.uniqueCount}</span>
              </p>
              {profile.type === 'number' && profile.min !== undefined && profile.max !== undefined ? (
                <p>
                  Range: <span className="font-medium text-foreground">{profile.min.toFixed(2)}</span> to{' '}
                  <span className="font-medium text-foreground">{profile.max.toFixed(2)}</span>
                </p>
              ) : null}
              {profile.sampleValues.length > 0 ? (
                <p className="truncate">
                  Sample: <span className="font-medium text-foreground">{profile.sampleValues.join(', ')}</span>
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
