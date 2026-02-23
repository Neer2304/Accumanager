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
import { RocketIcon } from 'lucide-react'
import { ABOUT_CONTENT } from './AboutContent'

interface GoogleAboutFooterProps extends BaseProps {
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GoogleAboutFooter({ 
  darkMode, 
  getResponsiveTypography 
}: GoogleAboutFooterProps) {
  const { footer } = ABOUT_CONTENT
  const currentYear = new Date().getFullYear()
  const copyrightText = footer.copyright.replace('{year}', currentYear.toString())

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
          {/* Company Info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box component="span" sx={{ fontSize: '24px', mr: 1.5 }}>
                {footer.company.logo}
              </Box>
              <Typography
                variant="h6"
                fontWeight={500}
                sx={{ 
                  fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                }}
              >
                {footer.company.name}
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
              {footer.company.description}
            </Typography>
          </Box>

          {/* Footer Sections */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3, sm: 4 },
              flex: 1,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            {footer.sections.map((section, index) => (
              <Box key={index} sx={{ minWidth: { xs: 'calc(50% - 12px)', sm: 'auto' } }}>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  {section.title}
                </Typography>
                <Stack spacing={1}>
                  {section.links.map((link, linkIndex) => (
                    <Typography
                      key={linkIndex}
                      component="a"
                      href={link.href}
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        fontWeight: 300,
                        cursor: 'pointer',
                        '&:hover': {
                          color: darkMode ? '#e8eaed' : '#202124',
                        }
                      }}
                    >
                      {link.label}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
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
            {copyrightText}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}