import { useRef } from 'react'
import { FileSpreadsheet, RefreshCw, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCompact } from '@/lib/utils'
import type { DatasetModel } from '@/types/data'

interface TopNavigationProps {
  dataset: DatasetModel
  filteredRowCount: number
  onUpload: (file: File) => void
  onReset: () => void
}

export function TopNavigation({ dataset, filteredRowCount, onUpload, onReset }: TopNavigationProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-card/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">CSVizual</p>
            <p className="text-xs text-muted-foreground">
              {dataset.meta.fileName} • {formatCompact(dataset.summary.rowCount)} rows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{formatCompact(filteredRowCount)} filtered rows</Badge>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                onUpload(file)
              }
              event.currentTarget.value = ''
            }}
          />
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Upload New
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </header>
  )
}
