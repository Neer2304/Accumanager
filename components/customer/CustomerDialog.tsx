import React, { useState, useEffect } from 'react';
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
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Customer } from './types';

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSubmit: (data: any) => Promise<void>;
  isMobile: boolean;
}

export const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onClose,
  customer,
  onSubmit,
  isMobile,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    gstin: '',
    isInterState: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        company: customer.company || '',
        address: customer.address || '',
        state: customer.state || '',
        city: customer.city || '',
        pincode: customer.pincode || '',
        gstin: customer.gstin || '',
        isInterState: customer.isInterState || false,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
        gstin: '',
        isInterState: false,
      });
    }
  }, [customer]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }
    if (!formData.state.trim()) {
      setError('State is required');
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = customer
        ? { ...formData, id: customer._id }
        : formData;
      await onSubmit(dataToSubmit);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
          {customer ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <ArrowBack />
          </IconButton>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: 'error.light',
                color: 'error.main',
                borderRadius: 1,
                fontSize: '0.875rem',
              }}
            >
              {error}
            </Box>
          )}

          <Stack spacing={2}>
            {/* Name & Phone Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Full Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone *"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                required
                disabled={loading}
              />
            </Stack>

            {/* Email & Company Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                disabled={loading}
              />
            </Stack>

            {/* Address */}
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              disabled={loading}
            />

            {/* City & State Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="State *"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                required
                disabled={loading}
              />
            </Stack>

            {/* Pincode & GSTIN Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="PIN Code"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="GSTIN"
                value={formData.gstin}
                onChange={(e) => handleChange('gstin', e.target.value)}
                size={isMobile ? 'small' : 'medium'}
                disabled={loading}
              />
            </Stack>

            {/* Transaction Type */}
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={formData.isInterState ? 'interstate' : 'intrastate'}
                label="Transaction Type"
                onChange={(e) =>
                  handleChange('isInterState', e.target.value === 'interstate')
                }
                disabled={loading}
              >
                <MenuItem value="intrastate">Intra-State (CGST + SGST)</MenuItem>
                <MenuItem value="interstate">Inter-State (IGST)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {!isMobile && (
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : customer
              ? 'Update Customer'
              : 'Add Customer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};