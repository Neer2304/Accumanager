// store/slices/billingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BillItem {
  productId: string
  name: string
  price: number
  quantity: number
  gstRate: number
  total: number
}

export interface Bill {
  id: string
  billNumber: string
  customerId?: string
  customerName: string
  items: BillItem[]
  subtotal: number
  totalGst: number
  discount: number
  totalAmount: number
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit'
  status: 'pending' | 'paid' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

interface BillingState {
  currentBill: {
    items: BillItem[]
    customerId?: string
    customerName: string
    discount: number
    paymentMethod: 'cash' | 'card' | 'upi' | 'credit'
  }
  bills: Bill[]
  isLoading: boolean
  error: string | null
}

const initialState: BillingState = {
  currentBill: {
    items: [],
    customerName: '',
    discount: 0,
    paymentMethod: 'cash',
  },
  bills: [],
  isLoading: false,
  error: null,
}

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<Bill[]>) => {
      state.bills = action.payload
    },
    addBill: (state, action: PayloadAction<Bill>) => {
      state.bills.unshift(action.payload)
    },
    addItemToCurrentBill: (state, action: PayloadAction<BillItem>) => {
      const existingItem = state.currentBill.items.find(
        item => item.productId === action.payload.productId
      )
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
        existingItem.total = existingItem.quantity * existingItem.price
      } else {
        state.currentBill.items.push(action.payload)
      }
    },
    updateItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.currentBill.items.find(item => item.productId === action.payload.productId)
      if (item) {
        item.quantity = action.payload.quantity
        item.total = item.quantity * item.price
      }
    },
    removeItemFromCurrentBill: (state, action: PayloadAction<string>) => {
      state.currentBill.items = state.currentBill.items.filter(
        item => item.productId !== action.payload
      )
    },
    setCurrentBillCustomer: (state, action: PayloadAction<{ customerId?: string; customerName: string }>) => {
      state.currentBill.customerId = action.payload.customerId
      state.currentBill.customerName = action.payload.customerName
    },
    setCurrentBillDiscount: (state, action: PayloadAction<number>) => {
      state.currentBill.discount = action.payload
    },
    setCurrentBillPaymentMethod: (state, action: PayloadAction<'cash' | 'card' | 'upi' | 'credit'>) => {
      state.currentBill.paymentMethod = action.payload
    },
    clearCurrentBill: (state) => {
      state.currentBill = {
        items: [],
        customerName: '',
        discount: 0,
        paymentMethod: 'cash',
      }
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
  setBills,
  addBill,
  addItemToCurrentBill,
  updateItemQuantity,
  removeItemFromCurrentBill,
  setCurrentBillCustomer,
  setCurrentBillDiscount,
  setCurrentBillPaymentMethod,
  clearCurrentBill,
  setLoading,
  setError,
} = billingSlice.actions
export default billingSlice.reducer