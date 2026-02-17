// components/googlesettings/GoogleSettingsSubscription.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  LinearProgress,
  alpha,
  Divider,
} from '@mui/material'
import {
  Payment,
  CheckCircle,
  Cancel,
  Schedule,
  Upgrade,
  Star,
  StarBorder,
} from '@mui/icons-material'
import { SubscriptionStatus } from './types'

interface GoogleSettingsSubscriptionProps {
  subscription: SubscriptionStatus | null
  onUpgradeClick: (plan: string) => void
  darkMode?: boolean
  isMobile?: boolean
}

const plans = [
  {
    name: 'Basic',
    price: '$9.99',
    period: 'per month',
    features: [
      'Up to 100 customers',
      'Basic analytics',
      'Email support',
      '1 user account',
    ],
    current: false,
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: 'per month',
    features: [
      'Unlimited customers',
      'Advanced analytics',
      'Priority support',
      '5 user accounts',
      'Custom reports',
      'API access',
    ],
    current: true,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$49.99',
    period: 'per month',
    features: [
      'Everything in Pro',
      'Unlimited users',
      'Dedicated account manager',
      'Custom integration',
      'SLA guarantee',
      'Early access features',
    ],
    current: false,
  },
]

export default function GoogleSettingsSubscription({ 
  subscription,
  onUpgradeClick,
  darkMode,
  isMobile,
}: GoogleSettingsSubscriptionProps) {
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#34a853'
      case 'pending': return '#fbbc04'
      case 'cancelled': return '#ea4335'
      default: return '#9aa0a6'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle sx={{ fontSize: 16 }} />
      case 'pending': return <Schedule sx={{ fontSize: 16 }} />
      case 'cancelled': return <Cancel sx={{ fontSize: 16 }} />
      default: return null
    }
  }

  // Calculate usage percentage (example)
  const usagePercentage = 65

  return (
    <Box>
      {/* Current Subscription */}
      {subscription && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: '16px',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Payment sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
            <Typography variant="subtitle1" fontWeight={500}>
              Current Subscription
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={500} gutterBottom>
                {subscription.plan} Plan
              </Typography>
              <Chip
                // icon={getStatusIcon(subscription.status)}
                label={subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                size="small"
                sx={{
                  backgroundColor: alpha(getStatusColor(subscription.status), 0.1),
                  color: getStatusColor(subscription.status),
                  border: `1px solid ${alpha(getStatusColor(subscription.status), 0.2)}`,
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" fontWeight={500}>
                {subscription.billingCycle === 'monthly' ? '$19.99' : '$199.99'}
              </Typography>
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                per {subscription.billingCycle}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Usage
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {usagePercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={usagePercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? '#303134' : '#e8eaed',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#34a853',
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Started: {new Date(subscription.startDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Renews: {new Date(subscription.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Available Plans */}
      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
        Available Plans
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
      }}>
        {plans.map((plan, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3 },
              borderRadius: '16px',
              border: plan.popular 
                ? `2px solid ${darkMode ? '#8ab4f8' : '#1a73e8'}`
                : `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: darkMode 
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(0,0,0,0.1)',
              },
            }}
          >
            {plan.popular && (
              <Chip
                label="POPULAR"
                size="small"
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: 20,
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={500} gutterBottom>
                {plan.name}
              </Typography>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {plan.price}
              </Typography>
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                {plan.period}
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {plan.features.map((feature, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 18, color: '#34a853' }} />
                  <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Button
              fullWidth
              variant={plan.current ? 'outlined' : 'contained'}
              onClick={() => onUpgradeClick(plan.name.toLowerCase())}
              disabled={plan.current}
              startIcon={!plan.current && <Upgrade />}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                backgroundColor: plan.current 
                  ? 'transparent'
                  : darkMode ? '#8ab4f8' : '#1a73e8',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: plan.current 
                  ? darkMode ? '#9aa0a6' : '#5f6368'
                  : 'white',
                '&:hover': {
                  backgroundColor: plan.current
                    ? 'transparent'
                    : darkMode ? '#aecbfa' : '#1669c1',
                  borderColor: darkMode ? '#5f6368' : '#202124',
                },
              }}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}