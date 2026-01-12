import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
} from '@mui/material';
import { InventoryIcons } from '@/assets/icons/InventoryIcons';
import { INVENTORY_CONTENT } from './InventoryContent';
import { Product } from '@/hooks/useInventoryData';

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
          background: theme.palette.background.paper,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        fontWeight: 600,
        color: 'text.primary',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcons.Add />
          {INVENTORY_CONTENT.dialog.addStock}
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Stack spacing={2}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>{INVENTORY_CONTENT.dialog.product}</InputLabel>
              <Select
                value={formData.productId}
                label={INVENTORY_CONTENT.dialog.product}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
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
            />
            
            <TextField
              fullWidth
              label={INVENTORY_CONTENT.dialog.batchNumber}
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              required
              size={isMobile ? "small" : "medium"}
            />
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
              gap: 2 
            }}>
              <TextField
                fullWidth
                label={INVENTORY_CONTENT.dialog.costPrice}
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
              />
              
              <TextField
                fullWidth
                label={INVENTORY_CONTENT.dialog.sellingPrice}
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                required
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            
            <TextField
              fullWidth
              label={INVENTORY_CONTENT.dialog.supplier}
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button 
            onClick={onClose} 
            size={isMobile ? "small" : "medium"}
            color="inherit"
          >
            {INVENTORY_CONTENT.buttons.cancel}
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            size={isMobile ? "small" : "medium"}
          >
            {INVENTORY_CONTENT.buttons.add}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};