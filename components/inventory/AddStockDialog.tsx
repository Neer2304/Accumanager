// AddStockDialog.tsx - Updated with Google theme
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  alpha,
} from '@mui/material';
import { InventoryIcons } from '@/assets/icons/InventoryIcons';
import { INVENTORY_CONTENT } from './InventoryContent';
import { Product } from '@/hooks/useInventoryData';
import { Button } from '@/components/ui/Button';

interface AddStockDialogProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddStock: (data: any) => Promise<void>;
  isMobile: boolean;
  theme: any;
}

export const AddStockDialog = ({ 
  open, 
  onClose, 
  products, 
  onAddStock,
  isMobile,
  theme 
}: AddStockDialogProps) => {
  const darkMode = theme.palette.mode === 'dark';
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    batchNumber: '',
    costPrice: '',
    sellingPrice: '',
    supplier: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddStock(formData);
    setFormData({
      productId: '',
      quantity: '',
      batchNumber: '',
      costPrice: '',
      sellingPrice: '',
      supplier: '',
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        fontWeight: 600,
        color: darkMode ? '#e8eaed' : '#202124',
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcons.Add sx={{ color: '#4285f4' }} />
          {INVENTORY_CONTENT.dialog.addStock}
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          backgroundColor: darkMode ? '#303134' : '#ffffff',
        }}>
          <Stack spacing={2}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}>
                {INVENTORY_CONTENT.dialog.product}
              </InputLabel>
              <Select
                value={formData.productId}
                label={INVENTORY_CONTENT.dialog.product}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
                sx={{
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                }}
              >
                {Array.isArray(products) && products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name} - {product.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label={INVENTORY_CONTENT.dialog.quantity}
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />
            
            <TextField
              fullWidth
              label={INVENTORY_CONTENT.dialog.batchNumber}
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              required
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />
            
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              '& > *': {
                flex: '1 1 calc(50% - 8px)',
                minWidth: 0,
              }
            }}>
              <TextField
                fullWidth
                label={INVENTORY_CONTENT.dialog.costPrice}
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              />
              
              <TextField
                fullWidth
                label={INVENTORY_CONTENT.dialog.sellingPrice}
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              label={INVENTORY_CONTENT.dialog.supplier}
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Button 
            onClick={onClose} 
            size={isMobile ? "small" : "medium"}
            variant="outlined"
            sx={{
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
              }
            }}
          >
            {INVENTORY_CONTENT.buttons.cancel}
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            size={isMobile ? "small" : "medium"}
            sx={{
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#3367d6',
              }
            }}
          >
            {INVENTORY_CONTENT.buttons.add}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};