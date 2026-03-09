import { useCallback, useMemo, type ReactNode } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { buildChartOption, builderConfigToSpec } from '@/lib/chart-engine'
import { parseCsvFile } from '@/lib/csv-parser'
import { analyzeDataset } from '@/lib/data-analysis'
import { applyFilters } from '@/lib/filtering'
import { LandingScreen } from '@/screens/landing-screen'
import { DashboardScreen } from '@/screens/dashboard-screen'
import { ExplorerScreen } from '@/screens/explorer-screen'
import { EditorScreen } from '@/screens/editor-screen'
import { TableScreen } from '@/screens/table-screen'
import { useDatasetStore } from '@/store/use-dataset-store'

function App() {
  const dataset = useDatasetStore((state) => state.dataset)
  const recommendations = useDatasetStore((state) => state.recommendations)
  const activeView = useDatasetStore((state) => state.activeView)
  const filters = useDatasetStore((state) => state.filters)
  const builderConfig = useDatasetStore((state) => state.builderConfig)
  const isParsing = useDatasetStore((state) => state.isParsing)
  const errorMessage = useDatasetStore((state) => state.errorMessage)

  const setParsing = useDatasetStore((state) => state.setParsing)
  const setError = useDatasetStore((state) => state.setError)
  const loadDataset = useDatasetStore((state) => state.loadDataset)
  const clearDataset = useDatasetStore((state) => state.clearDataset)
  const setActiveView = useDatasetStore((state) => state.setActiveView)
  const upsertFilter = useDatasetStore((state) => state.upsertFilter)
  const removeFilter = useDatasetStore((state) => state.removeFilter)
  const clearFilters = useDatasetStore((state) => state.clearFilters)
  const updateBuilderConfig = useDatasetStore((state) => state.updateBuilderConfig)
  const useRecommendationInBuilder = useDatasetStore((state) => state.useRecommendationInBuilder)

  const filteredRows = useMemo(() => {
    if (!dataset) {
      return []
    }
    return applyFilters(dataset.rows, filters, dataset.profiles)
  }, [dataset, filters])

  const builderSpec = useMemo(() => builderConfigToSpec(builderConfig), [builderConfig])
  const builderChartOption = useMemo(() => {
    if (!dataset) {
      return {}
    }
    return buildChartOption(builderSpec, filteredRows, dataset.profiles)
  }, [builderSpec, dataset, filteredRows])

  const handleUpload = useCallback(
    async (file: File) => {
      setParsing(true)
      setError(null)
      try {
        const parsed = await parseCsvFile(file)
        const analyzed = analyzeDataset(parsed)
        loadDataset(analyzed)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to parse CSV file.')
        setParsing(false)
      }
    },
    [loadDataset, setError, setParsing],
  )

  if (!dataset) {
    return <LandingScreen isParsing={isParsing} errorMessage={errorMessage} onUpload={handleUpload} />
  }

  const sharedFilterProps = {
    dataset,
    filteredRows,
    filters,
    onUpdateFilter: upsertFilter,
    onClearFilter: removeFilter,
    onClearAllFilters: clearFilters,
  }

  let content: ReactNode = null
  if (activeView === 'dashboard') {
    content = (
      <DashboardScreen
        dataset={dataset}
        filteredRows={filteredRows}
        recommendations={recommendations}
        onOpenRecommendation={useRecommendationInBuilder}
      />
    )
  } else if (activeView === 'explorer') {
    content = (
      <ExplorerScreen
        {...sharedFilterProps}
        recommendations={recommendations}
        onOpenRecommendation={useRecommendationInBuilder}
      />
    )
  } else if (activeView === 'editor') {
    content = (
      <EditorScreen
        {...sharedFilterProps}
        config={builderConfig}
        chartOption={builderChartOption}
        onUpdateBuilder={updateBuilderConfig}
      />
    )
  } else {
    content = <TableScreen {...sharedFilterProps} />
  }

  return (
    <AppLayout
      dataset={dataset}
      activeView={activeView}
      filteredRowCount={filteredRows.length}
      onViewChange={setActiveView}
      onUpload={handleUpload}
      onReset={clearDataset}
    >
      {content}
    </AppLayout>
  )
}

export default App
