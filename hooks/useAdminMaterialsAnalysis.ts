// hooks/useAdminMaterialsAnalysis.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminMaterialsAnalysisService } from '@/services/adminMaterialsAnalysisService';
import { TIME_RANGE_OPTIONS, TimeRangeOption } from '@/types/analysis';
import {
  setMaterialsAnalysisData,
  clearMaterialsAnalysisData,
  setTimeframe,
  setLoading,
  setRefreshing,
  setError,
  clearError,
} from '@/store/slices/adminMaterialsAnalysisSlice';

// Define interfaces
interface MaterialsAnalysisData {
  summary?: {
    totalMaterials: number;
    recentMaterials: number;
    totalStockValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    avgMaterialsPerUser: number;
    materialGrowthRate: number;
    activeMaterialUsers: number;
  };
  materialAnalysis?: {
    materialsByCategory: Array<{ _id: string | null; count: number }>;
    materialsByStatus: Array<{ _id: string | null; count: number }>;
    categoryValue: Array<{ _id: string; itemCount: number; totalValue: number }>;
    materialsByDay: Array<{ _id: string; count: number; totalValue: number }>;
    topUsersByMaterials: Array<{ userId: string; name: string; count: number }>;
  };
}

interface CategoryItem {
  category: string;
  count: number;
}

interface StatusItem {
  status: string;
  count: number;
}

interface CategoryValueItem {
  category: string;
  count: number;
  value: number;
}

interface MaterialsByDayItem {
  date: string;
  count: number;
  value: number;
}

interface TopUserItem {
  userId: string;
  name: string;
  count: number;
}

interface ChartDataItem {
  name: string;
  value: number;
}

interface MaterialsByDayChartItem {
  name: string;
  count: number;
  value: number;
}

interface RootState {
  adminMaterialsAnalysis: {
    data: MaterialsAnalysisData | null;
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    timeframe: number;
    lastUpdated: string | null;
  };
}

interface UseAdminMaterialsAnalysisReturn {
  // State
  data: MaterialsAnalysisData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  timeframe: number;
  lastUpdated: string | null;

  // Time range options
  timeRangeOptions: typeof TIME_RANGE_OPTIONS;
  currentTimeRangeOption: TimeRangeOption | undefined;

  // Actions
  loadMaterialsAnalysis: (timeframe?: number, forceRefresh?: boolean) => Promise<void>;
  refreshMaterialsAnalysis: () => Promise<void>;
  changeTimeframe: (timeframe: number) => void;
  clearData: () => void;

  // Specific getters
  getTotalMaterials: () => number;
  getRecentMaterials: () => number;
  getTotalStockValue: () => number;
  getLowStockItems: () => number;
  getOutOfStockItems: () => number;
  getAvgMaterialsPerUser: () => number;
  getMaterialGrowthRate: () => number;
  getActiveMaterialUsers: () => number;
  getMaterialsByCategory: () => CategoryItem[];
  getMaterialsByStatus: () => StatusItem[];
  getCategoryValue: () => CategoryValueItem[];
  getMaterialsByDay: () => MaterialsByDayItem[];
  getTopUsersByMaterials: () => TopUserItem[];

  // Chart data formatters
  getMaterialsByCategoryChartData: () => ChartDataItem[];
  getMaterialsByStatusChartData: () => ChartDataItem[];
  getMaterialsByDayChartData: () => MaterialsByDayChartItem[];
  getCategoryValueChartData: () => ChartDataItem[];
}

