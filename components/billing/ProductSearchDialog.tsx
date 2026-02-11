'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Avatar,
  Stack,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

interface SearchProduct {
  _id: string;
  name: string;
  type: string;
  displayName: string;
  price: number;
  variationId?: string;
  hsnCode: string;
  gstDetails: any;
  stock: number;
  category: string;
  brand?: string;
  sku?: string;
}

interface ProductSearchDialogProps {
  open: boolean;
  searchTerm: string;
  searchResults: SearchProduct[];
  isInterState: boolean;
  onClose: () => void;
  onSearchChange: (term: string) => void;
  onSelectProduct: (product: SearchProduct) => void;
}

export const ProductSearchDialog: React.FC<ProductSearchDialogProps> = ({
  open,
  searchTerm,
  searchResults,
  isInterState,
  onClose,
  onSearchChange,
  onSelectProduct,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          fontWeight: 500,
          color: darkMode ? '#e8eaed' : '#202124',
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        Search Products
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products by name, SKU, category, brand, or HSN..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <CloseIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
              },
              '&.Mui-focused': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
              },
            },
          }}
          sx={{ mb: 2 }}
          autoFocus
        />
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {searchResults.map((product, index) => (
            <Card
              key={index}
              sx={{
                mb: 1,
                p: 2,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                cursor: "pointer",
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
              onClick={() => onSelectProduct(product)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {product.displayName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mt: 0.5 }}>
                    HSN: {product.hsnCode} • Stock: {product.stock} • Category: {product.category}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip
                      label={isInterState ? "IGST" : "CGST+SGST"}
                      size="small"
                      sx={{
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        border: 'none',
                      }}
                    />
                    <Chip
                      label={`₹${product.price.toLocaleString()}`}
                      size="small"
                      sx={{
                        backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                        color: darkMode ? '#81c995' : '#34a853',
                        border: 'none',
                      }}
                    />
                    {product.stock < 10 && (
                      <Chip
                        label="Low Stock"
                        size="small"
                        sx={{
                          backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                          color: darkMode ? '#fdd663' : '#fbbc04',
                          border: 'none',
                        }}
                      />
                    )}
                  </Stack>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Chip
                    label={product.type === "variation" ? "Variation" : "Product"}
                    size="small"
                    sx={{
                      backgroundColor: product.type === "variation"
                        ? darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'
                        : darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                      color: product.type === "variation"
                        ? darkMode ? '#8ab4f8' : '#1a73e8'
                        : darkMode ? '#9aa0a6' : '#5f6368',
                      border: 'none',
                    }}
                  />
                </Box>
              </Stack>
            </Card>
          ))}
          {searchResults.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
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
              <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                No products found
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Try adjusting your search for "{searchTerm}"
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '20px',
            px: 3,
            py: 0.75,
            color: darkMode ? '#e8eaed' : '#202124',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};