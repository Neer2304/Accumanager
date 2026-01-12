import React, { ReactNode, useState } from 'react';
import { Paper, Box, alpha, useTheme, Fade } from '@mui/material';

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={elevation}
        onMouseEnter={() => hoverEffect && setIsHovered(true)}
        onMouseLeave={() => hoverEffect && setIsHovered(false)}
        sx={{
          p: { xs: 3, sm: 4, md: 4.5 },
          borderRadius: 4,
          background: `
            linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)
          `,
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 ${alpha(theme.palette.common.white, 0.1)}
          `,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered && hoverEffect ? 'translateY(-8px)' : 'translateY(0)',
          maxWidth,
          width: '100%',
          zIndex: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
            animation: 'shimmer 2s infinite linear',
            zIndex: 1,
          },
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200px 0' },
            '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '2px',
            background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.1))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: isHovered && hoverEffect ? 1 : 0.5,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 3 }}>
          {children}
        </Box>
      </Paper>
    </Fade>
  );
};

export default AuthCard;