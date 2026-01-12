import React from 'react'
import { Box, Container, Typography, Chip, useTheme } from '@mui/material'
import { HeroSectionProps } from './HeroSection.types'

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle, 
  chipLabel,
  gradient,
  overlay,
  isMobile
}) => {
  const theme = useTheme()

  return (
    <Box sx={{
      pt: { xs: 8, sm: 10, md: 12 },
      pb: { xs: 6, sm: 8, md: 10 },
      background: gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: overlay || 'rgba(0, 0, 0, 0.2)',
        zIndex: 1
      }
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          textAlign: 'center',
          maxWidth: 800,
          mx: 'auto',
          position: 'relative',
          zIndex: 2
        }}>
          <Chip
            label={chipLabel}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 2,
              py: 1,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '& .MuiChip-label': {
                padding: 0
              }
            }}
          />
          <Typography
            variant={isMobile ? "h3" : "h1"}
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: 'white',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              [theme.breakpoints.down('sm')]: {
                fontSize: '2.5rem',
                lineHeight: 1.2
              }
            }}
          >
            {title}
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              opacity: 0.95,
              mb: 4,
              color: 'white',
              fontWeight: 400,
              lineHeight: 1.6,
              [theme.breakpoints.down('sm')]: {
                fontSize: '1.1rem',
                px: 2
              }
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}