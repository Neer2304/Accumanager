// app/products/edit/[id]/page.tsx - FIXED VERSION
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
  Tooltip
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
  ContentCopy as CopyIcon
} from '@mui/icons-material'
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
          // FIX: Proper date handling
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
      // Add new variation
      setFormData(prev => ({
        ...prev,
        variations: [...prev.variations, newVariation]
      }))
    } else {
      // Update existing variation
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
      // Add new batch
      setFormData(prev => ({
        ...prev,
        batches: [...prev.batches, newBatch]
      }))
    } else {
      // Update existing batch
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
    // Prepare data with proper date formatting
    const submitData = {
      ...formData,
      batches: formData.batches.map(batch => ({
        ...batch,
        // Convert string dates to ISO strings for API
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

  // Calculate totals
  const totalStock = formData.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
  const totalValue = formData.variations.reduce((sum, v) => sum + (v.price * (v.stock || 0)), 0)
  const batchStock = formData.batches.reduce((sum, b) => sum + (b.quantity || 0), 0)
  const batchValue = formData.batches.reduce((sum, b) => sum + (b.sellingPrice * (b.quantity || 0)), 0)

  if (isLoading) {
    return (
      <MainLayout title="Edit Product">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  if (!product) {
    return (
      <MainLayout title="Product Not Found">
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Product not found
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/products')}
          >
            Back to Products
          </Button>
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={`Edit Product: ${product.name}`}>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={() => router.push('/products')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Edit Product
            </Typography>
            <Chip 
              label={product.category} 
              color="primary" 
              variant="outlined" 
              icon={<CategoryIcon />}
            />
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            Update product details, variations, batches, and pricing
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Main Content Container - Using Flex instead of Grid */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3, 
            width: '100%' 
          }}>
            {/* Left Column - Basic Info */}
            <Box sx={{ flex: { md: 2 } }}>
              {/* Basic Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon /> Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StoreIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />

                  <TextField
                    fullWidth
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
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
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Pricing */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon /> Pricing
                </Typography>
                <Divider sx={{ mb: 3 }} />

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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Cost Price (₹)"
                    name="baseCostPrice"
                    value={formData.baseCostPrice}
                    onChange={handleNumberChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Paper>

              {/* GST Details */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  GST Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  '& > *': {
                    flex: '1 1 300px',
                    minWidth: { xs: '100%', sm: '300px' }
                  }
                }}>
                  <FormControl fullWidth>
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
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="SGST Rate (%)"
                        name="gstDetails.sgstRate"
                        value={formData.gstDetails.sgstRate}
                        onChange={handleNumberChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  )}
                </Box>
              </Paper>

              {/* Tags */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TagIcon /> Tags
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      size="small"
                    />
                    <Button variant="outlined" onClick={handleAddTag}>
                      Add
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {formData.tags.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No tags added
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Right Column - Variations, Batches & Actions */}
            <Box sx={{ flex: { md: 1 } }}>
              {/* Stats Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                      <Typography variant="body2" color="text.secondary">
                        Variations
                      </Typography>
                      <Typography variant="h6">
                        {formData.variations.length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Stock
                      </Typography>
                      <Typography variant="h6" color={totalStock <= 10 ? 'warning.main' : 'inherit'}>
                        {totalStock}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Value
                      </Typography>
                      <Typography variant="h6">
                        ₹{totalValue.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Batches
                      </Typography>
                      <Typography variant="h6">
                        {formData.batches.length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Variations */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Variations ({formData.variations.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddVariation}
                  >
                    Add
                  </Button>
                </Box>

                {formData.variations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No variations added
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Stock</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.variations.map((variation, index) => (
                          <TableRow key={index}>
                            <TableCell>{variation.name}</TableCell>
                            <TableCell align="right">
                              <Typography color={variation.stock <= 10 ? 'warning.main' : 'inherit'}>
                                {variation.stock}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">₹{variation.price}</TableCell>
                            <TableCell align="center">
                              <IconButton size="small" onClick={() => handleEditVariation(index)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleRemoveVariation(index)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              {/* Batches */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Batches ({formData.batches.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddBatch}
                  >
                    Add
                  </Button>
                </Box>

                {formData.batches.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No batches added
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Batch No.</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="center">Expiry</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.batches.map((batch, index) => {
                          const expDate = new Date(batch.expDate)
                          const isExpired = expDate < new Date()
                          const isExpiringSoon = expDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>{batch.batchNumber}</TableCell>
                              <TableCell align="right">{batch.quantity}</TableCell>
                              <TableCell align="center">
                                <Tooltip title={expDate.toLocaleDateString()}>
                                  <Chip
                                    label={expDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    size="small"
                                    color={isExpired ? 'error' : isExpiringSoon ? 'warning' : 'default'}
                                    variant="outlined"
                                    icon={isExpired || isExpiringSoon ? <WarningIcon /> : <CalendarIcon />}
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton size="small" onClick={() => handleEditBatch(index)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleRemoveBatch(index)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              {/* Return Policy */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Return Policy
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isReturnable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isReturnable: e.target.checked }))}
                    />
                  }
                  label="Product is returnable"
                />
                
                {formData.isReturnable && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Return Period (days)"
                    name="returnPeriod"
                    value={formData.returnPeriod}
                    onChange={handleNumberChange}
                    sx={{ mt: 2 }}
                  />
                )}
              </Paper>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isUpdating}
                  startIcon={<SaveIcon />}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push('/products')}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Box>

      {/* Variation Dialog */}
      <Dialog open={variationDialog.open} onClose={() => setVariationDialog({ open: false, index: -1 })}>
        <DialogTitle>
          {variationDialog.index === -1 ? 'Add Variation' : 'Edit Variation'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
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
                />
              </Box>
              <TextField
                fullWidth
                type="number"
                label="Price (₹)"
                value={newVariation.price}
                onChange={(e) => setNewVariation(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
              />
              <TextField
                fullWidth
                type="number"
                label="Cost Price (₹)"
                value={newVariation.costPrice}
                onChange={(e) => setNewVariation(prev => ({ ...prev, costPrice: Number(e.target.value) || 0 }))}
              />
              <TextField
                fullWidth
                type="number"
                label="Stock"
                value={newVariation.stock}
                onChange={(e) => setNewVariation(prev => ({ ...prev, stock: Number(e.target.value) || 0 }))}
              />
              <TextField
                fullWidth
                label="Size"
                value={newVariation.size}
                onChange={(e) => setNewVariation(prev => ({ ...prev, size: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Color"
                value={newVariation.color}
                onChange={(e) => setNewVariation(prev => ({ ...prev, color: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Material"
                value={newVariation.material}
                onChange={(e) => setNewVariation(prev => ({ ...prev, material: e.target.value }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVariationDialog({ open: false, index: -1 })}>Cancel</Button>
          <Button onClick={handleSaveVariation} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Batch Dialog */}
      <Dialog open={batchDialog.open} onClose={() => setBatchDialog({ open: false, index: -1 })}>
        <DialogTitle>
          {batchDialog.index === -1 ? 'Add Batch' : 'Edit Batch'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
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
                />
              </Box>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={newBatch.quantity}
                onChange={(e) => setNewBatch(prev => ({ ...prev, quantity: Number(e.target.value) || 0 }))}
              />
              <TextField
                fullWidth
                type="number"
                label="Cost Price (₹)"
                value={newBatch.costPrice}
                onChange={(e) => setNewBatch(prev => ({ ...prev, costPrice: Number(e.target.value) || 0 }))}
              />
              <TextField
                fullWidth
                type="number"
                label="Selling Price (₹)"
                value={newBatch.sellingPrice}
                onChange={(e) => setNewBatch(prev => ({ ...prev, sellingPrice: Number(e.target.value) || 0 }))}
              />
              <TextField
                fullWidth
                type="date"
                label="MFG Date"
                value={newBatch.mfgDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, mfgDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="Expiry Date"
                value={newBatch.expDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, expDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="Received Date"
                value={newBatch.receivedDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, receivedDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchDialog({ open: false, index: -1 })}>Cancel</Button>
          <Button onClick={handleSaveBatch} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}