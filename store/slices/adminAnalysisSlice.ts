// store/slices/adminAnalysisSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalysisData, TimeRangeOption, TIME_RANGE_OPTIONS } from '@/types/analysis';

interface AdminAnalysisState {
  data: AnalysisData | null;
  timeframe: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: AdminAnalysisState = {
  data: null,
  timeframe: 30,
  loading: false,
  refreshing: false,
  error: null,
  lastUpdated: null,
};

const adminAnalysisSlice = createSlice({
  name: 'adminAnalysis',
  initialState,
  reducers: {
    // Data actions
    setAnalysisData: (state, action: PayloadAction<AnalysisData>) => {
      state.data = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    clearAnalysisData: (state) => {
      state.data = null;
    },

    // Timeframe
    setTimeframe: (state, action: PayloadAction<number>) => {
      state.timeframe = action.payload;
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },

    // Error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Reset
    resetState: () => initialState,
  },
});

export const {
  setAnalysisData,
  clearAnalysisData,
  setTimeframe,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  resetState,
} = adminAnalysisSlice.actions;

export default adminAnalysisSlice.reducer;