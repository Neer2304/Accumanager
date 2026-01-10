// components/dashboard/LowStockAlert.tsx - UPDATED
import React from 'react'
import {
  Alert,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'

const LowStockAlert: React.FC = () => {
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
      sx={{ mb: 3 }}
      icon={<WarningIcon />}
      action={
        <Button 
          color="inherit" 
          size="small" 
          component={Link}
          href="/products"
        >
          View Products
        </Button>
      }
    >
      <Box>
        <Typography fontWeight="bold" gutterBottom>
          Low Stock Alert! 🚨
        </Typography>
        <Typography variant="body2" gutterBottom>
          {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock.
        </Typography>
        <List dense sx={{ maxHeight: 120, overflow: 'auto' }}>
          {lowStockProducts.slice(0, 3).map(product => (
            <ListItem key={product._id} dense>
              <ListItemText
                primary={product.name}
                secondary={`Stock: ${product.variations?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0}`}
              />
            </ListItem>
          ))}
          {lowStockProducts.length > 3 && (
            <ListItem>
              <ListItemText
                primary={`... and ${lowStockProducts.length - 3} more products`}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Alert>
  )
}

export default LowStockAlert