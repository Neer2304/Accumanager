// store/slices/adminProductsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilters } from '@/types/product';

interface AdminProductsState {
  items: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalProducts: number;
  };
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AdminProductsState = {
  items: [],
  selectedProduct: null,
  filters: {
    page: 1,
    limit: 20,
    search: '',
    category: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  stats: {
    totalProducts: 0,
  },
  loading: false,
  submitting: false,
  error: null,
  success: null,
};

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {
    // Data actions
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
      state.stats.totalProducts += 1;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedProduct?._id === action.payload._id) {
        state.selectedProduct = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p._id !== action.payload);
      state.stats.totalProducts -= 1;
      if (state.selectedProduct?._id === action.payload) {
        state.selectedProduct = null;
      }
    },
    bulkRemoveProducts: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(p => !action.payload.includes(p._id));
      state.stats.totalProducts -= action.payload.length;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    // Filter actions
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      if (action.payload.search !== undefined || 
          action.payload.category !== undefined ||
          action.payload.page === 1) {
        state.pagination.page = 1;
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },

    // Pagination
    setPagination: (state, action: PayloadAction<{ total: number; pages: number }>) => {
      state.pagination.total = action.payload.total;
      state.pagination.pages = action.payload.pages;
    },

    // Stats
    setStats: (state, action: PayloadAction<{ totalProducts: number }>) => {
      state.stats = action.payload;
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },

    // Error/Success
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    // Reset
    resetState: () => initialState,
  },
});

export const {
  setProducts,
  setSelectedProduct,
  addProduct,
  updateProduct,
  removeProduct,
  bulkRemoveProducts,
  clearSelectedProduct,
  setFilters,
  setPage,
  resetFilters,
  setPagination,
  setStats,
  setLoading,
  setSubmitting,
  setError,
  setSuccess,
  clearMessages,
  resetState,
} = adminProductsSlice.actions;

export default adminProductsSlice.reducer;