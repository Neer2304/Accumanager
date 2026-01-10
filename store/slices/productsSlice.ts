// store/slices/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  costPrice: number
  stock: number
  gstRate: number
  images: string[]
  category: string
  sku: string
  barcode?: string
  createdAt: Date
  updatedAt: Date
}

interface ProductsState {
  items: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Products data actions
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload)
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload
    },
    
    // Loading state actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    // Error state actions
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setLoading,
  setError,
  clearError,
} = productsSlice.actions

export default productsSlice.reducer