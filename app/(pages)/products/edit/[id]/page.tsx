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
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Tooltip,
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
  Badge,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as TagIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  Numbers as NumbersIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  ContentCopy as CopyIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import { useProducts } from '@/hooks/useProducts'
import { useRouter, useParams } from 'next/navigation'
import { Product } from '@/types/indexs'

interface Variation {
  _id?: string;
  name: string;
  sku?: string;
  price: number;
  costPrice: number;
  stock: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  size?: string;
  color?: string;
  material?: string;
}

interface Batch {
  _id?: string;
  batchNumber: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  mfgDate: Date | string;
  expDate: Date | string;
  receivedDate: Date | string;
}

interface ProductFormData {
  name: string;
  sku?: string;
  description: string;
  category: string;
  subCategory?: string;
  brand?: string;
  basePrice: number;
  baseCostPrice: number;
  gstDetails: {
    type: "cgst_sgst" | "igst" | "utgst";
    hsnCode: string;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    utgstRate: number;
  };
  variations: Variation[];
  batches: Batch[];
  tags: string[];
  isReturnable: boolean;
  returnPeriod: number;
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const { products, updateProduct, isUpdating, error, clearError } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    basePrice: 0,
    baseCostPrice: 0,
    gstDetails: {
      type: 'cgst_sgst',
      hsnCode: '',
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      utgstRate: 0
    },
    variations: [],
    batches: [],
    tags: [],
    isReturnable: false,
    returnPeriod: 0
  })
  const [tagInput, setTagInput] = useState('')
  const [variationDialog, setVariationDialog] = useState({ open: false, index: -1 })
  const [batchDialog, setBatchDialog] = useState({ open: false, index: -1 })
  const [newVariation, setNewVariation] = useState<Variation>({
    name: '',
    sku: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    weight: 0,
    size: '',
    color: '',
    material: ''
  })
  const [newBatch, setNewBatch] = useState<Batch>({
    batchNumber: '',
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    mfgDate: new Date().toISOString().split('T')[0],
    expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    receivedDate: new Date().toISOString().split('T')[0]
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (productId && products.length > 0) {
      const foundProduct = products.find(p => p._id === productId)
      if (foundProduct) {
        setProduct(foundProduct)
        setFormData({
          name: foundProduct.name || '',
          sku: foundProduct.sku || '',
          description: foundProduct.description || '',
          category: foundProduct.category || '',
          subCategory: foundProduct.subCategory || '',
          brand: foundProduct.brand || '',
          basePrice: foundProduct.basePrice || 0,
          baseCostPrice: foundProduct.baseCostPrice || 0,
          gstDetails: {
            type: foundProduct.gstDetails?.type || 'cgst_sgst',
            hsnCode: foundProduct.gstDetails?.hsnCode || '',
            cgstRate: foundProduct.gstDetails?.cgstRate || 0,
            sgstRate: foundProduct.gstDetails?.sgstRate || 0,
            igstRate: foundProduct.gstDetails?.igstRate || 0,
            utgstRate: foundProduct.gstDetails?.utgstRate || 0
          },
          variations: foundProduct.variations || [],
          batches: foundProduct.batches?.map(batch => ({
            ...batch,
            mfgDate: batch.mfgDate ? 
              (typeof batch.mfgDate === 'string' ? 
                batch.mfgDate.split('T')[0] : 
                new Date(batch.mfgDate).toISOString().split('T')[0]) : 
              new Date().toISOString().split('T')[0],
            expDate: batch.expDate ? 
              (typeof batch.expDate === 'string' ? 
                batch.expDate.split('T')[0] : 
                new Date(batch.expDate).toISOString().split('T')[0]) : 
              new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            receivedDate: batch.receivedDate ? 
              (typeof batch.receivedDate === 'string' ? 
                batch.receivedDate.split('T')[0] : 
                new Date(batch.receivedDate).toISOString().split('T')[0]) : 
              new Date().toISOString().split('T')[0]
          })) || [],
          tags: foundProduct.tags || [],
          isReturnable: foundProduct.isReturnable || false,
          returnPeriod: foundProduct.returnPeriod || 0
        })
      } else {
        console.error('Product not found:', productId)
        router.push('/products')
      }
      setIsLoading(false)
    }
  }, [productId, products, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProductFormData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProductFormData],
          [child]: Number(value) || 0
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddVariation = () => {
    setNewVariation({
      name: '',
      sku: '',
      price: 0,
      costPrice: 0,
      stock: 0,
      weight: 0,
      size: '',
      color: '',
      material: ''
    })
    setVariationDialog({ open: true, index: -1 })
  }

  const handleEditVariation = (index: number) => {
    setNewVariation(formData.variations[index])
    setVariationDialog({ open: true, index })
  }

  const handleSaveVariation = () => {
    if (variationDialog.index === -1) {
      setFormData(prev => ({
        ...prev,
        variations: [...prev.variations, newVariation]
      }))
    } else {
      const updatedVariations = [...formData.variations]
      updatedVariations[variationDialog.index] = newVariation
      setFormData(prev => ({
        ...prev,
        variations: updatedVariations
      }))
    }
    setVariationDialog({ open: false, index: -1 })
  }

  const handleRemoveVariation = (index: number) => {
    if (window.confirm('Are you sure you want to remove this variation?')) {
      const updatedVariations = [...formData.variations]
      updatedVariations.splice(index, 1)
      setFormData(prev => ({
        ...prev,
        variations: updatedVariations
      }))
    }
  }

  const handleAddBatch = () => {
    setNewBatch({
      batchNumber: `BATCH-${Date.now()}`,
      quantity: 0,
      costPrice: 0,
      sellingPrice: formData.basePrice || 0,
      mfgDate: new Date().toISOString().split('T')[0],
      expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      receivedDate: new Date().toISOString().split('T')[0]
    })
    setBatchDialog({ open: true, index: -1 })
  }

  const handleEditBatch = (index: number) => {
    setNewBatch(formData.batches[index])
    setBatchDialog({ open: true, index })
  }

  const handleSaveBatch = () => {
    if (batchDialog.index === -1) {
      setFormData(prev => ({
        ...prev,
        batches: [...prev.batches, newBatch]
      }))
    } else {
      const updatedBatches = [...formData.batches]
      updatedBatches[batchDialog.index] = newBatch
      setFormData(prev => ({
        ...prev,
        batches: updatedBatches
      }))
    }
    setBatchDialog({ open: false, index: -1 })
  }

  const handleRemoveBatch = (index: number) => {
    if (window.confirm('Are you sure you want to remove this batch?')) {
      const updatedBatches = [...formData.batches]
      updatedBatches.splice(index, 1)
      setFormData(prev => ({
        ...prev,
        batches: updatedBatches
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId) return

    try {
      const submitData = {
        ...formData,
        batches: formData.batches.map(batch => ({
          ...batch,
          mfgDate: new Date(batch.mfgDate).toISOString(),
          expDate: new Date(batch.expDate).toISOString(),
          receivedDate: new Date(batch.receivedDate).toISOString()
        }))
      }

      await updateProduct({
        productId,
        productData: submitData
      })
      router.push('/products')
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const totalStock = formData.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
  const totalValue = formData.variations.reduce((sum, v) => sum + (v.price * (v.stock || 0)), 0)
  const batchStock = formData.batches.reduce((sum, b) => sum + (b.quantity || 0), 0)
  const batchValue = formData.batches.reduce((sum, b) => sum + (b.sellingPrice * (b.quantity || 0)), 0)

  if (isLoading) {
    return (
      <MainLayout title="Edit Product">
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            flexDirection: 'column',
            gap: 3
          }}>
            <CircularProgress size={48} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Loading product details...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    )
  }

  if (!product) {
    return (
      <MainLayout title="Product Not Found">
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: '12px',
                backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
                color: darkMode ? '#f28b82' : '#c5221f',
              }}
            >
              Product not found
            </Alert>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/products')}
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
              }}
            >
              Back to Products
            </Button>
          </Box>
        </Container>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={`Edit Product: ${product.name}`}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header - Google Material Design Style */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title="Back to Products">
              <IconButton
                onClick={() => router.push('/products')}
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
                <ArrowBackIcon sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: 20 }} />
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
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: 16, sm: 18 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Dashboard
                </Box>
              </MuiLink>
              <MuiLink
                component={Link}
                href="/products"
                sx={{
                  textDecoration: 'none',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Products
              </MuiLink>
              <Typography
                color={darkMode ? '#e8eaed' : '#202124'}
                fontSize={{ xs: '0.875rem', sm: '1rem' }}
              >
                Edit {product.name?.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}
              </Typography>
            </Breadcrumbs>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}
              >
                <InventoryIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Avatar>
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight={500}
                  sx={{
                    color: darkMode ? '#e8eaed' : '#202124',
                    letterSpacing: '-0.5px',
                    mb: 0.5,
                  }}
                >
                  Edit Product
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={product.category}
                    size="small"
                    icon={<CategoryIcon sx={{ fontSize: '0.9rem !important' }} />}
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    ID: {product._id?.slice(-6)}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Stack>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: '12px',
              backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
              border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
              color: darkMode ? '#f28b82' : '#c5221f',
              '& .MuiAlert-icon': {
                color: darkMode ? '#f28b82' : '#c5221f',
              },
            }}
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Main Content Container - Using Flex instead of Grid */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' }, 
            gap: 3, 
            width: '100%' 
          }}>
            {/* Left Column - Basic Info */}
            <Box sx={{ flex: { lg: 2 } }}>
              {/* Basic Information - Google Material Design Style */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Basic Information
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  '& > *': {
                    flex: '1 1 300px',
                    minWidth: { xs: '100%', sm: '300px' }
                  }
                }}>
                  <TextField
                    required
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StoreIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Sub Category"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />

                  <Box sx={{ flexBasis: '100%' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                          },
                          '&.Mui-focused': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Pricing - Google Material Design Style */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    }}
                  >
                    <MoneyIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Pricing
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  '& > *': {
                    flex: '1 1 300px',
                    minWidth: { xs: '100%', sm: '300px' }
                  }
                }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Base Price (₹)"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleNumberChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>
                        </InputAdornment>
                      ),
                      inputProps: { min: 0, step: 0.01 },
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Cost Price (₹)"
                    name="baseCostPrice"
                    value={formData.baseCostPrice}
                    onChange={handleNumberChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>
                        </InputAdornment>
                      ),
                      inputProps: { min: 0, step: 0.01 },
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>

              {/* GST Details - Google Material Design Style */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    }}
                  >
                    <NumbersIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    GST Details
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  '& > *': {
                    flex: '1 1 300px',
                    minWidth: { xs: '100%', sm: '300px' }
                  }
                }}>
                  <FormControl 
                    fullWidth 
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&.Mui-focused': {
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      },
                    }}
                  >
                    <InputLabel>GST Type</InputLabel>
                    <Select
                      name="gstDetails.type"
                      value={formData.gstDetails.type}
                      onChange={(e) => handleInputChange({ target: { name: 'gstDetails.type', value: e.target.value } } as any)}
                      label="GST Type"
                    >
                      <MenuItem value="cgst_sgst">CGST + SGST</MenuItem>
                      <MenuItem value="igst">IGST</MenuItem>
                      <MenuItem value="utgst">UTGST</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    required
                    fullWidth
                    label="HSN Code"
                    name="gstDetails.hsnCode"
                    value={formData.gstDetails.hsnCode}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />

                  {formData.gstDetails.type === 'cgst_sgst' && (
                    <>
                      <TextField
                        fullWidth
                        type="number"
                        label="CGST Rate (%)"
                        name="gstDetails.cgstRate"
                        value={formData.gstDetails.cgstRate}
                        onChange={handleNumberChange}
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 100, step: 0.1 },
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="SGST Rate (%)"
                        name="gstDetails.sgstRate"
                        value={formData.gstDetails.sgstRate}
                        onChange={handleNumberChange}
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 100, step: 0.1 },
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                    </>
                  )}

                  {formData.gstDetails.type === 'igst' && (
                    <TextField
                      fullWidth
                      type="number"
                      label="IGST Rate (%)"
                      name="gstDetails.igstRate"
                      value={formData.gstDetails.igstRate}
                      onChange={handleNumberChange}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        inputProps: { min: 0, max: 100, step: 0.1 },
                        sx: {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                          },
                          '&.Mui-focused': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </Paper>

              {/* Tags - Google Material Design Style */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    }}
                  >
                    <TagIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Tags
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        sx: {
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                          },
                          '&.Mui-focused': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                          },
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddTag}
                      sx={{
                        borderRadius: '12px',
                        px: 3,
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        color: darkMode ? '#e8eaed' : '#202124',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                        sx={{
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                          '& .MuiChip-deleteIcon': {
                            color: darkMode ? '#8ab4f8' : '#1a73e8',
                            '&:hover': {
                              color: darkMode ? '#f28b82' : '#ea4335',
                            },
                          },
                        }}
                      />
                    ))}
                    {formData.tags.length === 0 && (
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', py: 1 }}>
                        No tags added
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Right Column - Variations, Batches & Actions */}
            <Box sx={{ flex: { lg: 1 } }}>
              {/* Product Stats - Google Material Design Style */}
              <Card
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                    Product Stats
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    '& > *': {
                      flex: '1 1 120px'
                    }
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Variations
                      </Typography>
                      <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {formData.variations.length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Total Stock
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight={500} 
                        sx={{ 
                          color: totalStock <= 10 
                            ? darkMode ? '#fdd663' : '#fbbc04' 
                            : darkMode ? '#e8eaed' : '#202124' 
                        }}
                      >
                        {totalStock}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Total Value
                      </Typography>
                      <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        ₹{totalValue.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Batches
                      </Typography>
                      <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {formData.batches.length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Variations - Google Material Design Style */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Variations ({formData.variations.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddVariation}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 0.5,
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                      },
                    }}
                  >
                    Add
                  </Button>
                </Stack>

                {formData.variations.length === 0 ? (
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', textAlign: 'center', py: 2 }}>
                    No variations added
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '& th': { borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` } }}>
                          <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Name</TableCell>
                          <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Stock</TableCell>
                          <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Price</TableCell>
                          <TableCell align="center" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.variations.map((variation, index) => (
                          <TableRow key={index} sx={{ '& td': { borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` } }}>
                            <TableCell sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{variation.name}</TableCell>
                            <TableCell align="right">
                              <Typography 
                                sx={{ 
                                  color: variation.stock <= 10 
                                    ? darkMode ? '#fdd663' : '#fbbc04' 
                                    : darkMode ? '#e8eaed' : '#202124',
                                  fontWeight: 500,
                                }}
                              >
                                {variation.stock}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8', fontWeight: 500 }}>
                              ₹{variation.price}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditVariation(index)}
                                  sx={{
                                    color: darkMode ? '#9aa0a6' : '#5f6368',
                                    '&:hover': {
                                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleRemoveVariation(index)}
                                  sx={{
                                    color: darkMode ? '#9aa0a6' : '#5f6368',
                                    '&:hover': {
                                      color: darkMode ? '#f28b82' : '#ea4335',
                                      backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              {/* Batches - Google Material Design Style */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Batches ({formData.batches.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddBatch}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 0.5,
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                      },
                    }}
                  >
                    Add
                  </Button>
                </Stack>

                {formData.batches.length === 0 ? (
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', textAlign: 'center', py: 2 }}>
                    No batches added
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '& th': { borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` } }}>
                          <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Batch No.</TableCell>
                          <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Qty</TableCell>
                          <TableCell align="center" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Expiry</TableCell>
                          <TableCell align="center" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.batches.map((batch, index) => {
                          const expDate = new Date(batch.expDate)
                          const isExpired = expDate < new Date()
                          const isExpiringSoon = expDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          
                          return (
                            <TableRow key={index} sx={{ '& td': { borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` } }}>
                              <TableCell sx={{ color: darkMode ? '#e8eaed' : '#202124', fontFamily: 'monospace' }}>
                                {batch.batchNumber}
                              </TableCell>
                              <TableCell align="right" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {batch.quantity}
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title={expDate.toLocaleDateString()}>
                                  <Chip
                                    label={expDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    size="small"
                                    icon={isExpired || isExpiringSoon ? <WarningIcon sx={{ fontSize: '0.9rem !important' }} /> : <CalendarIcon sx={{ fontSize: '0.9rem !important' }} />}
                                    sx={{
                                      backgroundColor: isExpired
                                        ? darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)'
                                        : isExpiringSoon
                                        ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'
                                        : darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                                      color: isExpired
                                        ? darkMode ? '#f28b82' : '#ea4335'
                                        : isExpiringSoon
                                        ? darkMode ? '#fdd663' : '#fbbc04'
                                        : darkMode ? '#8ab4f8' : '#1a73e8',
                                      border: 'none',
                                    }}
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Edit">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditBatch(index)}
                                    sx={{
                                      color: darkMode ? '#9aa0a6' : '#5f6368',
                                      '&:hover': {
                                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                                      },
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleRemoveBatch(index)}
                                    sx={{
                                      color: darkMode ? '#9aa0a6' : '#5f6368',
                                      '&:hover': {
                                        color: darkMode ? '#f28b82' : '#ea4335',
                                        backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              {/* Return Policy - Google Material Design Style */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                }}
              >
                <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                  Return Policy
                </Typography>
                <Divider sx={{ mb: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isReturnable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isReturnable: e.target.checked }))}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Product is returnable
                    </Typography>
                  }
                />
                
                {formData.isReturnable && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Return Period (days)"
                    name="returnPeriod"
                    value={formData.returnPeriod}
                    onChange={handleNumberChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />
                )}
              </Paper>

              {/* Action Buttons - Google Material Design Style */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isUpdating}
                  startIcon={<SaveIcon />}
                  sx={{
                    borderRadius: '28px',
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
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push('/products')}
                  sx={{
                    borderRadius: '28px',
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
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Container>

      {/* Variation Dialog - Google Material Design Style */}
      <Dialog 
        open={variationDialog.open} 
        onClose={() => setVariationDialog({ open: false, index: -1 })}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            pb: 2,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 500,
            color: darkMode ? '#e8eaed' : '#202124',
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        >
          {variationDialog.index === -1 ? 'Add Variation' : 'Edit Variation'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': {
                flex: '1 1 200px',
                minWidth: '200px'
              }
            }}>
              <Box sx={{ flexBasis: '100%' }}>
                <TextField
                  fullWidth
                  label="Variation Name"
                  value={newVariation.name}
                  onChange={(e) => setNewVariation(prev => ({ ...prev, name: e.target.value }))}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                      },
                      '&.Mui-focused': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                      },
                    },
                  }}
                />
              </Box>
              <TextField
                fullWidth
                type="number"
                label="Price (₹)"
                value={newVariation.price}
                onChange={(e) => setNewVariation(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="number"
                label="Cost Price (₹)"
                value={newVariation.costPrice}
                onChange={(e) => setNewVariation(prev => ({ ...prev, costPrice: Number(e.target.value) || 0 }))}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="number"
                label="Stock"
                value={newVariation.stock}
                onChange={(e) => setNewVariation(prev => ({ ...prev, stock: Number(e.target.value) || 0 }))}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Size"
                value={newVariation.size}
                onChange={(e) => setNewVariation(prev => ({ ...prev, size: e.target.value }))}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Color"
                value={newVariation.color}
                onChange={(e) => setNewVariation(prev => ({ ...prev, color: e.target.value }))}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Material"
                value={newVariation.material}
                onChange={(e) => setNewVariation(prev => ({ ...prev, material: e.target.value }))}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        >
          <Button
            onClick={() => setVariationDialog({ open: false, index: -1 })}
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveVariation}
            variant="contained"
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Dialog - Google Material Design Style */}
      <Dialog 
        open={batchDialog.open} 
        onClose={() => setBatchDialog({ open: false, index: -1 })}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            pb: 2,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 500,
            color: darkMode ? '#e8eaed' : '#202124',
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        >
          {batchDialog.index === -1 ? 'Add Batch' : 'Edit Batch'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': {
                flex: '1 1 200px',
                minWidth: '200px'
              }
            }}>
              <Box sx={{ flexBasis: '100%' }}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  value={newBatch.batchNumber}
                  onChange={(e) => setNewBatch(prev => ({ ...prev, batchNumber: e.target.value }))}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                      },
                      '&.Mui-focused': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                      },
                    },
                  }}
                />
              </Box>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={newBatch.quantity}
                onChange={(e) => setNewBatch(prev => ({ ...prev, quantity: Number(e.target.value) || 0 }))}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="number"
                label="Cost Price (₹)"
                value={newBatch.costPrice}
                onChange={(e) => setNewBatch(prev => ({ ...prev, costPrice: Number(e.target.value) || 0 }))}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="number"
                label="Selling Price (₹)"
                value={newBatch.sellingPrice}
                onChange={(e) => setNewBatch(prev => ({ ...prev, sellingPrice: Number(e.target.value) || 0 }))}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="date"
                label="MFG Date"
                value={newBatch.mfgDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, mfgDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="date"
                label="Expiry Date"
                value={newBatch.expDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, expDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="date"
                label="Received Date"
                value={newBatch.receivedDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, receivedDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        >
          <Button
            onClick={() => setBatchDialog({ open: false, index: -1 })}
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveBatch}
            variant="contained"
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}