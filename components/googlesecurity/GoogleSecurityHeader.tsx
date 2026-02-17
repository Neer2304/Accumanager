// components/googlesecurity/GoogleSecurityHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Chip,
} from '@mui/material'
import { Shield } from '@mui/icons-material'
import { SecurityPageProps } from './types'
import { Button } from '@/components/ui/Button'

interface GoogleSecurityHeaderProps extends SecurityPageProps {
  onRequestReport: () => void
  onViewDocs: () => void
}

export default function GoogleSecurityHeader({ 
  darkMode, 
  getResponsiveTypography,
  onRequestReport,
  onViewDocs
}: GoogleSecurityHeaderProps) {
  return (
    <Box
      sx={{
        pt: { xs: 8, sm: 10, md: 12 },
        pb: { xs: 6, sm: 8, md: 10 },
        background: darkMode 
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
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
            icon={<Shield sx={{ fontSize: 16 }} />}
            label="Enterprise-Grade Security"
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
            Security{" "}
            <Box component="span" sx={{ color: '#34a853' }}>
              Built In
            </Box>
            , Not{" "}
            <Box component="span" sx={{ color: '#fbbc04' }}>
              Bolted On
            </Box>
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
            We take security seriously. Every aspect of our platform is designed with security as a core principle.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            mb: 4
          }}>
            <Button
              variant="contained"
              onClick={onRequestReport}
              sx={{
                backgroundColor: '#34a853',
                color: "white",
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: '#2d9248',
                },
              }}
            >
              Request Security Report
            </Button>
            
            <Button
              variant="outlined"
              onClick={onViewDocs}
              sx={{
                borderColor: "white",
                color: "white",
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              View Security Docs
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}