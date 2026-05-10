// hooks/useAdminAnalysis.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminAnalysisService } from '@/services/adminAnalysisService';
import { TIME_RANGE_OPTIONS, TimeRangeOption } from '@/types/analysis';
import {
  setAnalysisData,
  clearAnalysisData,
  setTimeframe,
  setLoading,
  setRefreshing,
  setError,
  clearError,
} from '@/store/slices/adminAnalysisSlice';

// Define interfaces
interface AnalysisData {
  systemOverview?: {
    databaseStats?: {
      totalUsers: number;
      activeUsers: number;
      totalNotes: number;
      recentNotes: number;
      recentUsers: number;
      userGrowthRate: number;
    };
  };
  summary?: {
    activeUserPercentage: number;
    notesPerActiveUser: string;
    engagementScore: number;
  };
  userAnalysis?: {
    usersByRole: Array<{ _id: string | null; count: number }>;
    usersByStatus: Array<{ _id: string | null; count: number }>;
    newUsersByDay: Array<{ _id: string; count: number }>;
    topActiveUsers: Array<{ userId: string; name: string; activityCount: number }>;
  };
  notesAnalysis?: {
    notesByCategory: Array<{ _id: string | null; count: number }>;
    notesByDay: Array<{ _id: string; count: number }>;
    topUsersByNotes: Array<{ userId: string; name: string; noteCount: number }>;
  };
}

interface UserRoleItem {
  role: string;
  count: number;
}

interface UserStatusItem {
  status: string;
  count: number;
}

interface NoteCategoryItem {
  category: string;
  count: number;
}

interface NewUserItem {
  date: string;
  count: number;
}

interface NoteDayItem {
  date: string;
  count: number;
}

interface TopActiveUserItem {
  userId: string;
  name: string;
  activityCount: number;
}

interface TopUserNoteItem {
  userId: string;
  name: string;
  noteCount: number;
}

interface ChartDataItem {
  name: string;
  value: number;
}

interface RootState {
  adminAnalysis: {
    data: AnalysisData | null;
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    timeframe: number;
    lastUpdated: string | null;
  };
}

interface UseAdminAnalysisReturn {
  // State
  data: AnalysisData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  timeframe: number;
  lastUpdated: string | null;

  // Time range options
  timeRangeOptions: typeof TIME_RANGE_OPTIONS;
  currentTimeRangeOption: TimeRangeOption | undefined;

  // Actions
  loadAnalysis: (timeframe?: number, forceRefresh?: boolean) => Promise<void>;
  refreshAnalysis: () => Promise<void>;
  changeTimeframe: (timeframe: number) => void;
  clearData: () => void;

  // Specific data getters (safe access)
  getTotalUsers: () => number;
  getActiveUsers: () => number;
  getTotalNotes: () => number;
  getRecentNotes: () => number;
  getRecentUsers: () => number;
  getUserGrowthRate: () => number;
  getActiveUserPercentage: () => number;
  getNotesPerActiveUser: () => number;
  getEngagementScore: () => number;
  getUsersByRole: () => UserRoleItem[];
  getUsersByStatus: () => UserStatusItem[];
  getNotesByCategory: () => NoteCategoryItem[];
  getNewUsersByDay: () => NewUserItem[];
  getNotesByDay: () => NoteDayItem[];
  getTopActiveUsers: () => TopActiveUserItem[];
  getTopUsersByNotes: () => TopUserNoteItem[];

  // Chart data formatters
  getUsersByRoleChartData: () => ChartDataItem[];
  getNotesByCategoryChartData: () => ChartDataItem[];
  getUsersByStatusChartData: () => ChartDataItem[];
  getNewUsersChartData: () => ChartDataItem[];
  getNotesChartData: () => ChartDataItem[];
}

