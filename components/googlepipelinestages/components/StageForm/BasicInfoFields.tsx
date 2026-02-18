// components/googlepipelinestages/components/StageForm/BasicInfoFields.tsx
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import { STAGE_CATEGORIES } from '../../constants';

interface BasicInfoFieldsProps {
  formData: any;
  validationErrors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: any) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  validationErrors,
  onInputChange,
  onSelectChange
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <>
      <TextField
        fullWidth
        label="Stage Name *"
        name="name"
        value={formData.name}
        onChange={onInputChange}
        error={!!validationErrors.name}
        helperText={validationErrors.name}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: darkMode ? '#303134' : '#fff',
          },
        }}
      />

      <FormControl
        fullWidth
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: darkMode ? '#303134' : '#fff',
          },
        }}
      >
        <InputLabel>Category *</InputLabel>
        <Select
          name="category"
          value={formData.category}
          label="Category *"
          onChange={onSelectChange}
        >
          {STAGE_CATEGORIES.map(cat => (
            <MenuItem key={cat.value} value={cat.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color }} />
                {cat.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Probability (%) *"
        name="probability"
        type="number"
        value={formData.probability}
        onChange={onInputChange}
        error={!!validationErrors.probability}
        helperText={validationErrors.probability}
        size="small"
        InputProps={{
          inputProps: { min: 0, max: 100 }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: darkMode ? '#303134' : '#fff',
          },
        }}
      />
    </>
  );
};