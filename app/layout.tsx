// app/layout.tsx - UPDATED
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { UserProvider } from '@/contexts/UserContext'
import ScreenTimeTracker from '@/components/ScreenTimeTracker' // Add this
import './globals.css'
import AuthDebug from '@/components/AuthDebug'
import FixLoading from '@/components/FixLoading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Business Management System',
  description: 'Complete business management solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <UserProvider>
            {children}
            <ScreenTimeTracker /> {/* Add tracker component */}
            <AuthDebug />
            <FixLoading />
          </UserProvider>
        </Providers>
      </body>
    </html>
  )
}