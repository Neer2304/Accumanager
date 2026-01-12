import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';

interface FloatingBackgroundProps {
  count?: number;
  size?: number;
}

const FloatingBackground: React.FC<FloatingBackgroundProps> = ({
  count = 3,
  size = 150,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, 
              ${alpha(theme.palette.primary.main, 0.1)} 0%, 
              ${alpha(theme.palette.primary.main, 0)} 70%)`,
            top: `${20 + i * 30}%`,
            left: `${10 + i * 40}%`,
            animation: `float ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default FloatingBackground;