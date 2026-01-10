// app/products/add/page.tsx
'use client'

import React, { useState } from 'react'
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
  Backdrop
} from '@mui/material'
import { MainLayout } from '@/components/Layout/MainLayout'
import ProductBasicInfo from '@/components/products/ProductBasicInfo'
import ProductVariations from '@/components/products/ProductVariations'
import ProductBatches from '@/components/products/ProductBatches'
import ProductGST from '@/components/products/ProductGST'
import ProductReview from '@/components/products/ProductReview'
import { useProducts } from '@/hooks/useProducts'
import { useRouter } from 'next/navigation'

const steps = [
  'Basic Information',
  'GST Details',
  'Product Variations',
  'Inventory Batches',
  'Review & Save'
]

export default function AddProductPage() {
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
  React.useEffect(() => {
    if (error) {
      showSnackbar(error, 'error')
      clearError() // Clear the error after showing
    }
  }, [error, clearError])

  return (
    <MainLayout title="Add New Product">
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Add New Product
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Complete all steps to add a new product with variations and inventory
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper sx={{ p: 4, borderRadius: '12px', position: 'relative' }}>
          {getStepContent(activeStep)}

          {activeStep < steps.length - 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={isAdding}
              >
                Next
              </Button>
            </Box>
          )}
        </Paper>

        {/* Global Loading Backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isAdding}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Saving Product...
            </Typography>
          </Box>
        </Backdrop>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  )
}