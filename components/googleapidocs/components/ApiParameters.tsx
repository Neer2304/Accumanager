// components/googleapidocs/components/ApiParameters.tsx
import React from 'react';
import {
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { Card } from '@/components/ui/Card';

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ApiParametersProps {
  parameters: Parameter[];
  darkMode: boolean;
}

export const ApiParameters: React.FC<ApiParametersProps> = ({ parameters, darkMode }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Parameters
      </Typography>
      
      <Card sx={{ overflow: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0.5,
            p: 1.5,
            backgroundColor: alpha('#4285f4', 0.1),
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            minWidth: 'fit-content',
          }}
        >
          <Typography variant="caption" fontWeight={600}>
            Name
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            Type
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            Required
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            Description
          </Typography>
        </Box>
        
        {parameters.map((param, index) => (
          <Box
            key={index}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0.5,
              p: 1.5,
              borderBottom: index < parameters.length - 1 
                ? `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` 
                : 'none',
              minWidth: 'fit-content',
              '&:hover': {
                backgroundColor: alpha('#000000', darkMode ? 0.05 : 0.02),
              },
            }}
          >
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              {param.name}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              {param.type}
            </Typography>
            
            <Typography variant="caption" color={param.required ? '#ea4335' : '#34a853'}>
              {param.required ? 'Yes' : 'No'}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              {param.description}
            </Typography>
          </Box>
        ))}
      </Card>
    </Box>
  );
};