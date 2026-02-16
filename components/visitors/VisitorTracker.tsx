// components/visitors/VisitorTracker.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useVisitorTracking } from '@/hooks/useVisitors'
import { useAuth } from '@/hooks/useAuth'

export function VisitorTracker() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { track, startTrackingSession } = useVisitorTracking()

  useEffect(() => {
    startTrackingSession()
    
    track({
      pageUrl: pathname,
      userId: user?.id,
      screenResolution: window.screen.width && window.screen.height 
        ? `${window.screen.width}x${window.screen.height}` 
        : undefined,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  }, [pathname, user?.id])

  return null
}