// components/googleadminsettings/components/SettingsFieldGroup.tsx
import React, { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';

interface SettingsFieldGroupProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  spacing?: number;
}

export const SettingsFieldGroup: React.FC<SettingsFieldGroupProps> = ({
  children,
  columns = 2,
  spacing = 2,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getWidth = () => {
    switch (columns) {
      case 1: return '100%';
      case 2: return 'calc(50% - 8px)';
      case 3: return 'calc(33.333% - 11px)';
      case 4: return 'calc(25% - 12px)';
      default: return 'calc(50% - 8px)';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      gap: spacing,
    }}>
      {React.Children.map(children, (child) => (
        <Box sx={{ 
          flex: `1 1 ${getWidth()}`,
          minWidth: '250px',
        }}>
          {child}
        </Box>
      ))}
    </Box>
  );
};