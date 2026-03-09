import { useMemo, useRef, useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DataRow } from '@/types/data'

interface DataTableCardProps {
  rows: DataRow[]
  columns: string[]
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  return String(value)
}

export function DataTableCard({ rows, columns }: DataTableCardProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  const tableColumns = useMemo<ColumnDef<DataRow>[]>(
    () =>
      columns.map((column) => ({
        accessorKey: column,
        header: ({ column: tableColumn }) => {
          const sorted = tableColumn.getIsSorted()
          return (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
              onClick={tableColumn.getToggleSortingHandler()}
            >
              {column}
              {sorted === 'asc' ? (
                <ArrowUp className="h-3 w-3" />
              ) : sorted === 'desc' ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-60" />
              )}
            </button>
          )
        },
        cell: ({ getValue }) => <span className="truncate text-sm">{formatCell(getValue())}</span>,
      })),
    [columns],
  )

  // TanStack Table manages internal state with function references by design.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const tableRows = table.getRowModel().rows
  const virtualizer = useVirtualizer({
    count: tableRows.length,
    estimateSize: () => 42,
    getScrollElement: () => containerRef.current,
    overscan: 16,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const gridTemplate = `repeat(${Math.max(columns.length, 1)}, minmax(160px, 1fr))`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Data Table</CardTitle>
        <CardDescription>Virtualized for large datasets. Click headers to sort.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border border-border">
          <div className="min-w-[780px]">
            <div
              className="grid border-b border-border bg-muted/40 px-3 py-2"
              style={{
                gridTemplateColumns: gridTemplate,
              }}
            >
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <div key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</div>
                )),
              )}
            </div>

            <div ref={containerRef} className="h-[420px] overflow-auto">
              <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
                {virtualRows.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">No rows match current filters.</div>
                ) : (
                  virtualRows.map((virtualRow) => {
                    const row = tableRows[virtualRow.index]
                    return (
                      <div
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={(node) => virtualizer.measureElement(node)}
                        className={cn(
                          'absolute left-0 grid w-full items-center border-b border-border/70 px-3 py-2 transition-colors odd:bg-card even:bg-muted/10',
                        )}
                        style={{
                          gridTemplateColumns: gridTemplate,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <div key={cell.id} className="truncate pr-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ))}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
