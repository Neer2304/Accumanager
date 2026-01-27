'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
} from '@mui/material'

interface AuthCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md'
}

export function AuthCard({
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'sm'
}: AuthCardProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        py: isMobile ? 3 : 0,
        px: isMobile ? 2 : 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: {
            xs: '100%',
            sm: maxWidth === 'xs' ? 400 : maxWidth === 'md' ? 800 : 600,
          },
        }}
      >
        <Fade in={true} timeout={600}>
          <Card 
            elevation={8}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                textAlign: 'center',
                py: isMobile ? 2.5 : 3,
                px: 2,
              }}
            >
              {icon && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
                  {icon}
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    fontWeight="700"
                  >
                    {title}
                  </Typography>
                </Box>
              )}
              
              {!icon && (
                <>
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    fontWeight="700"
                    gutterBottom
                  >
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {subtitle}
                    </Typography>
                  )}
                </>
              )}
            </Box>

            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              {children}
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </Box>
  )
}