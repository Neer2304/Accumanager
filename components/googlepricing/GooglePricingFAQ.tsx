// components/googlepricing/GooglePricingFAQ.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Fade,
  alpha,
} from '@mui/material'
import { HelpCircle } from 'lucide-react'
import { FAQ } from './types'

interface GooglePricingFAQProps {
  faqs: FAQ[]
  darkMode?: boolean
  isMobile?: boolean
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GooglePricingFAQ({ 
  faqs, 
  darkMode,
  getResponsiveTypography 
}: GooglePricingFAQProps) {
  
  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, sm: 10 } }}>
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
          Frequently Asked Questions
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
          Get answers to common questions about our pricing and plans
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
      }}>
        {faqs.map((faq, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: '100%', md: 'calc(50% - 12px)' },
              maxWidth: 500,
            }}
          >
            <Fade in timeout={(index + 1) * 100}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: '12px',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: darkMode 
                      ? '0 6px 16px rgba(0,0,0,0.3)'
                      : '0 6px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <HelpCircle 
                    size={20} 
                    style={{ 
                      marginRight: '12px', 
                      color: darkMode ? '#8ab4f8' : '#4285f4',
                      flexShrink: 0,
                    }} 
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ 
                      fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                      lineHeight: 1.2
                    }}
                  >
                    {faq.question}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color={darkMode ? "#9aa0a6" : "#5f6368"}
                  sx={{ 
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '0.95rem'),
                    lineHeight: 1.6,
                    pl: 4
                  }}
                >
                  {faq.answer}
                </Typography>
              </Paper>
            </Fade>
          </Box>
        ))}
      </Box>
    </Container>
  )
}