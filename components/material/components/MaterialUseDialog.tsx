import React, { useState } from 'react';
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
  Box,
  InputAdornment,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Material } from '../types/material.types';

interface MaterialUseDialogProps {
  open: boolean;
  material: Material | null;
  onClose: () => void;
  onSubmit: (request: any) => void;
  loading?: boolean;
}

export const MaterialUseDialog: React.FC<MaterialUseDialogProps> = ({
  open,
  material,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [quantity, setQuantity] = useState('');
  const [project, setProject] = useState('');
  const [note, setNote] = useState('');
  const [usedBy, setUsedBy] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!material) {
      setError('Material information is missing');
      return;
    }

    const quantityNum = parseFloat(quantity);
    
    if (!quantityNum || quantityNum <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (quantityNum > material.currentStock) {
      setError(`Cannot use more than ${material.currentStock} ${material.unit}`);
      return;
    }

    if (!usedBy.trim()) {
      setError('Please enter who is using this material');
      return;
    }

    onSubmit({
      materialId: material._id,
      quantity: quantityNum,
      project: project.trim() || undefined,
      note: note.trim() || undefined,
      usedBy: usedBy.trim(),
    });

    // Reset form
    setQuantity('');
    setProject('');
    setNote('');
    setUsedBy('');
    setError('');
  };

  const handleClose = () => {
    setQuantity('');
    setProject('');
    setNote('');
    setUsedBy('');
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
        Use Material
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          <Alert severity="info">
            <Typography variant="body2">
              Using {material?.name} from inventory. Current stock: {material.currentStock} {material.unit}
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

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
                max: material.currentStock,
                step: 0.01
              }
            }}
            helperText={`Max: ${material.currentStock} ${material.unit}`}
            disabled={loading}
          />

          <TextField
            label="Used By"
            fullWidth
            value={usedBy}
            onChange={(e) => setUsedBy(e.target.value)}
            placeholder="Enter name or department"
            required
            disabled={loading}
          />

          <TextField
            label="Project (Optional)"
            fullWidth
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Enter project name or code"
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
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Processing...' : 'Use Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};