// components/googlepricing/GooglePricingCTABanner.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  alpha,
} from '@mui/material'
import Link from 'next/link'
import { ArrowForward, RocketLaunch } from '@mui/icons-material'
import { ArrowForwardIcon } from '../common'
// import { RocketLaunch, ArrowForward } from 'lucide-react'

interface GooglePricingCTABannerProps {
  isAuthenticated: boolean
  popularPlanId?: string
  onSubscribe?: (planId: string) => void
  darkMode?: boolean
  isMobile?: boolean
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GooglePricingCTABanner({ 
  isAuthenticated, 
  popularPlanId,
  onSubscribe,
  darkMode,
  getResponsiveTypography 
}: GooglePricingCTABannerProps) {
  
  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          textAlign: "center",
          background: darkMode 
            ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
            : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          color: "white",
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            // icon={<RocketLaunch size={16} />}
            label={isAuthenticated ? "Upgrade Your Plan" : "Limited Time Offer"}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
              '& .MuiChip-icon': { color: 'white' }
            }}
          />

          <Typography
            variant="h3"
            component="h2"
            fontWeight={500}
            gutterBottom
            sx={{ 
              fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
              mb: 3,
            }}
          >
            {isAuthenticated ? "Unlock More Features" : "Start Your 14-Day Free Trial"}
          </Typography>

          <Typography
            variant="body1"
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontWeight: 300,
              fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {isAuthenticated 
              ? "Your current plan gives you basic access. Upgrade to unlock advanced features."
              : "Get full access to all Premium features. No credit card required."}
          </Typography>

          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    backgroundColor: '#34a853',
                    color: "white",
                    fontWeight: 500,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                    "&:hover": {
                      backgroundColor: '#2d9248',
                      boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
                {popularPlanId && onSubscribe && (
                  <Button
                    onClick={() => onSubscribe(popularPlanId)}
                    variant="outlined"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderColor: "white",
                      color: "white",
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Upgrade Now
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={() => onSubscribe?.("trial")}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 5,
                  py: 1.75,
                  backgroundColor: '#34a853',
                  color: "white",
                  fontWeight: 500,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                  "&:hover": {
                    backgroundColor: '#2d9248',
                    boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                  },
                }}
              >
                Sign Up for Free Trial
              </Button>
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{ 
              mt: 3, 
              opacity: 0.9,
              display: 'block',
              fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
            }}
          >
            {isAuthenticated 
              ? "Need help choosing? Contact our sales team"
              : "No credit card required • Cancel anytime • Instant setup"}
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}