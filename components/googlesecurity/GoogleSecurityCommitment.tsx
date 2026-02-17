// components/googlesecurity/GoogleSecurityCommitment.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
} from '@mui/material'
import { Security } from '@mui/icons-material'
import { SecurityPageProps } from './types'
import { Button } from '@/components/ui/Button'

interface GoogleSecurityCommitmentProps extends SecurityPageProps {
  onContact: () => void
  onDownload: () => void
}

export default function GoogleSecurityCommitment({ 
  darkMode, 
  getResponsiveTypography,
  onContact,
  onDownload
}: GoogleSecurityCommitmentProps) {
  return (
    <Container maxWidth="lg">
      <Card
        sx={{
          p: { xs: 3, sm: 4 },
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          borderRadius: '16px',
          mb: { xs: 6, sm: 8 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Box sx={{ 
            flex: 1,
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Typography
              variant="h3"
              component="h3"
              fontWeight={500}
              gutterBottom
              color={darkMode ? "#e8eaed" : "#202124"}
              sx={{ 
                fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
                mb: 2
              }}
            >
              Our Security Commitment
            </Typography>
            <Typography
              variant="body1"
              color={darkMode ? "#9aa0a6" : "#5f6368"}
              sx={{ 
                mb: 3,
                fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                lineHeight: 1.8
              }}
            >
              We are committed to maintaining the highest security standards. Our security team works 
              around the clock to protect your data and ensure compliance with the latest security 
              protocols and regulations.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={onContact}
                sx={{
                  backgroundColor: '#34a853',
                  color: "white",
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: '#2d9248',
                  },
                }}
              >
                Contact Security Team
              </Button>
              <Button
                variant="outlined"
                onClick={onDownload}
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                }}
              >
                Download Whitepaper
              </Button>
            </Box>
          </Box>
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Security sx={{ 
              fontSize: { xs: 120, md: 160 }, 
              color: '#4285f4',
              opacity: 0.8
            }} />
          </Box>
        </Box>
      </Card>
    </Container>
  )
}