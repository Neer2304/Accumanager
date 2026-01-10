// store/slices/customersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  gstNumber?: string
  totalPurchases: number
  createdAt: Date
  updatedAt: Date
}

interface CustomersState {
  items: Customer[]
  selectedCustomer: Customer | null
  isLoading: boolean
  error: string | null
}

const initialState: CustomersState = {
  items: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
}

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.items = action.payload
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.items.push(action.payload)
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.items.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(c => c.id !== action.payload)
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setSelectedCustomer,
  setLoading,
  setError,
} = customersSlice.actions
export default customersSlice.reducer