export const useAdminAnalysis = (autoLoad: boolean = true): UseAdminAnalysisReturn => {
  const dispatch = useDispatch();

  // Selectors with proper typing
  const data = useSelector((state: RootState) => state.adminAnalysis.data);
  const loading = useSelector((state: RootState) => state.adminAnalysis.loading);
  const refreshing = useSelector((state: RootState) => state.adminAnalysis.refreshing);
  const error = useSelector((state: RootState) => state.adminAnalysis.error);
  const timeframe = useSelector((state: RootState) => state.adminAnalysis.timeframe);
  const lastUpdated = useSelector((state: RootState) => state.adminAnalysis.lastUpdated);

  // Current time range option
  const currentTimeRangeOption = useMemo(
    () => TIME_RANGE_OPTIONS.find(opt => opt.days === timeframe),
    [timeframe]
  );

  // Load analysis data
  const loadAnalysis = useCallback(async (newTimeframe?: number, forceRefresh: boolean = false) => {
    const targetTimeframe = newTimeframe !== undefined ? newTimeframe : timeframe;
    
    // Don't load if already loading and not forced refresh
    if (loading && !forceRefresh) return;

    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const analysisData = await AdminAnalysisService.getAnalysis(targetTimeframe);
      dispatch(setAnalysisData(analysisData));

      // Update timeframe if different
      if (newTimeframe !== undefined && newTimeframe !== timeframe) {
        dispatch(setTimeframe(newTimeframe));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analysis data';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, timeframe, loading]);

  // Refresh current data
  const refreshAnalysis = useCallback(async () => {
    try {
      dispatch(setRefreshing(true));
      dispatch(clearError());

      const analysisData = await AdminAnalysisService.getAnalysis(timeframe);
      dispatch(setAnalysisData(analysisData));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh analysis';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setRefreshing(false));
    }
  }, [dispatch, timeframe]);

  // Change timeframe
  const changeTimeframe = useCallback((newTimeframe: number) => {
    if (newTimeframe !== timeframe) {
      loadAnalysis(newTimeframe);
    }
  }, [timeframe, loadAnalysis]);

  // Clear data
  const clearData = useCallback(() => {
    dispatch(clearAnalysisData());
  }, [dispatch]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && !data) {
      loadAnalysis();
    }
  }, [autoLoad, data, loadAnalysis]);

  // Safe getters with fallbacks
  const getTotalUsers = useCallback(() => data?.systemOverview?.databaseStats?.totalUsers || 0, [data]);
  const getActiveUsers = useCallback(() => data?.systemOverview?.databaseStats?.activeUsers || 0, [data]);
  const getTotalNotes = useCallback(() => data?.systemOverview?.databaseStats?.totalNotes || 0, [data]);
  const getRecentNotes = useCallback(() => data?.systemOverview?.databaseStats?.recentNotes || 0, [data]);
  const getRecentUsers = useCallback(() => data?.systemOverview?.databaseStats?.recentUsers || 0, [data]);
  const getUserGrowthRate = useCallback(() => data?.systemOverview?.databaseStats?.userGrowthRate || 0, [data]);
  const getActiveUserPercentage = useCallback(() => data?.summary?.activeUserPercentage || 0, [data]);
  const getNotesPerActiveUser = useCallback(() => parseFloat(data?.summary?.notesPerActiveUser || '0'), [data]);
  const getEngagementScore = useCallback(() => data?.summary?.engagementScore || 0, [data]);

  const getUsersByRole = useCallback((): UserRoleItem[] => {
    if (!data?.userAnalysis?.usersByRole) return [];
    return data.userAnalysis.usersByRole.map((item: { _id: string | null; count: number }) => ({
      role: item._id || 'Unknown',
      count: item.count
    }));
  }, [data]);

  const getUsersByStatus = useCallback((): UserStatusItem[] => {
    if (!data?.userAnalysis?.usersByStatus) return [];
    return data.userAnalysis.usersByStatus.map((item: { _id: string | null; count: number }) => ({
      status: item._id || 'unknown',
      count: item.count
    }));
  }, [data]);

  const getNotesByCategory = useCallback((): NoteCategoryItem[] => {
    if (!data?.notesAnalysis?.notesByCategory) return [];
    return data.notesAnalysis.notesByCategory.map((item: { _id: string | null; count: number }) => ({
      category: item._id || 'Uncategorized',
      count: item.count
    }));
  }, [data]);

  const getNewUsersByDay = useCallback((): NewUserItem[] => {
    if (!data?.userAnalysis?.newUsersByDay) return [];
    return data.userAnalysis.newUsersByDay.map((item: { _id: string; count: number }) => ({
      date: item._id,
      count: item.count
    }));
  }, [data]);

  const getNotesByDay = useCallback((): NoteDayItem[] => {
    if (!data?.notesAnalysis?.notesByDay) return [];
    return data.notesAnalysis.notesByDay.map((item: { _id: string; count: number }) => ({
      date: item._id,
      count: item.count
    }));
  }, [data]);

  const getTopActiveUsers = useCallback((): TopActiveUserItem[] => {
    return data?.userAnalysis?.topActiveUsers || [];
  }, [data]);

  const getTopUsersByNotes = useCallback((): TopUserNoteItem[] => {
    return data?.notesAnalysis?.topUsersByNotes || [];
  }, [data]);

  // Chart data formatters
  const getUsersByRoleChartData = useCallback((): ChartDataItem[] => {
    return getUsersByRole().map(item => ({
      name: item.role.charAt(0).toUpperCase() + item.role.slice(1),
      value: item.count
    }));
  }, [getUsersByRole]);

  const getNotesByCategoryChartData = useCallback((): ChartDataItem[] => {
    return getNotesByCategory().map(item => ({
      name: item.category,
      value: item.count
    }));
  }, [getNotesByCategory]);

  const getUsersByStatusChartData = useCallback((): ChartDataItem[] => {
    return getUsersByStatus().map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count
    }));
  }, [getUsersByStatus]);

  const getNewUsersChartData = useCallback((): ChartDataItem[] => {
    return getNewUsersByDay().map(item => ({
      name: item.date,
      value: item.count
    }));
  }, [getNewUsersByDay]);

  const getNotesChartData = useCallback((): ChartDataItem[] => {
    return getNotesByDay().map(item => ({
      name: item.date,
      value: item.count
    }));
  }, [getNotesByDay]);

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
    loadAnalysis,
    refreshAnalysis,
    changeTimeframe,
    clearData,

    // Specific getters
    getTotalUsers,
    getActiveUsers,
    getTotalNotes,
    getRecentNotes,
    getRecentUsers,
    getUserGrowthRate,
    getActiveUserPercentage,
    getNotesPerActiveUser,
    getEngagementScore,
    getUsersByRole,
    getUsersByStatus,
    getNotesByCategory,
    getNewUsersByDay,
    getNotesByDay,
    getTopActiveUsers,
    getTopUsersByNotes,

    // Chart data
    getUsersByRoleChartData,
    getNotesByCategoryChartData,
    getUsersByStatusChartData,
    getNewUsersChartData,
    getNotesChartData,
  };
};