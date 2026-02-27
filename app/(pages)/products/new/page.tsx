// app/products/new/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Alert,
  useTheme,
  alpha,
  Button,
  Stack,
  Breadcrumbs,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Card as MuiCard,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Collapse,
  Fade,
  Zoom,
  LinearProgress,
  Badge,
  Avatar,
} from '@mui/material'
import {
  // Core Icons
  Inventory as InventoryIcon,
  Save as SaveIcon,
  ArrowBack,
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Description as DescIcon,
  AttachMoney as PriceIcon,
  Receipt as ReceiptIcon,
  Scale as WeightIcon,
  CalendarToday as DateIcon,
  QrCode as SkuIcon,
  // GST Icons
  AccountBalance as GstIcon,
  Percent as PercentIcon,
  // Variation Icons
  Style as VariationIcon,
  ColorLens as ColorIcon,
  Straighten as SizeIcon,
  // Batch Icons
  BatchPrediction as BatchIcon,
  Factory as MfgIcon,
  Event as ExpiryIcon,
  // Action Icons
  Send as SendIcon,
  Clear as ClearIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  RocketLaunch as RocketIcon,
  // Status Icons
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Verified as VerifiedIcon,
  Error as ErrorIcon,
  WarningAmber as WarningAmberIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/Layout/MainLayout'
import {
  GoogleHubContainer,
  GoogleHubHeader,
  GoogleHubCard,
  GoogleHubAlert,
  GoogleHubSection,
} from '@/components/googlehub'
import { googleColors } from '@/components/googlehub/types'

// ===== INTERFACES =====

interface GSTDetails {
  type: 'cgst_sgst' | 'igst' | 'utgst'
  hsnCode: string
  cgstRate: number
  sgstRate: number
  igstRate: number
  utgstRate: number
}

interface Variation {
  id: string
  name: string
  sku: string
  price: number
  costPrice: number
  stock: number
  weight?: number
  attributes: Record<string, string>
}

interface Batch {
  id: string
  batchNumber: string
  quantity: number
  costPrice: number
  sellingPrice: number
  mfgDate: string
  expDate: string
  receivedDate: string
}

// ===== COMMON CATEGORIES =====

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Food & Beverages',
  'Furniture',
  'Books',
  'Toys',
  'Sports',
  'Beauty',
  'Healthcare',
  'Automotive',
  'Tools',
  'Stationery',
  'Gifts',
  'Pet Supplies',
  'Others',
]

const GST_RATES = [0, 5, 12, 18, 28]

// ===== STEP VALIDATION FUNCTIONS =====

interface StepValidation {
  isComplete: boolean
  missingFields: string[]
}

const validateStep1 = (formData: any): StepValidation => {
  const missingFields: string[] = []
  
  if (!formData.name?.trim()) missingFields.push('Product Name')
  if (!formData.category) missingFields.push('Category')
  if (!formData.hsnCode?.trim()) missingFields.push('HSN Code')
  
  return {
    isComplete: missingFields.length === 0,
    missingFields
  }
}

const validateStep2 = (formData: any): StepValidation => {
  const missingFields: string[] = []
  
  if (!formData.basePrice || Number(formData.basePrice) <= 0) missingFields.push('Selling Price')
  
  return {
    isComplete: missingFields.length === 0,
    missingFields
  }
}

const validateStep3 = (formData: any): StepValidation => {
  const missingFields: string[] = []
  
  if (formData.hasVariations) {
    formData.variations.forEach((variation: Variation, index: number) => {
      if (!variation.name?.trim()) missingFields.push(`Variation ${index + 1} Name`)
      if (!variation.price || variation.price <= 0) missingFields.push(`Variation ${index + 1} Price`)
    })
  }
  
  if (formData.hasBatches) {
    formData.batches.forEach((batch: Batch, index: number) => {
      if (!batch.batchNumber?.trim()) missingFields.push(`Batch ${index + 1} Number`)
      if (!batch.quantity || batch.quantity <= 0) missingFields.push(`Batch ${index + 1} Quantity`)
    })
  }
  
  return {
    isComplete: missingFields.length === 0,
    missingFields
  }
}

const validateStep4 = (formData: any): StepValidation => {
  return {
    isComplete: true,
    missingFields: []
  }
}

