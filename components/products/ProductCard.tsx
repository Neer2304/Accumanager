// components/products/ProductCard.tsx - UPDATED VERSION
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Badge
} from '@mui/material'
import {
  MoreVert as MoreIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  CloudOff as CloudOffIcon,
  Sync as SyncIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { Product } from '@/types/indexs'
import { useProducts } from '@/hooks/useProducts'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
  isOnline: boolean
  onSync: () => void
}

// Helper function to calculate total stock
const calculateTotalStock = (product: Product): number => {
  const variationStock = product.variations.reduce((sum, variation) => sum + (variation.stock || 0), 0);
  const batchStock = product.batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
  return variationStock + batchStock;
};

// Helper function to check if product is low stock
const isProductLowStock = (product: Product): boolean => {
  const hasLowVariation = product.variations.some(v => (v.stock || 0) <= 10);
  const totalStock = calculateTotalStock(product);
  return hasLowVariation || totalStock <= 10;
};

export default function ProductCard({ product, isOnline, onSync }: ProductCardProps) {
  const router = useRouter()
  const { deleteProduct, isDeleting } = useProducts()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleDelete = async () => {
  console.log("🔍 Delete clicked - Product ID:", product._id);
  console.log("🔍 Delete clicked - Product ID type:", typeof product._id);
  console.log("🔍 Delete clicked - Product ID length:", product._id?.length);
  
  if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
    try {
      await deleteProduct(product._id)
      handleMenuClose()
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

  const handleEdit = () => {
    router.push(`/products/edit/${product._id}`)
    handleMenuClose()
  }

  const handleDuplicate = () => {
    console.log('Duplicate product:', product._id)
    handleMenuClose()
  }

  // Calculate stock status
  const totalStock = calculateTotalStock(product);
  const outOfStock = totalStock === 0;

  // Check for expiring batches
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const expiringBatches = product.batches.filter(batch => {
    if (!batch.expDate) return false
    const expDate = new Date(batch.expDate)
    return expDate > now && expDate <= thirtyDaysFromNow
  })

  const expiredBatches = product.batches.filter(batch => {
    if (!batch.expDate) return false
    const expDate = new Date(batch.expDate)
    return expDate <= now
  })

  // Determine product status
  const isExpired = expiredBatches.length > 0
  const isExpiringSoon = expiringBatches.length > 0
  const isLowStock = isProductLowStock(product)

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        position: 'relative',
        border: isExpired ? '2px solid #ff4444' : 
                isExpiringSoon ? '2px solid #ff9900' : 
                isLowStock ? '2px solid #ffbb33' : 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          borderColor: isExpired ? '#ff4444' : 
                      isExpiringSoon ? '#ff9900' : 
                      isLowStock ? '#ffbb33' : 'primary.main'
        }
      }}
    >
      {/* Status Badges */}
      {(isExpired || isExpiringSoon || isLowStock || outOfStock) && (
        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1, zIndex: 1 }}>
          {outOfStock && (
            <Chip
              label="Out of Stock"
              size="small"
              color="error"
              sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
            />
          )}
          {isExpired && (
            <Chip
              label="Expired"
              size="small"
              color="error"
              sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
            />
          )}
          {isExpiringSoon && !isExpired && (
            <Chip
              label="Expiring Soon"
              size="small"
              color="warning"
              sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
            />
          )}
          {isLowStock && !outOfStock && (
            <Chip
              label="Low Stock"
              size="small"
              color="warning"
              sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
            />
          )}
        </Box>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <Tooltip title="Offline - Changes saved locally">
            <CloudOffIcon color="warning" fontSize="small" />
          </Tooltip>
        </Box>
      )}

      <CardContent sx={{ p: 3, pt: isExpired || isExpiringSoon || isLowStock ? 6 : 3 }}>
        {/* Menu Button */}
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <MoreIcon />
        </IconButton>

        {/* Product Image Placeholder */}
        <Box
          sx={{
            width: '100%',
            height: 120,
            bgcolor: isExpired ? 'error.light' : 
                     isExpiringSoon ? 'warning.light' : 
                     isLowStock ? 'warning.light' : 'grey.100',
            borderRadius: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isExpired ? 0.7 : 1
          }}
        >
          <InventoryIcon sx={{ 
            fontSize: 40, 
            color: isExpired ? 'error.main' : 
                   isExpiringSoon ? 'warning.main' : 
                   isLowStock ? 'warning.main' : 'grey.400' 
          }} />
        </Box>

        {/* Product Name */}
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          gutterBottom 
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: isExpired ? 'text.secondary' : 'text.primary'
          }}
        >
          {product.name}
        </Typography>

        {/* Category and Brand */}
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={product.category} 
            size="small" 
            variant="outlined"
            sx={{ mr: 1, mb: 1 }}
          />
          {product.brand && (
            <Chip 
              label={product.brand} 
              size="small" 
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}
        </Box>

        {/* Price */}
        <Typography variant="h6" color="primary" gutterBottom>
          ₹{product.basePrice?.toLocaleString() || 0}
          {product.baseCostPrice > 0 && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              component="span" 
              sx={{ ml: 1 }}
            >
              (Cost: ₹{product.baseCostPrice?.toLocaleString()})
            </Typography>
          )}
        </Typography>

        {/* Stock Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InventoryIcon sx={{ 
            fontSize: 16, 
            mr: 1, 
            color: outOfStock ? 'error.main' : 
                   isLowStock ? 'warning.main' : 'text.secondary' 
          }} />
          <Typography variant="body2" color={outOfStock ? 'error.main' : 'text.secondary'}>
            Stock: {totalStock}
          </Typography>
        </Box>

        {/* HSN Code */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          HSN: {product.gstDetails?.hsnCode || 'N/A'}
        </Typography>

        {/* Variations Count */}
        {product.variations && product.variations.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.variations.length} variation{product.variations.length > 1 ? 's' : ''}
          </Typography>
        )}

        {/* Batch Alerts */}
        {(expiredBatches.length > 0 || expiringBatches.length > 0) && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {expiredBatches.length > 0 && (
              <Chip
                label={`${expiredBatches.length} expired`}
                size="small"
                color="error"
                variant="outlined"
                icon={<WarningIcon />}
              />
            )}
            {expiringBatches.length > 0 && (
              <Chip
                label={`${expiringBatches.length} expiring`}
                size="small"
                color="warning"
                variant="outlined"
                icon={<CalendarIcon />}
              />
            )}
          </Box>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {product.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
              />
            ))}
            {product.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{product.tags.length - 3} more
              </Typography>
            )}
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={handleEdit}
            disabled={!isOnline}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting || !isOnline}
            startIcon={<DeleteIcon />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Box>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <DuplicateIcon sx={{ mr: 1, fontSize: 20 }} />
          Duplicate
        </MenuItem>
        <MenuItem 
          onClick={handleDelete} 
          disabled={isDeleting || !isOnline}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </MenuItem>
        {!isOnline && (
          <MenuItem onClick={onSync}>
            <SyncIcon sx={{ mr: 1, fontSize: 20 }} />
            Sync When Online
          </MenuItem>
        )}
      </Menu>
    </Card>
  )
}