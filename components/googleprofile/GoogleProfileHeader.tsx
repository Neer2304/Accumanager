// components/googleprofile/GoogleProfileHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Avatar,
  Chip,
  Stack,
  Button,
  Fade,
} from '@mui/material'
import Link from 'next/link'
import { Home as HomeIcon, Refresh, Upgrade } from '@mui/icons-material'
import { UserProfile, SubscriptionStatus } from './types'
import { getPlanColor, getStatusBackgroundColor } from './utils'

interface GoogleProfileHeaderProps {
  profile: UserProfile | null
  businessName?: string
  subscriptionStatus?: SubscriptionStatus | null
  darkMode?: boolean
  isMobile?: boolean
  isTablet?: boolean
  onRefresh: () => void
  onUpgradeClick: () => void
}

export default function GoogleProfileHeader({
  profile,
  businessName,
  subscriptionStatus,
  darkMode,
  isMobile,
  isTablet,
  onRefresh,
  onUpgradeClick,
}: GoogleProfileHeaderProps) {
  if (!profile) return null

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      background: darkMode 
        ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
        : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
    }}>
      <Fade in>
        <Breadcrumbs sx={{ 
          mb: { xs: 1, sm: 2 }, 
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
        }}>
          <MuiLink 
            component={Link} 
            href="/dashboard" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: darkMode ? '#9aa0a6' : '#5f6368', 
              fontWeight: 300, 
              "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
            Dashboard
          </MuiLink>
          <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
            Profile
          </Typography>
        </Breadcrumbs>
      </Fade>

      <Fade in timeout={300}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: { xs: 1.5, sm: 2 }, 
          mb: { xs: 2, sm: 3 } 
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: { xs: 60, sm: 80, md: 100 },
                  height: { xs: 60, sm: 80, md: 100 },
                  bgcolor: darkMode ? '#4285f4' : '#e3f2fd',
                  color: darkMode ? '#e8eaed' : '#1a73e8',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  fontWeight: 500,
                  border: darkMode ? '3px solid #3c4043' : '3px solid #ffffff',
                  boxShadow: darkMode 
                    ? '0 4px 20px rgba(66, 133, 244, 0.3)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography 
                  variant={isMobile ? "h6" : isTablet ? "h5" : "h4"} 
                  fontWeight={500} 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  {profile.name || 'User'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368', 
                    fontWeight: 300,
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' },
                    lineHeight: 1.4,
                  }}
                >
                  {businessName || profile.businessName || 'Business'}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={profile.role || 'User'} 
                size="small" 
                sx={{ 
                  backgroundColor: darkMode ? '#3c4043' : '#f5f5f5',
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }} 
              />
              <Chip 
                label={profile.isActive ? 'Active' : 'Inactive'} 
                size="small" 
                sx={{ 
                  backgroundColor: profile.isActive 
                    ? (darkMode ? '#0d652d' : '#d9f0e1')
                    : (darkMode ? '#3c4043' : '#f5f5f5'),
                  color: profile.isActive ? '#34a853' : (darkMode ? '#9aa0a6' : '#5f6368'),
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }} 
              />
              {subscriptionStatus && (
                <>
                  <Chip 
                    label={subscriptionStatus.plan === 'trial' ? 'Free Trial' : subscriptionStatus.plan + ' Plan'} 
                    size="small" 
                    sx={{ 
                      backgroundColor: darkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.1)',
                      color: getPlanColor(subscriptionStatus.plan),
                      fontWeight: 500,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }} 
                  />
                  {subscriptionStatus.daysRemaining !== undefined && (
                    <Chip 
                      label={`${subscriptionStatus.daysRemaining} days remaining`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: subscriptionStatus.daysRemaining > 7 ? '#34a853' : '#fbbc04',
                        color: subscriptionStatus.daysRemaining > 7 
                          ? (darkMode ? '#34a853' : '#0d652d')
                          : (darkMode ? '#fbbc04' : '#653c00'),
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    />
                  )}
                </>
              )}
            </Stack>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={1} 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button 
              startIcon={<Refresh />} 
              onClick={onRefresh}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ 
                borderRadius: '12px',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 500,
                minWidth: 'auto',
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 0.75 },
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                "&:hover": { 
                  borderColor: darkMode ? '#5f6368' : '#202124',
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              {isMobile ? '' : 'Refresh'}
            </Button>

            <Button 
              startIcon={<Upgrade />} 
              onClick={onUpgradeClick}
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{ 
                borderRadius: '12px',
                backgroundColor: '#34a853',
                color: 'white',
                fontWeight: 500,
                minWidth: 'auto',
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 0.75 },
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                "&:hover": { 
                  backgroundColor: '#2d9248',
                  boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                },
              }}
            >
              {isMobile ? '' : 'Upgrade Plan'}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Box>
  )
}