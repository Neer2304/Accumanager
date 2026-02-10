// ProductTable.tsx - Updated with Google theme
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
  const darkMode = theme.palette.mode === 'dark';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return '#34a853';
      case 'low_stock': return '#fbbc04';
      case 'out_of_stock': return '#ea4335';
      case 'over_stock': return '#4285f4';
      default: return darkMode ? '#9aa0a6' : '#5f6368';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <InventoryIcons.CheckCircle />;
      case 'low_stock': return <InventoryIcons.Warning />;
      case 'out_of_stock': return <InventoryIcons.Error />;
      case 'over_stock': return <InventoryIcons.Inventory />;
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
    <TableContainer sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      overflowX: 'auto',
    }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ 
          backgroundColor: darkMode ? '#303134' : '#f8f9fa',
          borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 600, 
              py: 2,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcons.Category sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}/>
                {INVENTORY_CONTENT.table.product}
              </Box>
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              py: 2,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}>
              {INVENTORY_CONTENT.table.category}
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              py: 2,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center'
            }}>
              {INVENTORY_CONTENT.table.currentStock}
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              py: 2,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center'
            }}>
              {INVENTORY_CONTENT.table.stockStatus}
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              py: 2,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center'
            }}>
              {INVENTORY_CONTENT.table.value}
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              py: 2,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center'
            }}>
              {INVENTORY_CONTENT.table.lastUpdated}
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              py: 2,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center'
            }}>
              {INVENTORY_CONTENT.table.actions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <InventoryIcons.Inventory sx={{ 
                    fontSize: { xs: 36, sm: 48 }, 
                    color: darkMode ? '#5f6368' : '#9aa0a6', 
                    mb: 2,
                    opacity: 0.5
                  }} />
                  <Typography variant="h6" sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    mb: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }} gutterBottom>
                    {INVENTORY_CONTENT.table.noProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}>
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
                      backgroundColor: darkMode 
                        ? alpha('#4285f4', 0.05)
                        : alpha('#4285f4', 0.02),
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        backgroundColor: getCategoryColor(product.category, theme), 
                        width: 40, 
                        height: 40,
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                        {product.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          {product.brand && (
                            <Chip
                              label={product.brand}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.65rem',
                                backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                                borderColor: darkMode ? '#5f6368' : '#dadce0',
                                color: darkMode ? '#e8eaed' : '#202124',
                              }}
                            />
                          )}
                          {product.variations && product.variations.length > 0 && (
                            <Typography variant="caption" sx={{ 
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            }}>
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
                        backgroundColor: alpha(getCategoryColor(product.category, theme), darkMode ? 0.2 : 0.1),
                        color: getCategoryColor(product.category, theme),
                        fontWeight: 500,
                        border: `1px solid ${alpha(getCategoryColor(product.category, theme), 0.3)}`,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ 
                          color: getStatusColor(status),
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        {currentStock}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                      }}>
                        {INVENTORY_CONTENT.table.minStock}: {minStock}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={stockPercentage} 
                        sx={{ 
                          mt: 0.5, 
                          height: 4, 
                          borderRadius: 2,
                          backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(status),
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
                        backgroundColor: alpha(getStatusColor(status), darkMode ? 0.2 : 0.1),
                        color: getStatusColor(status),
                        border: `1px solid ${alpha(getStatusColor(status), 0.3)}`,
                        fontWeight: 500,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                      color: '#4285f4',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}>
                      ₹{stockValue.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    }}>
                      @ ₹{product.baseCostPrice}{INVENTORY_CONTENT.table.unitPrice}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ 
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}>
                      {new Date(product.updatedAt).toLocaleDateString('en-IN')}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    }}>
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
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          '&:hover': { 
                            backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                            color: '#4285f4',
                          }
                        }}
                      >
                        <InventoryIcons.QrCode/>
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          '&:hover': { 
                            backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                            color: '#34a853',
                          }
                        }}
                      >
                        <InventoryIcons.BarChart/>
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          '&:hover': { 
                            backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                            color: '#fbbc04',
                          }
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
