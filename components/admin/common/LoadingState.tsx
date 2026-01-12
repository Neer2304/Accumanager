import React from 'react';
import { Box, CircularProgress, Typography, alpha, useTheme } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
  color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 60,
  fullScreen = false,
  color,
}) => {
  const theme = useTheme();

  const Container = fullScreen ? Box : Box;
  
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        width: fullScreen ? '100vw' : '100%',
        height: fullScreen ? '100vh' : '100%',
        backgroundColor: fullScreen ? theme.palette.background.default : 'transparent',
        position: fullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        zIndex: fullScreen ? 9999 : 'auto',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            color: color || theme.palette.primary.main,
          }}
        />
        {size > 40 && (
          <CircularProgress
            size={size}
            thickness={4}
            variant="determinate"
            value={100}
            sx={{
              color: alpha(color || theme.palette.primary.main, 0.1),
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        )}
      </Box>
      {message && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Container>
  );
};