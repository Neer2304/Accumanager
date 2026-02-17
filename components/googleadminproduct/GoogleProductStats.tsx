// components/googleadminproduct/GoogleProductStats.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Box,
  Typography,
  Divider,
  Badge,
  LinearProgress,
  alpha,
} from '@mui/material'
import {
  Category,
  Business,
  Label,
  Inventory,
  LocalOffer,
  ShoppingCart,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import { ProductStatsProps } from './types'

export default function GoogleProductStats({
  product,
  darkMode,
  calculateTotalStock,
  formatCurrency,
  getStockStatus,
}: ProductStatsProps) {
  if (!product) return null

  const totalStock = calculateTotalStock(product)
  const stockStatus = getStockStatus(totalStock)

  return (
    <>
      {/* Product Stats */}
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
        mb: 3,
      }}>
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              fontSize: '2rem',
            }}>
              {product.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
                {product.description || 'No description available'}
              </Typography>
            </Box>
            <Badge 
              badgeContent={product.isActive ? 'Active' : 'Inactive'} 
              sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: '0.7rem', 
                  padding: '0 8px',
                  height: 24,
                  minWidth: 60,
                  borderRadius: '12px',
                  backgroundColor: product.isActive ? '#34a853' : '#ea4335',
                  color: '#ffffff',
                  position: 'static',
                  transform: 'none',
                } 
              }}
            />
          </Stack>

          <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-around" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Base Price</Typography>
              <Typography variant="h4" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} fontWeight="bold">
                {formatCurrency(product.basePrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Cost Price</Typography>
              <Typography variant="h5" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {formatCurrency(product.baseCostPrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Stock Status</Typography>
              <Typography variant="h5" sx={{ color: stockStatus.color }}>
                {totalStock} units
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Info Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Category />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Category</Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {product.category}
                </Typography>
                {product.subCategory && (
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {product.subCategory}
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Business />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Brand</Typography>
                <Typography variant="body1" fontWeight="medium" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {product.brand || 'No Brand'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Label />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>SKU</Typography>
                <Typography variant="body1" fontWeight="medium" fontFamily="monospace" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {product.sku || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Stock Summary */}
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
        mb: 3,
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
          }}>
            <Inventory /> Inventory Summary
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Total Stock</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {totalStock} units
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(totalStock * 2, 100)} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: darkMode ? '#3c4043' : '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: stockStatus.color,
                    borderRadius: 4,
                  }
                }}
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  margin: '0 auto 8px' 
                }}>
                  <LocalOffer />
                </Avatar>
                <Typography variant="h5" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {product.variations?.length || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Variations</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.1),
                  color: '#fbbc04',
                  margin: '0 auto 8px' 
                }}>
                  <ShoppingCart />
                </Avatar>
                <Typography variant="h5" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {product.batches?.length || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Batches</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: product.isReturnable 
                    ? (darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.1))
                    : (darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.1)),
                  color: product.isReturnable ? '#34a853' : '#ea4335',
                  margin: '0 auto 8px' 
                }}>
                  {product.isReturnable ? <CheckCircle /> : <Cancel />}
                </Avatar>
                <Typography variant="h5" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {product.isReturnable ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Returnable</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}