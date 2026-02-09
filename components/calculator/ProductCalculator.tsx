'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputAdornment,
  Alert,
  Divider,
  LinearProgress,
  Snackbar,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Container,
} from '@mui/material'
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Calculate,
  Save,
  History,
  Delete,
  Add,
  Remove,
  Print,
  Download,
  Close,
  Search,
  LocalOffer,
  Inventory,
  Percent,
  Receipt,
  ShoppingCart,
  ClearAll,
  CloudDownload,
  ContentCopy,
  TrendingUp,
  TrendingDown,
  Refresh,
  MonetizationOn,
  Category,
  Scale,
  Person,
  CalendarToday,
  AttachMoney,
  AccountBalance,
  Store
} from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { MainLayout } from '@/components/Layout/MainLayout'

// Types (keep as is)
interface CalculatorProduct {
  id: string
  _id?: string
  name: string
  price: number
  costPrice: number
  gstRate: number
  stock: number
  category?: string
  sku?: string
  hsnCode?: string
  brand?: string
  userId?: string
  variations?: any[]
  batches?: any[]
  gstDetails?: {
    cgstRate: number
    sgstRate: number
    igstRate: number
    hsnCode: string
  }
}

interface CalculatorItem {
  id: string
  product: CalculatorProduct
  quantity: number
  discount: number
  gstType: 'cgst_sgst' | 'igst'
  calculatedPrice: number
  profit: number
  margin: number
}

interface CalculationResult {
  subtotal: number
  discountTotal: number
  gstTotal: number
  totalAmount: number
  totalCost: number
  profit: number
  margin: number
  roi: number
  breakEvenUnits: number
}

interface SavedCalculation {
  id: string
  timestamp: Date
  items: CalculatorItem[]
  result: CalculationResult
  notes?: string
  name: string
  userId?: string
}

