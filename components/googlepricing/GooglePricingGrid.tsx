// components/googlepricing/GooglePricingGrid.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Fade,
} from '@mui/material'
import GooglePricingCard from './GooglePricingCard'
import { PricingGridProps } from './types'

export default function GooglePricingGrid({ 
  plans, 
  isAuthenticated, 
  onSubscribe,
  darkMode,
  isMobile,
  isTablet,
  getResponsiveTypography 
}: PricingGridProps) {
  
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}>
        <Typography
          variant="h2"
          component="h2"
          fontWeight={500}
          gutterBottom
          color={darkMode ? "#e8eaed" : "#202124"}
          sx={{ 
            fontSize: getResponsiveTypography('1.75rem', '2rem', '2.25rem'),
            mb: 2
          }}
        >
          Simple, Transparent Pricing
        </Typography>
        <Typography
          variant="body1"
          color={darkMode ? "#9aa0a6" : "#5f6368"}
          sx={{ 
            maxWidth: 600, 
            mx: "auto",
            fontWeight: 300,
            fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
          }}
        >
          Choose the plan that fits your business. All plans include our core features.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          mb: 8
        }}
      >
        {plans.map((plan) => (
          <Box
            key={plan.id}
            sx={{
              width: { 
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(25% - 12px)'
              },
              minWidth: { xs: '100%', sm: 280 },
            }}
          >
            <Fade in>
              <GooglePricingCard
                plan={plan}
                isAuthenticated={isAuthenticated}
                onSubscribe={onSubscribe}
                darkMode={darkMode}
                isMobile={isMobile}
                isTablet={isTablet}
                getResponsiveTypography={getResponsiveTypography}
              />
            </Fade>
          </Box>
        ))}
      </Box>
    </Container>
  )
}