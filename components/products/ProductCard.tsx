// components/products/ProductCard.tsx
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
  Badge,
  Tooltip
} from '@mui/material'
import {
  MoreVert as MoreIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon
} from '@mui/icons-material'
import { Product } from '@/types'
import { useProducts } from '@/hooks/useProducts'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { deleteProduct, isDeleting } = useProducts()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id)
        handleMenuClose()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const handleEdit = () => {
    // Navigate to edit page
    window.location.href = `/products/edit/${product.id}`
    handleMenuClose()
  }

  const handleDuplicate = () => {
    // Implement duplicate logic
    handleMenuClose()
  }

  // Calculate stock status
  const totalStock = product.variations?.reduce((sum, variation) => sum + variation.stock, 0) || 0
  const lowStock = product.variations?.some(v => v.stock <= (v.minStock || 10)) || false
  const outOfStock = totalStock === 0

  // Check for expiring batches
  const expiringBatches = product.batches?.filter(batch => {
    const expDate = new Date(batch.expDate)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return expDate < thirtyDaysFromNow && expDate > new Date()
  }) || []

  const expiredBatches = product.batches?.filter(batch => 
    new Date(batch.expDate) < new Date()
  ) || []

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
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
            bgcolor: 'grey.100',
            borderRadius: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InventoryIcon sx={{ fontSize: 40, color: 'grey.400' }} />
        </Box>

        {/* Product Name */}
        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
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
          ₹{product.basePrice}
          {product.baseCostPrice > 0 && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              component="span" 
              sx={{ ml: 1 }}
            >
              (Cost: ₹{product.baseCostPrice})
            </Typography>
          )}
        </Typography>

        {/* Stock Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InventoryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Stock: {totalStock}
          </Typography>
          {(lowStock || outOfStock) && (
            <Tooltip title={outOfStock ? "Out of stock" : "Low stock"}>
              <WarningIcon 
                sx={{ 
                  fontSize: 16, 
                  ml: 1, 
                  color: outOfStock ? 'error.main' : 'warning.main' 
                }} 
              />
            </Tooltip>
          )}
        </Box>

        {/* HSN Code */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          HSN: {product.gstDetails.hsnCode}
        </Typography>

        {/* Variations Count */}
        {product.variations && product.variations.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.variations.length} variation{product.variations.length > 1 ? 's' : ''}
          </Typography>
        )}

        {/* Batch Alerts */}
        {(expiredBatches.length > 0 || expiringBatches.length > 0) && (
          <Box sx={{ mt: 1 }}>
            {expiredBatches.length > 0 && (
              <Chip
                label={`${expiredBatches.length} expired`}
                size="small"
                color="error"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {expiringBatches.length > 0 && (
              <Chip
                label={`${expiringBatches.length} expiring`}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ mb: 1 }}
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
          disabled={isDeleting}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </MenuItem>
      </Menu>
    </Card>
  )
}