const ProductCalculator: React.FC = () => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, isAuthenticated, getUserDisplayName, isLoading: authLoading } = useAuth()
  const { products: allProducts, isLoading: productsLoading, refetch: refetchProducts, isOnline } = useProducts()

  // State (keep as is)
  const [items, setItems] = useState<CalculatorItem[]>([])
  const [result, setResult] = useState<CalculationResult>({
    subtotal: 0,
    discountTotal: 0,
    gstTotal: 0,
    totalAmount: 0,
    totalCost: 0,
    profit: 0,
    margin: 0,
    roi: 0,
    breakEvenUnits: 0
  })

  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([])
  const [selectedProduct, setSelectedProduct] = useState<CalculatorProduct | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [discount, setDiscount] = useState<number>(0)
  const [gstType, setGstType] = useState<'cgst_sgst' | 'igst'>('cgst_sgst')
  const [searchTerm, setSearchTerm] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveNotes, setSaveNotes] = useState('')
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' | 'warning' 
  })
  const [bulkDiscount, setBulkDiscount] = useState<number>(0)

  // Convert hook products to calculator format (keep as is)
  const products = React.useMemo(() => {
    return allProducts.map((product): CalculatorProduct => {
      const totalStock = product.variations.reduce((sum, variation) => sum + (variation.stock || 0), 0);
      const gstRate = (product.gstDetails?.cgstRate || 0) + (product.gstDetails?.sgstRate || 0);
      
      return {
        id: product._id,
        _id: product._id,
        name: product.name,
        price: product.basePrice || 0,
        costPrice: product.baseCostPrice || 0,
        gstRate: gstRate > 0 ? gstRate : 18,
        stock: totalStock,
        category: product.category,
        sku: product.sku,
        hsnCode: product.gstDetails?.hsnCode,
        brand: product.brand,
        userId: product.userId,
        variations: product.variations,
        batches: product.batches,
        gstDetails: product.gstDetails
      }
    });
  }, [allProducts]);

  // Calculation functions (keep as is)
  const calculateAll = useCallback(() => {
    if (items.length === 0) {
      setResult({
        subtotal: 0,
        discountTotal: 0,
        gstTotal: 0,
        totalAmount: 0,
        totalCost: 0,
        profit: 0,
        margin: 0,
        roi: 0,
        breakEvenUnits: 0
      })
      return
    }

    let subtotal = 0
    let discountTotal = 0
    let gstTotal = 0
    let totalCost = 0
    let totalProfit = 0

    const updatedItems = items.map(item => {
      const basePrice = item.product.price * item.quantity
      const itemDiscount = (basePrice * item.discount) / 100
      const priceAfterDiscount = basePrice - itemDiscount
      const gstAmount = (priceAfterDiscount * item.product.gstRate) / 100
      const calculatedPrice = priceAfterDiscount + gstAmount
      const itemCost = item.product.costPrice * item.quantity
      const itemProfit = calculatedPrice - itemCost
      const itemMargin = itemCost > 0 ? (itemProfit / itemCost) * 100 : 0

      subtotal += basePrice
      discountTotal += itemDiscount
      gstTotal += gstAmount
      totalCost += itemCost
      totalProfit += itemProfit

      return { 
        ...item, 
        calculatedPrice,
        profit: itemProfit,
        margin: itemMargin
      }
    })

    const bulkDiscountAmount = (subtotal * bulkDiscount) / 100
    const finalSubtotal = subtotal - bulkDiscountAmount - discountTotal
    const finalGstTotal = (finalSubtotal * getAverageGstRate()) / 100
    const totalAmount = finalSubtotal + finalGstTotal
    const profit = totalAmount - totalCost
    const margin = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const breakEvenUnits = totalCost > 0 ? Math.ceil(totalCost / getAverageSellingPrice()) : 0

    const itemsChanged = JSON.stringify(items) !== JSON.stringify(updatedItems)
    if (itemsChanged) {
      setItems(updatedItems)
    }
    
    const finalResult = {
      subtotal: subtotal - bulkDiscountAmount,
      discountTotal: discountTotal + bulkDiscountAmount,
      gstTotal: finalGstTotal,
      totalAmount,
      totalCost,
      profit,
      margin,
      roi,
      breakEvenUnits
    }

    setResult(finalResult)
  }, [items, bulkDiscount])

  const getAverageGstRate = useCallback(() => {
    if (items.length === 0) return 0
    const total = items.reduce((sum, item) => sum + item.product.gstRate, 0)
    return total / items.length
  }, [items])

  const getAverageSellingPrice = useCallback(() => {
    if (items.length === 0) return 0
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    return total / totalQuantity
  }, [items])

  useEffect(() => {
    calculateAll()
  }, [calculateAll])

  // Rest of functions (keep as is) - addItem, removeItem, updateItem, etc.
  const addItem = () => {
    if (!selectedProduct) {
      showSnackbar('Please select a product', 'error')
      return
    }

    if (selectedProduct.userId && user && selectedProduct.userId !== user.id) {
      showSnackbar('This product does not belong to your account', 'error')
      return
    }

    const newItem: CalculatorItem = {
      id: Date.now().toString(),
      product: selectedProduct,
      quantity,
      discount,
      gstType,
      calculatedPrice: 0,
      profit: 0,
      margin: 0
    }

    setItems(prevItems => [...prevItems, newItem])
    resetForm()
  }

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
    showSnackbar('Item removed', 'success')
  }

  const updateItem = (id: string, field: keyof CalculatorItem, value: any) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const resetForm = () => {
    setSelectedProduct(null)
    setQuantity(1)
    setDiscount(0)
  }

  const clearAll = () => {
    setItems([])
    setBulkDiscount(0)
    showSnackbar('Calculator cleared', 'success')
  }

  const saveCalculation = async () => {
    if (items.length === 0) {
      showSnackbar('No items to save', 'error')
      return
    }

    if (!user) {
      showSnackbar('Please login to save calculations', 'error')
      return
    }

    const saveData: SavedCalculation = {
      id: Date.now().toString(),
      timestamp: new Date(),
      items: [...items],
      result: { ...result },
      notes: saveNotes,
      name: saveName || `Calculation ${savedCalculations.length + 1}`,
      userId: user.id
    }

    const updatedCalculations = [saveData, ...savedCalculations]
    localStorage.setItem(`saved_calculations_${user.id}`, JSON.stringify(updatedCalculations))
    
    setSavedCalculations(updatedCalculations)
    setSaveDialogOpen(false)
    setSaveName('')
    setSaveNotes('')
    showSnackbar('Calculation saved successfully', 'success')
  }

  const loadCalculation = (calculation: SavedCalculation) => {
    if (calculation.userId && user && calculation.userId !== user.id) {
      showSnackbar('You cannot load this calculation', 'error')
      return
    }

    setItems(calculation.items)
    setResult(calculation.result)
    setShowHistory(false)
    showSnackbar('Calculation loaded', 'success')
  }

  const deleteSavedCalculation = (id: string) => {
    const updatedCalculations = savedCalculations.filter(calc => calc.id !== id)
    if (user) {
      localStorage.setItem(`saved_calculations_${user.id}`, JSON.stringify(updatedCalculations))
    }
    setSavedCalculations(updatedCalculations)
    showSnackbar('Calculation deleted', 'success')
  }

  const exportToPDF = async () => {
    if (!user) {
      showSnackbar('Please login to export', 'error')
      return
    }

    const content = generateExportContent()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `profit-calculation-${user.name || 'user'}-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    URL.revokeObjectURL(url)
    showSnackbar('Calculation exported', 'success')
  }

  const generateExportContent = () => {
    const userName = user?.name || 'User'
    const userEmail = user?.email || ''
    
    return `
PROFIT CALCULATION REPORT
==========================
User: ${userName}
Email: ${userEmail}
Date: ${new Date().toLocaleString()}

ITEMS:
${items.map(item => `
• ${item.product.name}
  Quantity: ${item.quantity}
  Price: ₹${item.product.price}
  Cost: ₹${item.product.costPrice}
  Discount: ${item.discount}%
  GST: ${item.product.gstRate}%
  Profit: ₹${item.profit.toFixed(2)} (${item.margin.toFixed(2)}%)
`).join('\n')}

SUMMARY:
Subtotal: ₹${result.subtotal.toFixed(2)}
Discount: ₹${result.discountTotal.toFixed(2)}
GST: ₹${result.gstTotal.toFixed(2)}
Total Cost: ₹${result.totalCost.toFixed(2)}
Total Amount: ₹${result.totalAmount.toFixed(2)}

PROFIT ANALYSIS:
Total Profit: ₹${result.profit.toFixed(2)}
Profit Margin: ${result.margin.toFixed(2)}%
ROI: ${result.roi.toFixed(2)}%
Break-even Units: ${result.breakEvenUnits}

Generated by: ${userName}
Date: ${new Date().toLocaleString()}
    `
  }

  const copyToClipboard = () => {
    const userName = user?.name || 'User'
    const text = `
User: ${userName}
Date: ${new Date().toLocaleDateString()}

Total Amount: ₹${result.totalAmount.toFixed(2)}
Total Cost: ₹${result.totalCost.toFixed(2)}
Profit: ₹${result.profit.toFixed(2)} (${result.margin.toFixed(2)}% margin)
ROI: ${result.roi.toFixed(2)}%
Break-even: ${result.breakEvenUnits} units
    `.trim()
    
    navigator.clipboard.writeText(text)
    showSnackbar('Copied to clipboard', 'success')
  }

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity })
  }, [])

  const handleBack = () => {
    window.history.back()
  }

  // Load saved calculations
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSavedCalculations()
    }
  }, [isAuthenticated, user])

  const loadUserSavedCalculations = async () => {
    if (!isAuthenticated || !user) return

    try {
      const saved = localStorage.getItem(`saved_calculations_${user.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSavedCalculations(parsed)
      }
    } catch (error) {
      console.error('Error loading saved calculations:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    if (product.userId && user && product.userId !== user.id) {
      return false
    }
    
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsnCode?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // If auth is still loading
  if (authLoading) {
    return (
      <MainLayout title="Profit Calculator">
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
          }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    )
  }

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <MainLayout title="Profit Calculator">
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
          }}>
            <Card sx={{
              maxWidth: 500,
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <MonetizationOn sx={{ fontSize: 64, color: '#34a853', mb: 2 }} />
              <Typography variant="h4" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Profit Calculator
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Please login to use the calculator and access your products
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.href = '/login'}
                sx={{ 
                  borderRadius: 2, 
                  px: 4,
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' }
                }}
              >
                Login to Continue
              </Button>
            </Card>
          </Box>
        </Container>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Profit Calculator">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </MuiLink>
            <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Calculator
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Profit Calculator
              </Typography>
              <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Calculate profits, margins, and ROI for your products
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {!isOnline && (
                <Chip 
                  label="Offline Mode" 
                  size="small" 
                  sx={{
                    backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                    borderColor: alpha('#fbbc04', 0.3),
                    color: darkMode ? '#fdd663' : '#fbbc04',
                  }}
                />
              )}
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Welcome, {getUserDisplayName()} • {products.length} Products
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          {/* Header Card */}
          <Card sx={{
            mb: 3,
            borderRadius: 3,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <Box sx={{
              p: 3,
              background: darkMode 
                ? `linear-gradient(135deg, ${alpha('#4285f4', 0.8)} 0%, ${alpha('#0d3064', 0.9)} 100%)`
                : `linear-gradient(135deg, ${alpha('#4285f4', 0.9)} 0%, ${alpha('#0d3064', 0.9)} 100%)`,
              color: '#ffffff',
              borderRadius: '12px 12px 0 0',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: alpha('#ffffff', 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <Calculate sx={{ fontSize: 28, color: '#ffffff' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Profit Calculator
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {getUserDisplayName()} • {products.length} Products
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => refetchProducts()}
                    disabled={productsLoading}
                    sx={{
                      backgroundColor: alpha('#ffffff', 0.2),
                      color: '#ffffff',
                      '&:hover': { backgroundColor: alpha('#ffffff', 0.3) }
                    }}
                  >
                    {productsLoading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
                  </IconButton>
                  <IconButton
                    onClick={() => setShowHistory(true)}
                    sx={{
                      backgroundColor: alpha('#ffffff', 0.2),
                      color: '#ffffff',
                      '&:hover': { backgroundColor: alpha('#ffffff', 0.3) }
                    }}
                  >
                    <History />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Calculator Layout */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              p: 3
            }}>
              {/* Left Column - Product Selection */}
              <Box sx={{ 
                flex: 1,
                minWidth: { md: 400 }
              }}>
                <Card sx={{
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={500} gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: darkMode ? '#e8eaed' : '#202124'
                    }}>
                      <Store /> My Products
                    </Typography>

                    {/* Search */}
                    <TextField
                      fullWidth
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Product List */}
                    {productsLoading ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Loading products...
                        </Typography>
                      </Box>
                    ) : products.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Inventory sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                        <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          No products found
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => window.location.href = '/products/add'}
                          disabled={!isOnline}
                          sx={{ mt: 2 }}
                        >
                          Add Products
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        maxHeight: 300, 
                        overflowY: 'auto',
                        p: 1,
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        borderRadius: 2,
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
                      }}>
                        {filteredProducts.map((product) => (
                          <Card
                            key={product.id || product._id}
                            sx={{
                              p: 2,
                              mb: 1,
                              borderRadius: 2,
                              cursor: 'pointer',
                              backgroundColor: selectedProduct?.id === product.id 
                                ? (darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1))
                                : (darkMode ? '#202124' : '#ffffff'),
                              border: selectedProduct?.id === product.id 
                                ? `2px solid ${darkMode ? '#8ab4f8' : '#4285f4'}`
                                : `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                              '&:hover': {
                                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                                transform: 'translateY(-2px)',
                                boxShadow: darkMode 
                                  ? '0 4px 8px rgba(0,0,0,0.3)'
                                  : '0 4px 8px rgba(0,0,0,0.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                  {product.category}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  <Chip 
                                    label={`₹${product.price}`} 
                                    size="small"
                                    sx={{
                                      backgroundColor: darkMode ? alpha('#34a853', 0.2) : alpha('#34a853', 0.1),
                                      color: darkMode ? '#81c995' : '#34a853',
                                    }}
                                  />
                                  <Chip 
                                    label={`${product.gstRate}% GST`} 
                                    size="small"
                                    sx={{
                                      backgroundColor: darkMode ? alpha('#ea4335', 0.2) : alpha('#ea4335', 0.1),
                                      color: darkMode ? '#f28b82' : '#ea4335',
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#81c995' : '#34a853', fontWeight: 500 }}>
                                Stock: {product.stock}
                              </Typography>
                            </Box>
                          </Card>
                        ))}
                      </Box>
                    )}

                    {/* Input Form */}
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          fullWidth
                          label="Discount (%)"
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                          sx={{ flex: 1 }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      </Box>
                      
                      <Select
                        fullWidth
                        value={gstType}
                        onChange={(e) => setGstType(e.target.value as any)}
                      >
                        <MenuItem value="cgst_sgst">CGST + SGST</MenuItem>
                        <MenuItem value="igst">IGST</MenuItem>
                      </Select>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Add />}
                        onClick={addItem}
                        disabled={!selectedProduct}
                        sx={{ 
                          py: 1.5,
                          backgroundColor: '#34a853',
                          '&:hover': { backgroundColor: '#2d9248' }
                        }}
                      >
                        Add to Calculation
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Right Column - Items & Results */}
              <Box sx={{ flex: 1 }}>
                {/* Items Card */}
                <Card sx={{
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight={500} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: darkMode ? '#e8eaed' : '#202124'
                      }}>
                        <ShoppingCart /> Items ({items.length})
                      </Typography>
                      <IconButton 
                        onClick={clearAll} 
                        disabled={items.length === 0}
                        size="small"
                        sx={{ color: darkMode ? '#f28b82' : '#ea4335' }}
                      >
                        <ClearAll />
                      </IconButton>
                    </Box>

                    {items.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Receipt sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                        <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          No items added yet
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <TableContainer sx={{ 
                          maxHeight: 300, 
                          borderRadius: 2,
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
                        }}>
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ 
                                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                                  color: darkMode ? '#e8eaed' : '#202124'
                                }}>
                                  Product
                                </TableCell>
                                <TableCell align="center" sx={{ 
                                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                                  color: darkMode ? '#e8eaed' : '#202124'
                                }}>
                                  Qty
                                </TableCell>
                                <TableCell align="center" sx={{ 
                                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                                  color: darkMode ? '#e8eaed' : '#202124'
                                }}>
                                  Disc
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                                  color: darkMode ? '#e8eaed' : '#202124'
                                }}>
                                  Profit
                                </TableCell>
                                <TableCell align="center" sx={{ 
                                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                                  color: darkMode ? '#e8eaed' : '#202124'
                                }}>
                                  Actions
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {items.map((item) => (
                                <TableRow 
                                  key={item.id} 
                                  hover
                                  sx={{ 
                                    '&:hover': {
                                      backgroundColor: darkMode ? '#303134' : '#f8f9fa'
                                    }
                                  }}
                                >
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                      {item.product.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                      ₹{item.product.price} × {item.quantity}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                      <IconButton 
                                        size="small"
                                        onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                                      >
                                        <Remove fontSize="small" />
                                      </IconButton>
                                      <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                        {item.quantity}
                                      </Typography>
                                      <IconButton 
                                        size="small"
                                        onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                                      >
                                        <Add fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={item.discount}
                                      onChange={(e) => updateItem(item.id, 'discount', Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                                      sx={{ width: 80 }}
                                      InputProps={{
                                        endAdornment: <Typography variant="caption">%</Typography>
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <Box>
                                      <Typography fontWeight={600} color={item.profit >= 0 ? '#34a853' : '#ea4335'}>
                                        ₹{item.profit.toFixed(2)}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                        {item.margin.toFixed(1)}%
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="center">
                                    <IconButton 
                                      size="small" 
                                      sx={{ color: darkMode ? '#f28b82' : '#ea4335' }}
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {/* Bulk Discount */}
                        <Box sx={{ 
                          mt: 3, 
                          p: 2, 
                          backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.05),
                          borderRadius: 2,
                          border: `1px solid ${darkMode ? alpha('#fbbc04', 0.3) : alpha('#fbbc04', 0.2)}`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" fontWeight={500} sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              color: darkMode ? '#fdd663' : '#fbbc04'
                            }}>
                              <LocalOffer /> Apply Bulk Discount
                            </Typography>
                            <TextField
                              size="small"
                              type="number"
                              value={bulkDiscount}
                              onChange={(e) => setBulkDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                              sx={{ width: 120 }}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                            />
                          </Box>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Results Card */}
                <Card sx={{
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  background: darkMode 
                    ? `linear-gradient(135deg, ${alpha('#0d3064', 0.5)} 0%, ${alpha('#202124', 0.8)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#e3f2fd', 0.5)} 0%, ${alpha('#ffffff', 0.8)} 100%)`
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={500} gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: darkMode ? '#e8eaed' : '#202124'
                    }}>
                      <Calculate /> Profit Calculation Results
                    </Typography>

                    {/* Key Metrics */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      mb: 3,
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                      <Card sx={{ 
                        flex: 1,
                        p: 2,
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        textAlign: 'center'
                      }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Total Revenue
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="#4285f4">
                          ₹{result.totalAmount.toFixed(2)}
                        </Typography>
                      </Card>
                      <Card sx={{ 
                        flex: 1,
                        p: 2,
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        textAlign: 'center'
                      }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Total Cost
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="#ea4335">
                          ₹{result.totalCost.toFixed(2)}
                        </Typography>
                      </Card>
                    </Box>

                    {/* Profit Summary */}
                    <Card sx={{ 
                      p: 2,
                      mb: 3,
                      backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.05),
                      border: `1px solid ${darkMode ? alpha('#34a853', 0.3) : alpha('#34a853', 0.2)}`,
                      borderRadius: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ color: darkMode ? '#81c995' : '#34a853' }}>
                            Total Profit
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            After all discounts & GST
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="h4" 
                            fontWeight={800}
                            color="#34a853"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            {result.profit >= 0 ? <TrendingUp /> : <TrendingDown />}
                            ₹{Math.abs(result.profit).toFixed(2)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {result.margin.toFixed(2)}% Profit Margin
                          </Typography>
                        </Box>
                      </Box>
                    </Card>

                    {/* Detailed Analysis */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: darkMode ? '#e8eaed' : '#202124'
                      }}>
                        <Scale /> Detailed Analysis
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        <Card sx={{ 
                          flex: 1,
                          p: 2,
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
                        }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            GST Breakdown
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                Subtotal:
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>₹{result.subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                Discount:
                              </Typography>
                              <Typography variant="body2" fontWeight={600} color="#ea4335">
                                -₹{result.discountTotal.toFixed(2)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                GST Total:
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>₹{result.gstTotal.toFixed(2)}</Typography>
                            </Box>
                          </Box>
                        </Card>

                        <Card sx={{ 
                          flex: 1,
                          p: 2,
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
                        }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Business Metrics
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                ROI:
                              </Typography>
                              <Typography variant="body2" fontWeight={600} color={result.roi >= 0 ? '#34a853' : '#ea4335'}>
                                {result.roi.toFixed(2)}%
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                Break-even Units:
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {result.breakEvenUnits}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                Avg. Selling Price:
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                ₹{getAverageSellingPrice().toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    {items.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          startIcon={<ContentCopy />}
                          onClick={copyToClipboard}
                          sx={{
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}
                        >
                          Copy Results
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Save />}
                          onClick={() => setSaveDialogOpen(true)}
                          sx={{
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}
                        >
                          Save Calculation
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          onClick={exportToPDF}
                          sx={{
                            backgroundColor: '#34a853',
                            '&:hover': { backgroundColor: '#2d9248' }
                          }}
                        >
                          Export Report
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* History Dialog */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
        }}>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            <History /> My Saved Calculations
          </Typography>
          <IconButton 
            onClick={() => setShowHistory(false)}
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {savedCalculations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <History sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
              <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                No saved calculations
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {savedCalculations.map((calc) => (
                <Card 
                  key={calc.id} 
                  sx={{
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {calc.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {new Date(calc.timestamp).toLocaleString()}
                        </Typography>
                        {calc.notes && (
                          <Typography variant="body2" sx={{ mt: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {calc.notes}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => loadCalculation(calc)}
                          sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}
                        >
                          <CloudDownload />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteSavedCalculation(calc.id)}
                          sx={{ color: darkMode ? '#f28b82' : '#ea4335' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 3,
                      flexWrap: 'wrap'
                    }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Items
                        </Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {calc.items.length} products
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Total Amount
                        </Typography>
                        <Typography variant="body2" fontWeight={500} color="#34a853">
                          ₹{calc.result.totalAmount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Profit
                        </Typography>
                        <Typography variant="body2" fontWeight={500} color="#4285f4">
                          ₹{calc.result.profit.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
          <Button 
            onClick={() => setShowHistory(false)}
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <DialogTitle sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Save Profit Calculation
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Saving as: <strong>{getUserDisplayName()}</strong>
            </Typography>
            <TextField
              fullWidth
              label="Calculation Name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g., Q4 Bulk Order Analysis"
            />
            <TextField
              fullWidth
              label="Notes (Optional)"
              value={saveNotes}
              onChange={(e) => setSaveNotes(e.target.value)}
              multiline
              rows={3}
              placeholder="Add any notes about this calculation..."
            />
            
            {items.length > 0 && (
              <Card sx={{ 
                p: 2, 
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`
              }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Preview Summary:
                </Typography>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Total Items:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>{items.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Total Profit:
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="#34a853">
                      ₹{result.profit.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      ROI:
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {result.roi.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
          <Button 
            onClick={() => setSaveDialogOpen(false)}
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveCalculation}
            variant="contained"
            disabled={!saveName.trim() || items.length === 0}
            sx={{ 
              backgroundColor: '#34a853',
              '&:hover': { backgroundColor: '#2d9248' }
            }}
          >
            Save Calculation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  )
}

export default ProductCalculator