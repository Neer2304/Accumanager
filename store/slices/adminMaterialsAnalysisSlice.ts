// store/slices/adminMaterialsAnalysisSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MaterialsAnalysisData } from '@/types/analysis';

interface AdminMaterialsAnalysisState {
  data: MaterialsAnalysisData | null;
  timeframe: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: AdminMaterialsAnalysisState = {
  data: null,
  timeframe: 30,
  loading: false,
  refreshing: false,
  error: null,
  lastUpdated: null,
};

const adminMaterialsAnalysisSlice = createSlice({
  name: 'adminMaterialsAnalysis',
  initialState,
  reducers: {
    // Data actions
    setMaterialsAnalysisData: (state, action: PayloadAction<MaterialsAnalysisData>) => {
      state.data = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    clearMaterialsAnalysisData: (state) => {
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
  setMaterialsAnalysisData,
  clearMaterialsAnalysisData,
  setTimeframe,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  resetState,
} = adminMaterialsAnalysisSlice.actions;

export default adminMaterialsAnalysisSlice.reducer;