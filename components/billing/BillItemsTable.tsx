'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Avatar,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

interface BillItem {
  productId: string;
  variationId?: string;
  name: string;
  variationName?: string;
  hsnCode: string;
  price: number;
  quantity: number;
  discount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
}

interface BillItemsTableProps {
  items: BillItem[];
  isInterState: boolean;
  onAddProduct: () => void;
  onUpdateItem: (index: number, field: keyof BillItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  isOnline: boolean;
  isSubscriptionActive?: boolean;
}

export const BillItemsTable: React.FC<BillItemsTableProps> = ({
  items,
  isInterState,
  onAddProduct,
  onUpdateItem,
  onRemoveItem,
  isOnline,
  isSubscriptionActive,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: 'none',
        mb: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}
            >
              <InventoryIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Bill Items ({items.length})
            </Typography>
          </Stack>
          <Button
            startIcon={<AddIcon />}
            onClick={onAddProduct}
            variant="contained"
            disabled={!isOnline && !isSubscriptionActive}
            sx={{
              borderRadius: '28px',
              px: 3,
              py: 0.75,
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                boxShadow: darkMode
                  ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                  : '0 4px 12px rgba(26, 115, 232, 0.3)',
              },
              '&:disabled': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            Add Product
          </Button>
        </Stack>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>#</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Product</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>HSN</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Price</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Qty</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Disc%</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Taxable</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>GST</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Total</TableCell>
                <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    '&:hover': {
                      backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                    },
                    '& td': {
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    },
                  }}
                >
                  <TableCell sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {item.name}
                    </Typography>
                    {item.variationName && (
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {item.variationName}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.hsnCode}
                      size="small"
                      sx={{
                        backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        border: 'none',
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        onUpdateItem(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      size="small"
                      sx={{ width: 80 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, step: 0.01 },
                        sx: {
                          borderRadius: '8px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          },
                          '&.Mui-focused': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                          },
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      size="small"
                      sx={{ width: 70 }}
                      inputProps={{ min: 1 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          },
                          '&.Mui-focused': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                          },
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        onUpdateItem(
                          index,
                          "discount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      size="small"
                      sx={{ width: 70 }}
                      inputProps={{ min: 0, max: 100 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        sx: {
                          borderRadius: '8px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          },
                          '&.Mui-focused': {
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                            boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                          },
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>
                      ₹{item.taxableAmount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isInterState ? (
                      <Typography variant="caption" sx={{ color: darkMode ? '#fdd663' : '#fbbc04', fontWeight: 500 }}>
                        IGST: ₹{item.igstAmount.toFixed(2)}
                      </Typography>
                    ) : (
                      <Stack>
                        <Typography variant="caption" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8', fontWeight: 500 }}>
                          CGST: ₹{item.cgstAmount.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8', fontWeight: 500 }}>
                          SGST: ₹{item.sgstAmount.toFixed(2)}
                        </Typography>
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                      ₹{item.total.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => onRemoveItem(index)}
                      size="small"
                      sx={{
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&:hover': {
                          color: darkMode ? '#f28b82' : '#ea4335',
                          backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {items.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                margin: '0 auto 16px',
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
              <InventoryIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No items in bill
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
              Click "Add Product" to start adding items
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={onAddProduct}
              variant="outlined"
              disabled={!isOnline && !isSubscriptionActive}
              sx={{
                borderRadius: '28px',
                px: 3,
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            >
              Add Product
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};