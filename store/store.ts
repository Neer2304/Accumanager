// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import authSlice from './slices/authSlice'
import productsSlice from './slices/productsSlice'
import customersSlice from './slices/customersSlice'
import billingSlice from './slices/billingSlice'
import attendanceSlice from './slices/attendanceSlice'
import { RootState } from '@/types'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    customers: customersSlice,
    billing: billingSlice,
    attendance: attendanceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector