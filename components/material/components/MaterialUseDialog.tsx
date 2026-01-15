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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AttachMoney,
  Inventory,
  RemoveShoppingCart,
  Numbers,
  Description,
  Business,
} from '@mui/icons-material';
import { Material, UseMaterialRequest } from '../types/material.types';

interface MaterialUseDialogProps {
  open: boolean;
  material: Material | null;
  onClose: () => void;
  onSubmit: (request: UseMaterialRequest) => Promise<void>;
  loading?: boolean;
}

export const MaterialUseDialog: React.FC<MaterialUseDialogProps> = ({
  open,
  material,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const theme = useTheme();
  const [quantity, setQuantity] = useState<number>(0);
  const [project, setProject] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (material && open) {
      setQuantity(0);
      setProject('');
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

    if (quantity > material.currentStock) {
      setError(`Insufficient stock. Available: ${material.currentStock} ${material.unit}`);
      return;
    }

    try {
      await onSubmit({
        materialId: material._id,
        quantity,
        project: project || undefined,
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

  if (!material) return null;

  const cost = quantity * material.unitCost;
  const remainingStock = material.currentStock - quantity;
  const isLowStock = remainingStock <= material.minimumStock;
  const isOutOfStock = remainingStock === 0;

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
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RemoveShoppingCart sx={{ color: theme.palette.error.main }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Use Material
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deduct stock from inventory
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
              label={`${material.currentStock} ${material.unit} available`}
              color={material.status === 'out-of-stock' ? 'error' : material.status === 'low-stock' ? 'warning' : 'success'}
              size="small"
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Unit Cost
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
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Category
              </Typography>
              <Typography variant="body2">
                {material.category}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Quantity Input */}
        <TextField
          fullWidth
          label="Quantity to Use"
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
            inputProps: { 
              min: 0.01, 
              max: material.currentStock,
              step: 0.01 
            },
          }}
          helperText={`Max: ${material.currentStock} ${material.unit}`}
          sx={{ mb: 3 }}
        />

        {/* Project/Reference */}
        <TextField
          fullWidth
          label="Project/Reference (Optional)"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Business />
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
              backgroundColor: alpha(theme.palette.info.main, 0.05),
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Summary
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Quantity to Use:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {quantity} {material.unit}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Cost:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${cost.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Remaining Stock:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  color={isOutOfStock ? 'error.main' : isLowStock ? 'warning.main' : 'success.main'}
                >
                  {remainingStock} {material.unit}
                </Typography>
              </Box>
              {isLowStock && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {isOutOfStock 
                    ? 'This will deplete all stock. Consider restocking soon.'
                    : 'This will bring stock below minimum level.'
                  }
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
          disabled={loading || quantity <= 0}
          startIcon={<RemoveShoppingCart />}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Processing...' : 'Use Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};