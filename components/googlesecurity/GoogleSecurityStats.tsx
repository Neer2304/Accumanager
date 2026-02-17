// components/googlesecurity/GoogleSecurityStats.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Card,
  Typography,
  Fade,
} from '@mui/material'
import {
  Shield,
  BugReport,
  MonitorHeart,
  Warning,
  Lock,
  Cloud,
} from '@mui/icons-material'
import { SecurityStat, SecurityPageProps } from './types'

interface GoogleSecurityStatsProps extends SecurityPageProps {
  stats?: SecurityStat[]
}

export default function GoogleSecurityStats({ 
  darkMode, 
  stats = defaultStats,
  isMobile,
}: GoogleSecurityStatsProps) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        mb: { xs: 6, sm: 8 }
      }}>
        {stats.map((stat, index) => (
          <Fade in key={index} timeout={(index + 1) * 200}>
            <Card
              sx={{
                width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 8px)', md: 'calc(16.666% - 8px)' },
                minWidth: 150,
                textAlign: 'center',
                p: 3,
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: darkMode 
                    ? '0 8px 24px rgba(0,0,0,0.3)'
                    : '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mb: 2,
                color: '#4285f4'
              }}>
                {stat.icon}
              </Box>
              <Typography variant="h4" fontWeight={600} gutterBottom color={darkMode ? "#e8eaed" : "#202124"}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                {stat.label}
              </Typography>
            </Card>
          </Fade>
        ))}
      </Box>
    </Container>
  )
}

const defaultStats: SecurityStat[] = [
  { label: "Security Audits", value: "Quarterly", icon: <Shield /> },
  { label: "Penetration Tests", value: "Monthly", icon: <BugReport /> },
  { label: "Vulnerability Scans", value: "Daily", icon: <MonitorHeart /> },
  { label: "Incident Response", value: "24/7", icon: <Warning /> },
  { label: "Data Encryption", value: "100%", icon: <Lock /> },
  { label: "Uptime SLA", value: "99.9%", icon: <Cloud /> }
]