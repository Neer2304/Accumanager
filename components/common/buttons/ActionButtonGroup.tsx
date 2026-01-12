import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface ActionButtonGroupProps extends BoxProps {
  justify?: 'start' | 'end' | 'center' | 'space-between';
  spacing?: number;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  children,
  justify = 'end',
  spacing = 1,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: spacing,
        justifyContent: justify,
        alignItems: 'center',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ActionButtonGroup;