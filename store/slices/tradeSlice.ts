import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface TradeState {
  balance: number;
  portfolio: any[];
  history: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TradeState = {
  balance: 0,
  portfolio: [],
  history: [],
  loading: false,
  error: null,
};

// Async Thunk to execute a trade
export const executeTrade = createAsyncThunk(
  'trade/execute',
  async (tradeData: { symbol: string; type: 'buy' | 'sell'; quantity: number; price: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/trading/execute', tradeData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error || 'Trade failed');
    }
  }
);

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setAccountData: (state, action: PayloadAction<{ balance: number; portfolio: any[] }>) => {
      state.balance = action.payload.balance;
      state.portfolio = action.payload.portfolio;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.portfolio = action.payload.portfolio;
      })
      .addCase(executeTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAccountData } = tradeSlice.actions;
export default tradeSlice.reducer;