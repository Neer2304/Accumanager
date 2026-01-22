// components/calculator/ProductCalculator.tsx - UPDATED WITH useProducts
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
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
  Stack,
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
  CircularProgress
} from '@mui/material'
import {
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
  Person
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { MainLayout } from '@/components/Layout/MainLayout'

// Types
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, isAuthenticated, getUserDisplayName, isLoading: authLoading } = useAuth()
  const { products: allProducts, isLoading: productsLoading, refetch: refetchProducts, isOnline } = useProducts()

  // State
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

  // Refs
  const resultRef = useRef<HTMLDivElement>(null)

  // Convert hook products to calculator format
  const products = React.useMemo(() => {
    return allProducts.map((product): CalculatorProduct => {
      // Calculate total stock from variations
      const totalStock = product.variations.reduce((sum, variation) => sum + (variation.stock || 0), 0);
      
      // Calculate GST rate from gstDetails
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

  // Memoized calculate function
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

    // Apply bulk discount
    const bulkDiscountAmount = (subtotal * bulkDiscount) / 100
    const finalSubtotal = subtotal - bulkDiscountAmount - discountTotal
    const finalGstTotal = (finalSubtotal * getAverageGstRate()) / 100
    const totalAmount = finalSubtotal + finalGstTotal
    const profit = totalAmount - totalCost
    const margin = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const breakEvenUnits = totalCost > 0 ? Math.ceil(totalCost / getAverageSellingPrice()) : 0

    // Only update items if they actually changed
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

    // Scroll to result on mobile
    if (isMobile && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 300)
    }
  }, [items, bulkDiscount, isMobile])

  // Calculate helper functions
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

  // Initialize calculations when items change
  useEffect(() => {
    calculateAll()
  }, [calculateAll])

  // Load saved calculations
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSavedCalculations()
    }
  }, [isAuthenticated, user])

  const loadUserSavedCalculations = async () => {
    if (!isAuthenticated || !user) return

    try {
      // Load from localStorage
      const saved = localStorage.getItem(`saved_calculations_${user.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSavedCalculations(parsed)
      }
    } catch (error) {
      console.error('Error loading saved calculations:', error)
    }
  }

  const addItem = () => {
    if (!selectedProduct) {
      showSnackbar('Please select a product', 'error')
      return
    }

    // Check if product belongs to current user
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

    // Save to localStorage
    const updatedCalculations = [saveData, ...savedCalculations]
    localStorage.setItem(`saved_calculations_${user.id}`, JSON.stringify(updatedCalculations))
    
    setSavedCalculations(updatedCalculations)
    setSaveDialogOpen(false)
    setSaveName('')
    setSaveNotes('')
    showSnackbar('Calculation saved successfully', 'success')
  }

  const loadCalculation = (calculation: SavedCalculation) => {
    // Check if calculation belongs to current user
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

  // Filter products based on search and user
  const filteredProducts = products.filter(product => {
    // Check if product belongs to current user
    if (product.userId && user && product.userId !== user.id) {
      return false
    }
    
    // Search filter
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <MainLayout title="Profit Calculator">
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
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <MonetizationOn sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Profit Calculator
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please login to use the calculator and access your products
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.href = '/login'}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Login to Continue
            </Button>
          </Card>
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Profit Calculator">
      <Box sx={{
        maxWidth: '1400px',
        margin: '0 auto',
        px: { xs: 1, sm: 2, md: 3 }
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            borderRadius: { xs: 2, sm: 3, md: 4 },
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: theme.palette.background.paper,
            mt: 2
          }}>
            {/* Header */}
            <Box sx={{
              p: { xs: 2, sm: 3, md: 4 },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#fff', 0.1),
                animation: 'float 6s ease-in-out infinite'
              }} />
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: 2,
                    background: alpha('#fff', 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <MonetizationOn sx={{ fontSize: { xs: 24, sm: 28 }, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} gutterBottom>
                      Profit Calculator
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      Welcome, {getUserDisplayName()} • {products.length} Products
                      {!isOnline && (
                        <Chip 
                          label="Offline" 
                          size="small" 
                          color="warning" 
                          sx={{ ml: 1, fontSize: '0.7rem' }}
                        />
                      )}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, sm: 0 } }}>
                  <Tooltip title="Refresh Products">
                    <IconButton 
                      onClick={() => refetchProducts()}
                      disabled={productsLoading}
                      sx={{ 
                        background: alpha('#fff', 0.2), 
                        color: 'white',
                        '&:hover': { background: alpha('#fff', 0.3) }
                      }}
                    >
                      {productsLoading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View History">
                    <IconButton 
                      onClick={() => setShowHistory(true)}
                      sx={{ 
                        background: alpha('#fff', 0.2), 
                        color: 'white',
                        '&:hover': { background: alpha('#fff', 0.3) }
                      }}
                    >
                      <History />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save Calculation">
                    <IconButton 
                      onClick={() => setSaveDialogOpen(true)}
                      disabled={items.length === 0}
                      sx={{ 
                        background: alpha('#fff', 0.2), 
                        color: 'white',
                        '&:hover': { background: alpha('#fff', 0.3) }
                      }}
                    >
                      <Save />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export PDF">
                    <IconButton 
                      onClick={exportToPDF}
                      disabled={items.length === 0}
                      sx={{ 
                        background: alpha('#fff', 0.2), 
                        color: 'white',
                        '&:hover': { background: alpha('#fff', 0.3) }
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>

            {/* Main Content */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Left Section - Product Selection */}
              <Box sx={{ flex: 1, minWidth: { md: 400 } }}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.5)
                }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingCart /> My Products
                        {!isOnline && (
                          <Chip 
                            label="Offline" 
                            size="small" 
                            color="warning" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {productsLoading && <CircularProgress size={20} />}
                        <Typography variant="caption" color="text.secondary">
                          {products.length} products
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Product Search */}
                    <TextField
                      fullWidth
                      placeholder="Search your products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                    />

                    {/* Product List */}
                    {productsLoading ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          Loading products...
                        </Typography>
                      </Box>
                    ) : products.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Inventory sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography color="text.secondary">
                          No products found
                        </Typography>
                        <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                          Add products first to use the calculator
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => window.location.href = '/products/add'}
                          disabled={!isOnline}
                        >
                          Add Products
                        </Button>
                      </Box>
                    ) : (
                      <Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto', p: 1 }}>
                        {filteredProducts.map((product) => (
                          <Card
                            key={product.id || product._id}
                            variant="outlined"
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              cursor: 'pointer',
                              border: selectedProduct?.id === product.id ? `2px solid ${theme.palette.primary.main}` : undefined,
                              background: selectedProduct?.id === product.id ? alpha(theme.palette.primary.main, 0.05) : undefined,
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[2]
                              }
                            }}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {product.name}
                                </Typography>
                                <Chip 
                                  label={`${product.gstRate}% GST`} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Stack>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Stack spacing={0.5} flex={1}>
                                  <Typography variant="caption" color="text.secondary">
                                    {product.category}
                                  </Typography>
                                  {product.sku && (
                                    <Typography variant="caption" color="text.secondary">
                                      SKU: {product.sku}
                                    </Typography>
                                  )}
                                  {product.hsnCode && (
                                    <Typography variant="caption" color="text.secondary">
                                      HSN: {product.hsnCode}
                                    </Typography>
                                  )}
                                </Stack>
                                <Stack spacing={0.5} alignItems="flex-end">
                                  <Typography variant="body2" fontWeight={600} color="primary">
                                    ₹{product.price}
                                  </Typography>
                                  <Typography variant="caption" color="error">
                                    Cost: ₹{product.costPrice}
                                  </Typography>
                                </Stack>
                              </Stack>
                              {product.stock > 0 && (
                                <LinearProgress 
                                  variant="determinate" 
                                  value={Math.min((product.stock / 100) * 100, 100)}
                                  color={product.stock < 10 ? 'error' : product.stock < 30 ? 'warning' : 'success'}
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                              )}
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    )}

                    {/* Input Form */}
                    <Stack spacing={2} sx={{ mt: 3 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Inventory />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Discount (%)"
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Percent />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                      
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
                        sx={{ py: 1.5, borderRadius: 2 }}
                      >
                        Add to Calculation
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Right Section - Items & Results */}
              <Box sx={{ flex: 1, minWidth: { md: 500 } }}>
                <Stack spacing={3}>
                  {/* Items Table */}
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Receipt /> Items ({items.length})
                        </Typography>
                        <Tooltip title="Clear All">
                          <IconButton 
                            onClick={clearAll} 
                            disabled={items.length === 0}
                            size="small"
                            color="error"
                          >
                            <ClearAll />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      {items.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Inventory sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                          <Typography color="text.secondary">
                            No items added yet
                          </Typography>
                          <Typography variant="body2" color="text.disabled">
                            Select products and add them to start calculating
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer sx={{ maxHeight: 300, borderRadius: 2 }}>
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="center">Qty</TableCell>
                                <TableCell align="center">Disc</TableCell>
                                <TableCell align="right">Profit</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {items.map((item) => (
                                <TableRow key={item.id} hover>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                      {item.product.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      ₹{item.product.price} × {item.quantity} | Cost: ₹{item.product.costPrice}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                      <IconButton 
                                        size="small"
                                        onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                                      >
                                        <Remove fontSize="small" />
                                      </IconButton>
                                      <Typography>{item.quantity}</Typography>
                                      <IconButton 
                                        size="small"
                                        onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                                      >
                                        <Add fontSize="small" />
                                      </IconButton>
                                    </Stack>
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
                                    <Stack spacing={0.5}>
                                      <Typography fontWeight={600} color={item.profit >= 0 ? 'success.main' : 'error.main'}>
                                        ₹{item.profit.toFixed(2)}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {item.margin.toFixed(1)}% margin
                                      </Typography>
                                    </Stack>
                                  </TableCell>
                                  <TableCell align="center">
                                    <IconButton 
                                      size="small" 
                                      color="error"
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
                      )}

                      {/* Bulk Discount */}
                      {items.length > 0 && (
                        <Paper sx={{ mt: 3, p: 2, background: alpha(theme.palette.warning.light, 0.1), borderRadius: 2 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocalOffer /> Apply Bulk Discount
                            </Typography>
                            <TextField
                              size="small"
                              type="number"
                              value={bulkDiscount}
                              onChange={(e) => setBulkDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                              sx={{ width: 120 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Percent fontSize="small" />
                                  </InputAdornment>
                                ),
                                endAdornment: <Typography variant="caption">%</Typography>
                              }}
                            />
                          </Stack>
                        </Paper>
                      )}
                    </CardContent>
                  </Card>

                  {/* Results Section */}
                  <div ref={resultRef}>
                    <Card sx={{ 
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calculate /> Profit Calculation Results
                        </Typography>

                        {/* Key Metrics */}
                        <Stack spacing={2} sx={{ mb: 3 }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Paper sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              flex: 1,
                              textAlign: 'center',
                              background: alpha(theme.palette.primary.main, 0.05)
                            }}>
                              <Typography variant="caption" color="text.secondary">
                                Total Revenue
                              </Typography>
                              <Typography variant="h5" fontWeight={700} color="primary">
                                ₹{result.totalAmount.toFixed(2)}
                              </Typography>
                            </Paper>
                            <Paper sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              flex: 1,
                              textAlign: 'center',
                              background: alpha(theme.palette.error.light, 0.05)
                            }}>
                              <Typography variant="caption" color="text.secondary">
                                Total Cost
                              </Typography>
                              <Typography variant="h5" fontWeight={700} color="error">
                                ₹{result.totalCost.toFixed(2)}
                              </Typography>
                            </Paper>
                          </Stack>

                          {/* Profit Summary */}
                          <Paper sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            background: alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                          }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  Total Profit
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  After all discounts & GST
                                </Typography>
                              </Box>
                              <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                                <Typography 
                                  variant="h4" 
                                  fontWeight={800}
                                  color="success.main"
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                  {result.profit >= 0 ? <TrendingUp /> : <TrendingDown />}
                                  ₹{Math.abs(result.profit).toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {result.margin.toFixed(2)}% Profit Margin
                                </Typography>
                              </Stack>
                            </Stack>
                          </Paper>
                        </Stack>

                        {/* Detailed Analysis */}
                        <Stack spacing={2}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Scale /> Detailed Analysis
                          </Typography>
                          
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                GST Breakdown
                              </Typography>
                              <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Subtotal:</Typography>
                                  <Typography variant="body2" fontWeight={600}>₹{result.subtotal.toFixed(2)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Discount:</Typography>
                                  <Typography variant="body2" fontWeight={600} color="error">-₹{result.discountTotal.toFixed(2)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">GST Total:</Typography>
                                  <Typography variant="body2" fontWeight={600}>₹{result.gstTotal.toFixed(2)}</Typography>
                                </Stack>
                              </Stack>
                            </Paper>

                            <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Business Metrics
                              </Typography>
                              <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Return on Investment:</Typography>
                                  <Typography variant="body2" fontWeight={600} color={result.roi >= 0 ? 'success.main' : 'error.main'}>
                                    {result.roi.toFixed(2)}%
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Break-even Units:</Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {result.breakEvenUnits}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Avg. Selling Price:</Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    ₹{getAverageSellingPrice().toFixed(2)}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Paper>
                          </Stack>
                        </Stack>

                        {/* Action Buttons */}
                        {items.length > 0 && (
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3 }}>
                            <Button
                              variant="outlined"
                              startIcon={<ContentCopy />}
                              onClick={copyToClipboard}
                              fullWidth={isMobile}
                            >
                              Copy Results
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<Print />}
                              onClick={() => window.print()}
                              fullWidth={isMobile}
                            >
                              Print Report
                            </Button>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </motion.div>

        {/* History Dialog */}
        <Dialog
          open={showHistory}
          onClose={() => setShowHistory(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              <History /> My Saved Calculations
            </Typography>
            <IconButton onClick={() => setShowHistory(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {savedCalculations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <History sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">
                  No saved calculations
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Save your calculations to view them here
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {savedCalculations.map((calc) => (
                  <Card key={calc.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {calc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(calc.timestamp).toLocaleString()}
                          </Typography>
                          {calc.notes && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                              {calc.notes}
                            </Typography>
                          )}
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Load Calculation">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => loadCalculation(calc)}
                            >
                              <CloudDownload />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => deleteSavedCalculation(calc.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                      <Divider sx={{ my: 2 }} />
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Items
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {calc.items.length} products
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Amount
                          </Typography>
                          <Typography variant="body2" fontWeight={500} color="success.main">
                            ₹{calc.result.totalAmount.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Profit
                          </Typography>
                          <Typography variant="body2" fontWeight={500} color="primary.main">
                            ₹{calc.result.profit.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            ROI
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {calc.result.roi.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowHistory(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Save Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Save Profit Calculation</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Saving as: <strong>{getUserDisplayName()}</strong>
              </Typography>
              <TextField
                fullWidth
                label="Calculation Name"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="e.g., Q4 Bulk Order Analysis"
                helperText="Give a descriptive name for this calculation"
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
              
              {/* Preview Summary */}
              {items.length > 0 && (
                <Paper sx={{ p: 2, background: alpha(theme.palette.primary.light, 0.05) }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview Summary:
                  </Typography>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">Total Items:</Typography>
                      <Typography variant="caption" fontWeight={600}>{items.length}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">Total Profit:</Typography>
                      <Typography variant="caption" fontWeight={600} color="success.main">
                        ₹{result.profit.toFixed(2)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">ROI:</Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {result.roi.toFixed(2)}%
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={saveCalculation}
              variant="contained"
              disabled={!saveName.trim() || items.length === 0}
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

        {/* Add CSS Animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </Box>
    </MainLayout>
  )
}

export default ProductCalculator