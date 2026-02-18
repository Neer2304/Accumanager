// components/googlepipelinestages/components/StageForm/CustomFieldsSection.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  MenuItem,
  Select,
  FormControlLabel,
  Switch,
  IconButton,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import { GOOGLE_COLORS } from '../../constants';

interface CustomField {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  options?: string[];
}

interface CustomFieldsSectionProps {
  customFields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  darkMode: boolean;
}

export const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  customFields,
  onChange,
  darkMode
}) => {
  const addCustomField = () => {
    const newField: CustomField = {
      name: '',
      type: 'text',
      required: false
    };
    onChange([...customFields, newField]);
  };

  const removeCustomField = (index: number) => {
    const updated = customFields.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateCustomField = (index: number, field: Partial<CustomField>) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], ...field };
    onChange(updated);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
        Custom Fields
      </Typography>

      {customFields.map((field, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: '12px',
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        >
          <DragIndicatorIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', cursor: 'grab' }} />
          
          <TextField
            size="small"
            label="Field Name"
            value={field.name}
            onChange={(e) => updateCustomField(index, { name: e.target.value })}
            sx={{ flex: 2 }}
          />
          
          <Select
            size="small"
            value={field.type}
            onChange={(e) => updateCustomField(index, { type: e.target.value as any })}
            sx={{ flex: 1 }}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="boolean">Yes/No</MenuItem>
            <MenuItem value="select">Dropdown</MenuItem>
          </Select>
          
          <FormControlLabel
            control={
              <Switch
                checked={field.required}
                onChange={(e) => updateCustomField(index, { required: e.target.checked })}
                size="small"
              />
            }
            label="Required"
          />
          
          <IconButton size="small" onClick={() => removeCustomField(index)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addCustomField}
        variant="outlined"
        size="small"
        sx={{
          borderRadius: '20px',
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
          mt: 1
        }}
      >
        Add Custom Field
      </Button>
    </Box>
  );
};