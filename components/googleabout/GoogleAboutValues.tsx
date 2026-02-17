// components/googleabout/GoogleAboutValues.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Chip,
  Card,
  CardContent,
  Fade,
  useTheme,
} from '@mui/material'
import { Award } from 'lucide-react'
import { ABOUT_CONTENT } from './AboutContent'
import { BaseProps } from './types'
import { ValuesIcon } from '../users/about/AboutIcons'

interface GoogleAboutValuesProps extends BaseProps {
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GoogleAboutValues({ 
  isMobile, 
  darkMode, 
  getResponsiveTypography 
}: GoogleAboutValuesProps) {
  return (
    <Box sx={{ 
      py: { xs: 8, sm: 10, md: 12 }, 
      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
      borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
          <Chip
            icon={<Award size={18} />}
            label="Our Core Values"
            sx={{
              mb: 3,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              color: darkMode ? '#e8eaed' : '#202124',
              fontWeight: 500,
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              '& .MuiChip-icon': { 
                color: darkMode ? '#fbbc04' : '#fbbc04',
                fontSize: 18
              }
            }}
          />
          
          <Typography
            variant={getResponsiveTypography('h4', 'h3', 'h2') as any}
            component="h2"
            fontWeight={500}
            gutterBottom
            color={darkMode ? "#e8eaed" : "#202124"}
            sx={{ 
              fontSize: getResponsiveTypography('1.75rem', '2rem', '2.25rem'),
              letterSpacing: '-0.02em',
              mb: 3
            }}
          >
            {ABOUT_CONTENT.values.title}
          </Typography>
          
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontWeight: 300,
              fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem')
            }}
          >
            {ABOUT_CONTENT.values.subtitle}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center'
        }}>
          {ABOUT_CONTENT.values.items.map((value, index) => (
            <Fade in key={index} timeout={(index + 1) * 100}>
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
                minWidth: { xs: '100%', sm: 280 }
              }}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: darkMode 
                        ? '0 8px 24px rgba(0,0,0,0.4)'
                        : '0 8px 24px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: { xs: 3, sm: 4 }, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      mb: 3,
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '12px',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    }}>
                      <ValuesIcon 
                        valueName={value.title} 
                        size={isMobile ? "medium" : "large"} 
                        color={darkMode ? '#e8eaed' : '#202124'}
                      />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      fontWeight={500} 
                      gutterBottom
                      sx={{ fontSize: getResponsiveTypography('1.1rem', '1.25rem', '1.5rem') }}
                    >
                      {value.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      color={darkMode ? "#9aa0a6" : "#5f6368"}
                      sx={{ 
                        fontWeight: 300,
                        fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                        lineHeight: 1.6
                      }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  )
}