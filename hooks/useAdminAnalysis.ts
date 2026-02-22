// hooks/useAdminAnalysis.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminAnalysisService } from '@/services/adminAnalysisService';
import { TIME_RANGE_OPTIONS } from '@/types/analysis';
import {
  setAnalysisData,
  clearAnalysisData,
  setTimeframe,
  setLoading,
  setRefreshing,
  setError,
  clearError,
} from '@/store/slices/adminAnalysisSlice';

interface UseAdminAnalysisReturn {
  // State
  data: any;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  timeframe: number;
  lastUpdated: string | null;

  // Time range options
  timeRangeOptions: typeof TIME_RANGE_OPTIONS;
  currentTimeRangeOption: typeof TIME_RANGE_OPTIONS[0] | undefined;

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
  getUsersByRole: () => Array<{ role: string; count: number }>;
  getUsersByStatus: () => Array<{ status: string; count: number }>;
  getNotesByCategory: () => Array<{ category: string; count: number }>;
  getNewUsersByDay: () => Array<{ date: string; count: number }>;
  getNotesByDay: () => Array<{ date: string; count: number }>;
  getTopActiveUsers: () => any[];
  getTopUsersByNotes: () => any[];

  // Chart data formatters
  getUsersByRoleChartData: () => Array<{ name: string; value: number }>;
  getNotesByCategoryChartData: () => Array<{ name: string; value: number }>;
  getUsersByStatusChartData: () => Array<{ name: string; value: number }>;
  getNewUsersChartData: () => Array<{ name: string; value: number }>;
  getNotesChartData: () => Array<{ name: string; value: number }>;
}

export const useAdminAnalysis = (autoLoad: boolean = true): UseAdminAnalysisReturn => {
  const dispatch = useDispatch();

  // Selectors
  const data = useSelector((state: any) => state.adminAnalysis.data);
  const loading = useSelector((state: any) => state.adminAnalysis.loading);
  const refreshing = useSelector((state: any) => state.adminAnalysis.refreshing);
  const error = useSelector((state: any) => state.adminAnalysis.error);
  const timeframe = useSelector((state: any) => state.adminAnalysis.timeframe);
  const lastUpdated = useSelector((state: any) => state.adminAnalysis.lastUpdated);

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
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load analysis data'));
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
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to refresh analysis'));
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

  const getUsersByRole = useCallback(() => {
    if (!data?.userAnalysis?.usersByRole) return [];
    return data.userAnalysis.usersByRole.map((item: any) => ({
      role: item._id || 'Unknown',
      count: item.count
    }));
  }, [data]);

  const getUsersByStatus = useCallback(() => {
    if (!data?.userAnalysis?.usersByStatus) return [];
    return data.userAnalysis.usersByStatus.map((item: any) => ({
      status: item._id || 'unknown',
      count: item.count
    }));
  }, [data]);

  const getNotesByCategory = useCallback(() => {
    if (!data?.notesAnalysis?.notesByCategory) return [];
    return data.notesAnalysis.notesByCategory.map((item: any) => ({
      category: item._id || 'Uncategorized',
      count: item.count
    }));
  }, [data]);

  const getNewUsersByDay = useCallback(() => {
    if (!data?.userAnalysis?.newUsersByDay) return [];
    return data.userAnalysis.newUsersByDay.map((item: any) => ({
      date: item._id,
      count: item.count
    }));
  }, [data]);

  const getNotesByDay = useCallback(() => {
    if (!data?.notesAnalysis?.notesByDay) return [];
    return data.notesAnalysis.notesByDay.map((item: any) => ({
      date: item._id,
      count: item.count
    }));
  }, [data]);

  const getTopActiveUsers = useCallback(() => data?.userAnalysis?.topActiveUsers || [], [data]);
  const getTopUsersByNotes = useCallback(() => data?.notesAnalysis?.topUsersByNotes || [], [data]);

  // Chart data formatters
  const getUsersByRoleChartData = useCallback(() => {
    return getUsersByRole().map(item => ({
      name: item.role.charAt(0).toUpperCase() + item.role.slice(1),
      value: item.count
    }));
  }, [getUsersByRole]);

  const getNotesByCategoryChartData = useCallback(() => {
    return getNotesByCategory().map(item => ({
      name: item.category,
      value: item.count
    }));
  }, [getNotesByCategory]);

  const getUsersByStatusChartData = useCallback(() => {
    return getUsersByStatus().map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count
    }));
  }, [getUsersByStatus]);

  const getNewUsersChartData = useCallback(() => {
    return getNewUsersByDay().map(item => ({
      name: item.date,
      value: item.count
    }));
  }, [getNewUsersByDay]);

  const getNotesChartData = useCallback(() => {
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