export const useAdminMaterialsAnalysis = (autoLoad: boolean = true): UseAdminMaterialsAnalysisReturn => {
  const dispatch = useDispatch();

  // Selectors with proper typing
  const data = useSelector((state: RootState) => state.adminMaterialsAnalysis.data);
  const loading = useSelector((state: RootState) => state.adminMaterialsAnalysis.loading);
  const refreshing = useSelector((state: RootState) => state.adminMaterialsAnalysis.refreshing);
  const error = useSelector((state: RootState) => state.adminMaterialsAnalysis.error);
  const timeframe = useSelector((state: RootState) => state.adminMaterialsAnalysis.timeframe);
  const lastUpdated = useSelector((state: RootState) => state.adminMaterialsAnalysis.lastUpdated);

  // Current time range option
  const currentTimeRangeOption = useMemo(
    () => TIME_RANGE_OPTIONS.find(opt => opt.days === timeframe),
    [timeframe]
  );

  // Load materials analysis
  const loadMaterialsAnalysis = useCallback(async (newTimeframe?: number, forceRefresh: boolean = false) => {
    const targetTimeframe = newTimeframe !== undefined ? newTimeframe : timeframe;
    
    if (loading && !forceRefresh) return;

    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const analysisData = await AdminMaterialsAnalysisService.getMaterialsAnalysis(targetTimeframe);
      dispatch(setMaterialsAnalysisData(analysisData));

      if (newTimeframe !== undefined && newTimeframe !== timeframe) {
        dispatch(setTimeframe(newTimeframe));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load materials analysis';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, timeframe, loading]);

  // Refresh
  const refreshMaterialsAnalysis = useCallback(async () => {
    try {
      dispatch(setRefreshing(true));
      dispatch(clearError());

      const analysisData = await AdminMaterialsAnalysisService.getMaterialsAnalysis(timeframe);
      dispatch(setMaterialsAnalysisData(analysisData));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh materials analysis';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setRefreshing(false));
    }
  }, [dispatch, timeframe]);

  // Change timeframe
  const changeTimeframe = useCallback((newTimeframe: number) => {
    if (newTimeframe !== timeframe) {
      loadMaterialsAnalysis(newTimeframe);
    }
  }, [timeframe, loadMaterialsAnalysis]);

  // Clear data
  const clearData = useCallback(() => {
    dispatch(clearMaterialsAnalysisData());
  }, [dispatch]);

  // Auto-load
  useEffect(() => {
    if (autoLoad && !data) {
      loadMaterialsAnalysis();
    }
  }, [autoLoad, data, loadMaterialsAnalysis]);

  // Safe getters
  const getTotalMaterials = useCallback(() => data?.summary?.totalMaterials || 0, [data]);
  const getRecentMaterials = useCallback(() => data?.summary?.recentMaterials || 0, [data]);
  const getTotalStockValue = useCallback(() => data?.summary?.totalStockValue || 0, [data]);
  const getLowStockItems = useCallback(() => data?.summary?.lowStockItems || 0, [data]);
  const getOutOfStockItems = useCallback(() => data?.summary?.outOfStockItems || 0, [data]);
  const getAvgMaterialsPerUser = useCallback(() => data?.summary?.avgMaterialsPerUser || 0, [data]);
  const getMaterialGrowthRate = useCallback(() => data?.summary?.materialGrowthRate || 0, [data]);
  const getActiveMaterialUsers = useCallback(() => data?.summary?.activeMaterialUsers || 0, [data]);

  const getMaterialsByCategory = useCallback((): CategoryItem[] => {
    if (!data?.materialAnalysis?.materialsByCategory) return [];
    return data.materialAnalysis.materialsByCategory.map((item: { _id: string | null; count: number }) => ({
      category: item._id || 'Uncategorized',
      count: item.count
    }));
  }, [data]);

  const getMaterialsByStatus = useCallback((): StatusItem[] => {
    if (!data?.materialAnalysis?.materialsByStatus) return [];
    return data.materialAnalysis.materialsByStatus.map((item: { _id: string | null; count: number }) => ({
      status: item._id || 'unknown',
      count: item.count
    }));
  }, [data]);

  const getCategoryValue = useCallback((): CategoryValueItem[] => {
    if (!data?.materialAnalysis?.categoryValue) return [];
    return data.materialAnalysis.categoryValue.map((item: { _id: string; itemCount: number; totalValue: number }) => ({
      category: item._id,
      count: item.itemCount,
      value: item.totalValue
    }));
  }, [data]);

  const getMaterialsByDay = useCallback((): MaterialsByDayItem[] => {
    if (!data?.materialAnalysis?.materialsByDay) return [];
    return data.materialAnalysis.materialsByDay.map((item: { _id: string; count: number; totalValue: number }) => ({
      date: item._id,
      count: item.count,
      value: item.totalValue
    }));
  }, [data]);

  const getTopUsersByMaterials = useCallback((): TopUserItem[] => {
    return data?.materialAnalysis?.topUsersByMaterials || [];
  }, [data]);

  // Chart data formatters
  const getMaterialsByCategoryChartData = useCallback((): ChartDataItem[] => {
    return getMaterialsByCategory().map(item => ({
      name: item.category,
      value: item.count
    }));
  }, [getMaterialsByCategory]);

  const getMaterialsByStatusChartData = useCallback((): ChartDataItem[] => {
    return getMaterialsByStatus().map(item => ({
      name: item.status.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      value: item.count
    }));
  }, [getMaterialsByStatus]);

  const getMaterialsByDayChartData = useCallback((): MaterialsByDayChartItem[] => {
    return getMaterialsByDay().map(item => ({
      name: item.date,
      count: item.count,
      value: item.value
    }));
  }, [getMaterialsByDay]);

  const getCategoryValueChartData = useCallback((): ChartDataItem[] => {
    return getCategoryValue().map(item => ({
      name: item.category,
      value: item.value
    }));
  }, [getCategoryValue]);

  return {
    // State
    data,
    loading,
    refreshing,
    error,
    timeframe,
    lastUpdated,

    // Time range options
    timeRangeOptions: TIME_RANGE_OPTIONS,
    currentTimeRangeOption,

    // Actions
    loadMaterialsAnalysis,
    refreshMaterialsAnalysis,
    changeTimeframe,
    clearData,

    // Getters
    getTotalMaterials,
    getRecentMaterials,
    getTotalStockValue,
    getLowStockItems,
    getOutOfStockItems,
    getAvgMaterialsPerUser,
    getMaterialGrowthRate,
    getActiveMaterialUsers,
    getMaterialsByCategory,
    getMaterialsByStatus,
    getCategoryValue,
    getMaterialsByDay,
    getTopUsersByMaterials,

    // Chart data
    getMaterialsByCategoryChartData,
    getMaterialsByStatusChartData,
    getMaterialsByDayChartData,
    getCategoryValueChartData,
  };
};