// app/providers.tsx
'use client'

import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/store/store'
import { queryClient } from '@/lib/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext' // Your custom ThemeProvider
import { AuthProvider } from '@/contexts/authContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider> {/* Your custom ThemeProvider that includes MUI ThemeProvider */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}