// ===== MAIN COMPONENT =====

export default function NewProductPage() {
  const theme = useTheme()
  const router = useRouter()
  const darkMode = theme.palette.mode === 'dark'
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    
    // Pricing
    basePrice: '',
    baseCostPrice: '',
    
    // GST
    gstType: 'cgst_sgst' as 'cgst_sgst' | 'igst' | 'utgst',
    hsnCode: '',
    cgstRate: 18,
    sgstRate: 18,
    igstRate: 18,
    utgstRate: 18,
    
    // Variations
    hasVariations: false,
    variations: [] as Variation[],
    
    // Batches
    hasBatches: false,
    batches: [] as Batch[],
    
    // Additional
    tags: '',
    isReturnable: true,
    returnPeriod: 7,
    sku: '',
  })

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Track completed steps
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false])
  
  // Step validation
  const stepValidations = [
    validateStep1(formData),
    validateStep2(formData),
    validateStep3(formData),
    validateStep4(formData),
  ]

  // Update completed steps when form data changes
  useEffect(() => {
    const newCompletedSteps = stepValidations.map(v => v.isComplete)
    setCompletedSteps(newCompletedSteps)
  }, [formData])

  const steps = [
    {
      label: 'Basic Information',
      description: 'Product name, category, and HSN code',
      icon: <DescIcon />,
      color: googleColors.blue,
    },
    {
      label: 'Pricing & GST',
      description: 'Set your prices and tax details',
      icon: <PriceIcon />,
      color: googleColors.green,
    },
    {
      label: 'Inventory Details',
      description: 'Add variations, batches, and stock',
      icon: <InventoryIcon />,
      color: googleColors.orange,
    },
    {
      label: 'Additional Info',
      description: 'Tags, return policy, and review',
      icon: <InfoIcon />,
      color: googleColors.purple,
    },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic Info validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.hsnCode.trim()) {
      newErrors.hsnCode = 'HSN Code is required'
    } else if (!/^\d{4,8}$/.test(formData.hsnCode)) {
      newErrors.hsnCode = 'HSN Code should be 4-8 digits'
    }

    // Pricing validation
    if (!formData.basePrice || Number(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Valid base price is required'
    }
    if (formData.baseCostPrice && Number(formData.baseCostPrice) > Number(formData.basePrice)) {
      newErrors.baseCostPrice = 'Cost price should be less than selling price'
    }

    // Variations validation
    if (formData.hasVariations) {
      formData.variations.forEach((variation, index) => {
        if (!variation.name.trim()) {
          newErrors[`variation_${index}_name`] = 'Variation name required'
        }
        if (variation.price <= 0) {
          newErrors[`variation_${index}_price`] = 'Valid price required'
        }
      })
    }

    // Batches validation
    if (formData.hasBatches) {
      formData.batches.forEach((batch, index) => {
        if (!batch.batchNumber.trim()) {
          newErrors[`batch_${index}_number`] = 'Batch number required'
        }
        if (batch.quantity <= 0) {
          newErrors[`batch_${index}_quantity`] = 'Valid quantity required'
        }
        if (batch.expDate && new Date(batch.expDate) < new Date()) {
          newErrors[`batch_${index}_expDate`] = 'Expiry date should be in future'
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fix the errors before submitting')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Prepare data for API
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subCategory: formData.subCategory,
        brand: formData.brand,
        basePrice: Number(formData.basePrice),
        baseCostPrice: Number(formData.baseCostPrice) || 0,
        sku: formData.sku || undefined,
        gstDetails: {
          type: formData.gstType,
          hsnCode: formData.hsnCode.trim(),
          cgstRate: Number(formData.cgstRate),
          sgstRate: Number(formData.sgstRate),
          igstRate: Number(formData.igstRate),
          utgstRate: Number(formData.utgstRate),
        },
        variations: formData.hasVariations ? formData.variations.map(v => ({
          name: v.name,
          sku: v.sku,
          price: v.price,
          costPrice: v.costPrice || 0,
          stock: v.stock || 0,
          weight: v.weight,
        })) : [],
        batches: formData.hasBatches ? formData.batches.map(b => ({
          batchNumber: b.batchNumber,
          quantity: b.quantity,
          costPrice: b.costPrice,
          sellingPrice: b.sellingPrice,
          mfgDate: b.mfgDate,
          expDate: b.expDate,
          receivedDate: b.receivedDate || new Date().toISOString().split('T')[0],
        })) : [],
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        isReturnable: formData.isReturnable,
        returnPeriod: formData.returnPeriod,
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product')
      }

      setSuccess(true)
      
      // Show success message and redirect after delay
      setTimeout(() => {
        router.push('/products')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNext = () => {
    const validation = stepValidations[activeStep]
    if (!validation.isComplete) {
      setError(`Please complete: ${validation.missingFields.join(', ')}`)
      return
    }
    setError(null)
    setActiveStep(prev => prev + 1)
  }

  const handleBack = () => {
    setError(null)
    setActiveStep(prev => prev - 1)
  }

  // Variation handlers
  const addVariation = () => {
    const newVariation: Variation = {
      id: Date.now().toString(),
      name: '',
      sku: '',
      price: 0,
      costPrice: 0,
      stock: 0,
      attributes: {},
    }
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, newVariation],
    }))
  }

  const updateVariation = (index: number, field: keyof Variation, value: any) => {
    setFormData(prev => {
      const newVariations = [...prev.variations]
      newVariations[index] = { ...newVariations[index], [field]: value }
      return { ...prev, variations: newVariations }
    })
  }

  const removeVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }))
  }

  // Batch handlers
  const addBatch = () => {
    const today = new Date().toISOString().split('T')[0]
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    
    const newBatch: Batch = {
      id: Date.now().toString(),
      batchNumber: '',
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      mfgDate: today,
      expDate: nextYear.toISOString().split('T')[0],
      receivedDate: today,
    }
    setFormData(prev => ({
      ...prev,
      batches: [...prev.batches, newBatch],
    }))
  }

  const updateBatch = (index: number, field: keyof Batch, value: any) => {
    setFormData(prev => {
      const newBatches = [...prev.batches]
      newBatches[index] = { ...newBatches[index], [field]: value }
      return { ...prev, batches: newBatches }
    })
  }

  const removeBatch = (index: number) => {
    setFormData(prev => ({
      ...prev,
      batches: prev.batches.filter((_, i) => i !== index),
    }))
  }

  // Calculate overall progress
  const completedCount = completedSteps.filter(Boolean).length
  const progressPercentage = (completedCount / steps.length) * 100

  return (
    <MainLayout title="Add New Product">
      <GoogleHubContainer>
        {/* Header */}
        <GoogleHubHeader
          title="Add New Product"
          subtitle="Create a new product with all necessary details"
          icon={<InventoryIcon />}
          breadcrumbs={[
            { label: 'Products', href: '/products' },
            { label: 'Add New' },
          ]}
          stats={[
            {
              label: 'Progress',
              value: `${completedCount}/${steps.length} Steps`,
              color: googleColors.blue,
              icon: <CheckCircleIcon />,
            },
          ]}
        />

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Form Completion
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: googleColors.blue }}>
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(googleColors.blue, 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: googleColors.blue,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Success Message */}
        <Fade in={success}>
          <Box sx={{ mb: 3 }}>
            <GoogleHubAlert
              type="success"
              title="Product Created Successfully!"
              message="Your product has been added. Redirecting to products page..."
            />
          </Box>
        </Fade>

        {/* Error Alert */}
        {error && !success && (
          <GoogleHubAlert
            type="error"
            title="Cannot Proceed"
            message={error}
            onClose={() => setError(null)}
            sx={{ mb: 3 }}
          />
        )}

        {/* Main Form */}
        <GoogleHubCard sx={{ p: 0, overflow: 'hidden' }}>
          {/* Stepper Header */}
          <Box sx={{ 
            p: 3, 
            pb: 0,
            background: darkMode ? alpha(googleColors.greyDark, 0.5) : alpha(googleColors.greyLight, 0.5),
            borderBottom: `1px solid ${darkMode ? googleColors.greyDark : googleColors.greyBorder}`,
          }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          completedSteps[index] ? (
                            <CheckCircleIcon sx={{ fontSize: 16, color: googleColors.green }} />
                          ) : null
                        }
                      >
                        <Avatar
                          sx={{
                            bgcolor: activeStep === index 
                              ? step.color 
                              : completedSteps[index]
                              ? googleColors.green
                              : darkMode ? googleColors.greyDark : googleColors.greyLight,
                            color: activeStep === index || completedSteps[index]
                              ? '#fff'
                              : darkMode ? '#9aa0a6' : googleColors.grey,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {step.icon}
                        </Avatar>
                      </Badge>
                    )}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {step.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step Content */}
          <Box sx={{ p: 4 }}>
            {/* Step 1: Basic Information */}
            {activeStep === 0 && (
              <Fade in={true}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DescIcon sx={{ color: steps[0].color }} />
                    <Typography variant="h6" fontWeight={600}>
                      Basic Information
                    </Typography>
                    {!completedSteps[0] && (
                      <Chip
                        icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                        label="Required"
                        size="small"
                        sx={{ bgcolor: alpha(googleColors.red, 0.1), color: googleColors.red }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {/* Product Name */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="Product Name *"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <InventoryIcon sx={{ color: googleColors.blue }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    {/* SKU */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="SKU (Stock Keeping Unit)"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        placeholder="e.g., PROD-001"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SkuIcon sx={{ color: googleColors.purple }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Enter product description..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescIcon sx={{ color: googleColors.teal }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {/* Category */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 12px)' } }}>
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel>Category *</InputLabel>
                        <Select
                          value={formData.category}
                          label="Category *"
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          startAdornment={
                            <InputAdornment position="start">
                              <CategoryIcon sx={{ color: googleColors.blue }} />
                            </InputAdornment>
                          }
                        >
                          {PRODUCT_CATEGORIES.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                          ))}
                        </Select>
                        {errors.category && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.category}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>

                    {/* Sub Category */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="Sub Category"
                        value={formData.subCategory}
                        onChange={(e) => handleInputChange('subCategory', e.target.value)}
                        placeholder="e.g., Smartphones, T-Shirts"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CategoryIcon sx={{ color: googleColors.green }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    {/* Brand */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="Brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        placeholder="e.g., Apple, Nike"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TagIcon sx={{ color: googleColors.orange }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Missing Fields Warning */}
                  {!completedSteps[0] && stepValidations[0].missingFields.length > 0 && (
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: alpha(googleColors.red, 0.05),
                      border: `1px solid ${alpha(googleColors.red, 0.2)}`,
                      borderRadius: 2,
                    }}>
                      <Typography variant="body2" sx={{ color: googleColors.red, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmberIcon sx={{ fontSize: 18 }} />
                        Please fill in: {stepValidations[0].missingFields.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Fade>
            )}

            {/* Step 2: Pricing & GST */}
            {activeStep === 1 && (
              <Fade in={true}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PriceIcon sx={{ color: steps[1].color }} />
                    <Typography variant="h6" fontWeight={600}>
                      Pricing & GST Details
                    </Typography>
                    {!completedSteps[1] && (
                      <Chip
                        icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                        label="Required"
                        size="small"
                        sx={{ bgcolor: alpha(googleColors.red, 0.1), color: googleColors.red }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {/* Base Price */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="Selling Price *"
                        type="number"
                        value={formData.basePrice}
                        onChange={(e) => handleInputChange('basePrice', e.target.value)}
                        error={!!errors.basePrice}
                        helperText={errors.basePrice}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PriceIcon sx={{ color: googleColors.green }} />
                            </InputAdornment>
                          ),
                          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                        }}
                      />
                    </Box>

                    {/* Cost Price */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="Cost Price"
                        type="number"
                        value={formData.baseCostPrice}
                        onChange={(e) => handleInputChange('baseCostPrice', e.target.value)}
                        error={!!errors.baseCostPrice}
                        helperText={errors.baseCostPrice || 'Price you paid to acquire'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PriceIcon sx={{ color: googleColors.red }} />
                            </InputAdornment>
                          ),
                          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* HSN Code */}
                  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      fullWidth
                      label="HSN Code *"
                      value={formData.hsnCode}
                      onChange={(e) => handleInputChange('hsnCode', e.target.value.toUpperCase())}
                      error={!!errors.hsnCode}
                      helperText={errors.hsnCode || '4-8 digit HSN/SAC code'}
                      placeholder="e.g., 8517, 9983"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptIcon sx={{ color: googleColors.purple }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* GST Type */}
                  <FormControl fullWidth>
                    <InputLabel>GST Type</InputLabel>
                    <Select
                      value={formData.gstType}
                      label="GST Type"
                      onChange={(e) => handleInputChange('gstType', e.target.value)}
                    >
                      <MenuItem value="cgst_sgst">CGST + SGST (Intra-State)</MenuItem>
                      <MenuItem value="igst">IGST (Inter-State)</MenuItem>
                      <MenuItem value="utgst">UTGST (Union Territory)</MenuItem>
                    </Select>
                  </FormControl>

                  {/* GST Rates */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {formData.gstType === 'cgst_sgst' && (
                      <>
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                          <FormControl fullWidth>
                            <InputLabel>CGST Rate (%)</InputLabel>
                            <Select
                              value={formData.cgstRate}
                              label="CGST Rate (%)"
                              onChange={(e) => handleInputChange('cgstRate', e.target.value)}
                            >
                              {GST_RATES.map(rate => (
                                <MenuItem key={rate} value={rate}>{rate}%</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                          <FormControl fullWidth>
                            <InputLabel>SGST Rate (%)</InputLabel>
                            <Select
                              value={formData.sgstRate}
                              label="SGST Rate (%)"
                              onChange={(e) => handleInputChange('sgstRate', e.target.value)}
                            >
                              {GST_RATES.map(rate => (
                                <MenuItem key={rate} value={rate}>{rate}%</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </>
                    )}

                    {formData.gstType === 'igst' && (
                      <Box sx={{ width: '100%' }}>
                        <FormControl fullWidth>
                          <InputLabel>IGST Rate (%)</InputLabel>
                          <Select
                            value={formData.igstRate}
                            label="IGST Rate (%)"
                            onChange={(e) => handleInputChange('igstRate', e.target.value)}
                          >
                            {GST_RATES.map(rate => (
                              <MenuItem key={rate} value={rate}>{rate}%</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}

                    {formData.gstType === 'utgst' && (
                      <Box sx={{ width: '100%' }}>
                        <FormControl fullWidth>
                          <InputLabel>UTGST Rate (%)</InputLabel>
                          <Select
                            value={formData.utgstRate}
                            label="UTGST Rate (%)"
                            onChange={(e) => handleInputChange('utgstRate', e.target.value)}
                          >
                            {GST_RATES.map(rate => (
                              <MenuItem key={rate} value={rate}>{rate}%</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                  </Box>

                  {/* Missing Fields Warning */}
                  {!completedSteps[1] && stepValidations[1].missingFields.length > 0 && (
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: alpha(googleColors.red, 0.05),
                      border: `1px solid ${alpha(googleColors.red, 0.2)}`,
                      borderRadius: 2,
                    }}>
                      <Typography variant="body2" sx={{ color: googleColors.red, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmberIcon sx={{ fontSize: 18 }} />
                        Please fill in: {stepValidations[1].missingFields.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Fade>
            )}

            {/* Step 3: Inventory Details */}
            {activeStep === 2 && (
              <Fade in={true}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <InventoryIcon sx={{ color: steps[2].color }} />
                    <Typography variant="h6" fontWeight={600}>
                      Inventory Details
                    </Typography>
                  </Box>

                  {/* Variations Toggle */}
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: alpha(googleColors.purple, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(googleColors.purple, 0.2)}`,
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasVariations}
                          onChange={(e) => handleInputChange('hasVariations', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            This product has variations
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            For products with different sizes, colors, or styles
                          </Typography>
                        </Box>
                      }
                    />
                    {formData.hasVariations && (
                      <Chip
                        icon={<VariationIcon />}
                        label={`${formData.variations.length} variations added`}
                        size="small"
                        sx={{ mt: 1, bgcolor: alpha(googleColors.purple, 0.1), color: googleColors.purple }}
                      />
                    )}
                  </Box>

                  {/* Variations Section */}
                  <Collapse in={formData.hasVariations}>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Product Variations
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddCircleIcon />}
                          onClick={addVariation}
                          sx={{ borderColor: googleColors.purple, color: googleColors.purple }}
                        >
                          Add Variation
                        </Button>
                      </Box>

                      {formData.variations.map((variation, index) => (
                        <GoogleHubCard key={variation.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: googleColors.purple }}>
                              Variation {index + 1}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => removeVariation(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Variation Name *"
                                value={variation.name}
                                onChange={(e) => updateVariation(index, 'name', e.target.value)}
                                placeholder="e.g., Small, Red, 1GB"
                                error={!!errors[`variation_${index}_name`]}
                                helperText={errors[`variation_${index}_name`]}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="SKU"
                                value={variation.sku}
                                onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                                placeholder="e.g., PROD-RED-S"
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Price *"
                                type="number"
                                value={variation.price}
                                onChange={(e) => updateVariation(index, 'price', Number(e.target.value))}
                                error={!!errors[`variation_${index}_price`]}
                                helperText={errors[`variation_${index}_price`]}
                                InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Cost Price"
                                type="number"
                                value={variation.costPrice}
                                onChange={(e) => updateVariation(index, 'costPrice', Number(e.target.value))}
                                InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Stock"
                                type="number"
                                value={variation.stock}
                                onChange={(e) => updateVariation(index, 'stock', Number(e.target.value))}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Weight (kg)"
                                type="number"
                                value={variation.weight || ''}
                                onChange={(e) => updateVariation(index, 'weight', Number(e.target.value))}
                              />
                            </Box>
                          </Box>
                        </GoogleHubCard>
                      ))}

                      {formData.variations.length === 0 && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                          No variations added. Click "Add Variation" to create variations.
                        </Typography>
                      )}
                    </Box>
                  </Collapse>

                  {/* Batches Toggle */}
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: alpha(googleColors.teal, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(googleColors.teal, 0.2)}`,
                    mt: 2,
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasBatches}
                          onChange={(e) => handleInputChange('hasBatches', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            This product has batches
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            For products with expiry dates or batch tracking
                          </Typography>
                        </Box>
                      }
                    />
                    {formData.hasBatches && (
                      <Chip
                        icon={<BatchIcon />}
                        label={`${formData.batches.length} batches added`}
                        size="small"
                        sx={{ mt: 1, bgcolor: alpha(googleColors.teal, 0.1), color: googleColors.teal }}
                      />
                    )}
                  </Box>

                  {/* Batches Section */}
                  <Collapse in={formData.hasBatches}>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Product Batches
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddCircleIcon />}
                          onClick={addBatch}
                          sx={{ borderColor: googleColors.teal, color: googleColors.teal }}
                        >
                          Add Batch
                        </Button>
                      </Box>

                      {formData.batches.map((batch, index) => (
                        <GoogleHubCard key={batch.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: googleColors.teal }}>
                              Batch {index + 1}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => removeBatch(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Batch Number *"
                                value={batch.batchNumber}
                                onChange={(e) => updateBatch(index, 'batchNumber', e.target.value)}
                                error={!!errors[`batch_${index}_number`]}
                                helperText={errors[`batch_${index}_number`]}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Quantity *"
                                type="number"
                                value={batch.quantity}
                                onChange={(e) => updateBatch(index, 'quantity', Number(e.target.value))}
                                error={!!errors[`batch_${index}_quantity`]}
                                helperText={errors[`batch_${index}_quantity`]}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Cost Price"
                                type="number"
                                value={batch.costPrice}
                                onChange={(e) => updateBatch(index, 'costPrice', Number(e.target.value))}
                                InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Selling Price"
                                type="number"
                                value={batch.sellingPrice}
                                onChange={(e) => updateBatch(index, 'sellingPrice', Number(e.target.value))}
                                InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Manufacturing Date"
                                type="date"
                                value={batch.mfgDate}
                                onChange={(e) => updateBatch(index, 'mfgDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 11px)' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Expiry Date"
                                type="date"
                                value={batch.expDate}
                                onChange={(e) => updateBatch(index, 'expDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors[`batch_${index}_expDate`]}
                                helperText={errors[`batch_${index}_expDate`]}
                              />
                            </Box>
                          </Box>
                        </GoogleHubCard>
                      ))}

                      {formData.batches.length === 0 && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                          No batches added. Click "Add Batch" to create batches.
                        </Typography>
                      )}
                    </Box>
                  </Collapse>

                  {/* Missing Fields Warning */}
                  {!completedSteps[2] && stepValidations[2].missingFields.length > 0 && (
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: alpha(googleColors.red, 0.05),
                      border: `1px solid ${alpha(googleColors.red, 0.2)}`,
                      borderRadius: 2,
                      mt: 2,
                    }}>
                      <Typography variant="body2" sx={{ color: googleColors.red, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmberIcon sx={{ fontSize: 18 }} />
                        Please complete: {stepValidations[2].missingFields.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Fade>
            )}

            {/* Step 4: Additional Info */}
            {activeStep === 3 && (
              <Fade in={true}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <InfoIcon sx={{ color: steps[3].color }} />
                    <Typography variant="h6" fontWeight={600}>
                      Additional Information
                    </Typography>
                  </Box>

                  {/* Tags */}
                  <TextField
                    fullWidth
                    label="Tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas (e.g., electronics, new, sale)"
                    helperText="Tags help customers find your products"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TagIcon sx={{ color: googleColors.blue }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Return Policy */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.isReturnable}
                            onChange={(e) => handleInputChange('isReturnable', e.target.checked)}
                          />
                        }
                        label="Product is returnable"
                      />
                    </Box>

                    {formData.isReturnable && (
                      <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                        <TextField
                          fullWidth
                          label="Return Period (days)"
                          type="number"
                          value={formData.returnPeriod}
                          onChange={(e) => handleInputChange('returnPeriod', Number(e.target.value))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DateIcon sx={{ color: googleColors.orange }} />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">days</InputAdornment>,
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Summary */}
                  <GoogleHubCard gradient sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Product Summary
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Name</Typography>
                        <Typography variant="body2" fontWeight={500}>{formData.name || 'Not set'}</Typography>
                      </Box>
                      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Category</Typography>
                        <Typography variant="body2" fontWeight={500}>{formData.category || 'Not set'}</Typography>
                      </Box>
                      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Price</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          ₹{Number(formData.basePrice).toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>HSN Code</Typography>
                        <Typography variant="body2" fontWeight={500}>{formData.hsnCode || 'Not set'}</Typography>
                      </Box>
                      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Variations</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formData.hasVariations ? formData.variations.length : 'None'}
                        </Typography>
                      </Box>
                      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Batches</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formData.hasBatches ? formData.batches.length : 'None'}
                        </Typography>
                      </Box>
                    </Box>
                  </GoogleHubCard>
                </Stack>
              </Fade>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ 
            p: 3, 
            borderTop: `1px solid ${darkMode ? googleColors.greyDark : googleColors.greyBorder}`,
            background: darkMode ? alpha(googleColors.greyDark, 0.5) : alpha(googleColors.greyLight, 0.5),
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep === steps.length - 1 ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => router.back()}
                      startIcon={<ClearIcon />}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading || !completedSteps.every(Boolean)}
                      startIcon={loading ? null : <SaveIcon />}
                      sx={{ 
                        bgcolor: googleColors.greenLight,
                        '&:hover': { bgcolor: googleColors.green },
                      }}
                    >
                      {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!completedSteps[activeStep]}
                    endIcon={<SendIcon />}
                    sx={{ bgcolor: googleColors.blue }}
                  >
                    Next Step
                  </Button>
                )}
              </Box>
            </Box>

            {/* Progress Indicators */}
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              {steps.map((_, index) => (
                <Tooltip key={index} title={`Step ${index + 1}: ${completedSteps[index] ? 'Completed' : 'Incomplete'}`}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      bgcolor: index === activeStep 
                        ? steps[index].color
                        : completedSteps[index]
                        ? googleColors.green
                        : darkMode ? googleColors.greyDark : googleColors.greyBorder,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => {
                      if (completedSteps[index] || index < activeStep) {
                        setActiveStep(index)
                      }
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        </GoogleHubCard>

        {/* Quick Tips */}
        <GoogleHubCard sx={{ mt: 3, p: 2, background: alpha(googleColors.blue, 0.05) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <RocketIcon sx={{ color: googleColors.blue }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Pro Tip:</strong> Add variations for products with different sizes/colors, and batches for products with expiry dates.
            </Typography>
          </Box>
        </GoogleHubCard>
      </GoogleHubContainer>
    </MainLayout>
  )
}