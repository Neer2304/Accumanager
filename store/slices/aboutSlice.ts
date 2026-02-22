// store/slices/aboutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AboutReview, AboutSummary } from '@/services/aboutService';

interface AboutState {
  reviews: AboutReview[];
  summary: AboutSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutState = {
  reviews: [],
  summary: null,
  loading: false,
  error: null,
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    setAboutData: (state, action: PayloadAction<{ reviews: AboutReview[]; summary: AboutSummary }>) => {
      state.reviews = action.payload.reviews;
      state.summary = action.payload.summary;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setAboutData, setLoading, setError, clearError } = aboutSlice.actions;
export default aboutSlice.reducer;