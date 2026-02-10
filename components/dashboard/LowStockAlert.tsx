import React from 'react'
import {
  Alert,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  alpha,
  useTheme
} from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'

const LowStockAlert: React.FC = () => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const { products } = useProducts()
  
  const lowStockProducts = products.filter(product => {
    const totalStock = product.variations?.reduce((sum, variation) => 
      sum + (variation.stock || 0), 0
    ) || 0
    return totalStock < 10
  })

  if (lowStockProducts.length === 0) return null

  return (
    <Alert 
      severity="warning" 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        backgroundColor: darkMode ? alpha('#fbbc04', 0.15) : alpha('#fbbc04', 0.08),
        border: `1px solid ${darkMode ? alpha('#fbbc04', 0.3) : alpha('#fbbc04', 0.2)}`,
        color: darkMode ? '#fdd663' : '#f29900',
      }}
      icon={<WarningIcon sx={{ color: '#fbbc04' }} />}
      action={
        <Button 
          color="inherit" 
          size="small" 
          component={Link}
          href="/products"
          sx={{ 
            color: darkMode ? '#fdd663' : '#f29900',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            '&:hover': {
              backgroundColor: darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.15)
            }
          }}
        >
          View Products
        </Button>
      }
    >
      <Box>
        <Typography 
          fontWeight="bold" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '0.9rem', sm: '1rem' },
            color: darkMode ? '#e8eaed' : '#202124'
          }}
        >
          Low Stock Alert! 🚨
        </Typography>
        <Typography 
          variant="body2" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            color: darkMode ? '#9aa0a6' : '#5f6368'
          }}
        >
          {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock.
        </Typography>
        <List 
          dense 
          sx={{ 
            maxHeight: 120, 
            overflow: 'auto',
            backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
            borderRadius: 1,
            mt: 1
          }}
        >
          {lowStockProducts.slice(0, 3).map(product => (
            <ListItem 
              key={product._id} 
              dense
              sx={{ 
                borderBottom: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <ListItemText
                primary={
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: darkMode ? '#e8eaed' : '#202124'
                    }}
                  >
                    {product.name}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="caption"
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      color: darkMode ? '#9aa0a6' : '#5f6368'
                    }}
                  >
                    Stock: {product.variations?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0}
                  </Typography>
                }
              />
            </ListItem>
          ))}
          {lowStockProducts.length > 3 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography 
                    variant="caption"
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      color: darkMode ? '#9aa0a6' : '#5f6368'
                    }}
                  >
                    ... and {lowStockProducts.length - 3} more products
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Alert>
  )
}

export default LowStockAlert