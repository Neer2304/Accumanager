// components/common/forms/FormSwitch.tsx (Updated)
import React from 'react';
import {
  FormControlLabel,
  Switch,
  Box,
  Typography,
  FormHelperText,
} from '@mui/material';

interface FormSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  helper?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  label,
  checked,
  onChange,
  error,
  helper,
  disabled = false,
  size = 'medium',
}) => {
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            size={size}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'primary.main',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'primary.main',
              },
            }}
          />
        }
        label={
          <Typography variant="body2" color={error ? 'error' : 'text.primary'}>
            {label}
          </Typography>
        }
      />
      {(error || helper) && (
        <FormHelperText error={!!error}>
          {error || helper}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormSwitch;