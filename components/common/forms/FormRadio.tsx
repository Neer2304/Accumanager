import React from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Box,
} from '@mui/material';

interface Option {
  value: string | number;
  label: string;
}

interface FormRadioProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  error?: string;
  helper?: string;
  required?: boolean;
  row?: boolean;
}

const FormRadio: React.FC<FormRadioProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  helper,
  required = false,
  row = false,
}) => {
  return (
    <Box>
      <FormLabel component="legend" sx={{ mb: 1, display: 'block' }}>
        {label}{required ? ' *' : ''}
      </FormLabel>
      <RadioGroup
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        row={row}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={option.label}
            sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
          />
        ))}
      </RadioGroup>
      {(error || helper) && (
        <FormHelperText error={!!error}>
          {error || helper}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormRadio;