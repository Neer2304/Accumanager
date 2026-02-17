// components/googleabout/GoogleAboutMissionVision.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Fade,
  useTheme,
} from '@mui/material'
import { InnovationIcon } from '@/assets/icons/AboutIcons'
import { ABOUT_CONTENT } from './AboutContent'
import { BaseProps } from './types'
import { Business } from '@mui/icons-material'

interface GoogleAboutMissionVisionProps extends BaseProps {
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GoogleAboutMissionVision({ 
  darkMode, 
  getResponsiveTypography 
}: GoogleAboutMissionVisionProps) {
  return (
    <Box sx={{ 
      py: { xs: 8, sm: 10, md: 12 },
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 6,
          alignItems: 'center' 
        }}>
          {/* Mission */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Fade in timeout={400}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: '16px',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: darkMode 
                      ? '0 8px 24px rgba(0,0,0,0.4)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ 
                  display: 'inline-flex',
                  p: 2,
                  mb: 3,
                  backgroundColor: darkMode ? '#0d47a1' : '#e8f0fe',
                  borderRadius: '12px',
                }}>
                  <Business sx={{ fontSize: 32, color: darkMode ? 'white' : '#4285f4' }} />
                </Box>
                
                <Typography 
                  variant="h4" 
                  fontWeight={500} 
                  gutterBottom
                  sx={{ fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem') }}
                >
                  {ABOUT_CONTENT.mission.title}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  color={darkMode ? "#9aa0a6" : "#5f6368"} 
                  paragraph
                  sx={{ 
                    fontWeight: 300,
                    fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                    mb: 3
                  }}
                >
                  {ABOUT_CONTENT.mission.subtitle}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color={darkMode ? "#9aa0a6" : "#5f6368"}
                  sx={{ 
                    fontWeight: 300,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                    lineHeight: 1.8
                  }}
                >
                  {ABOUT_CONTENT.mission.description}
                </Typography>
              </Paper>
            </Fade>
          </Box>
          
          {/* Vision */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Fade in timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: '16px',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: darkMode 
                      ? '0 8px 24px rgba(0,0,0,0.4)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ 
                  display: 'inline-flex',
                  p: 2,
                  mb: 3,
                  backgroundColor: darkMode ? '#311b92' : '#f3e8ff',
                  borderRadius: '12px',
                }}>
                  <InnovationIcon sx={{ fontSize: 32, color: darkMode ? 'white' : '#9333ea' }} />
                </Box>
                
                <Typography 
                  variant="h4" 
                  fontWeight={500} 
                  gutterBottom
                  sx={{ fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem') }}
                >
                  {ABOUT_CONTENT.vision.title}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  color={darkMode ? "#9aa0a6" : "#5f6368"} 
                  paragraph
                  sx={{ 
                    fontWeight: 300,
                    fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                    mb: 3
                  }}
                >
                  {ABOUT_CONTENT.vision.subtitle}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color={darkMode ? "#9aa0a6" : "#5f6368"}
                  sx={{ 
                    fontWeight: 300,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                    lineHeight: 1.8
                  }}
                >
                  {ABOUT_CONTENT.vision.description}
                </Typography>
              </Paper>
            </Fade>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}