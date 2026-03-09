import type { ReactNode } from 'react'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { TopNavigation } from '@/components/layout/top-navigation'
import type { AppView, DatasetModel } from '@/types/data'

interface AppLayoutProps {
  dataset: DatasetModel
  activeView: AppView
  filteredRowCount: number
  onViewChange: (view: AppView) => void
  onUpload: (file: File) => void
  onReset: () => void
  children: ReactNode
}

export function AppLayout({
  dataset,
  activeView,
  filteredRowCount,
  onViewChange,
  onUpload,
  onReset,
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation dataset={dataset} filteredRowCount={filteredRowCount} onUpload={onUpload} onReset={onReset} />
      <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:dashboard-grid">
        <div className="lg:col-span-3">
          <SidebarNav activeView={activeView} onViewChange={onViewChange} />
        </div>
        <main className="p-4 lg:col-span-9 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
