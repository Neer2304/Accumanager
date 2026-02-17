// components/googleabout/GoogleAboutCTA.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  Button,
  Fade,
  useTheme,
} from '@mui/material'
import Link from 'next/link'
// import { RocketLaunch } from 'lucide-react'
import { ArrowForward, RocketLaunch } from '@mui/icons-material'
import { ABOUT_CONTENT } from './AboutContent'
import { BaseProps } from './types'

interface GoogleAboutCTAProps extends BaseProps {
  isAuthenticated: boolean
  authLoading?: boolean
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GoogleAboutCTA({ 
  isAuthenticated, 
  authLoading,
  isMobile, 
  darkMode, 
  getResponsiveTypography 
}: GoogleAboutCTAProps) {
  return (
    <Box sx={{ 
      py: { xs: 8, sm: 10, md: 12 },
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Container maxWidth="md">
        <Fade in timeout={600}>
          <Paper
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              textAlign: 'center',
              background: darkMode 
                ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
                : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
              color: 'white',
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
                label={isAuthenticated ? "Ready to Grow?" : "Start Your Journey"}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 500,
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />

              <Typography
                variant={getResponsiveTypography('h4', 'h3', 'h2') as any}
                component="h2"
                fontWeight={500}
                gutterBottom
                color="white"
                sx={{ 
                  fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
                  mb: 3,
                }}
              >
                {isAuthenticated 
                  ? ABOUT_CONTENT.cta.authenticated.title 
                  : ABOUT_CONTENT.cta.unauthenticated.title}
              </Typography>
              
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  color: 'white',
                  fontWeight: 300,
                  fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                {isAuthenticated 
                  ? ABOUT_CONTENT.cta.authenticated.subtitle 
                  : ABOUT_CONTENT.cta.unauthenticated.subtitle}
              </Typography>
              
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ 
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  component={Link}
                  href={isAuthenticated ? "/dashboard" : "/signup"}
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: '#34a853',
                    color: 'white',
                    fontWeight: 500,
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#2d9248',
                      boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                    }
                  }}
                >
                  {isAuthenticated 
                    ? ABOUT_CONTENT.cta.authenticated.buttonText 
                    : ABOUT_CONTENT.cta.unauthenticated.buttonText}
                </Button>
                
                <Button
                  variant="outlined"
                  size={isMobile ? "medium" : "large"}
                  component={Link}
                  href="/features"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  {ABOUT_CONTENT.cta.secondaryButton}
                </Button>
              </Stack>
              
              {!isAuthenticated && !authLoading && (
                <Typography
                  variant="body2"
                  sx={{ 
                    mt: 2, 
                    opacity: 0.9,
                    fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem')
                  }}
                  color="white"
                >
                  {ABOUT_CONTENT.cta.unauthenticated.disclaimer}
                </Typography>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}