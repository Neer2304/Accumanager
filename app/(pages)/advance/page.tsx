// app/(pages)/advance/page.tsx
'use client'

import { Box, Typography, Button, Card, CardContent, Grid, Chip } from '@mui/material'
import { Rocket, Palette, TrendingUp, People, AutoAwesome } from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

const features = [
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

      {/* Features Grid */}
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} key={feature.title}>
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
                      background: 
                        feature.status === 'active' ? currentScheme.colors.success + '20' :
                        feature.status === 'beta' ? currentScheme.colors.warning + '20' :
                        currentScheme.colors.info + '20',
                      color: 
                        feature.status === 'active' ? currentScheme.colors.success :
                        feature.status === 'beta' ? currentScheme.colors.warning :
                        currentScheme.colors.info,
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
                    background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${currentScheme.colors.primary}CC 0%, ${currentScheme.colors.secondary}CC 100%)`,
                    },
                  }}
                >
                  {feature.status === 'soon' ? 'Coming Soon' : 'Explore'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats */}
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
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.primary}>
                  4
                </Typography>
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  Total Features
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.success}>
                  2
                </Typography>
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  Active Now
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.warning}>
                  1
                </Typography>
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  In Beta
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.info}>
                  1
                </Typography>
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  Coming Soon
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}