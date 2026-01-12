// components/common/layout/AnimatedBackground.tsx (create if not exists)
import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
  showRadial?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  showRadial = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.08)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {showRadial && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.15)} 0%, transparent 50%)`,
            zIndex: 0,
          }}
        />
      )}
      {children && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default AnimatedBackground;