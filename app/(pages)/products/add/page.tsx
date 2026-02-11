'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Avatar,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
} from '@mui/material'
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Check as CheckIcon,
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import ProductBasicInfo from '@/components/products/ProductBasicInfo'
import ProductVariations from '@/components/products/ProductVariations'
import ProductBatches from '@/components/products/ProductBatches'
import ProductGST from '@/components/products/ProductGST'
import ProductReview from '@/components/products/ProductReview'
import { useProducts } from '@/hooks/useProducts'
import { useRouter } from 'next/navigation'

// Custom Step Icon Component
const CustomStepIcon = (props: StepIconProps) => {
  const { active, completed, className, icon } = props;
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const icons: { [index: string]: React.ReactElement } = {
    1: <DescriptionIcon />,
    2: <ReceiptIcon />,
    3: <LocalOfferIcon />,
    4: <InventoryIcon />,
    5: <SaveIcon />,
  };

  return (
    <Avatar
      sx={{
        width: 36,
        height: 36,
        backgroundColor: completed
          ? darkMode ? '#34a853' : '#34a853'
          : active
          ? darkMode ? '#8ab4f8' : '#1a73e8'
          : darkMode ? '#3c4043' : '#e8eaed',
        color: completed || active
          ? darkMode ? '#202124' : '#ffffff'
          : darkMode ? '#9aa0a6' : '#5f6368',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
      }}
      className={className}
    >
      {completed ? <CheckIcon /> : icons[String(icon)]}
    </Avatar>
  );
};

const steps = [
  {
    label: 'Basic Information',
    description: 'Product details, pricing & category'
  },
  {
    label: 'GST Details',
    description: 'Tax information & HSN code'
  },
  {
    label: 'Product Variations',
    description: 'SKU, size, color & stock'
  },
  {
    label: 'Inventory Batches',
    description: 'Batch numbers & expiry dates'
  },
  {
    label: 'Review & Save',
    description: 'Verify and publish product'
  }
]

