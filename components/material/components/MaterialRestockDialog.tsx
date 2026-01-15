import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
  InputAdornment,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import {
  AttachMoney,
  Inventory,
  AddShoppingCart,
  Numbers,
  Description,
  Business,
  Receipt,
  Schedule,
} from '@mui/icons-material';
import { Material, RestockMaterialRequest } from '../types/material.types';

interface MaterialRestockDialogProps {
  open: boolean;
  material: Material | null;
  onClose: () => void;
  onSubmit: (request: RestockMaterialRequest) => Promise<void>;
  loading?: boolean;
}

export const MaterialRestockDialog: React.FC<MaterialRestockDialogProps> = ({
  open,
  material,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const theme = useTheme();
  const [quantity, setQuantity] = useState<number>(0);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [supplier, setSupplier] = useState<string>('');
  const [purchaseOrder, setPurchaseOrder] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (material && open) {
      setQuantity(0);
      setUnitCost(material.unitCost || 0);
      setSupplier(material.supplierName || '');
      setPurchaseOrder('');
      setNote('');
      setError('');
    }
  }, [material, open]);

  const handleSubmit = async () => {
    if (!material) return;

    // Validate
    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!unitCost || unitCost < 0) {
      setError('Please enter a valid unit cost');
      return;
    }

    try {
      await onSubmit({
        materialId: material._id,
        quantity,
        unitCost,
        supplier: supplier || undefined,
        purchaseOrder: purchaseOrder || undefined,
        note: note || undefined,
      });
      onClose();
    } catch (err) {
      // Error is handled by parent
    }
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantity(numValue);
      if (error) setError('');
    } else if (value === '') {
      setQuantity(0);
    }
  };

  const handleUnitCostChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setUnitCost(numValue);
      if (error) setError('');
    } else if (value === '') {
      setUnitCost(0);
    }
  };

  if (!material) return null;

  const totalCost = quantity * unitCost;
  const newStock = material.currentStock + quantity;
  const isExceedingMax = material.maximumStock && newStock > material.maximumStock;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AddShoppingCart sx={{ color: theme.palette.success.main }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Restock Material
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add stock to inventory
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Material Info */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {material.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {material.sku}
              </Typography>
            </Box>
            <Chip
              label={`${material.currentStock} ${material.unit} in stock`}
              color={material.status === 'out-of-stock' ? 'error' : material.status === 'low-stock' ? 'warning' : 'success'}
              size="small"
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Current Unit Cost
              </Typography>
              <Typography variant="body2" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                <AttachMoney fontSize="inherit" />
                {material.unitCost.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Minimum Stock
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {material.minimumStock} {material.unit}
              </Typography>
            </Box>
            {material.maximumStock && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Maximum Stock
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {material.maximumStock} {material.unit}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Quantity and Unit Cost */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Quantity to Add"
            type="number"
            value={quantity || ''}
            onChange={(e) => handleQuantityChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Numbers />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">
                    {material.unit}
                  </Typography>
                </InputAdornment>
              ),
              inputProps: { min: 0.01, step: 0.01 },
            }}
          />
          
          <TextField
            fullWidth
            label="Unit Cost"
            type="number"
            value={unitCost || ''}
            onChange={(e) => handleUnitCostChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
              inputProps: { min: 0, step: 0.01 },
            }}
          />
        </Stack>

        {/* Supplier Information */}
        <TextField
          fullWidth
          label="Supplier (Optional)"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Business />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
          helperText={material.supplierName ? `Previous supplier: ${material.supplierName}` : undefined}
        />

        {/* Purchase Order */}
        <TextField
          fullWidth
          label="Purchase Order # (Optional)"
          value={purchaseOrder}
          onChange={(e) => setPurchaseOrder(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Receipt />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Note */}
        <TextField
          fullWidth
          label="Notes (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={2}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Description />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Summary */}
        {quantity > 0 && (
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backgroundColor: alpha(theme.palette.success.main, 0.05),
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Order Summary
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Quantity to Add:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {quantity} {material.unit}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Unit Cost:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${unitCost.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Cost:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${totalCost.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">New Stock Level:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  color={isExceedingMax ? 'warning.main' : 'success.main'}
                >
                  {newStock} {material.unit}
                </Typography>
              </Box>
              {isExceedingMax && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  This will exceed the maximum stock level of {material.maximumStock} {material.unit}
                </Alert>
              )}
            </Stack>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || quantity <= 0 || unitCost < 0}
          startIcon={<AddShoppingCart />}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Processing...' : 'Restock Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};