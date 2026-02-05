// app/(pages)/advance/theme-customizer/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  TextField,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import { ADVANCE_COLOR_SCHEMES } from '@/contexts/AdvanceThemeContexts'

export default function ThemeCustomizerPage() {
  const { mode, customScheme, currentScheme, toggleTheme, setMode, applyCustomScheme } = useAdvanceThemeContext()
  const [selectedSchemeId, setSelectedSchemeId] = useState(customScheme?.id || 'advance-modern')

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedSchemeId(schemeId)
    const scheme = ADVANCE_COLOR_SCHEMES.find(s => s.id === schemeId)
    if (scheme) {
      applyCustomScheme(scheme)
    }
  }

  const handleReset = () => {
    setSelectedSchemeId(mode === 'dark' ? 'advance-modern' : 'advance-light')
    applyCustomScheme(null)
  }

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          mb: 4,
          background: currentScheme.colors.components.card,
          border: `1px solid ${currentScheme.colors.components.border}`,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🎨 Theme Customizer
          </Typography>
          <Typography variant="body1" color={currentScheme.colors.text.secondary}>
            Customize the look and feel of your advanced features section
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column - Color Schemes */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Color Schemes
              </Typography>
              <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
                Choose from pre-designed color schemes
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {ADVANCE_COLOR_SCHEMES.map((scheme) => (
                  <Chip
                    key={scheme.id}
                    label={scheme.name}
                    onClick={() => handleSchemeSelect(scheme.id)}
                    sx={{
                      background: selectedSchemeId === scheme.id 
                        ? currentScheme.colors.primary 
                        : currentScheme.colors.components.hover,
                      color: selectedSchemeId === scheme.id 
                        ? 'white' 
                        : currentScheme.colors.text.primary,
                      '&:hover': {
                        background: currentScheme.colors.components.active + '20',
                      },
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={toggleTheme}
                  sx={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                  }}
                >
                  Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    flex: 1,
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  Reset to Default
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Preview */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Preview
              </Typography>
              <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
                See how your theme looks
              </Typography>

              {/* Theme Preview */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: currentScheme.colors.background,
                  border: `1px solid ${currentScheme.colors.components.border}`,
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Current Scheme: {currentScheme.name}
                  </Typography>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                    {currentScheme.description}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 2 }} />

                {/* Color Palette Preview */}
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Color Palette
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 40,
                      borderRadius: 1,
                      background: currentScheme.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    Primary
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      height: 40,
                      borderRadius: 1,
                      background: currentScheme.colors.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    Secondary
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      height: 40,
                      borderRadius: 1,
                      background: currentScheme.colors.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    Accent
                  </Box>
                </Box>

                {/* Component Preview */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Component Preview
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      background: currentScheme.colors.components.card,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Card Component</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: `linear-gradient(135deg, ${currentScheme.colors.buttons.primary} 0%, ${currentScheme.colors.buttons.secondary} 100%)`,
                      mb: 1,
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    Secondary Button
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}