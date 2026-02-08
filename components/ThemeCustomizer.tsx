'use client'
import React, { useState } from 'react';
import {
  Box,
  Container,
  useTheme,
  alpha,
  Breadcrumbs,
  Typography,
  Divider,
  Slider,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Contrast as ContrastIcon,
  Colorize as ColorizeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Gradient as GradientIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useColorScheme, ColorPreferences } from '@/hooks/useColorScheme';

interface ComponentPreview {
  name: string;
  component: React.ReactNode;
}

const ThemeCustomizer: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [customPreferences, setCustomPreferences] = useState<ColorPreferences>({});
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('modern-dark');
  const [noteColor, setNoteColor] = useState<string>('#dbeafe');
  const [gradientAngle, setGradientAngle] = useState<number>(90);
  
  const { 
    currentScheme,
    isDarkMode,
    getComponentStyles,
    getButtonStyles,
    getNoteCardStyles,
    getHeaderStyles,
    getCardStyles,
    getInputStyles,
    getGradientBackground,
    getAccessibleColorPair,
    getTextColorForBackground,
    getContrastRatio,
    getAllColorSchemes,
    getColorSchemeById,
    getAllNoteColors,
    isAccessibleCombination,
    applyColorPreferences,
    primaryColor,
    secondaryColor,
    accentColor,
    textPrimary,
    textSecondary,
  } = useColorScheme(customPreferences);

  // Get all available color schemes
  const colorSchemes = getAllColorSchemes();
  const noteColors = getAllNoteColors();
  
  // Handler for scheme selection
  const handleSchemeSelect = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    const scheme = getColorSchemeById(schemeId);
    if (scheme) {
      setCustomPreferences({
        headerColor: scheme.colors.components.header,
        buttonColor: scheme.colors.buttons.primary,
        textColor: scheme.colors.text.primary,
        backgroundColor: scheme.colors.background,
        cardColor: scheme.colors.components.card,
        accentColor: scheme.colors.accent,
      });
    }
  };

  // Handler for random color generation
  const handleRandomize = () => {
    const randomNoteColor = noteColors[Math.floor(Math.random() * noteColors.length)];
    setNoteColor(randomNoteColor.background);
    
    // Randomize preferences
    setCustomPreferences({
      headerColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      buttonColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      textColor: darkMode ? '#ffffff' : '#000000',
      accentColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    });
  };

  // Handler for applying custom colors
  const handleApplyCustom = () => {
    const newPrefs: ColorPreferences = {
      headerColor: customPreferences.headerColor || currentScheme.colors.components.header,
      buttonColor: customPreferences.buttonColor || currentScheme.colors.buttons.primary,
      textColor: customPreferences.textColor || currentScheme.colors.text.primary,
      accentColor: customPreferences.accentColor || currentScheme.colors.accent,
    };
    
    setCustomPreferences(newPrefs);
    applyColorPreferences(newPrefs);
  };

  // Get styles for preview components
  const headerStyles = getHeaderStyles();
  const cardStyles = getCardStyles();
  const inputStyles = getInputStyles();
  const primaryButtonStyles = getButtonStyles('primary');
  const successButtonStyles = getButtonStyles('success');
  const warningButtonStyles = getButtonStyles('warning');
  const errorButtonStyles = getButtonStyles('error');
  const noteCardStyles = getNoteCardStyles(noteColor);
  const accessiblePair = getAccessibleColorPair(customPreferences.headerColor || primaryColor);

  // Check accessibility
  const isHeaderAccessible = customPreferences.headerColor 
    ? isAccessibleCombination(customPreferences.headerColor, accessiblePair.text)
    : true;

  // Component previews
  const componentPreviews: ComponentPreview[] = [
    {
      name: 'Header',
      component: (
        <Card 
          hover
          sx={{ 
            backgroundColor: headerStyles.backgroundColor,
            color: headerStyles.color,
            border: `1px solid ${headerStyles.borderColor}`,
          }}
        >
          <Typography variant="h6" sx={{ color: headerStyles.color }}>
            Application Header
          </Typography>
          <Typography variant="body2" sx={{ color: headerStyles.color, opacity: 0.8 }}>
            Navbar with menu items
          </Typography>
        </Card>
      ),
    },
    {
      name: 'Primary Button',
      component: (
        <Button
          variant="contained"
          sx={{
            backgroundColor: primaryButtonStyles.backgroundColor,
            color: primaryButtonStyles.color,
            '&:hover': {
              backgroundColor: primaryButtonStyles.hoverColor,
            },
          }}
        >
          Primary Action
        </Button>
      ),
    },
    {
      name: 'Note Card',
      component: (
        <Card 
          hover
          sx={{ 
            backgroundColor: noteCardStyles.backgroundColor,
            color: noteCardStyles.color,
            border: `2px solid ${noteCardStyles.borderColor}`,
            maxWidth: 200,
          }}
        >
          <Typography variant="body2" sx={{ color: noteCardStyles.color }}>
            Sample note with this color scheme
          </Typography>
        </Card>
      ),
    },
    {
      name: 'Input Field',
      component: (
        <Input
          label="Sample Input"
          value=""
          onChange={() => {}}
          placeholder="Type here..."
          sx={{
            backgroundColor: inputStyles.backgroundColor,
            color: inputStyles.color,
            borderColor: inputStyles.borderColor,
          }}
        />
      ),
    },
    {
      name: 'Status Buttons',
      component: (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: successButtonStyles.backgroundColor,
              color: successButtonStyles.color,
            }}
          >
            Success
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: warningButtonStyles.backgroundColor,
              color: warningButtonStyles.color,
            }}
          >
            Warning
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: errorButtonStyles.backgroundColor,
              color: errorButtonStyles.color,
            }}
          >
            Error
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <MainLayout title="Theme Customizer">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Theme Customizer
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              🎨 Theme Customizer
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Customize your application's appearance with pre-built themes or create your own color scheme
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label="Color Customization"
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <Chip
              label="Live Preview"
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
            <Chip
              label="Accessibility Check"
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                borderColor: alpha('#fbbc04', 0.3),
                color: darkMode ? '#fdd663' : '#fbbc04',
              }}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Current Scheme Info */}
          <Card
            title="🎯 Current Theme"
            subtitle={`${currentScheme.name} - ${currentScheme.description}`}
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              mt: 2,
              justifyContent: 'center'
            }}>
              <Chip 
                label="Primary Color" 
                sx={{ 
                  backgroundColor: primaryColor, 
                  color: getAccessibleColorPair(primaryColor).text,
                  fontWeight: 'bold',
                }} 
              />
              <Chip 
                label="Secondary Color" 
                sx={{ 
                  backgroundColor: secondaryColor, 
                  color: getAccessibleColorPair(secondaryColor).text,
                  fontWeight: 'bold',
                }} 
              />
              <Chip 
                label="Accent Color" 
                sx={{ 
                  backgroundColor: accentColor, 
                  color: getAccessibleColorPair(accentColor).text,
                  fontWeight: 'bold',
                }} 
              />
            </Box>
          </Card>

          {/* Main Customization Area */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {/* Left Column: Color Scheme Selection */}
            <Box sx={{ flex: 1 }}>
              <Card
                title="🎨 Color Schemes"
                subtitle="Choose from pre-designed themes"
                hover
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  height: '100%',
                }}
              >
                <Input
                  select
                  fullWidth
                  label="Select a Theme"
                  value={selectedSchemeId}
                  onChange={(e) => handleSchemeSelect(e.target.value)}
                  sx={{ mb: 3, mt: 2 }}
                >
                  {colorSchemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </option>
                  ))}
                </Input>

                <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                <Typography variant="body2" sx={{ mb: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Note Colors
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {noteColors.slice(0, 12).map((colorCombo, index) => (
                    <Button
                      key={index}
                      onClick={() => setNoteColor(colorCombo.background)}
                      sx={{
                        width: 40,
                        height: 40,
                        minWidth: 40,
                        padding: 0,
                        backgroundColor: colorCombo.background,
                        border: noteColor === colorCombo.background 
                          ? `2px solid ${accentColor}` 
                          : `1px solid ${colorCombo.border}`,
                        '&:hover': {
                          backgroundColor: colorCombo.background,
                          opacity: 0.9,
                        },
                      }}
                    >
                      {noteColor === colorCombo.background && (
                        <CheckIcon sx={{ 
                          color: colorCombo.text,
                          fontSize: 16,
                        }} />
                      )}
                    </Button>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleRandomize}
                  startIcon={<RefreshIcon />}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Randomize Colors
                </Button>
              </Card>
            </Box>

            {/* Middle Column: Component Previews */}
            <Box sx={{ flex: 1 }}>
              <Card
                title="👀 Component Previews"
                subtitle="See how your theme looks"
                hover
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                  {componentPreviews.map((preview) => (
                    <Box key={preview.name}>
                      <Typography variant="body2" sx={{ mb: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {preview.name}
                      </Typography>
                      {preview.component}
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                <Box>
                  <Typography variant="body2" sx={{ mb: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    <GradientIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Gradient Preview
                  </Typography>
                  
                  <Card
                    hover
                    sx={{
                      height: 100,
                      borderRadius: 2,
                      background: getGradientBackground(gradientAngle),
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ 
                      color: getTextColorForBackground(primaryColor),
                      fontWeight: 'bold',
                    }}>
                      Gradient Background
                    </Typography>
                  </Card>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', minWidth: 60 }}>
                      Angle: {gradientAngle}°
                    </Typography>
                    <Slider
                      value={gradientAngle}
                      onChange={(_, value) => setGradientAngle(value as number)}
                      min={0}
                      max={360}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>
              </Card>
            </Box>

            {/* Right Column: Customization Controls */}
            <Box sx={{ flex: 1 }}>
              <Card
                title="🎛️ Custom Colors"
                subtitle="Create your own color scheme"
                hover
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                  {/* Header Color */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Header Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Input
                        fullWidth
                        value={customPreferences.headerColor || ''}
                        onChange={(e) => setCustomPreferences(prev => ({
                          ...prev,
                          headerColor: e.target.value,
                        }))}
                        placeholder="#1e293b"
                      />
                      <input
                        type="color"
                        value={customPreferences.headerColor || currentScheme.colors.components.header}
                        onChange={(e) => setCustomPreferences(prev => ({
                          ...prev,
                          headerColor: e.target.value,
                        }))}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                        }}
                      />
                    </Box>
                    {!isHeaderAccessible && customPreferences.headerColor && (
                      <Alert
                        severity="warning"
                        message={`Low contrast with text: ${accessiblePair.text}`}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>

                  {/* Button Color */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Button Color
                    </Typography>
                    <input
                      type="color"
                      value={customPreferences.buttonColor || currentScheme.colors.buttons.primary}
                      onChange={(e) => setCustomPreferences(prev => ({
                        ...prev,
                        buttonColor: e.target.value,
                      }))}
                      style={{
                        width: '100%',
                        height: 40,
                        borderRadius: 8,
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                      }}
                    />
                  </Box>

                  {/* Text Color */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Text Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Input
                        fullWidth
                        value={customPreferences.textColor || ''}
                        onChange={(e) => setCustomPreferences(prev => ({
                          ...prev,
                          textColor: e.target.value,
                        }))}
                        placeholder="#f8fafc"
                      />
                      <input
                        type="color"
                        value={customPreferences.textColor || currentScheme.colors.text.primary}
                        onChange={(e) => setCustomPreferences(prev => ({
                          ...prev,
                          textColor: e.target.value,
                        }))}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Accent Color */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Accent Color
                    </Typography>
                    <input
                      type="color"
                      value={customPreferences.accentColor || currentScheme.colors.accent}
                      onChange={(e) => setCustomPreferences(prev => ({
                        ...prev,
                        accentColor: e.target.value,
                      }))}
                      style={{
                        width: '100%',
                        height: 40,
                        borderRadius: 8,
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                  {/* Accessibility Check */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Accessibility Check
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Card
                        hover
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: accessiblePair.background,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: accessiblePair.text,
                            fontWeight: 'bold',
                          }}
                        >
                          Aa
                        </Typography>
                      </Card>
                      <Box>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          Contrast: {getContrastRatio(
                            accessiblePair.background, 
                            accessiblePair.text
                          ).toFixed(2)}:1
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {isAccessibleCombination(accessiblePair.background, accessiblePair.text)
                            ? '✓ WCAG AA Compliant'
                            : '⚠️ Low Contrast'
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleApplyCustom}
                    startIcon={<CheckIcon />}
                    sx={{
                      backgroundColor: '#34a853',
                      '&:hover': { backgroundColor: '#2d9248' },
                      mt: 2,
                    }}
                  >
                    Apply Custom Colors
                  </Button>
                </Box>
              </Card>
            </Box>
          </Box>

          {/* Accessibility Info */}
          <Card
            title="📊 Accessibility Information"
            subtitle="WCAG compliance and contrast ratios"
            hover
            sx={{
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mt: 2,
              justifyContent: 'space-between'
            }}>
              <Card
                hover
                sx={{
                  flex: 1,
                  minWidth: 200,
                  p: 2,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}>
                  Text Contrast
                </Typography>
                <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {getContrastRatio(accessiblePair.background, accessiblePair.text).toFixed(2)}:1
                </Typography>
              </Card>

              <Card
                hover
                sx={{
                  flex: 1,
                  minWidth: 200,
                  p: 2,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}>
                  WCAG Level
                </Typography>
                <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {getContrastRatio(accessiblePair.background, accessiblePair.text) >= 4.5 
                    ? 'AA ✓' 
                    : 'Needs Improvement'
                  }
                </Typography>
              </Card>

              <Card
                hover
                sx={{
                  flex: 1,
                  minWidth: 200,
                  p: 2,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}>
                  Current Theme
                </Typography>
                <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {currentScheme.name}
                </Typography>
              </Card>
            </Box>
          </Card>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default ThemeCustomizer;