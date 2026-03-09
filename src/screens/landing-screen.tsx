import { BarChart3, DatabaseZap, WandSparkles } from 'lucide-react'
import { UploadZone } from '@/components/upload/upload-zone'
import { Card, CardContent } from '@/components/ui/card'

interface LandingScreenProps {
  isParsing: boolean
  errorMessage: string | null
  onUpload: (file: File) => void
}

const highlights = [
  {
    title: 'Automatic Data Understanding',
    description: 'Type inference, quality checks, and distribution-aware summaries in seconds.',
    icon: DatabaseZap,
  },
  {
    title: 'Smart Visualization Recommendations',
    description: 'CSVizual proposes charts based on data shape, not guesswork.',
    icon: BarChart3,
  },
  {
    title: 'Interactive Exploration Workspace',
    description: 'Filter rows, build custom charts, and validate insights against raw records.',
    icon: WandSparkles,
  },
]

export function LandingScreen({ isParsing, errorMessage, onUpload }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(31,111,235,0.2),_transparent_52%),radial-gradient(circle_at_bottom_left,_rgba(15,155,142,0.15),_transparent_55%)] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="text-center">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            CSVizual
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Upload a CSV and turn raw rows into interactive analytics
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Navigate from dataset understanding to chart exploration and custom visualization building in one SaaS-style workspace.
          </p>
        </section>

        <UploadZone isLoading={isParsing} onUpload={onUpload} />
        {errorMessage ? <p className="text-sm font-medium text-danger">{errorMessage}</p> : null}

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => {
            const Icon = highlight.icon
            return (
              <Card key={highlight.title}>
                <CardContent className="space-y-2 p-5">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="font-heading text-base font-semibold">{highlight.title}</h2>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </section>
      </div>
    </div>
  )
}
