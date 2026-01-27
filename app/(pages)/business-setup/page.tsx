'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Divider,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  Container,
} from '@mui/material'
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  ContactPhone as ContactIcon,
  CheckCircle as CheckCircleIcon,
  Download,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import { useAuth } from '@/hooks/useAuth'

interface BusinessFormData {
  businessName: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  gstNumber: string
  phone: string
  email: string
  logo?: string
}

const steps = ['Business Info', 'Address Details', 'Contact Info']

export default function BusinessSetupPage() {
  const { user } = useAuth()
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [business, setBusiness] = useState<BusinessFormData | null>(null)

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    gstNumber: '',
    phone: '',
    email: '',
    logo: ''
  })

  // Check if business already exists
  useEffect(() => {
    const checkBusiness = async () => {
      try {
        console.log('🔍 Checking for existing business...')
        const response = await fetch('/api/business', {
          credentials: 'include'
        })
        
        console.log('📊 Business API Response Status:', response.status)
        
        if (response.status === 404) {
          console.log('ℹ️ No existing business found (404)')
          setSuccess('Please setup your business profile')
          return
        }
        
        if (response.ok) {
          const data = await response.json()
          console.log('📦 Business API Response Data:', data)
          
          if (data.business) {
            console.log('✅ Business found:', data.business.businessName)
            setBusiness(data.business)
            setFormData(data.business)
            setSuccess('Business profile found! You can update your details.')
          }
        } else {
          console.log('❌ Business check failed:', response.status)
          if (response.status === 401) {
            setError('Please login to access business setup')
          }
        }
      } catch (error) {
        console.error('❌ Error checking business:', error)
        setError('Failed to check existing business. Please try again.')
      }
    }

    checkBusiness()
  }, [])

  const handleInputChange = (field: keyof BusinessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Business Info
        if (!formData.businessName.trim()) {
          setError('Business name is required')
          return false
        }
        if (!formData.gstNumber.trim()) {
          setError('GST Number is required')
          return false
        }
        if (formData.gstNumber.length !== 15) {
          setError('GST Number must be 15 characters long')
          return false
        }
        return true

      case 1: // Address Details
        if (!formData.address.trim()) {
          setError('Address is required')
          return false
        }
        if (!formData.city.trim()) {
          setError('City is required')
          return false
        }
        if (!formData.state.trim()) {
          setError('State is required')
          return false
        }
        if (!formData.pincode.trim() || formData.pincode.length !== 6) {
          setError('Valid 6-digit pincode is required')
          return false
        }
        return true

      case 2: // Contact Info
        if (!formData.phone.trim() || formData.phone.length !== 10) {
          setError('Valid 10-digit phone number is required')
          return false
        }
        if (!formData.email.trim()) {
          setError('Email is required')
          return false
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError('Valid email address is required')
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1)
      setError('')
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
    setError('')
  }

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('🚀 Submitting business data:', formData)
      
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      console.log('📊 Submit Response Status:', response.status)
      console.log('📊 Submit Response Headers:', response.headers)

      const responseText = await response.text()
      console.log('📦 Raw Response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.log('📦 Parsed Response Data:', data)
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError)
        setError('Invalid response from server')
        return
      }

      if (response.ok) {
        setBusiness(data.business)
        setSuccess(
          business 
            ? 'Business profile updated successfully!' 
            : 'Business profile created successfully!'
        )
        // Reset form to show success message clearly
        setTimeout(() => {
          setSuccess('')
        }, 5000)
      } else {
        setError(data.message || `Failed to save business details (Status: ${response.status})`)
      }
    } catch (error) {
      console.error('❌ Error saving business:', error)
      setError('Failed to save business details. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadProfile = () => {
    if (!business) {
      setError('No business profile found to download')
      return
    }

    try {
      // Create PDF content
      const content = `
BUSINESS PROFILE
================
Date: ${new Date().toLocaleDateString()}

BUSINESS INFORMATION
-------------------
Business Name: ${business.businessName}
GST Number: ${business.gstNumber}
Logo URL: ${business.logo || 'Not provided'}

ADDRESS DETAILS
---------------
Address: ${business.address}
City: ${business.city}
State: ${business.state}
Pincode: ${business.pincode}
Country: ${business.country}

CONTACT INFORMATION
------------------
Phone: ${business.phone}
Email: ${business.email}

GENERATED ON: ${new Date().toLocaleString()}
      `.trim();

      // Create and trigger download
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `business_profile_${business.businessName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('Business profile downloaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error downloading profile:', error);
      setError('Failed to download business profile');
    }
  };

  const handleBackToDashboard = () => {
    window.history.back();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon />
              Business Information
            </Typography>
            
            <TextField
              fullWidth
              label="Business Name *"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Enter your business name"
              helperText="Legal name of your business as registered"
              required
              error={!formData.businessName.trim() && activeStep === 0}
            />
            
            <TextField
              fullWidth
              label="GST Number *"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
              placeholder="e.g., 07AABCU9603R1ZM"
              helperText="15-character GST identification number"
              inputProps={{ maxLength: 15 }}
              required
              error={formData.gstNumber.length !== 15 && activeStep === 0}
            />
            
            <TextField
              fullWidth
              label="Business Logo URL (Optional)"
              value={formData.logo}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
              helperText="URL to your business logo"
            />
          </Stack>
        )

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon />
              Address Details
            </Typography>
            
            <TextField
              fullWidth
              label="Address *"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street address, building name"
              multiline
              rows={3}
              required
              error={!formData.address.trim() && activeStep === 1}
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="City *"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                required
                error={!formData.city.trim() && activeStep === 1}
              />
              
              <TextField
                fullWidth
                label="State *"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
                required
                error={!formData.state.trim() && activeStep === 1}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Pincode *"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit pincode"
                inputProps={{ maxLength: 6 }}
                required
                error={(formData.pincode.length !== 6) && activeStep === 1}
              />
              
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Country"
              />
            </Box>
          </Stack>
        )

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ContactIcon />
              Contact Information
            </Typography>
            
            <TextField
              fullWidth
              label="Phone Number *"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit mobile number"
              inputProps={{ maxLength: 10 }}
              helperText="Primary contact number for your business"
              required
              error={(formData.phone.length !== 10) && activeStep === 2}
            />
            
            <TextField
              fullWidth
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="business@example.com"
              helperText="Official email address for communications"
              required
              error={!formData.email.trim() && activeStep === 2}
            />
          </Stack>
        )

      default:
        return null
    }
  }

  return (
    <MainLayout title="Business Management">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header - Similar to other pages */}
        <Box sx={{ mb: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={handleBackToDashboard}
            sx={{ mb: 2 }}
            size="small"
            variant="outlined"
          >
            Back to Dashboard
          </Button>

          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Business</Typography>
          </Breadcrumbs>

          {/* Main Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                🏢 Business Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {business 
                  ? 'Manage your business profile for invoicing and compliance'
                  : 'Setup your business profile to start creating professional invoices'
                }
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              spacing={1}
              alignItems="center"
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-between', sm: 'flex-end' }
              }}
            >
              {/* Status Chip */}
              <Chip 
                label={business ? "Profile Created" : "Setup Required"}
                size="small"
                color={business ? "success" : "warning"}
                variant="outlined"
              />

              {/* Download Button */}
              {business && (
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownloadProfile}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                    }
                  }}
                >
                  Download Profile
                </Button>
              )}
            </Stack>
          </Box>

          {/* Status Bar */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BusinessIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Status
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {business ? `Profile: ${business.businessName}` : 'Business Profile Not Setup'}
                  </Typography>
                </Box>
              </Box>
              
              {business && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    GST: <strong>{business.gstNumber}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Location: <strong>{business.city}, {business.state}</strong>
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Stepper */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  variant="contained"
                  size="large"
                  startIcon={isLoading ? null : <CheckCircleIcon />}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
                    boxShadow: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #115293 0%, #0d47a1 100%)',
                      boxShadow: 4,
                    }
                  }}
                >
                  {isLoading ? 'Saving...' : business ? 'Update Business' : 'Save Business'}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  variant="contained" 
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon />
              Why setup business profile?
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                • Required for generating GST-compliant invoices
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                • Auto-calculates CGST/SGST or IGST based on your business state
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                • Professional invoices with your business details
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                • Required for tax compliance and record keeping
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  )
}