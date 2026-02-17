// components/googleprofile/GoogleProfileSubscription.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Stack,
} from '@mui/material'
import {
  Check as CheckIcon,
  Upgrade as UpgradeIcon,
} from '@mui/icons-material'
import { SubscriptionStatus } from './types'
import { PRICING_PLANS, getPlanColor } from './utils'

interface GoogleProfileSubscriptionProps {
  subscriptionStatus: SubscriptionStatus | null
  onUpgradeClick: () => void
  darkMode?: boolean
}

export default function GoogleProfileSubscription({
  subscriptionStatus,
  onUpgradeClick,
  darkMode,
}: GoogleProfileSubscriptionProps) {
  if (!subscriptionStatus) return null

  const planKey = subscriptionStatus.plan as keyof typeof PRICING_PLANS
  const plan = PRICING_PLANS[planKey] || PRICING_PLANS.trial

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500,
            color: darkMode ? '#e8eaed' : '#202124',
            mb: 1,
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
          }}
        >
          Subscription Details
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
          }}
        >
          Manage your subscription plan and billing information
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

      {/* Current Subscription */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
          Current Subscription
        </Typography>
        <Paper
          sx={{
            p: 3,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: getPlanColor(subscriptionStatus.plan) }}>
                  {plan.name}
                </Typography>
                <Chip 
                  label={subscriptionStatus.isActive ? 'Active' : 'Inactive'} 
                  size="small" 
                  sx={{ 
                    backgroundColor: subscriptionStatus.isActive 
                      ? (darkMode ? '#0d652d' : '#d9f0e1')
                      : (darkMode ? '#420000' : '#fce8e6'),
                    color: subscriptionStatus.isActive ? '#34a853' : '#ea4335',
                    fontWeight: 500,
                  }} 
                />
              </Box>
              
              <Stack spacing={0.5}>
                {subscriptionStatus.currentPeriodEnd && (
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {subscriptionStatus.isActive ? 'Renews on' : 'Expired on'}: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                )}
                {subscriptionStatus.daysRemaining !== undefined && (
                  <Typography variant="body2" sx={{ 
                    color: subscriptionStatus.daysRemaining > 7 
                      ? (darkMode ? '#34a853' : '#0d652d')
                      : (darkMode ? '#fbbc04' : '#653c00'),
                    fontWeight: 500,
                  }}>
                    {subscriptionStatus.daysRemaining} days remaining
                  </Typography>
                )}
              </Stack>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<UpgradeIcon />}
              onClick={onUpgradeClick}
              sx={{ 
                borderRadius: '12px',
                backgroundColor: '#4285f4',
                color: 'white',
                fontWeight: 500,
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: '#3367d6',
                  boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                },
              }}
            >
              Upgrade Plan
            </Button>
          </Box>
        </Paper>
      </Box>

      {subscriptionStatus && (
        <>
          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Current Plan Features */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Current Plan Features
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
              gap: 2 
            }}>
              {plan.features.map((feature: string, index: number) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <CheckIcon fontSize="small" sx={{ color: '#34a853', mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {feature}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}