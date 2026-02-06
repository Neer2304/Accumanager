// components/Layout/AdLayout.tsx
'use client'

import { Box } from '@mui/material'
import SmartAd from '@/components/Ads/SmartAd'

export const AdLayout = ({ children }: { children: React.ReactNode }) => {
  const showAds = true // Control with user preference or subscription
  
  return (
    <Box sx={{ display: 'flex', gap: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {/* Top Banner Ad */}
        {showAds && (
          <Box sx={{ mb: 3 }}>
            <SmartAd type="banner" category="tech" priority="high" />
          </Box>
        )}
        
        {children}
        
        {/* Bottom Ad */}
        {showAds && (
          <Box sx={{ mt: 3 }}>
            <SmartAd type="banner" category="business" />
          </Box>
        )}
      </Box>
      
      {/* Sidebar */}
      <Box sx={{ width: 300, display: { xs: 'none', lg: 'block' } }}>
        {showAds && (
          <Box sx={{ position: 'sticky', top: 80 }}>
            <SmartAd type="sidebar" category="tech" />
            <Box sx={{ mt: 2 }}>
              <SmartAd type="sidebar" category="business" />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}