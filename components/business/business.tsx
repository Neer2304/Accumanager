'use client'

import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Alert,
  Stack,
} from '@mui/material'
import { Business as BusinessIcon } from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'
import { useBusinessSetup } from '@/hooks/useBusinessSetup'
import { businessSetupContent } from '@/data/businessSetupContent'
import { BusinessForm } from './BusinessForm'
import { BusinessStepper } from './BusinessStepper'
import { BenefitsCard } from './BenefitsCard'

export default function BusinessSetupPage() {
  const {
    activeStep,
    isLoading,
    error,
    success,
    business,
    formData,
    handleInputChange,
    handleNext,
    handleBack,
    handleSubmit,
  } = useBusinessSetup()

  const { header, buttons } = businessSetupContent

  return (
    <MainLayout title={business ? "Business Profile" : header.title}>
      <Box sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: 800, 
        margin: '0 auto',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <Paper sx={{ 
          p: { xs: 3, md: 4 }, 
          mb: 3, 
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <BusinessIcon sx={{ 
            fontSize: { xs: 48, md: 60 }, 
            mb: 2,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
          }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {business ? 'Business Profile' : header.title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            {business 
              ? 'Update your business information for invoicing and compliance'
              : header.subtitle
            }
          </Typography>
        </Paper>

        {/* Stepper */}
        <BusinessStepper activeStep={activeStep} />

        {/* Alerts */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}>
              {success}
            </Alert>
          )}
        </Stack>

        {/* Form Content */}
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <BusinessForm
              activeStep={activeStep}
              formData={formData}
              onInputChange={handleInputChange}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              hasBusiness={!!business}
            />
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <BenefitsCard />
      </Box>
    </MainLayout>
  )
}