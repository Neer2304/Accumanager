// components/googlepricing/GooglePricingCard.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  alpha,
} from '@mui/material'
import {
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material'
import {
  Users,
  Package,
  Crown,
} from 'lucide-react'
import { PricingCardProps } from './types'

export default function GooglePricingCard({ 
  plan, 
  isAuthenticated, 
  onSubscribe,
  darkMode,
  getResponsiveTypography 
}: PricingCardProps) {
  
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        borderRadius: '16px',
        border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode 
            ? '0 8px 24px rgba(0,0,0,0.4)'
            : '0 8px 24px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <Chip
          icon={<Crown size={14} />}
          label="Most Popular"
          sx={{
            position: 'absolute',
            top: -5,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            backgroundColor: '#4285f4',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      )}

      {/* Saving Badge */}
      {plan.savingPercentage && (
        <Chip
          label={`Save ${plan.savingPercentage}%`}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: '#34a853',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      )}

      <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Plan Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: getResponsiveTypography('1.1rem', '1.25rem', '1.5rem') }}
          >
            {plan.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
            <Typography
              variant="h3"
              fontWeight={600}
              sx={{ fontSize: getResponsiveTypography('2rem', '2.25rem', '2.5rem') }}
            >
              ₹{plan.price}
            </Typography>
            {plan.originalPrice && (
              <Typography
                variant="body1"
                sx={{ 
                  ml: 1,
                  textDecoration: 'line-through',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem')
                }}
              >
                ₹{plan.originalPrice}
              </Typography>
            )}
          </Box>
          <Typography
            variant="body2"
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{ fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem') }}
          >
            {plan.period}
          </Typography>
        </Box>

        {/* Limits Summary */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
          mb: 4,
          p: 2,
          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
          borderRadius: '12px',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Users size={20} style={{ margin: '0 auto 4px', color: darkMode ? '#8ab4f8' : '#4285f4' }} />
            <Typography variant="body2" fontWeight={600}>
              {plan.limits.customers === 0 ? "Unlimited" : plan.limits.customers.toLocaleString()}
            </Typography>
            <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
              Customers
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Package size={20} style={{ margin: '0 auto 4px', color: darkMode ? '#8ab4f8' : '#4285f4' }} />
            <Typography variant="body2" fontWeight={600}>
              {plan.limits.products === 0 ? "Unlimited" : plan.limits.products.toLocaleString()}
            </Typography>
            <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
              Products
            </Typography>
          </Box>
        </Box>

        {/* CTA Button */}
        <Button
          onClick={() => onSubscribe(plan.id)}
          disabled={isAuthenticated && plan.id === "trial"}
          endIcon={<ArrowForward />}
          variant="contained"
          fullWidth
          sx={{
            mb: 4,
            py: 1.5,
            backgroundColor: plan.popular ? '#4285f4' : '#34a853',
            color: "white",
            fontWeight: 500,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
            '&:hover': {
              backgroundColor: plan.popular ? '#3367d6' : '#2d9248',
              boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
            },
            '&.Mui-disabled': {
              backgroundColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }
          }}
        >
          {plan.id === "trial" && isAuthenticated
            ? "Already Using"
            : plan.id === "trial"
            ? "Start Free Trial"
            : "Get Started"}
        </Button>

        {/* Features List */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            sx={{ 
              mb: 2,
              fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem')
            }}
          >
            Key Features:
          </Typography>
          <Stack spacing={1.5}>
            {plan.features.included.slice(0, 6).map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircle sx={{ 
                  fontSize: 18, 
                  color: '#34a853', 
                  mr: 1.5,
                  flexShrink: 0,
                  mt: 0.25
                }} />
                <Typography
                  variant="body2"
                  color={darkMode ? "#e8eaed" : "#202124"}
                  sx={{ 
                    fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                    lineHeight: 1.4
                  }}
                >
                  {feature.name}
                </Typography>
              </Box>
            ))}
            {plan.features.included.length > 6 && (
              <Typography
                variant="body2"
                sx={{ 
                  color: '#4285f4',
                  fontWeight: 500,
                  fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                  mt: 1
                }}
              >
                + {plan.features.included.length - 6} more features
              </Typography>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}