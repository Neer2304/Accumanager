// components/googleabout/GoogleAboutFooter.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  useTheme,
} from '@mui/material'
import { BaseProps } from './types'
import { RocketLaunch } from '@mui/icons-material'

interface GoogleAboutFooterProps extends BaseProps {
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GoogleAboutFooter({ 
  darkMode, 
  getResponsiveTypography 
}: GoogleAboutFooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, sm: 5, md: 6 },
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        color: darkMode ? '#e8eaed' : '#202124',
        borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, sm: 6 },
            mb: { xs: 4, sm: 5 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RocketLaunch size={24} color="#4285f4" style={{ marginRight: '12px' }} />
              <Typography
                variant="h6"
                fontWeight={500}
                sx={{ 
                  fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                }}
              >
                AccuManage
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ 
                opacity: 0.8, 
                mb: 2,
                maxWidth: 400,
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
              }}
            >
              Streamline your business operations with our all-in-one management platform.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3, sm: 4 },
              flex: 1,
            }}
          >
            <Box>
              <Typography 
                variant="subtitle2" 
                gutterBottom 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 500,
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                }}
              >
                Product
              </Typography>
              <Stack spacing={1}>
                {["Features", "Pricing", "API", "Documentation"].map((item) => (
                  <Typography
                    key={item}
                    component="a"
                    href={`#${item.toLowerCase()}`}
                    sx={{
                      textDecoration: 'none',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                      fontWeight: 300,
                      '&:hover': {
                        color: darkMode ? '#e8eaed' : '#202124',
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography 
                variant="subtitle2" 
                gutterBottom 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 500,
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                }}
              >
                Company
              </Typography>
              <Stack spacing={1}>
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <Typography
                    key={item}
                    component="a"
                    href="#"
                    sx={{
                      textDecoration: 'none',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                      fontWeight: 300,
                      '&:hover': {
                        color: darkMode ? '#e8eaed' : '#202124',
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography 
                variant="subtitle2" 
                gutterBottom 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 500,
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                }}
              >
                Support
              </Typography>
              <Stack spacing={1}>
                {["Help Center", "Community", "Status", "Security"].map((item) => (
                  <Typography
                    key={item}
                    component="a"
                    href="#"
                    sx={{
                      textDecoration: 'none',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                      fontWeight: 300,
                      '&:hover': {
                        color: darkMode ? '#e8eaed' : '#202124',
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ 
          borderColor: darkMode ? '#3c4043' : '#dadce0', 
          mb: { xs: 3, sm: 4 } 
        }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{ 
              opacity: 0.6,
              fontWeight: 300,
              fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
            }}
          >
            © {new Date().getFullYear()} AccuManage. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}