// app/admin/products/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Box,
  Alert,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import { useTheme as useThemeContext } from '@/contexts/ThemeContext'

import {
  GoogleProductSkeleton,
  GoogleProductHeader,
  GoogleProductStats,
  GoogleProductTabs,
  GoogleProductOverview,
  GoogleProductVariations,
  GoogleProductBatches,
  GoogleProductGST,
  GoogleProductActions,
  Product,
} from '@/components/googleadminproduct'

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const theme = useTheme()
  const { mode } = useThemeContext()
  const darkMode = mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError('')
      
      const productId = params.id as string
      console.log('🔄 Fetching product ID:', productId)
      
      if (!productId || productId === 'undefined') {
        setError('Invalid product ID')
        return
      }
      
      const response = await fetch(`/api/admin/products/${productId}`)
      
      console.log('📥 Response status:', response.status)
      
      if (!response.ok) {
        const data = await response.json()
        console.error('❌ API Error:', data)
        
        if (response.status === 401) {
          throw new Error('Please log in to access this page')
        }
        if (response.status === 403) {
          throw new Error('Admin access required')
        }
        if (response.status === 404) {
          throw new Error('Product not found')
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid product ID')
        }
        
        throw new Error(data.message || `Failed to load product (${response.status})`)
      }
      
      const data = await response.json()
      console.log('✅ Product loaded:', data)
      setProduct(data)
      
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message || 'Failed to load product')
      
      // Auto-redirect on auth errors
      if (err.message.includes('log in') || err.message.includes('Unauthorized')) {
        setTimeout(() => router.push('/admin/login'), 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchProduct()
  }

  const handleEdit = () => {
    router.push(`/admin/products/${params.id}/edit`)
  }

  const handleBack = () => {
    router.push('/admin/products')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // Implement export functionality
    console.log('Export product')
  }

  const handleShare = () => {
    // Implement share functionality
    console.log('Share product')
  }

  // Helper functions
  const calculateTotalStock = (product: Product) => {
    let total = 0
    if (product.variations?.length > 0) {
      product.variations.forEach((v: any) => total += v.stock || 0)
    }
    if (product.batches?.length > 0) {
      product.batches.forEach((b: any) => total += b.quantity || 0)
    }
    return total
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: '#ea4335', label: 'Out of Stock' }
    if (stock < 10) return { color: '#fbbc04', label: 'Low Stock' }
    return { color: '#34a853', label: 'In Stock' }
  }

  const renderTabContent = () => {
    if (!product) return null

    switch (activeTab) {
      case 'variations':
        return (
          <GoogleProductVariations
            variations={product.variations}
            darkMode={darkMode}
            formatCurrency={formatCurrency}
            getStockStatus={getStockStatus}
          />
        )
      case 'batches':
        return (
          <GoogleProductBatches
            batches={product.batches}
            darkMode={darkMode}
            formatCurrency={formatCurrency}
          />
        )
      case 'gst':
        return (
          <GoogleProductGST
            gstDetails={product.gstDetails}
            darkMode={darkMode}
            formatCurrency={formatCurrency}
          />
        )
      default:
        return (
          <GoogleProductOverview
            product={product}
            darkMode={darkMode}
            isMobile={isMobile}
            calculateTotalStock={calculateTotalStock}
            formatCurrency={formatCurrency}
            getStockStatus={getStockStatus}
          />
        )
    }
  }

  if (loading) {
    return <GoogleProductSkeleton />
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.05),
            border: `1px solid ${darkMode ? alpha('#ea4335', 0.2) : alpha('#ea4335', 0.1)}`,
            color: darkMode ? '#ea4335' : '#d32f2f',
          }}
          action={
            <button 
              onClick={handleRefresh}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: darkMode ? '#ea4335' : '#d32f2f',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Retry
            </button>
          }
        >
          {error}
        </Alert>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="warning" 
          sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.05),
            border: `1px solid ${darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.1)}`,
            color: darkMode ? '#fbbc04' : '#ed6c02',
          }}
          action={
            <button 
              onClick={handleBack}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: darkMode ? '#fbbc04' : '#ed6c02',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Back to Products
            </button>
          }
        >
          Product not found
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <GoogleProductHeader
        product={product}
        onBack={handleBack}
        onRefresh={handleRefresh}
        onEdit={handleEdit}
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <GoogleProductStats
        product={product}
        darkMode={darkMode}
        calculateTotalStock={calculateTotalStock}
        formatCurrency={formatCurrency}
        getStockStatus={getStockStatus}
      />

      <GoogleProductTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        product={product}
        darkMode={darkMode}
      />

      <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
        {renderTabContent()}
      </Box>

      <GoogleProductActions
        onPrint={handlePrint}
        onExport={handleExport}
        onShare={handleShare}
        darkMode={darkMode}
        isMobile={isMobile}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  )
}