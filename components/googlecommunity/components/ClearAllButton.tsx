// components/googlecommunity/components/ClearAllButton.tsx
import React from 'react';
import {
  Button,
  alpha,
  useTheme
} from '@mui/material';

interface ClearAllButtonProps {
  onClick: () => void;
  disabled: boolean;
  count: number;
}

export const ClearAllButton: React.FC<ClearAllButtonProps> = ({ onClick, disabled, count }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled || count === 0}
      sx={{
        color: '#ea4335',
        borderColor: '#ea4335',
        '&:hover': {
          backgroundColor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
          borderColor: '#ea4335',
        },
      }}
    >
      Clear All
    </Button>
  );
};