export default function AddProductPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { 
    addProduct, 
    isAdding, 
    error, 
    clearError 
  } = useProducts()
  
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  })

  const [productData, setProductData] = useState({
    // Basic Info
    name: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    basePrice: 0,
    baseCostPrice: 0,
    tags: [] as string[],
    isReturnable: false,
    returnPeriod: 0,
    
    // GST Details
    gstDetails: {
      type: 'cgst_sgst' as const,
      hsnCode: '',
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      utgstRate: 0
    },
    
    // Variations
    variations: [] as any[],
    
    // Batches
    batches: [] as any[]
  })

  const handleNext = () => {
    // Clear any previous errors
    clearError()
    
    // Validate current step before proceeding
    if (activeStep === 0) {
      if (!productData.name.trim()) {
        showSnackbar('Product name is required', 'error')
        return
      }
      if (!productData.category.trim()) {
        showSnackbar('Category is required', 'error')
        return
      }
      if (productData.basePrice <= 0) {
        showSnackbar('Valid base price is required', 'error')
        return
      }
    }
    
    if (activeStep === 1) {
      if (!productData.gstDetails.hsnCode.trim()) {
        showSnackbar('HSN Code is required', 'error')
        return
      }
    }

    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    clearError()
    setActiveStep((prev) => prev - 1)
  }

  const handleDataChange = (newData: any) => {
    setProductData(prev => ({ ...prev, ...newData }))
  }

  const handleSaveProduct = async () => {
    try {
      // Clear previous errors
      clearError()
      
      // Final validation
      const validationErrors: string[] = []
      
      if (!productData.name.trim()) validationErrors.push('Product name is required')
      if (!productData.category.trim()) validationErrors.push('Category is required')
      if (!productData.gstDetails.hsnCode.trim()) validationErrors.push('HSN Code is required')
      if (!productData.basePrice || productData.basePrice <= 0) validationErrors.push('Valid base price is required')

      if (validationErrors.length > 0) {
        showSnackbar(validationErrors.join(', '), 'error')
        return
      }

      // Prepare the product data for API
      const productToSave = {
        name: productData.name.trim(),
        description: productData.description?.trim() || '',
        category: productData.category.trim(),
        subCategory: productData.subCategory?.trim() || '',
        brand: productData.brand?.trim() || '',
        basePrice: Number(productData.basePrice),
        baseCostPrice: Number(productData.baseCostPrice) || 0,
        gstDetails: {
          type: productData.gstDetails.type || 'cgst_sgst',
          hsnCode: productData.gstDetails.hsnCode.trim(),
          cgstRate: Number(productData.gstDetails.cgstRate) || 0,
          sgstRate: Number(productData.gstDetails.sgstRate) || 0,
          igstRate: Number(productData.gstDetails.igstRate) || 0,
          utgstRate: Number(productData.gstDetails.utgstRate) || 0,
        },
        variations: productData.variations?.map(variation => ({
          ...variation,
          price: Number(variation.price),
          costPrice: Number(variation.costPrice),
          stock: Number(variation.stock),
          weight: variation.weight ? Number(variation.weight) : undefined,
        })) || [],
        batches: productData.batches?.map(batch => ({
          ...batch,
          quantity: Number(batch.quantity),
          costPrice: Number(batch.costPrice),
          sellingPrice: Number(batch.sellingPrice),
          mfgDate: new Date(batch.mfgDate),
          expDate: new Date(batch.expDate),
          receivedDate: new Date(batch.receivedDate || Date.now()),
        })) || [],
        tags: productData.tags || [],
        isReturnable: Boolean(productData.isReturnable),
        returnPeriod: Number(productData.returnPeriod) || 0,
      }

      console.log('Saving product:', productToSave)

      // Call the addProduct mutation
      await addProduct(productToSave, {
        onSuccess: () => {
          showSnackbar('Product added successfully!', 'success')
          
          // Redirect to products page after a short delay
          setTimeout(() => {
            router.push('/products')
          }, 2000)
        },
        onError: (error: Error) => {
          // Error is already handled in the hook, but we can show a snackbar too
          showSnackbar(error.message || 'Failed to save product', 'error')
        }
      })

    } catch (error: any) {
      console.error('Error saving product:', error)
      showSnackbar(error.message || 'Failed to save product', 'error')
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleBackClick = () => {
    router.back()
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ProductBasicInfo data={productData} onChange={handleDataChange} />
      case 1:
        return <ProductGST data={productData} onChange={handleDataChange} />
      case 2:
        return <ProductVariations data={productData} onChange={handleDataChange} />
      case 3:
        return <ProductBatches data={productData} onChange={handleDataChange} />
      case 4:
        return (
          <ProductReview 
            data={productData} 
            onSave={handleSaveProduct} 
            isLoading={isAdding} 
          />
        )
      default:
        return null
    }
  }

  // Show error from hook if any
  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error')
      clearError()
    }
  }, [error, clearError])

  return (
    <MainLayout title="Add New Product">
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header - Google Material Design Style */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title="Back to Products">
              <IconButton
                onClick={handleBackClick}
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '12px',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <BackIcon sx={{ color: darkMode ? '#e8eaed' : '#202124' }} />
              </IconButton>
            </Tooltip>
            <Breadcrumbs>
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </MuiLink>
              <MuiLink
                component={Link}
                href="/products"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              >
                Products
              </MuiLink>
              <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                Add New
              </Typography>
            </Breadcrumbs>
          </Stack>

          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={500}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                letterSpacing: '-0.5px',
                mb: 1,
              }}
            >
              Add New Product
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
              Complete all steps to add a new product with variations and inventory
            </Typography>
          </Box>
        </Stack>

        {/* Stepper - Google Material Design Style */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 4,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            connector={!isMobile ? (
              <StepConnector
                sx={{
                  [`& .${stepConnectorClasses.line}`]: {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    borderTopWidth: 2,
                  },
                  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
                    borderColor: darkMode ? '#34a853' : '#34a853',
                  },
                }}
              />
            ) : undefined}
            sx={{
              '& .MuiStepLabel-root': {
                p: 0,
              },
              '& .MuiStepLabel-labelContainer': {
                '& .MuiStepLabel-label': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&.Mui-active': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    fontWeight: 600,
                  },
                  '&.Mui-completed': {
                    color: darkMode ? '#34a853' : '#34a853',
                  },
                },
                '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
                  mt: 1,
                },
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        color: activeStep === index
                          ? darkMode ? '#8ab4f8' : '#1a73e8'
                          : darkMode ? '#e8eaed' : '#202124',
                      }}
                    >
                      {step.label}
                    </Typography>
                    {!isMobile && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          mt: 0.5,
                        }}
                      >
                        {step.description}
                      </Typography>
                    )}
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content - Google Material Design Style */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
            position: 'relative',
            minHeight: 400,
          }}
        >
          {getStepContent(activeStep)}

          {/* Navigation Buttons - Google Material Design Style */}
          {activeStep < steps.length - 1 && (
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 4 }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
                sx={{
                  borderRadius: '28px',
                  px: 4,
                  py: 1.25,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                  '&:disabled': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={isAdding}
                sx={{
                  borderRadius: '28px',
                  px: 4,
                  py: 1.25,
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  color: darkMode ? '#202124' : '#ffffff',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                    boxShadow: darkMode
                      ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                      : '0 4px 12px rgba(26, 115, 232, 0.3)',
                  },
                  '&:disabled': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              >
                Next
              </Button>
            </Stack>
          )}
        </Paper>

        {/* Global Loading Backdrop - Google Material Design Style */}
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
          open={isAdding}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: darkMode
                  ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                  : '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <CircularProgress
                size={48}
                sx={{
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 500,
                }}
              >
                Saving Product...
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  mt: 1,
                }}
              >
                Please wait while we save your product
              </Typography>
            </Paper>
          </Box>
        </Backdrop>

        {/* Snackbar - Google Material Design Style */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: '12px',
              backgroundColor: snackbar.severity === 'success'
                ? darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)'
                : darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
              border: `1px solid ${
                snackbar.severity === 'success'
                  ? darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)'
                  : darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'
              }`,
              color: snackbar.severity === 'success'
                ? darkMode ? '#81c995' : '#1e7e34'
                : darkMode ? '#f28b82' : '#c5221f',
              '& .MuiAlert-icon': {
                color: 'inherit',
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  )
}