import React from 'react';
import { Box, Typography } from '@mui/material';

interface AccuManagerLogoBadgeProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'badge' | 'text';
}

const AccuManagerLogoBadge: React.FC<AccuManagerLogoBadgeProps> = ({ 
  size = 'medium', 
  variant = 'badge' 
}) => {
  const sizeMap = {
    small: { fontSize: '0.9rem', badgeSize: 80, iconSize: 20 },
    medium: { fontSize: '1.2rem', badgeSize: 120, iconSize: 28 },
    large: { fontSize: '1.8rem', badgeSize: 160, iconSize: 36 }
  };

  const { fontSize, badgeSize, iconSize } = sizeMap[size];

  const BadgeLogo = () => (
    <Box sx={{ 
      position: 'relative',
      width: badgeSize,
      height: badgeSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Outer badge shape */}
      <Box sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '24%',
        background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
        transform: 'rotate(45deg)',
      }} />
      
      {/* Inner white area */}
      <Box sx={{
        position: 'absolute',
        width: '85%',
        height: '85%',
        borderRadius: '20%',
        backgroundColor: 'white',
        transform: 'rotate(45deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Google-style circles inside */}
        <Box sx={{
          position: 'relative',
          width: '70%',
          height: '70%',
          transform: 'rotate(-45deg)',
        }}>
          {/* Circles arranged like Google logo */}
          <Box sx={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            backgroundColor: '#4285f4',
            top: '10%',
            left: '10%',
          }} />
          
          <Box sx={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            backgroundColor: '#ea4335',
            top: '10%',
            right: '10%',
          }} />
          
          <Box sx={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            backgroundColor: '#fbbc04',
            bottom: '10%',
            left: '10%',
          }} />
          
          <Box sx={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            backgroundColor: '#34a853',
            bottom: '10%',
            right: '10%',
          }} />
          
          {/* Center 'A' */}
          <Typography
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: iconSize * 0.6,
              fontWeight: 900,
              color: '#202124',
              fontFamily: "'Google Sans', sans-serif",
            }}
          >
            A
          </Typography>
        </Box>
      </Box>
      
      {/* Text around badge */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: fontSize,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          whiteSpace: 'nowrap',
          fontFamily: "'Google Sans', sans-serif",
        }}
      >
        AccuManager
      </Typography>
    </Box>
  );

  const TextLogo = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography
        sx={{
          fontSize: fontSize,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #4285f4 0%, #ea4335 25%, #fbbc04 50%, #34a853 75%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Google Sans', 'Roboto', sans-serif",
        }}
      >
        AccuManager
      </Typography>
      <Typography
        sx={{
        //   fontSize: fontSize * 0.6,
          fontWeight: 400,
          color: '#5f6368',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: "'Google Sans', sans-serif",
        }}
      >
        Business Suite
      </Typography>
    </Box>
  );

  return variant === 'badge' ? <BadgeLogo /> : <TextLogo />;
};

export { AccuManagerLogoBadge };