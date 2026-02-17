// app/(pages)/advance/page.tsx
'use client'

import { Box, Typography, Button, Card, CardContent, Chip, alpha } from '@mui/material'
import { Rocket, Palette, TrendingUp, People, AutoAwesome, Construction } from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  status: 'active' | 'beta' | 'soon';
}

const features: Feature[] = [
  {
    title: 'Theme Customizer',
    description: 'Customize colors, components, and create your own theme system',
    icon: <Palette />,
    path: '/advance/theme-customizer',
    status: 'active',
  },
  {
    title: 'Customer 360°',
    description: 'Unified customer profile with all interactions and history',
    icon: <People />,
    path: '#',
    status: 'soon',
  },
  {
    title: 'AI Analytics',
    description: 'Predictive insights and smart recommendations',
    icon: <AutoAwesome />,
    path: '#',
    status: 'beta',
  },
  {
    title: 'Marketing Automation',
    description: 'Automated campaigns and lead nurturing',
    icon: <TrendingUp />,
    path: '#',
    status: 'active',
  },
]

export default function AdvancePage() {
  const { currentScheme, mode } = useAdvanceThemeContext()

  // Google colors for light and dark modes
  const googleColors = {
    // Primary Google colors
    blue: '#4285F4',
    green: '#34A853',
    yellow: '#FBBC04',
    red: '#EA4335',
    
    // Light mode colors
    light: {
      background: '#FFFFFF',
      surface: '#F8F9FA',
      textPrimary: '#202124',
      textSecondary: '#5F6368',
      border: '#DADCE0',
      card: '#FFFFFF',
      chipBackground: '#F1F3F4',
    },
    
    // Dark mode colors (Material Design dark theme)
    dark: {
      background: '#202124',
      surface: '#303134',
      textPrimary: '#E8EAED',
      textSecondary: '#9AA0A6',
      border: '#3C4043',
      card: '#303134',
      chipBackground: '#3C4043',
    }
  }

  // Get current mode colors
  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light

  // Helper to get status color (Google themed)
  const getStatusColor = (status: Feature['status']) => {
    const baseColor = status === 'active' ? googleColors.green : 
                     status === 'beta' ? googleColors.yellow : googleColors.red
    
    return {
      background: alpha(baseColor, mode === 'dark' ? 0.2 : 0.1),
      color: baseColor,
      border: alpha(baseColor, mode === 'dark' ? 0.3 : 0.2)
    };
  }

  // Helper for stats colors (Google themed)
  const statsColors = {
    primary: googleColors.blue,
    success: googleColors.green,
    warning: googleColors.yellow,
    info: googleColors.red,
  }

  return (
    <Box sx={{ 
      backgroundColor: currentColors.background,
      minHeight: '100vh',
      color: currentColors.textPrimary,
      transition: 'background-color 0.3s ease'
    }}>
      <Box sx={{ p: 3 }}>
        {/* Under Development Banner */}
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.15)} 0%, ${alpha(googleColors.yellow, 0.05)} 100%)`,
            border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
            borderRadius: '16px',
            backgroundColor: currentColors.card,
            transition: 'all 0.3s ease',
            boxShadow: mode === 'dark' 
              ? '0 2px 4px rgba(0,0,0,0.4)' 
              : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.2)} 0%, ${alpha(googleColors.yellow, 0.1)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
                }}
              >
                <Construction sx={{ fontSize: 28, color: googleColors.yellow }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600} color={googleColors.yellow} gutterBottom>
                  🚧 Under Development
                </Typography>
                <Typography variant="body1" color={currentColors.textSecondary}>
                  This page and all its features are currently under development. 
                  Some features may not be available yet. We're working hard to bring you an amazing experience!
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(googleColors.blue, 0.1)} 0%, ${alpha(googleColors.green, 0.1)} 100%)`,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '16px',
            backgroundColor: currentColors.card,
            transition: 'all 0.3s ease',
            boxShadow: mode === 'dark' 
              ? '0 2px 4px rgba(0,0,0,0.4)' 
              : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            opacity: 0.7,
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(66,133,244,0.4)',
                  opacity: 0.7,
                }}
              >
                <Rocket sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={600} color={currentColors.textPrimary}>
                  Advanced Features
                </Typography>
                <Typography variant="body1" color={currentColors.textSecondary}>
                  Power up your CRM with enterprise-grade features
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color={currentColors.textSecondary}>
              These advanced features are designed to give you more control, better insights, 
              and enhanced customization options for your CRM experience.
            </Typography>
          </CardContent>
        </Card>

        {/* Features Grid using Flexbox */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4,
            opacity: 0.7,
          }}
        >
          {features.map((feature) => {
            const statusColor = getStatusColor(feature.status);
            
            return (
              <Box
                key={feature.title}
                sx={{
                  flex: '1 1 calc(50% - 12px)',
                  minWidth: '300px',
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: currentColors.card,
                    border: `1px solid ${currentColors.border}`,
                    borderRadius: '16px',
                    transition: 'all 0.2s ease',
                    boxShadow: mode === 'dark' 
                      ? '0 2px 4px rgba(0,0,0,0.4)' 
                      : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: mode === 'dark'
                        ? `0 8px 24px rgba(66,133,244,0.3)`
                        : `0 4px 12px rgba(66,133,244,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)`,
                      borderColor: googleColors.blue,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${alpha(googleColors.blue, 0.1)} 0%, ${alpha(googleColors.green, 0.1)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${currentColors.border}`,
                          color: currentColors.textPrimary,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Chip
                        label={feature.status}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          background: statusColor.background,
                          color: statusColor.color,
                          border: `1px solid ${statusColor.border}`,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                    
                    <Typography variant="h6" fontWeight={600} gutterBottom color={currentColors.textPrimary}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body2" color={currentColors.textSecondary} paragraph>
                      {feature.description}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      href={feature.path}
                      disabled={true} // All buttons disabled
                      sx={{
                        background: currentColors.chipBackground,
                        color: currentColors.textSecondary,
                        border: 'none',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        padding: '8px 16px',
                        boxShadow: 'none',
                        '&:hover': {
                          background: currentColors.chipBackground,
                          boxShadow: 'none',
                        },
                        '&:disabled': {
                          backgroundColor: currentColors.chipBackground,
                          color: currentColors.textSecondary,
                          opacity: 0.8,
                        },
                      }}
                    >
                      Under Development
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>

        {/* Quick Stats using Flexbox */}
        <Card
          sx={{
            mt: 4,
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            boxShadow: mode === 'dark' 
              ? '0 2px 4px rgba(0,0,0,0.4)' 
              : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            opacity: 0.7,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom color={currentColors.textPrimary}>
              🚀 Advanced Features Stats
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: '120px' }} textAlign="center">
                <Typography variant="h4" fontWeight={700} color={statsColors.primary}>
                  4
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Total Features
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: '120px' }} textAlign="center">
                <Typography variant="h4" fontWeight={700} color={statsColors.success}>
                  2
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Active Now
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: '120px' }} textAlign="center">
                <Typography variant="h4" fontWeight={700} color={statsColors.warning}>
                  1
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  In Beta
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: '120px' }} textAlign="center">
                <Typography variant="h4" fontWeight={700} color={statsColors.info}>
                  1
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Coming Soon
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}