'use client';

import React, { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';

interface AuthContainerProps {
  children: ReactNode;
  showBackground?: boolean;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  showBackground = true,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: showBackground
          ? darkMode
            ? 'radial-gradient(circle at 20% 80%, rgba(138, 180, 248, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251, 188, 4, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(52, 168, 83, 0.05) 0%, transparent 50%), #202124'
            : 'radial-gradient(circle at 20% 80%, rgba(26, 115, 232, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251, 188, 4, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(52, 168, 83, 0.03) 0%, transparent 50%), #f8f9fa'
          : 'none',
        position: 'relative',
        overflow: 'hidden',
        '&::before': showBackground
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 50% 50%, ${darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'} 0%, transparent 70%)`,
              animation: 'pulse 8s ease-in-out infinite alternate',
            }
          : {},
        '@keyframes pulse': {
          '0%': { opacity: 0.3 },
          '100%': { opacity: 0.7 },
        },
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '100%': { transform: 'translate(30px, 20px) rotate(5deg)' },
        },
      }}
    >
      {showBackground && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)'} 0%, transparent 70%)`,
              animation: 'float 20s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              right: '5%',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${darkMode ? 'rgba(251, 188, 4, 0.06)' : 'rgba(251, 188, 4, 0.03)'} 0%, transparent 70%)`,
              animation: 'float 25s ease-in-out infinite reverse',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '80%',
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${darkMode ? 'rgba(52, 168, 83, 0.06)' : 'rgba(52, 168, 83, 0.03)'} 0%, transparent 70%)`,
              animation: 'float 18s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        </>
      )}

      {children}
    </Box>
  );
};

export default AuthContainer;