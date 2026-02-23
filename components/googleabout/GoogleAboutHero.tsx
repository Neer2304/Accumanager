// components/googleabout/GoogleAboutHero.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  useTheme,
  Fade,
} from '@mui/material'
import { Sparkles, CheckCircle } from 'lucide-react'
import { ABOUT_CONTENT } from './AboutContent'
import { BaseProps } from './types'

interface GoogleAboutHeroProps extends BaseProps {
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GoogleAboutHero({ 
  isMobile, 
  isTablet, 
  darkMode, 
  getResponsiveTypography 
}: GoogleAboutHeroProps) {
  const features = ["Trusted by businesses", "24/7 Customer Support", "99.9% Uptime", "Enterprise Security"]

  return (
    <Box
      sx={{
        pt: { xs: 12, sm: 14, md: 16 },
        pb: { xs: 6, sm: 8, md: 10 },
        background: darkMode 
          ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
          : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
        color: "white",
        position: 'relative',
        overflow: 'hidden',
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
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              icon={<Sparkles size={18} />}
              label={ABOUT_CONTENT.hero.tagline}
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
                color: 'white',
                fontSize: getResponsiveTypography('2rem', '2.5rem', '3rem'),
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                mb: 3,
              }}
            >
              {ABOUT_CONTENT.hero.title}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                opacity: 0.95,
                mb: 4,
                color: 'white',
                fontWeight: 300,
                fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
              }}
            >
              {ABOUT_CONTENT.hero.subtitle}
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
        </Fade>
      </Container>
    </Box>
  )
}