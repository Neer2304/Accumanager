import React, { ReactNode } from 'react';
import { Box, alpha, useTheme } from '@mui/material';

interface AuthContainerProps {
  children: ReactNode;
  showBackground?: boolean;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  showBackground = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: showBackground ? `
          radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
        ` : 'none',
        position: 'relative',
        overflow: 'hidden',
        '&::before': showBackground ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite alternate',
        } : {},
        '@keyframes pulse': {
          '0%': { opacity: 0.3 },
          '100%': { opacity: 0.6 },
        },
      }}
    >
      {/* Animated background elements */}
      {showBackground && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
              animation: 'float 20s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              right: '15%',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
              animation: 'float 25s ease-in-out infinite reverse',
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