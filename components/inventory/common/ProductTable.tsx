import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Avatar,
  LinearProgress,
  alpha,
  Stack,
  IconButton,
} from '@mui/material';
import { InventoryIcons } from '@/assets/icons/InventoryIcons';
import { INVENTORY_CONTENT } from '../InventoryContent';
import { Product } from '@/hooks/useInventoryData';

interface ProductTableProps {
  products: Product[];
  calculateTotalStock: (product: Product) => number;
  getStockStatus: (product: Product) => string;
  getMinStockLevel: (product: Product) => number;
  getCategoryColor: (category: string, theme: any) => string;
  theme: any;
  isMobile: boolean;
}

export const ProductTable = ({ 
  products, 
  calculateTotalStock, 
  getStockStatus, 
  getMinStockLevel,
  getCategoryColor,
  theme,
  isMobile 
}: ProductTableProps) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return theme.palette.success.main;
      case 'low_stock': return theme.palette.warning.main;
      case 'out_of_stock': return theme.palette.error.main;
      case 'over_stock': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <InventoryIcons.CheckCircle />;
      case 'low_stock': return <InventoryIcons.Warning />;
      case 'out_of_stock': return <InventoryIcons.Error />;
      case 'over_stock': return <InventoryIcons.Shipping />;
      default: return <InventoryIcons.Inventory />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock': return INVENTORY_CONTENT.status.inStock;
      case 'low_stock': return INVENTORY_CONTENT.status.lowStock;
      case 'out_of_stock': return INVENTORY_CONTENT.status.outOfStock;
      case 'over_stock': return INVENTORY_CONTENT.status.overStock;
      default: return 'Unknown';
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead sx={{ 
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6)
            : 'grey.50' 
        }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcons.Category/>
                {INVENTORY_CONTENT.table.product}
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>{INVENTORY_CONTENT.table.category}</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">{INVENTORY_CONTENT.table.currentStock}</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">{INVENTORY_CONTENT.table.stockStatus}</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">{INVENTORY_CONTENT.table.value}</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">{INVENTORY_CONTENT.table.lastUpdated}</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">{INVENTORY_CONTENT.table.actions}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <InventoryIcons.Inventory sx={{ 
                    fontSize: 48, 
                    color: 'text.disabled', 
                    mb: 2 
                  }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {INVENTORY_CONTENT.table.noProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {INVENTORY_CONTENT.table.noProductsEmpty}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const currentStock = calculateTotalStock(product);
              const minStock = getMinStockLevel(product);
              const stockValue = currentStock * product.baseCostPrice;
              const status = getStockStatus(product);
              const stockPercentage = Math.min((currentStock / (minStock * 3)) * 100, 100);
              
              return (
                <TableRow 
                  key={product._id} 
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { 
                      bgcolor: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.action.hover, 0.05)
                        : 'action.hover' 
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: getCategoryColor(product.category, theme), 
                        width: 40, 
                        height: 40,
                        color: 'white'
                      }}>
                        {product.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          {product.brand && (
                            <Chip
                              label={product.brand}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                          {product.variations && product.variations.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {product.variations.length} {INVENTORY_CONTENT.table.variants}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ 
                        bgcolor: alpha(getCategoryColor(product.category, theme), 0.1),
                        color: getCategoryColor(product.category, theme),
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        color={getStatusColor(status)}
                      >
                        {currentStock}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {INVENTORY_CONTENT.table.minStock}: {minStock}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={stockPercentage} 
                        sx={{ 
                          mt: 0.5, 
                          height: 4, 
                          borderRadius: 2,
                          bgcolor: alpha(getStatusColor(status), 0.2),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getStatusColor(status),
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      icon={getStatusIcon(status)}
                      label={getStatusLabel(status)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(status), 0.1),
                        color: getStatusColor(status),
                        border: `1px solid ${alpha(getStatusColor(status), 0.2)}`,
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                      ₹{stockValue.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @ ₹{product.baseCostPrice}{INVENTORY_CONTENT.table.unitPrice}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="text.primary">
                      {new Date(product.updatedAt).toLocaleDateString('en-IN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(product.updatedAt).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <InventoryIcons.QrCode/>
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'success.main' }
                        }}
                      >
                        <InventoryIcons.BarChart/>
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'warning.main' }
                        }}
                      >
                        <InventoryIcons.MoreVert/>
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};