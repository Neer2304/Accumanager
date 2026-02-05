// app/(pages)/advance/page.tsx
'use client'

import { Box, Typography, Button, Card, CardContent, Chip } from '@mui/material'
import { Rocket, Palette, TrendingUp, People, AutoAwesome } from '@mui/icons-material'
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
  const { currentScheme } = useAdvanceThemeContext()

  // Helper to get status color (using buttons colors)
  const getStatusColor = (status: Feature['status']) => {
    switch (status) {
      case 'active':
        return {
          background: `${currentScheme.colors.buttons.success}20`,
          color: currentScheme.colors.buttons.success
        };
      case 'beta':
        return {
          background: `${currentScheme.colors.buttons.warning}20`,
          color: currentScheme.colors.buttons.warning
        };
      case 'soon':
        return {
          background: `${currentScheme.colors.buttons.error}20`, // Using error as "soon" color
          color: currentScheme.colors.buttons.error
        };
      default:
        return {
          background: `${currentScheme.colors.buttons.success}20`,
          color: currentScheme.colors.buttons.success
        };
    }
  }

  // Helper for stats colors (using buttons colors)
  const statsColors = {
    primary: currentScheme.colors.primary,
    success: currentScheme.colors.buttons.success,
    warning: currentScheme.colors.buttons.warning,
    info: currentScheme.colors.buttons.error, // Using error as info
  }

  return (
    <Box>
      {/* Hero Section */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${currentScheme.colors.primary}20 0%, ${currentScheme.colors.secondary}20 100%)`,
          border: `1px solid ${currentScheme.colors.components.border}`,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Rocket sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Advanced Features
              </Typography>
              <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                Power up your CRM with enterprise-grade features
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color={currentScheme.colors.text.secondary}>
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
                  background: currentScheme.colors.components.card,
                  border: `1px solid ${currentScheme.colors.components.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${currentScheme.colors.primary}20`,
                    borderColor: currentScheme.colors.primary,
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
                        background: `linear-gradient(135deg, ${currentScheme.colors.primary}20 0%, ${currentScheme.colors.secondary}20 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
                    {feature.description}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    href={feature.path}
                    disabled={feature.status === 'soon'}
                    sx={{
                      background: `linear-gradient(135deg, ${currentScheme.colors.buttons.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${currentScheme.colors.buttons.primary}CC 0%, ${currentScheme.colors.secondary}CC 100%)`,
                      },
                    }}
                  >
                    {feature.status === 'soon' ? 'Coming Soon' : 'Explore'}
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
          background: currentScheme.colors.components.card,
          border: `1px solid ${currentScheme.colors.components.border}`,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
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
              <Typography variant="h4" fontWeight="bold" color={statsColors.primary}>
                4
              </Typography>
              <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                Total Features
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: '120px' }} textAlign="center">
              <Typography variant="h4" fontWeight="bold" color={statsColors.success}>
                2
              </Typography>
              <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                Active Now
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: '120px' }} textAlign="center">
              <Typography variant="h4" fontWeight="bold" color={statsColors.warning}>
                1
              </Typography>
              <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                In Beta
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: '120px' }} textAlign="center">
              <Typography variant="h4" fontWeight="bold" color={statsColors.info}>
                1
              </Typography>
              <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                Coming Soon
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}