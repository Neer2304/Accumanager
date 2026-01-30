import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material'
import { TrendingUp, Inventory as ProductIcon, Refresh } from '@mui/icons-material'
import { ProductSalesData } from '@/types'

interface TopProductsChartProps {
  data?: ProductSalesData[]
}

interface ProductStats {
  _id: string
  name: string
  totalSales: number
  totalRevenue: number
  stock: number
  category: string
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data: propData }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const [productsData, setProductsData] = useState<ProductStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTopProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // If data is passed as prop, use it
      if (propData && propData.length > 0) {
        console.log('📊 Using prop data for top products:', propData)
        setProductsData(propData.map((item, index) => ({
          // FIX: Create unique ID using item properties and index
          _id: item.id || item.productId || `${item.productName}_${index}_${Date.now()}`,
          name: item.productName || 'Unknown Product',
          totalSales: item.sales || 0,
          totalRevenue: item.revenue || 0,
          stock: 0,
          category: ''
        })))
        setLoading(false)
        return
      }

      // Otherwise fetch from API
      console.log('📊 Fetching top products from API...')
      const response = await fetch('/api/dashboard/top-products', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Top products data received:', data)
      
      if (data && Array.isArray(data)) {
        // FIX: Ensure each item has a unique _id
        const productsWithUniqueIds = data.map((item, index) => ({
          ...item,
          _id: item._id || `product_${index}_${Date.now()}`
        }))
        setProductsData(productsWithUniqueIds)
      } else {
        throw new Error('Invalid data format received')
      }

    } catch (err: any) {
      console.error('❌ Error fetching top products:', err)
      setError(err.message || 'Failed to load top products data')
      // Don't use fallback data - show empty state
      setProductsData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopProducts()
  }, [propData])

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'error'
    if (stock < 10) return 'warning'
    return 'success'
  }

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Out of Stock'
    if (stock < 10) return 'Low Stock'
    return 'In Stock'
  }

  const handleRefresh = () => {
    fetchTopProducts()
  }

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: { xs: 1, sm: 2 }
      }}>
        <CardContent sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: { xs: 1.5, sm: 2 } 
        }}>
          <CircularProgress size={isMobile ? 24 : 32} />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Loading top products...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: { xs: 1, sm: 2 }
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: { xs: 1.5, sm: 2 },
        '&:last-child': { pb: { xs: 1.5, sm: 2 } }
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUp 
              color="primary" 
              sx={{ fontSize: { xs: 20, sm: 24 } }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}
            >
              Top Products
            </Typography>
          </Box>
          <Tooltip title="Refresh data">
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <Refresh fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 }
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ 
          flex: 1, 
          minHeight: isMobile ? 180 : 200,
          overflow: 'auto'
        }}>
          {productsData.length > 0 ? (
            <List 
              dense 
              sx={{ 
                height: '100%',
                pt: 0
              }}
            >
              {productsData.map((product, index) => (
                <ListItem 
                  // FIX: Use a combination of _id and index for unique key
                  key={`${product._id}_${index}`}
                  divider={index !== productsData.length - 1}
                  sx={{ 
                    py: { xs: 1, sm: 1.5 },
                    px: 0,
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 1
                    }}>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9rem' },
                          lineHeight: 1.3,
                          flex: 1
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color={index < 3 ? "primary" : "default"}
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: 32,
                          height: 24,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    
                    {product.category && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          mt: 0.25, 
                          display: 'block',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      >
                        {product.category}
                      </Typography>
                    )}
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1, 
                      mt: 0.5,
                      alignItems: 'center'
                    }}>
                      <Typography 
                        variant="caption" 
                        color="primary.main"
                        fontWeight="medium"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      >
                        Sold: {product.totalSales}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="success.main"
                        fontWeight="medium"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      >
                        ₹{product.totalRevenue.toLocaleString()}
                      </Typography>
                      {product.stock > 0 && (
                        <Chip
                          label={getStockText(product.stock)}
                          size="small"
                          color={getStockColor(product.stock)}
                          variant="outlined"
                          sx={{ 
                            height: 20,
                            fontSize: { xs: '0.6rem', sm: '0.65rem' },
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              textAlign: 'center',
              py: { xs: 3, sm: 4 } 
            }}>
              <ProductIcon sx={{ 
                fontSize: { xs: 36, sm: 48 }, 
                color: 'text.secondary', 
                mb: 1,
                opacity: 0.5
              }} />
              <Typography 
                color="text.secondary" 
                variant="body2"
                gutterBottom
                sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
              >
                No product sales data available
              </Typography>
              <Typography 
                color="text.secondary" 
                variant="caption"
                sx={{ 
                  maxWidth: 200,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                {error 
                  ? 'Unable to load product data. Please try again.'
                  : 'Complete some orders to see your top products here.'
                }
              </Typography>
            </Box>
          )}
        </Box>

        {/* Summary */}
        {productsData.length > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Box>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                Total: {productsData.length} products
              </Typography>
              {productsData[0]?.totalSales > 0 && (
                <Typography 
                  variant="caption" 
                  color="primary.main" 
                  fontWeight="medium"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  Top: {productsData[0]?.name}
                </Typography>
              )}
            </Box>
            <Typography 
              variant="caption" 
              color="success.main" 
              fontWeight="bold"
              sx={{ 
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            >
              ₹{productsData.reduce((sum, product) => sum + product.totalRevenue, 0).toLocaleString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default TopProductsChart