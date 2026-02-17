// components/googlepricing/GooglePricingHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  useTheme,
} from '@mui/material'
import { CheckCircle, Sparkles } from 'lucide-react'

interface GooglePricingHeaderProps {
  darkMode?: boolean
  isMobile?: boolean
  isTablet?: boolean
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GooglePricingHeader({ 
  darkMode, 
  isMobile, 
  getResponsiveTypography 
}: GooglePricingHeaderProps) {
  
  const features = ["14-day free trial", "No setup fees", "Cancel anytime", "24/7 support"]

  return (
    <Box
      sx={{
        pt: { xs: 8, sm: 10, md: 12 },
        pb: { xs: 6, sm: 8, md: 10 },
        background: darkMode 
          ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
          : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
        color: "white",
        position: "relative",
        overflow: "hidden",
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          <Chip
            icon={<Sparkles size={18} />}
            label="No Credit Card Required for Trial"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
              '& .MuiChip-icon': { color: 'white' }
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            fontWeight={500}
            gutterBottom
            sx={{
              fontSize: getResponsiveTypography('2rem', '2.5rem', '3rem'),
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: "white",
              mb: 3,
            }}
          >
            Pricing That{" "}
            <Box component="span" sx={{ color: '#34a853' }}>
              Grows
            </Box>{" "}
            With Your Business
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
              fontWeight: 300,
              color: "white",
            }}
          >
            Start free, scale smart. Choose the perfect plan with transparent pricing and no hidden fees.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ 
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mb: 4
            }}
          >
            {features.map((feature) => (
              <Box key={feature} sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ marginRight: '8px', color: '#34a853' }} />
                <Typography variant="body2" color="white">
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}