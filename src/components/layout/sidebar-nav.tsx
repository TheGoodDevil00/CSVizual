import type { ComponentType } from 'react'
import { BarChart3, LayoutDashboard, SlidersHorizontal, Table } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppView } from '@/types/data'

interface SidebarNavProps {
  activeView: AppView
  onViewChange: (view: AppView) => void
}

const navItems: { id: AppView; label: string; icon: ComponentType<{ className?: string }>; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview and instant insights' },
  { id: 'explorer', label: 'Chart Explorer', icon: BarChart3, description: 'Recommended visualizations' },
  { id: 'editor', label: 'Builder', icon: SlidersHorizontal, description: 'Custom chart configuration' },
  { id: 'table', label: 'Data Table', icon: Table, description: 'Virtualized row exploration' },
]

export function SidebarNav({ activeView, onViewChange }: SidebarNavProps) {
  return (
    <aside className="hidden border-r border-border/70 bg-card p-4 lg:block">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activeView === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full rounded-md border px-3 py-3 text-left transition-all',
                active ? 'border-primary/30 bg-primary/10 text-primary' : 'border-transparent hover:border-border hover:bg-muted',
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <p className={cn('mt-1 text-xs', active ? 'text-primary/80' : 'text-muted-foreground')}>{item.description}</p>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
