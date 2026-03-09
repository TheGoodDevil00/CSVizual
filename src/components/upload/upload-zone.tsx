import { useRef, useState } from 'react'
import { FileUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  isLoading: boolean
  onUpload: (file: File) => void
}

export function UploadZone({ isLoading, onUpload }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  return (
    <Card className={cn('border-dashed transition-all', isDragActive ? 'border-primary bg-primary/5' : 'border-border')}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileUp className="h-5 w-5 text-primary" />
          Upload a CSV file
        </CardTitle>
        <CardDescription>Drag and drop your dataset or browse from disk. Parsing starts instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragActive(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setIsDragActive(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragActive(false)
            const file = event.dataTransfer.files?.[0]
            if (file) {
              onUpload(file)
            }
          }}
          className="rounded-md border border-dashed border-border bg-muted/40 p-8 text-center"
        >
          <Sparkles className="mx-auto mb-3 h-6 w-6 text-accent" />
          <p className="text-sm text-muted-foreground">Supports comma-separated `.csv` files with header row</p>
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
          <Button className="mt-5" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            {isLoading ? 'Parsing dataset...' : 'Choose CSV File'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
