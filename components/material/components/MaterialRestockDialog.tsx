import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Alert,
  InputAdornment,
  Box,
  CircularProgress,
} from '@mui/material';
import { Material } from '../types/material.types';

interface MaterialRestockDialogProps {
  open: boolean;
  material: Material | null;
  onClose: () => void;
  onSubmit: (request: any) => void;
  loading?: boolean;
}

export const MaterialRestockDialog: React.FC<MaterialRestockDialogProps> = ({
  open,
  material,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [purchaseOrder, setPurchaseOrder] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Initialize form values when material becomes available
  useEffect(() => {
    if (material) {
      setSupplier(material.supplierName || '');
      setUnitCost(material.unitCost.toString());
    }
  }, [material]);

  const calculateTotalCost = () => {
    if (!material) return '0.00';
    
    const quantityNum = parseFloat(quantity);
    const unitCostNum = parseFloat(unitCost);
    if (quantityNum && unitCostNum) {
      return (quantityNum * unitCostNum).toFixed(2);
    }
    return '0.00';
  };

  const handleSubmit = () => {
    if (!material) {
      setError('Material information is missing');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const unitCostNum = parseFloat(unitCost);
    
    if (!quantityNum || quantityNum <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!unitCostNum || unitCostNum <= 0) {
      setError('Please enter a valid unit cost');
      return;
    }

    onSubmit({
      materialId: material._id,
      quantity: quantityNum,
      supplier: supplier.trim() || undefined,
      purchaseOrder: purchaseOrder.trim() || undefined,
      unitCost: unitCostNum,
      note: note.trim() || undefined,
    });

    // Reset form
    setQuantity('');
    setSupplier(material.supplierName || '');
    setPurchaseOrder('');
    setUnitCost(material.unitCost.toString());
    setNote('');
    setError('');
  };

  const handleClose = () => {
    setQuantity('');
    if (material) {
      setSupplier(material.supplierName || '');
      setUnitCost(material.unitCost.toString());
    }
    setPurchaseOrder('');
    setNote('');
    setError('');
    onClose();
  };

  // If dialog is open but material is null, show loading
  if (open && !material) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // If material is null, don't render the dialog content
  if (!material) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Restock Material
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          <Alert severity="info">
            <Typography variant="body2">
              Restocking {material.name}. Current stock: {material.currentStock} {material.unit}
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {material.unit}
                  </InputAdornment>
                ),
                inputProps: { 
                  min: 0.01, 
                  step: 0.01
                }
              }}
              disabled={loading}
            />
            <TextField
              label="Unit Cost"
              type="number"
              fullWidth
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
                inputProps: { 
                  min: 0.01, 
                  step: 0.01
                }
              }}
              disabled={loading}
            />
          </Box>

          <Alert severity="success">
            <Typography variant="body2">
              Total Cost: ${calculateTotalCost()}
            </Typography>
          </Alert>

          <TextField
            label="Supplier"
            fullWidth
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Enter supplier name"
            disabled={loading}
          />

          <TextField
            label="Purchase Order (Optional)"
            fullWidth
            value={purchaseOrder}
            onChange={(e) => setPurchaseOrder(e.target.value)}
            placeholder="Enter PO number"
            disabled={loading}
          />

          <TextField
            label="Notes (Optional)"
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any additional notes"
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="success"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Processing...' : 'Restock Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};