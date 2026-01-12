import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface FormFieldGroupProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  spacing?: number;
  error?: string;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  title,
  subtitle,
  children,
  spacing = 2,
  error,
}) => {
  return (
    <Box>
      {(title || subtitle) && (
        <Box sx={{ mb: 2 }}>
          {title && (
            <Typography variant="h6" fontWeight="bold" gutterBottom={!!subtitle}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      
      {error && (
        <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: spacing 
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default FormFieldGroup;