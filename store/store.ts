// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import authSlice from './slices/authSlice'
import productsSlice from './slices/productsSlice'
import customersSlice from './slices/customersSlice'
import billingSlice from './slices/billingSlice'
import attendanceSlice from './slices/attendanceSlice'
import visitorsSlice from './slices/visitorsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    customers: customersSlice,
    billing: billingSlice,
    attendance: attendanceSlice,
    visitors: visitorsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector