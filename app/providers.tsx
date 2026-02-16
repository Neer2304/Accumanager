// app/providers.tsx (updated)
'use client'

import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/store/store'
import { queryClient } from '@/lib/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/authContext'
import { VisitorTracker } from '@/components/visitors/VisitorTracker' // Optional component

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            {/* Optional: Auto-track visitors on every page */}
            <VisitorTracker />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}