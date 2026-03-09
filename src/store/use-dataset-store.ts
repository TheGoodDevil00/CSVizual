import { create } from 'zustand'
import { builderConfigToSpec, generateChartRecommendations } from '@/lib/chart-engine'
import type {
  AppView,
  BuilderConfig,
  ChartSpec,
  DatasetModel,
  FilterState,
  Aggregation,
} from '@/types/data'

interface DatasetState {
  dataset: DatasetModel | null
  recommendations: ChartSpec[]
  activeView: AppView
  filters: FilterState
  selectedRecommendationId: string | null
  builderConfig: BuilderConfig
  isParsing: boolean
  errorMessage: string | null
  setParsing: (value: boolean) => void
  setError: (value: string | null) => void
  loadDataset: (dataset: DatasetModel) => void
  clearDataset: () => void
  setActiveView: (view: AppView) => void
  upsertFilter: (column: string, filter: FilterState[string]) => void
  removeFilter: (column: string) => void
  clearFilters: () => void
  updateBuilderConfig: (update: Partial<BuilderConfig>) => void
  useRecommendationInBuilder: (recommendationId: string) => void
  setSelectedRecommendation: (recommendationId: string) => void
}

function defaultBuilderConfig(dataset: DatasetModel | null): BuilderConfig {
  if (!dataset) {
    return {
      chartType: 'bar',
      xColumn: '',
      yColumn: '',
      aggregation: 'avg',
    }
  }

  const numericColumns = dataset.profiles.filter((profile) => profile.type === 'number').map((profile) => profile.name)
  const categoryColumns = dataset.profiles
    .filter((profile) => profile.type === 'string' || profile.type === 'boolean' || profile.type === 'date')
    .map((profile) => profile.name)
  const xColumn = categoryColumns[0] ?? dataset.columns[0] ?? ''
  const yColumn = numericColumns[0] ?? dataset.columns[1] ?? dataset.columns[0] ?? ''

  return {
    chartType: numericColumns.length > 0 && categoryColumns.length > 0 ? 'bar' : 'histogram',
    xColumn,
    yColumn,
    aggregation: 'avg',
  }
}

function normalizeAggregation(aggregation: Aggregation | undefined): Aggregation {
  return aggregation ?? 'avg'
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  dataset: null,
  recommendations: [],
  activeView: 'dashboard',
  filters: {},
  selectedRecommendationId: null,
  builderConfig: {
    chartType: 'bar',
    xColumn: '',
    yColumn: '',
    aggregation: 'avg',
  },
  isParsing: false,
  errorMessage: null,
  setParsing: (value) => set({ isParsing: value }),
  setError: (value) => set({ errorMessage: value }),
  loadDataset: (dataset) => {
    const recommendations = generateChartRecommendations(dataset)
    const seededBuilder = defaultBuilderConfig(dataset)
    set({
      dataset,
      recommendations,
      activeView: 'dashboard',
      filters: {},
      selectedRecommendationId: recommendations[0]?.id ?? null,
      builderConfig: seededBuilder,
      errorMessage: null,
      isParsing: false,
    })
  },
  clearDataset: () =>
    set({
      dataset: null,
      recommendations: [],
      activeView: 'dashboard',
      filters: {},
      selectedRecommendationId: null,
      builderConfig: defaultBuilderConfig(null),
      isParsing: false,
      errorMessage: null,
    }),
  setActiveView: (view) => set({ activeView: view }),
  upsertFilter: (column, filter) => {
    const nextFilters = { ...get().filters }
    if (filter.kind === 'numeric' && filter.min === undefined && filter.max === undefined) {
      delete nextFilters[column]
    } else if (filter.kind === 'text' && filter.query.trim().length === 0) {
      delete nextFilters[column]
    } else {
      nextFilters[column] = filter
    }
    set({ filters: nextFilters })
  },
  removeFilter: (column) => {
    const nextFilters = { ...get().filters }
    delete nextFilters[column]
    set({ filters: nextFilters })
  },
  clearFilters: () => set({ filters: {} }),
  updateBuilderConfig: (update) => {
    set((state) => ({
      builderConfig: {
        ...state.builderConfig,
        ...update,
      },
    }))
  },
  useRecommendationInBuilder: (recommendationId) => {
    const recommendation = get().recommendations.find((item) => item.id === recommendationId)
    if (!recommendation) {
      return
    }

    const config = builderConfigToSpec(get().builderConfig)
    set((state) => ({
      builderConfig: {
        chartType: recommendation.chartType,
        xColumn: recommendation.xColumn ?? config.xColumn ?? state.builderConfig.xColumn,
        yColumn: recommendation.yColumn ?? config.yColumn ?? state.builderConfig.yColumn,
        aggregation: normalizeAggregation(recommendation.aggregation),
      },
      activeView: 'editor',
      selectedRecommendationId: recommendationId,
    }))
  },
  setSelectedRecommendation: (recommendationId) => set({ selectedRecommendationId: recommendationId }),
}))
