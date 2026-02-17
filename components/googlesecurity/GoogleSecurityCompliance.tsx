// components/googlesecurity/GoogleSecurityCompliance.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Card,
  Fade,
} from '@mui/material'
import { VerifiedUser } from '@mui/icons-material'
import { ComplianceStandard, SecurityPageProps } from './types'
import { Button } from '@/components/ui/Button'

interface GoogleSecurityComplianceProps extends SecurityPageProps {
  standards: ComplianceStandard[]
  onViewAll: () => void
}

export default function GoogleSecurityCompliance({ 
  darkMode, 
  getResponsiveTypography,
  standards,
  onViewAll
}: GoogleSecurityComplianceProps) {
  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          textAlign: "center",
          background: darkMode 
            ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
            : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          color: "white",
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          mb: { xs: 6, sm: 8 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<VerifiedUser sx={{ fontSize: 16 }} />}
            label="Compliance & Certifications"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
              '& .MuiChip-icon': { color: 'white' }
            }}
          />

          <Typography
            variant="h3"
            component="h2"
            fontWeight={500}
            gutterBottom
            sx={{ 
              fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
              mb: 3,
            }}
          >
            Meeting Global Standards
          </Typography>

          <Typography
            variant="body1"
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontWeight: 300,
              fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            We comply with industry-leading security standards and undergo regular third-party audits
          </Typography>

          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mb: 3
          }}>
            {standards.map((standard) => (
              <Fade in key={standard.id}>
                <Card
                  sx={{
                    width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 8px)', md: 'calc(16.666% - 8px)' },
                    minWidth: 120,
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mb: 1,
                    color: 'white'
                  }}>
                    {standard.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {standard.name}
                  </Typography>
                  <Chip
                    label={standard.status}
                    size="small"
                    sx={{
                      backgroundColor: 
                        standard.status === 'compliant' ? '#34a853' :
                        standard.status === 'in-progress' ? '#fbbc04' : '#ea4335',
                      color: 'white',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}
                  />
                </Card>
              </Fade>
            ))}
          </Box>

          <Button
            variant="outlined"
            onClick={onViewAll}
            sx={{
              borderColor: "white",
              color: "white",
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              mt: 2,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            View All Certifications
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}