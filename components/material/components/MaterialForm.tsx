import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Paper,
  Typography,
  Divider,
  Alert,
  Stack,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Add,
  Delete,
  AttachMoney,
  Inventory,
  Numbers,
  Description,
  Business,
  LocationOn,
  Schedule,
  LocalShipping,
  Security,
} from '@mui/icons-material';
import {
  MaterialFormData,
  MATERIAL_CATEGORIES,
  MATERIAL_UNITS,
  validateMaterial,
} from '../types/material.types';

interface MaterialFormProps {
  formData: MaterialFormData;
  onChange: (field: keyof MaterialFormData, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string;
  onCancel?: () => void;
  isEdit?: boolean;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  formData,
  onChange,
  onSubmit,
  loading = false,
  error,
  onCancel,
  isEdit = false,
}) => {
  const theme = useTheme();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validation = validateMaterial(formData);
    setValidationErrors(validation.errors);
    
    if (validation.valid) {
      onSubmit();
    }
  };

  const handleFieldChange = (field: keyof MaterialFormData, value: any) => {
    onChange(field, value);
    
    // Clear validation errors for this field
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const sections = [
    {
      title: 'Basic Information',
      icon: <Inventory />,
      fields: [
        { name: 'name', label: 'Material Name *', type: 'text', icon: <Inventory fontSize="small" /> },
        { name: 'sku', label: 'SKU Code *', type: 'text', icon: <Numbers fontSize="small" /> },
        { name: 'description', label: 'Description', type: 'textarea', icon: <Description fontSize="small" /> },
      ],
    },
    {
      title: 'Stock & Pricing',
      icon: <AttachMoney />,
      fields: [
        { name: 'initialStock', label: 'Initial Stock', type: 'number', icon: <Inventory fontSize="small" /> },
        { name: 'minimumStock', label: 'Minimum Stock Level *', type: 'number', icon: <Security fontSize="small" /> },
        { name: 'maximumStock', label: 'Maximum Stock Level', type: 'number', icon: <Inventory fontSize="small" /> },
        { name: 'unitCost', label: 'Unit Cost *', type: 'number', icon: <AttachMoney fontSize="small" /> },
      ],
    },
    {
      title: 'Classification',
      icon: <Business />,
      fields: [
        { name: 'category', label: 'Category *', type: 'select', options: MATERIAL_CATEGORIES, icon: <Business fontSize="small" /> },
        { name: 'unit', label: 'Unit of Measurement *', type: 'select', options: MATERIAL_UNITS, icon: <Inventory fontSize="small" /> },
      ],
    },
    {
      title: 'Supplier Information',
      icon: <LocalShipping />,
      fields: [
        { name: 'supplierName', label: 'Supplier Name', type: 'text', icon: <Business fontSize="small" /> },
        { name: 'supplierCode', label: 'Supplier Code', type: 'text', icon: <Numbers fontSize="small" /> },
        { name: 'supplierContact', label: 'Contact Information', type: 'text', icon: <Description fontSize="small" /> },
        { name: 'leadTime', label: 'Lead Time (days)', type: 'number', icon: <Schedule fontSize="small" /> },
      ],
    },
    {
      title: 'Storage & Location',
      icon: <LocationOn />,
      fields: [
        { name: 'storageLocation', label: 'Storage Location', type: 'text', icon: <LocationOn fontSize="small" /> },
        { name: 'shelf', label: 'Shelf Number', type: 'text', icon: <Inventory fontSize="small" /> },
        { name: 'bin', label: 'Bin Number', type: 'text', icon: <Inventory fontSize="small" /> },
      ],
    },
    {
      title: 'Additional Information',
      icon: <Security />,
      fields: [
        { name: 'expirationDate', label: 'Expiration Date', type: 'date', icon: <Schedule fontSize="small" /> },
        { name: 'batchNumber', label: 'Batch/Lot Number', type: 'text', icon: <Numbers fontSize="small" /> },
      ],
    },
  ];

  const renderField = (field: any) => {
    const commonProps = {
      fullWidth: true,
      size: 'small' as const,
      value: formData[field.name as keyof MaterialFormData] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        handleFieldChange(field.name as keyof MaterialFormData, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value),
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            {field.icon}
          </InputAdornment>
        ),
      },
      sx: { mb: 2 },
    };

    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small" key={field.name} sx={{ mb: 2 }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              {...commonProps}
              label={field.label}
              value={formData[field.name as keyof MaterialFormData] || ''}
              onChange={(e) => handleFieldChange(field.name as keyof MaterialFormData, e.target.value)}
            >
              {field.options?.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            key={field.name}
            label={field.label}
            multiline
            rows={3}
          />
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            key={field.name}
            label={field.label}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return (
          <TextField
            {...commonProps}
            key={field.name}
            label={field.label}
            type={field.type}
            inputProps={field.type === 'number' ? { min: 0, step: 0.01 } : {}}
          />
        );
    }
  };

  return (
    <Box>
      {/* Error Display */}
      {(error || validationErrors.length > 0) && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => {
            setValidationErrors([]);
          }}
        >
          {error || validationErrors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Alert>
      )}

      <Grid container spacing={3}>
        {sections.map((section, sectionIndex) => (
          <Grid item xs={12} md={6} key={sectionIndex}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(section.icon, {
                    sx: { color: theme.palette.primary.main, fontSize: 20 }
                  })}
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {section.title}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {section.fields.map((field) => renderField(field))}

              {/* Stock Alert Switch for first section */}
              {sectionIndex === 0 && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.lowStockAlert}
                      onChange={(e) => handleFieldChange('lowStockAlert', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable low stock alerts"
                  sx={{ mt: 1 }}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Paper
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Fields marked with * are required
          </Typography>

          <Stack direction="row" spacing={2}>
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Cancel
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<Add />}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {loading ? 'Processing...' : isEdit ? 'Update Material' : 'Create Material'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};