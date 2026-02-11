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
  Badge,
  Avatar,
  Stack,
  Divider,
  alpha,
  useTheme,
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
  CalendarToday as CalendarIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
  LocalOffer as LocalOfferIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
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
  const hasLowBatch = product.batches.some(b => (b.quantity || 0) <= 10);
  const totalStock = calculateTotalStock(product);
  return hasLowVariation || hasLowBatch || totalStock <= 10;
};

export default function ProductCard({ product, isOnline, onSync }: ProductCardProps) {
  const router = useRouter()
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
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

  // Get status color
  const getStatusColor = () => {
    if (isExpired) return '#ea4335'
    if (isExpiringSoon) return '#fbbc04'
    if (isLowStock) return '#fbbc04'
    if (outOfStock) return '#ea4335'
    return darkMode ? '#8ab4f8' : '#1a73e8'
  }

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: 'none',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode
            ? '0 8px 16px rgba(0, 0, 0, 0.4)'
            : '0 8px 16px rgba(0, 0, 0, 0.08)',
          borderColor: getStatusColor(),
        },
      }}
    >
      {/* Status Badges - Google Material Design Style */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1, zIndex: 2 }}>
        {outOfStock && (
          <Chip
            label="Out of Stock"
            size="small"
            sx={{
              backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
              color: darkMode ? '#f28b82' : '#ea4335',
              border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.3)' : 'rgba(234, 67, 53, 0.2)'}`,
              fontSize: '0.65rem',
              fontWeight: 600,
              height: 20,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        )}
        {isExpired && (
          <Chip
            label="Expired"
            size="small"
            sx={{
              backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
              color: darkMode ? '#f28b82' : '#ea4335',
              border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.3)' : 'rgba(234, 67, 53, 0.2)'}`,
              fontSize: '0.65rem',
              fontWeight: 600,
              height: 20,
            }}
          />
        )}
        {isExpiringSoon && !isExpired && (
          <Chip
            label="Expiring Soon"
            size="small"
            sx={{
              backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
              color: darkMode ? '#fdd663' : '#fbbc04',
              border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.3)' : 'rgba(251, 188, 4, 0.2)'}`,
              fontSize: '0.65rem',
              fontWeight: 600,
              height: 20,
            }}
          />
        )}
        {isLowStock && !outOfStock && !isExpired && !isExpiringSoon && (
          <Chip
            label="Low Stock"
            size="small"
            sx={{
              backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
              color: darkMode ? '#fdd663' : '#fbbc04',
              border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.3)' : 'rgba(251, 188, 4, 0.2)'}`,
              fontSize: '0.65rem',
              fontWeight: 600,
              height: 20,
            }}
          />
        )}
      </Box>

      {/* Offline Indicator */}
      {!isOnline && (
        <Box sx={{ position: 'absolute', top: 12, right: 48, zIndex: 2 }}>
          <Tooltip title="Offline - Changes saved locally">
            <CloudOffIcon sx={{ fontSize: 18, color: darkMode ? '#fdd663' : '#fbbc04' }} />
          </Tooltip>
        </Box>
      )}

      {/* Menu Button - Google Material Design Style */}
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          color: darkMode ? '#9aa0a6' : '#5f6368',
          backgroundColor: darkMode ? 'rgba(60, 64, 67, 0.5)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          borderRadius: '12px',
          width: 36,
          height: 36,
          '&:hover': {
            backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            color: darkMode ? '#e8eaed' : '#202124',
          },
        }}
      >
        <MoreIcon fontSize="small" />
      </IconButton>

      <CardContent sx={{ p: 3 }}>
        {/* Product Image Placeholder - Google Material Design Style */}
        <Avatar
          variant="rounded"
          sx={{
            width: '100%',
            height: 120,
            borderRadius: '12px',
            mb: 2,
            backgroundColor: isExpired
              ? darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)'
              : isExpiringSoon || isLowStock
              ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)'
              : darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
            color: isExpired
              ? darkMode ? '#f28b82' : '#ea4335'
              : isExpiringSoon || isLowStock
              ? darkMode ? '#fdd663' : '#fbbc04'
              : darkMode ? '#8ab4f8' : '#1a73e8',
            opacity: isExpired ? 0.7 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          <InventoryIcon sx={{ fontSize: 48 }} />
        </Avatar>

        {/* Product Name - Google Material Design Style */}
        <Typography
          variant="h6"
          fontWeight={500}
          gutterBottom
          sx={{
            color: isExpired
              ? darkMode ? '#9aa0a6' : '#5f6368'
              : darkMode ? '#e8eaed' : '#202124',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1.5,
          }}
        >
          {product.name}
        </Typography>

        {/* Category and Brand - Google Material Design Style */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            icon={<CategoryIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={product.category}
            size="small"
            sx={{
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              border: 'none',
              fontSize: '0.7rem',
              height: 24,
            }}
          />
          {product.brand && (
            <Chip
              icon={<StoreIcon sx={{ fontSize: '0.9rem !important' }} />}
              label={product.brand}
              size="small"
              sx={{
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                border: 'none',
                fontSize: '0.7rem',
                height: 24,
              }}
            />
          )}
        </Stack>

        {/* Price - Google Material Design Style */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                fontSize: '1.25rem',
              }}
            >
              ₹{product.basePrice?.toLocaleString() || 0}
            </Typography>
            {product.baseCostPrice > 0 && (
              <Typography
                variant="caption"
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                (Cost: ₹{product.baseCostPrice?.toLocaleString()})
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Stock Status - Google Material Design Style */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <InventoryIcon
            sx={{
              fontSize: 16,
              color: outOfStock
                ? darkMode ? '#f28b82' : '#ea4335'
                : isLowStock
                ? darkMode ? '#fdd663' : '#fbbc04'
                : darkMode ? '#9aa0a6' : '#5f6368',
            }}
          />
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              color: outOfStock
                ? darkMode ? '#f28b82' : '#ea4335'
                : isLowStock
                ? darkMode ? '#fdd663' : '#fbbc04'
                : darkMode ? '#e8eaed' : '#202124',
            }}
          >
            Stock: {totalStock}
          </Typography>
        </Stack>

        {/* HSN Code */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            mb: 1,
            fontFamily: 'monospace',
            fontSize: '0.7rem',
          }}
        >
          HSN: {product.gstDetails?.hsnCode || 'N/A'}
        </Typography>

        {/* Variations Count */}
        {product.variations && product.variations.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
            <LocalOfferIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {product.variations.length} variation{product.variations.length > 1 ? 's' : ''}
            </Typography>
          </Stack>
        )}

        {/* Batch Alerts - Google Material Design Style */}
        {(expiredBatches.length > 0 || expiringBatches.length > 0) && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1, flexWrap: 'wrap' }}>
            {expiredBatches.length > 0 && (
              <Chip
                label={`${expiredBatches.length} expired`}
                size="small"
                icon={<WarningIcon sx={{ fontSize: '0.8rem !important' }} />}
                sx={{
                  backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                  color: darkMode ? '#f28b82' : '#ea4335',
                  border: 'none',
                  fontSize: '0.65rem',
                  height: 22,
                }}
              />
            )}
            {expiringBatches.length > 0 && (
              <Chip
                label={`${expiringBatches.length} expiring`}
                size="small"
                icon={<CalendarIcon sx={{ fontSize: '0.8rem !important' }} />}
                sx={{
                  backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                  color: darkMode ? '#fdd663' : '#fbbc04',
                  border: 'none',
                  fontSize: '0.65rem',
                  height: 22,
                }}
              />
            )}
          </Stack>
        )}

        {/* Tags - Google Material Design Style */}
        {product.tags && product.tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
            {product.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  border: 'none',
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            ))}
            {product.tags.length > 3 && (
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                +{product.tags.length - 3} more
              </Typography>
            )}
          </Stack>
        )}

        {/* Divider - Google Material Design Style */}
        <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

        {/* Action Buttons - Google Material Design Style */}
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={handleEdit}
            disabled={!isOnline}
            startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              borderRadius: '20px',
              py: 0.75,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
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
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={handleDelete}
            disabled={isDeleting || !isOnline}
            startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              borderRadius: '20px',
              py: 0.75,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#f28b82' : '#ea4335',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              '&:hover': {
                borderColor: darkMode ? '#f28b82' : '#ea4335',
                backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.05)' : 'rgba(234, 67, 53, 0.05)',
                color: darkMode ? '#f28b82' : '#ea4335',
              },
              '&:disabled': {
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Stack>
      </CardContent>

      {/* Action Menu - Google Material Design Style */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode
              ? '0 8px 16px rgba(0, 0, 0, 0.4)'
              : '0 8px 16px rgba(0, 0, 0, 0.08)',
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            py: 1.5,
            px: 2.5,
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
            },
          }}
        >
          <EditIcon sx={{ mr: 1.5, fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleDuplicate}
          sx={{
            py: 1.5,
            px: 2.5,
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
            },
          }}
        >
          <DuplicateIcon sx={{ mr: 1.5, fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          disabled={isDeleting || !isOnline}
          sx={{
            py: 1.5,
            px: 2.5,
            color: darkMode ? '#f28b82' : '#ea4335',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
            },
            '&.Mui-disabled': {
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        >
          <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </MenuItem>
        {!isOnline && (
          <MenuItem
            onClick={onSync}
            sx={{
              py: 1.5,
              px: 2.5,
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              },
            }}
          >
            <SyncIcon sx={{ mr: 1.5, fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            Sync When Online
          </MenuItem>
        )}
      </Menu>
    </Card>
  )
}