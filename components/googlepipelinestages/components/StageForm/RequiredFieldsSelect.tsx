// components/googlepipelinestages/components/StageForm/RequiredFieldsSelect.tsx
import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip as MuiChip,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material';
import { REQUIRED_FIELD_OPTIONS, GOOGLE_COLORS } from '../../constants';

interface RequiredFieldsSelectProps {
  requiredFields: string[];
  onSelectChange: (e: any) => void;
  darkMode: boolean;
}

export const RequiredFieldsSelect: React.FC<RequiredFieldsSelectProps> = ({
  requiredFields,
  onSelectChange,
  darkMode
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle', color: GOOGLE_COLORS.green }} />
        Required Fields
      </Typography>

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
        <InputLabel>Required Fields</InputLabel>
        <Select
          multiple
          name="requiredFields"
          value={requiredFields}
          onChange={onSelectChange}
          label="Required Fields"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => {
                const option = REQUIRED_FIELD_OPTIONS.find(opt => opt.value === value);
                return (
                  <MuiChip
                    key={value}
                    label={option?.label || value}
                    size="small"
                    icon={<CheckCircleIcon />}
                    sx={{
                      bgcolor: alpha(GOOGLE_COLORS.green, 0.1),
                      color: GOOGLE_COLORS.green,
                      '& .MuiChip-icon': { color: GOOGLE_COLORS.green }
                    }}
                  />
                );
              })}
            </Box>
          )}
        >
          {REQUIRED_FIELD_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {requiredFields.includes(option.value) ? (
                  <CheckCircleIcon sx={{ color: GOOGLE_COLORS.green, fontSize: 18 }} />
                ) : (
                  <UncheckedIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 18 }} />
                )}
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {requiredFields.length === 0 && (
        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 1, display: 'block' }}>
          No fields are required for this stage
        </Typography>
      )}
    </Box>
  );
};