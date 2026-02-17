// components/googleadminproduct/GoogleProductHeader.tsx
'use client'

import React from 'react'
import {
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Chip,
  alpha,
} from '@mui/material'
import {
  ArrowBack,
  Refresh,
  Edit,
  Numbers,
  Store,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import { ProductHeaderProps } from './types'

export default function GoogleProductHeader({
  product,
  onBack,
  onRefresh,
  onEdit,
  darkMode,
  isMobile,
}: ProductHeaderProps) {
  if (!product) return null

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title="Back to Products">
            <IconButton 
              onClick={onBack}
              sx={{ 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '12px',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                }
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Product Details
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Manage and view detailed information about this product
            </Typography>
          </Box>
        </Stack>
        
        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={onRefresh}
              sx={{ 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '12px',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
              borderRadius: '24px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              }
            }}
          >
            Edit Product
          </Button>
        </Stack>
      </Stack>

      {/* Product ID Badge */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Chip 
          icon={<Numbers sx={{ fontSize: 16 }} />}
          label={`ID: ${product._id}`}
          size="small"
          sx={{
            backgroundColor: darkMode ? alpha('#9aa0a6', 0.1) : alpha('#5f6368', 0.1),
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontFamily: 'monospace',
            border: 'none',
            fontSize: '0.8rem',
          }}
        />
        <Chip 
          icon={<Store sx={{ fontSize: 16 }} />}
          label={`Category: ${product.category}`}
          size="small"
          sx={{
            backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
            color: darkMode ? '#8ab4f8' : '#1a73e8',
            border: 'none',
            fontSize: '0.8rem',
          }}
        />
        {product.isActive ? (
          <Chip 
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label="Active"
            size="small"
            sx={{
              backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.1),
              color: '#34a853',
              border: 'none',
              fontSize: '0.8rem',
            }}
          />
        ) : (
          <Chip 
            icon={<Cancel sx={{ fontSize: 16 }} />}
            label="Inactive"
            size="small"
            sx={{
              backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.1),
              color: '#ea4335',
              border: 'none',
              fontSize: '0.8rem',
            }}
          />
        )}
        {product.sku && (
          <Chip 
            icon={<Numbers sx={{ fontSize: 16 }} />}
            label={`SKU: ${product.sku}`}
            size="small"
            sx={{
              backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.1),
              color: '#fbbc04',
              border: 'none',
              fontSize: '0.8rem',
            }}
          />
        )}
      </Stack>
    </>
  )
}