import React from 'react';
import { Typography, Box } from '@mui/material';
import { Info } from '@mui/icons-material';

interface FormLabelProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  helper?: string;
  tooltip?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  label,
  required = false,
  helper,
  tooltip,
}) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        component="label"
        htmlFor={htmlFor}
        variant="body2"
        fontWeight="500"
        color="text.primary"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      >
        {label}
        {required && (
          <Typography component="span" color="error" sx={{ ml: 0.5 }}>
            *
          </Typography>
        )}
        {tooltip && (
          <Info sx={{ fontSize: 16, color: 'text.secondary' }} />
        )}
      </Typography>
      {helper && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {helper}
        </Typography>
      )}
    </Box>
  );
};

export default FormLabel;