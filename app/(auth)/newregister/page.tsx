// app/(auth)/newregister/page.tsx
'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  alpha,
  useTheme,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  Radio,
  Chip,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Home,
  Work,
  CalendarToday,
  Lock,
  Google,
  ArrowForward,
  CheckCircle,
  ChevronRight,
  Business,
  People,
  LocationCity,
  Favorite,
  School,
  CreditCard,
  Public,
  Tag,
  Info,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Professional color scheme
const colors = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1',
  light: {
    background: '#f5f7fa',
    surface: '#ffffff',
    textPrimary: '#212121',
    textSecondary: '#616161',
    border: '#e0e0e0',
    divider: '#eeeeee',
    hover: '#f5f5f5',
  },
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    divider: '#2d2d2d',
    hover: '#2a2a2a',
  }
}

const steps = ['Personal Details', 'Address Information', 'Professional Info', 'Preferences & Terms']

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

const relationshipOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
]

const incomeOptions = [
  { value: '<20k', label: 'Less than $20,000' },
  { value: '20k-40k', label: '$20,000 - $40,000' },
  { value: '40k-60k', label: '$40,000 - $60,000' },
  { value: '60k-80k', label: '$60,000 - $80,000' },
  { value: '80k-100k', label: '$80,000 - $100,000' },
  { value: '100k+', label: '$100,000+' },
]

const interestsOptions = [
  'Technology', 'Business', 'Health', 'Education', 'Travel',
  'Food', 'Sports', 'Music', 'Art', 'Fashion',
  'Photography', 'Gaming', 'Reading', 'Fitness', 'Cooking'
]

export default function NewRegisterPage() {
  const theme = useTheme()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string>('')

  // Determine if dark mode is active
  const isDarkMode = theme.palette.mode === 'dark'
  const currentColors = isDarkMode ? colors.dark : colors.light

  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    username: '',

    // Personal Information
    gender: 'prefer-not-to-say',
    relationshipStatus: 'single',

    // Address
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',

    // Professional Information
    occupation: '',
    companyName: '',
    jobTitle: '',
    incomeRange: '<20k',

    // Interests & Preferences
    interests: [] as string[],
    newsletterSubscription: false,
    termsAccepted: false,
    privacyAccepted: false,
  })

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSelectChange = (field: string) => (event: any) => {
    const value = event.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.checked }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const currentInterests = [...prev.interests]
      if (currentInterests.includes(interest)) {
        return { ...prev, interests: currentInterests.filter(i => i !== interest) }
      } else {
        if (currentInterests.length >= 10) return prev
        return { ...prev, interests: [...currentInterests, interest] }
      }
    })
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Personal Details
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Enter a valid email address'
        if (!formData.password) newErrors.password = 'Password is required'
        else if (formData.password.length < 8) newErrors.password = 'Use at least 8 characters'
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Must include uppercase, lowercase, and number'
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
        else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = 'Enter a valid phone number'
        }
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
        else {
          const dob = new Date(formData.dateOfBirth)
          const today = new Date()
          const age = today.getFullYear() - dob.getFullYear()
          if (age < 13) newErrors.dateOfBirth = 'Must be at least 13 years old'
        }
        if (!formData.username.trim()) newErrors.username = 'Username is required'
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters'
        else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
          newErrors.username = 'Only letters, numbers, dots and underscores'
        }
        break

      case 1: // Address
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.state.trim()) newErrors.state = 'State is required'
        if (!formData.country.trim()) newErrors.country = 'Country is required'
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
        else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Enter a valid ZIP code'
        }
        break

      case 2: // Professional
        if (formData.occupation && formData.occupation.length > 50) {
          newErrors.occupation = 'Occupation cannot exceed 50 characters'
        }
        if (formData.companyName && formData.companyName.length > 100) {
          newErrors.companyName = 'Company name cannot exceed 100 characters'
        }
        if (formData.jobTitle && formData.jobTitle.length > 50) {
          newErrors.jobTitle = 'Job title cannot exceed 50 characters'
        }
        if (!formData.incomeRange) newErrors.incomeRange = 'Please select income range'
        break

      case 3: // Preferences
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the Terms of Service'
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the Privacy Policy'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setLoading(true)
    setServerError('')

    try {
      const { confirmPassword, ...submitData } = formData

      const response = await fetch('/api/auth/newregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Registration failed')

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)

    } catch (error: any) {
      setServerError(error.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: currentColors.textPrimary, mb: 3, fontWeight: 600 }}>
              Personal Information
            </Typography>
            
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      size="small"
                      sx={{ color: currentColors.textSecondary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, color: currentColors.textPrimary }}>Gender</FormLabel>
                <Select
                  value={formData.gender}
                  onChange={handleSelectChange('gender')}
                  variant="outlined"
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, color: currentColors.textPrimary }}>Relationship Status</FormLabel>
                <Select
                  value={formData.relationshipStatus}
                  onChange={handleSelectChange('relationshipStatus')}
                  variant="outlined"
                >
                  {relationshipOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: currentColors.textPrimary, mb: 3, fontWeight: 600 }}>
              Address Information
            </Typography>
            
            <TextField
              fullWidth
              label="Street Address"
              value={formData.streetAddress}
              onChange={handleChange('streetAddress')}
              error={!!errors.streetAddress}
              helperText={errors.streetAddress}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={handleChange('city')}
                error={!!errors.city}
                helperText={errors.city}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCity sx={{ color: currentColors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={handleChange('state')}
                error={!!errors.state}
                helperText={errors.state}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={handleChange('country')}
                error={!!errors.country}
                helperText={errors.country}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Public sx={{ color: currentColors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.zipCode}
                onChange={handleChange('zipCode')}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                variant="outlined"
              />
            </Box>

            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: alpha(colors.info, 0.1),
                color: currentColors.textPrimary,
                border: `1px solid ${alpha(colors.info, 0.3)}`,
              }}
            >
              <Typography variant="body2">
                Your address information is encrypted for security and only used for verification purposes.
              </Typography>
            </Alert>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: currentColors.textPrimary, mb: 3, fontWeight: 600 }}>
              Professional Information
            </Typography>
            
            <TextField
              fullWidth
              label="Occupation"
              value={formData.occupation}
              onChange={handleChange('occupation')}
              error={!!errors.occupation}
              helperText={errors.occupation}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={handleChange('companyName')}
              error={!!errors.companyName}
              helperText={errors.companyName}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleChange('jobTitle')}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tag sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 4 }}>
              <FormLabel sx={{ mb: 1, color: currentColors.textPrimary }}>Annual Income Range</FormLabel>
              <Select
                value={formData.incomeRange}
                onChange={handleSelectChange('incomeRange')}
                variant="outlined"
                error={!!errors.incomeRange}
              >
                {incomeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.incomeRange && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.incomeRange}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: currentColors.textPrimary, mb: 2 }}>
                Interests (Select up to 10)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {interestsOptions.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    onClick={() => handleInterestToggle(interest)}
                    color={formData.interests.includes(interest) ? 'primary' : 'default'}
                    variant="outlined"
                    sx={{
                      backgroundColor: formData.interests.includes(interest) 
                        ? alpha(colors.primary, 0.1) 
                        : 'transparent',
                      borderColor: formData.interests.includes(interest) 
                        ? colors.primary 
                        : currentColors.border,
                      color: formData.interests.includes(interest) 
                        ? colors.primary 
                        : currentColors.textPrimary,
                      '&:hover': {
                        backgroundColor: formData.interests.includes(interest) 
                          ? alpha(colors.primary, 0.15)
                          : alpha(colors.primary, 0.05),
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color={currentColors.textSecondary} sx={{ mt: 2, display: 'block' }}>
                Selected: {formData.interests.length}/10
              </Typography>
            </Box>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.newsletterSubscription} 
                    onChange={handleCheckboxChange('newsletterSubscription')}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color={currentColors.textPrimary}>
                    Subscribe to newsletter for updates and offers
                  </Typography>
                }
              />
            </FormGroup>
          </Box>
        )

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: currentColors.textPrimary, mb: 3, fontWeight: 600 }}>
              Review & Agreement
            </Typography>
            
            <Card 
              sx={{ 
                mb: 4, 
                backgroundColor: alpha(colors.primary, 0.05),
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ color: currentColors.textPrimary, fontWeight: 600, mb: 3 }}>
                  Registration Summary
                </Typography>
                <Box sx={{ display: 'grid', gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Personal Information
                    </Typography>
                    <Typography variant="body1" color={currentColors.textPrimary}>
                      {formData.fullName} • {formData.gender} • {formData.relationshipStatus}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Contact
                    </Typography>
                    <Typography variant="body1" color={currentColors.textPrimary}>
                      {formData.email} • {formData.phoneNumber}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Location
                    </Typography>
                    <Typography variant="body1" color={currentColors.textPrimary}>
                      {formData.city}, {formData.state}, {formData.country}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Professional
                    </Typography>
                    <Typography variant="body1" color={currentColors.textPrimary}>
                      {formData.occupation || 'Not specified'} • {formData.companyName || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Income Range
                    </Typography>
                    <Typography variant="body1" color={currentColors.textPrimary}>
                      {incomeOptions.find(opt => opt.value === formData.incomeRange)?.label}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      Interests
                    </Typography>
                    <Typography variant="body1" color={currentColors.textPrimary}>
                      {formData.interests.length > 0 ? formData.interests.join(', ') : 'None selected'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <FormGroup sx={{ mb: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.termsAccepted} 
                    onChange={handleCheckboxChange('termsAccepted')}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color={currentColors.textPrimary}>
                    I agree to the{' '}
                    <Link 
                      href="/terms" 
                      style={{ 
                        color: colors.primary, 
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Terms of Service
                    </Link>
                  </Typography>
                }
              />
              {errors.termsAccepted && (
                <Typography color="error" variant="caption" sx={{ ml: 4 }}>
                  {errors.termsAccepted}
                </Typography>
              )}

              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.privacyAccepted} 
                    onChange={handleCheckboxChange('privacyAccepted')}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color={currentColors.textPrimary}>
                    I agree to the{' '}
                    <Link 
                      href="/privacy" 
                      style={{ 
                        color: colors.primary, 
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.privacyAccepted && (
                <Typography color="error" variant="caption" sx={{ ml: 4 }}>
                  {errors.privacyAccepted}
                </Typography>
              )}
            </FormGroup>

            <Alert 
              severity="info" 
              icon={<Info />}
              sx={{ 
                backgroundColor: alpha(colors.info, 0.1),
                color: currentColors.textPrimary,
                border: `1px solid ${alpha(colors.info, 0.3)}`,
              }}
            >
              <Typography variant="body2">
                <strong>Data Security Notice:</strong> Your sensitive information (address, phone number, date of birth, income range, and relationship status) will be encrypted using AES-256-GCM encryption for maximum security.
              </Typography>
            </Alert>
          </Box>
        )

      default:
        return null
    }
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: currentColors.background,
          p: 3,
        }}
      >
        <Card sx={{ 
          maxWidth: 500, 
          width: '100%', 
          textAlign: 'center',
          backgroundColor: currentColors.surface,
          border: `1px solid ${currentColors.border}`,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: colors.success,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 4px 20px rgba(46,125,50,0.3)',
              }}
            >
              <CheckCircle sx={{ fontSize: 40, color: '#ffffff' }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ color: currentColors.textPrimary, fontWeight: 700, mb: 2 }}>
              Registration Successful!
            </Typography>
            <Typography variant="body1" color={currentColors.textSecondary} paragraph sx={{ mb: 4 }}>
              Your account has been created successfully. Sensitive data has been encrypted for security. You'll be redirected to your dashboard shortly.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <CircularProgress size={24} sx={{ color: colors.primary }} />
              <Typography variant="body2" color={currentColors.textSecondary}>
                Setting up your account...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentColors.background,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 800, width: '100%' }}>
        {/* Main Card */}
        <Card sx={{ 
          backgroundColor: currentColors.surface,
          border: `1px solid ${currentColors.border}`,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          mb: 3,
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 4px 20px rgba(25,118,210,0.3)',
                  }}
                >
                  <Lock sx={{ fontSize: 28, color: '#ffffff' }} />
                </Box>
                <Typography variant="h4" sx={{ 
                  color: currentColors.textPrimary,
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                }}>
                  Complete Registration
                </Typography>
              </Box>
              <Typography variant="body1" color={currentColors.textSecondary} sx={{ mb: 1 }}>
                Secure registration with encrypted data protection
              </Typography>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 4 }}>
              <Stepper 
                activeStep={activeStep} 
                sx={{
                  '& .MuiStepLabel-root .Mui-active': { color: colors.primary },
                  '& .MuiStepLabel-root .Mui-completed': { color: colors.success },
                  '& .MuiStepLabel-label': { color: currentColors.textSecondary },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Server Error */}
            {serverError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 1,
                  backgroundColor: alpha(colors.error, 0.1),
                  border: `1px solid ${alpha(colors.error, 0.3)}`,
                  color: currentColors.textPrimary,
                }}
              >
                {serverError}
              </Alert>
            )}

            {/* Form Content */}
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                sx={{
                  color: currentColors.textSecondary,
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: currentColors.hover,
                  },
                  '&:disabled': {
                    color: currentColors.border,
                  },
                }}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                    textTransform: 'none',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 1,
                    boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                      boxShadow: '0 6px 20px rgba(25,118,210,0.5)',
                    },
                    '&:disabled': {
                      backgroundColor: currentColors.border,
                      color: currentColors.textSecondary,
                    },
                  }}
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ChevronRight />}
                  sx={{
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                    textTransform: 'none',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 1,
                    boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                      boxShadow: '0 6px 20px rgba(25,118,210,0.5)',
                    },
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 4, borderColor: currentColors.divider }}>
              <Typography variant="body2" color={currentColors.textSecondary}>
                Or sign up with
              </Typography>
            </Divider>

            {/* Google Sign Up */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              sx={{
                borderColor: currentColors.border,
                color: currentColors.textPrimary,
                textTransform: 'none',
                fontSize: '0.9375rem',
                fontWeight: 500,
                borderRadius: 1,
                py: 1.5,
                '&:hover': {
                  borderColor: currentColors.textSecondary,
                  backgroundColor: currentColors.hover,
                },
              }}
            >
              Sign up with Google
            </Button>
          </CardContent>
        </Card>

        {/* Login Link */}
        <Card sx={{ 
          backgroundColor: currentColors.surface,
          border: `1px solid ${currentColors.border}`,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}>
          <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
            <Typography variant="body1" color={currentColors.textPrimary}>
              Already have an account?{' '}
              <Link 
                href="/login" 
                style={{ 
                  color: colors.primary,
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" color={currentColors.textSecondary}>
            🔒 All sensitive data is encrypted using AES-256-GCM. We never store plain text passwords.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}