// components/googlesecurity/GoogleSecurityFeatures.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  alpha,
} from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { SecurityFeature, SecurityPageProps } from './types'

interface GoogleSecurityFeaturesProps extends SecurityPageProps {
  features: SecurityFeature[]
}

export default function GoogleSecurityFeatures({ 
  darkMode, 
  getResponsiveTypography,
  features,
  isMobile,
  isTablet,
}: GoogleSecurityFeaturesProps) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}>
        <Typography
          variant="h2"
          component="h2"
          fontWeight={500}
          gutterBottom
          color={darkMode ? "#e8eaed" : "#202124"}
          sx={{ 
            fontSize: getResponsiveTypography('1.75rem', '2rem', '2.25rem'),
            mb: 2
          }}
        >
          Comprehensive Security Features
        </Typography>
        <Typography
          variant="body1"
          color={darkMode ? "#9aa0a6" : "#5f6368"}
          sx={{ 
            maxWidth: 600, 
            mx: "auto",
            fontWeight: 300,
            fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
          }}
        >
          Multiple layers of security protecting your data at every level
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
        mb: 8
      }}>
        {features.map((feature) => (
          <Box
            key={feature.id}
            sx={{
              width: { 
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)'
              },
              minWidth: { xs: '100%', sm: 280 },
            }}
          >
            <Fade in>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: '16px',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode 
                      ? '0 8px 24px rgba(0,0,0,0.3)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    {feature.icon}
                    <Box sx={{ ml: 2 }}>
                      <Chip
                        label={feature.category}
                        size="small"
                        sx={{
                          backgroundColor: alpha(
                            feature.category === 'infrastructure' ? '#4285f4' :
                            feature.category === 'application' ? '#34a853' :
                            feature.category === 'compliance' ? '#fbbc04' : '#ea4335',
                            0.1
                          ),
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                    sx={{ 
                      fontSize: getResponsiveTypography('1.1rem', '1.25rem', '1.5rem'),
                      mb: 2
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color={darkMode ? "#9aa0a6" : "#5f6368"}
                    sx={{ 
                      mb: 3,
                      fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>

                  <List dense disablePadding>
                    {feature.details.map((detail, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#34a853' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: darkMode ? '#e8eaed' : '#202124',
                                fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem')
                              }}
                            >
                              {detail}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        ))}
      </Box>
    </Container>
  )
}