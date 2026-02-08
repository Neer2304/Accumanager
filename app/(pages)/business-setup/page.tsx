'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Breadcrumbs,
  Stack,
  Stepper,
  Step,
  StepLabel,
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
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

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
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  
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
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: darkMode ? '#e8eaed' : '#202124',
            }}>
              <BusinessIcon />
              Business Information
            </Typography>
            
            <Input
              fullWidth
              label="Business Name *"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Enter your business name"
              helperText="Legal name of your business as registered"
              required
              error={!formData.businessName.trim() && activeStep === 0}
            />
            
            <Input
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
            
            <Input
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
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: darkMode ? '#e8eaed' : '#202124',
            }}>
              <LocationIcon />
              Address Details
            </Typography>
            
            <Input
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
              <Input
                fullWidth
                label="City *"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                required
                error={!formData.city.trim() && activeStep === 1}
              />
              
              <Input
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
              <Input
                fullWidth
                label="Pincode *"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit pincode"
                inputProps={{ maxLength: 6 }}
                required
                error={(formData.pincode.length !== 6) && activeStep === 1}
              />
              
              <Input
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
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: darkMode ? '#e8eaed' : '#202124',
            }}>
              <ContactIcon />
              Contact Information
            </Typography>
            
            <Input
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
            
            <Input
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
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Business
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Business Management
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {business 
                ? 'Manage your business profile for invoicing and compliance'
                : 'Setup your business profile to start creating professional invoices'
              }
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label={business ? "Profile Created" : "Setup Required"}
              variant="outlined"
              sx={{
                backgroundColor: business 
                  ? (darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08))
                  : (darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08)),
                borderColor: business ? alpha('#34a853', 0.3) : alpha('#fbbc04', 0.3),
                color: business 
                  ? (darkMode ? '#81c995' : '#34a853')
                  : (darkMode ? '#fdd663' : '#fbbc04'),
              }}
            />
            
            {business && (
              <Chip
                label={`GST: ${business.gstNumber}`}
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                  borderColor: alpha('#4285f4', 0.3),
                  color: darkMode ? '#8ab4f8' : '#4285f4',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Alerts */}
          {error && (
            <Alert
              severity="error"
              message={error}
              dismissible
              onDismiss={() => setError('')}
              sx={{ mb: 3 }}
            />
          )}
          
          {success && (
            <Alert
              severity="success"
              message={success}
              dismissible
              onDismiss={() => setSuccess('')}
              sx={{ mb: 3 }}
            />
          )}

          {/* Status Card */}
          <Card
            title={business ? "🏢 Business Profile Created" : "⚙️ Business Setup Required"}
            subtitle={business ? `Business: ${business.businessName} • ${business.city}, ${business.state}` : 'Complete the setup process to create invoices'}
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleBackToDashboard}
                  startIcon={<BackIcon />}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Back
                </Button>
                {business && (
                  <Button
                    variant="contained"
                    onClick={handleDownloadProfile}
                    startIcon={<Download />}
                    sx={{ 
                      backgroundColor: '#34a853',
                      '&:hover': { backgroundColor: '#2d9248' }
                    }}
                  >
                    Download Profile
                  </Button>
                )}
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          />

          {/* Stepper */}
          <Card
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                sx={{
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                  },
                  '& .MuiStepLabel-root .Mui-disabled .MuiStepIcon-root': {
                    color: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel 
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Card>

          {/* Form Content */}
          <Card
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              {renderStepContent(activeStep)}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    minWidth: 100,
                  }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    variant="contained"
                    startIcon={isLoading ? undefined : <CheckCircleIcon />}
                    sx={{ 
                      backgroundColor: '#34a853',
                      '&:hover': { backgroundColor: '#2d9248' },
                      minWidth: 180,
                    }}
                  >
                    {isLoading ? 'Saving...' : business ? 'Update Business' : 'Save Business'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext} 
                    variant="contained"
                    sx={{ 
                      backgroundColor: '#4285f4',
                      '&:hover': { backgroundColor: '#3367d6' },
                      minWidth: 100,
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Card>

          {/* Info Card */}
          <Card
            title="📋 Why setup business profile?"
            subtitle="Essential information for business setup"
            hover
            sx={{ 
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}
          >
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '0.875rem',
                }}
              >
                • Required for generating GST-compliant invoices
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '0.875rem',
                }}
              >
                • Auto-calculates CGST/SGST or IGST based on your business state
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '0.875rem',
                }}
              >
                • Professional invoices with your business details
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '0.875rem',
                }}
              >
                • Required for tax compliance and record keeping
              </Typography>
            </Stack>
          </Card>
        </Container>
      </Box>
    </MainLayout>
  )
}