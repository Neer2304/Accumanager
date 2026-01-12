import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { ArrowBack, Business, Phone, Email, LocationOn } from '@mui/icons-material';

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  company: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  gstin: string;
  isInterState: boolean;
}

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  isMobile: boolean;
  title: string;
  initialData?: CustomerFormData;
  loading?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  open,
  onClose,
  onSubmit,
  isMobile,
  title,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = React.useState<CustomerFormData>(
    initialData || {
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
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
            {title}
          </Typography>
          {isMobile && (
            <IconButton onClick={onClose} size="small">
              <ArrowBack />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                size={isMobile ? "small" : "medium"}
              />
            </Stack>

            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
                size={isMobile ? "small" : "medium"}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="PIN Code"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                fullWidth
                label="GSTIN"
                value={formData.gstin}
                onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                size={isMobile ? "small" : "medium"}
              />
            </Stack>

            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={formData.isInterState ? 'interstate' : 'intrastate'}
                label="Transaction Type"
                onChange={(e) => handleChange('isInterState', e.target.value === 'interstate')}
              >
                <MenuItem value="intrastate">Intra-State (CGST + SGST)</MenuItem>
                <MenuItem value="interstate">Inter-State (IGST)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          {!isMobile && (
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update Customer' : 'Add Customer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};