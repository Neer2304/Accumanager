import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

interface FormGridProps {
  children: ReactNode;
  columns?: number;
  spacing?: number;
}

const FormGrid: React.FC<FormGridProps> = ({
  children,
  columns = 2,
  spacing = 3,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      gap: spacing,
      '& > *': {
        flex: `1 1 calc(${100 / columns}% - ${spacing * 8}px)`,
        minWidth: 200,
      }
    }}>
      {children}
    </Box>
  );
};

export default FormGrid;