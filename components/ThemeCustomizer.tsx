// components/ThemeCustomizer.tsx
'use client'
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Slider,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  IconButton,
  Stack,
  Alert,
  Tooltip,
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
} from '@mui/icons-material';
import { useColorScheme, ColorPreferences, ColorScheme } from '@/hooks/useColorScheme';

interface ComponentPreview {
  name: string;
  component: React.ReactNode;
}

const ThemeCustomizer: React.FC = () => {
  const [customPreferences, setCustomPreferences] = useState<ColorPreferences>({});
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('modern-dark');
  const [noteColor, setNoteColor] = useState<string>('#dbeafe');
  const [gradientAngle, setGradientAngle] = useState<number>(90);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
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
        <Paper 
          sx={{ 
            p: 2, 
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
        </Paper>
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
        <Card sx={{ 
          backgroundColor: noteCardStyles.backgroundColor,
          color: noteCardStyles.color,
          border: `2px solid ${noteCardStyles.borderColor}`,
          maxWidth: 200,
        }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: noteCardStyles.color }}>
              Sample note with this color scheme
            </Typography>
          </CardContent>
        </Card>
      ),
    },
    {
      name: 'Input Field',
      component: (
        <TextField
          label="Sample Input"
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: inputStyles.backgroundColor,
              color: inputStyles.color,
              '& fieldset': {
                borderColor: inputStyles.borderColor,
              },
            },
          }}
        />
      ),
    },
    {
      name: 'Status Buttons',
      component: (
        <Stack direction="row" spacing={1}>
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
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: currentScheme.colors.background, color: textPrimary, minHeight: '100vh' }}>
      <Paper sx={{ p: 3, mb: 3, backgroundColor: cardStyles.backgroundColor, color: cardStyles.color }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <PaletteIcon sx={{ color: accentColor, fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: textPrimary }}>
              Theme Customizer
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                <Typography>{darkMode ? 'Dark Mode' : 'Light Mode'}</Typography>
              </Box>
            }
          />
        </Box>
        
        <Typography variant="body1" sx={{ color: textSecondary, mb: 3 }}>
          Customize your application's appearance with pre-built themes or create your own color scheme.
        </Typography>
      </Paper>

      {/* Use Flexbox instead of Grid */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        {/* Left Column: Color Scheme Selection */}
        <Box flex={1}>
          <Card sx={{ 
            backgroundColor: cardStyles.backgroundColor, 
            color: cardStyles.color,
            height: '100%',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>
                <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Color Schemes
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: textSecondary }}>Select a Theme</InputLabel>
                <Select
                  value={selectedSchemeId}
                  label="Select a Theme"
                  onChange={(e) => handleSchemeSelect(e.target.value)}
                  sx={{ 
                    backgroundColor: inputStyles.backgroundColor,
                    color: inputStyles.color,
                    '& .MuiSelect-icon': { color: textSecondary },
                  }}
                >
                  {colorSchemes.map((scheme) => (
                    <MenuItem key={scheme.id} value={scheme.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: scheme.colors.primary,
                            borderRadius: '4px',
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                        {scheme.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" sx={{ mb: 2, color: textSecondary }}>
                Current Scheme: {currentScheme.name}
              </Typography>
              
              <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                <Chip 
                  label="Primary" 
                  sx={{ 
                    backgroundColor: primaryColor, 
                    color: getAccessibleColorPair(primaryColor).text 
                  }} 
                />
                <Chip 
                  label="Secondary" 
                  sx={{ 
                    backgroundColor: secondaryColor, 
                    color: getAccessibleColorPair(secondaryColor).text 
                  }} 
                />
                <Chip 
                  label="Accent" 
                  sx={{ 
                    backgroundColor: accentColor, 
                    color: getAccessibleColorPair(accentColor).text 
                  }} 
                />
              </Box>

              <Divider sx={{ my: 2, borderColor: cardStyles.borderColor }} />

              <Typography variant="subtitle2" sx={{ mb: 2, color: textSecondary }}>
                Note Colors
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1}>
                {noteColors.slice(0, 12).map((colorCombo, index) => (
                  <Tooltip title={`Text: ${colorCombo.text}`} key={index}>
                    <IconButton
                      onClick={() => setNoteColor(colorCombo.background)}
                      sx={{
                        width: 40,
                        height: 40,
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
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRandomize}
                sx={{ mt: 2 }}
              >
                Randomize Colors
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Middle Column: Component Previews */}
        <Box flex={1}>
          <Card sx={{ 
            backgroundColor: cardStyles.backgroundColor, 
            color: cardStyles.color,
            height: '100%',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>
                <ColorizeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Component Previews
              </Typography>

              <Stack spacing={3}>
                {componentPreviews.map((preview) => (
                  <Box key={preview.name}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: textSecondary }}>
                      {preview.name}
                    </Typography>
                    {preview.component}
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 3, borderColor: cardStyles.borderColor }} />

              <Typography variant="subtitle2" sx={{ mb: 2, color: textSecondary }}>
                <GradientIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Gradient Preview
              </Typography>
              
              <Box
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
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" sx={{ color: textSecondary }}>
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
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Customization Controls */}
        <Box flex={1}>
          <Card sx={{ 
            backgroundColor: cardStyles.backgroundColor, 
            color: cardStyles.color,
            height: '100%',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>
                <ContrastIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Custom Colors
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: textSecondary }}>
                    Header Color
                  </Typography>
                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={customPreferences.headerColor || ''}
                      onChange={(e) => setCustomPreferences(prev => ({
                        ...prev,
                        headerColor: e.target.value,
                      }))}
                      placeholder="#1e293b"
                      sx={{
                        backgroundColor: inputStyles.backgroundColor,
                        '& .MuiOutlinedInput-root': {
                          color: inputStyles.color,
                        },
                      }}
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
                        borderRadius: 4,
                        border: `1px solid ${inputStyles.borderColor}`,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                  {!isHeaderAccessible && customPreferences.headerColor && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      Low contrast with text: {accessiblePair.text}
                    </Alert>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: textSecondary }}>
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
                      borderRadius: 4,
                      border: `1px solid ${inputStyles.borderColor}`,
                      cursor: 'pointer',
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: textSecondary }}>
                    Text Color
                  </Typography>
                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={customPreferences.textColor || ''}
                      onChange={(e) => setCustomPreferences(prev => ({
                        ...prev,
                        textColor: e.target.value,
                      }))}
                      placeholder="#f8fafc"
                      sx={{
                        backgroundColor: inputStyles.backgroundColor,
                        '& .MuiOutlinedInput-root': {
                          color: inputStyles.color,
                        },
                      }}
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
                        borderRadius: 4,
                        border: `1px solid ${inputStyles.borderColor}`,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: textSecondary }}>
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
                      borderRadius: 4,
                      border: `1px solid ${inputStyles.borderColor}`,
                      cursor: 'pointer',
                    }}
                  />
                </Box>

                <Divider sx={{ borderColor: cardStyles.borderColor }} />

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: textSecondary }}>
                    Accessibility Check
                  </Typography>
                  <Box display="flex" gap={2} alignItems="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: accessiblePair.background,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${inputStyles.borderColor}`,
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
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: textPrimary }}>
                        Contrast: {getContrastRatio(
                          accessiblePair.background, 
                          accessiblePair.text
                        ).toFixed(2)}:1
                      </Typography>
                      <Typography variant="caption" sx={{ color: textSecondary }}>
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
                  startIcon={<CheckIcon />}
                  onClick={handleApplyCustom}
                  sx={{
                    backgroundColor: primaryButtonStyles.backgroundColor,
                    color: primaryButtonStyles.color,
                    mt: 2,
                  }}
                >
                  Apply Custom Colors
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Current Scheme Info */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: cardStyles.backgroundColor, color: cardStyles.color }}>
        <Typography variant="body2" sx={{ color: textSecondary }}>
          Current Scheme: <strong style={{ color: textPrimary }}>{currentScheme.name}</strong> - {currentScheme.description}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ThemeCustomizer;