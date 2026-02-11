'use client';

import React, { ReactNode, useState } from 'react';
import { Paper, Box, useTheme, Fade } from '@mui/material';

interface AuthCardProps {
  children: ReactNode;
  elevation?: number;
  maxWidth?: number | string;
  hoverEffect?: boolean;
}

const AuthCard: React.FC<AuthCardProps> = ({
  children,
  elevation = 0,
  maxWidth = 500,
  hoverEffect = true,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={elevation}
        onMouseEnter={() => hoverEffect && setIsHovered(true)}
        onMouseLeave={() => hoverEffect && setIsHovered(false)}
        sx={{
          p: { xs: 3, sm: 4, md: 4.5 },
          borderRadius: '28px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: isHovered && hoverEffect ? 'translateY(-4px)' : 'translateY(0)',
          '&:hover': {
            boxShadow: darkMode
              ? '0 16px 48px rgba(0, 0, 0, 0.6)'
              : '0 16px 48px rgba(0, 0, 0, 0.12)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1a73e8, #8ab4f8, #fbbc04, #34a853)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite linear',
            zIndex: 1,
          },
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '0% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '2px',
            background: `linear-gradient(145deg, ${darkMode ? 'rgba(138, 180, 248, 0.3)' : 'rgba(26, 115, 232, 0.2)'}, ${darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'})`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: isHovered && hoverEffect ? 0.8 : 0.3,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          },
          maxWidth,
          width: '100%',
          zIndex: 2,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 3 }}>{children}</Box>
      </Paper>
    </Fade>
  );
};

export default AuthCard;