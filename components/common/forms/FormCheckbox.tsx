import React from 'react';
import {
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from '@mui/material';

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  helper?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
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
          <Checkbox
            name={name}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            size={size}
            sx={{
              '&.Mui-checked': {
                color: 'primary.main',
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
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {error || helper}
        </Typography>
      )}
    </Box>
  );
};

export default FormCheckbox;