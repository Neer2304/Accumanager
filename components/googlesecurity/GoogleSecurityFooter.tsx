// components/googlesecurity/GoogleSecurityFooter.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
} from '@mui/material'
import { Security } from '@mui/icons-material'
import { SecurityPageProps } from './types'

export default function GoogleSecurityFooter({ 
  darkMode, 
  getResponsiveTypography 
}: SecurityPageProps) {
  const footerLinks = {
    security: ["Overview", "Features", "Compliance", "Audits"],
    resources: ["Whitepaper", "Documentation", "FAQ", "Contact"],
    legal: ["Privacy", "Terms", "GDPR", "Compliance"],
  }

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
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 4, sm: 6 },
          mb: { xs: 4, sm: 5 },
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ fontSize: 24, color: '#4285f4', mr: 1.5 }} />
              <Typography
                variant="h6"
                fontWeight={500}
                sx={{ 
                  fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                }}
              >
                AccuManage Security
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ 
                opacity: 0.8, 
                mb: 2,
                maxWidth: 400,
                fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
              }}
            >
              Your security is our top priority. We employ industry-leading practices to protect your data.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3, sm: 4 },
              flex: 1,
            }}
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <Box key={category}>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                    textTransform: 'capitalize',
                  }}
                >
                  {category}
                </Typography>
                <Stack spacing={1}>
                  {links.map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href={`/security/${item.toLowerCase()}`}
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        cursor: 'pointer',
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
              fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
            }}
          >
            © {new Date().getFullYear()} AccuManage Security. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}