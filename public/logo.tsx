import React from 'react';
import { Box, Typography } from '@mui/material';

interface AccuManagerLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'icon';
  darkMode?: boolean;
}

const AccuManagerLogo: React.FC<AccuManagerLogoProps> = ({ 
  size = 'medium', 
  variant = 'full',
  darkMode = false 
}) => {
  const sizeMap = {
    small: { fontSize: '1.2rem', iconSize: 24, spacing: 4 },
    medium: { fontSize: '1.8rem', iconSize: 32, spacing: 6 },
    large: { fontSize: '2.5rem', iconSize: 40, spacing: 8 }
  };

  const { fontSize, iconSize, spacing } = sizeMap[size];

  // Google color palette
  const colors = {
    blue: '#4285f4',
    red: '#ea4335',
    yellow: '#fbbc04',
    green: '#34a853',
    text: darkMode ? '#e8eaed' : '#202124'
  };

  const letters = [
    { char: 'A', color: colors.blue },
    { char: 'c', color: colors.red },
    { char: 'c', color: colors.yellow },
    { char: 'u', color: colors.green },
    { char: 'M', color: colors.blue },
    { char: 'a', color: colors.red },
    { char: 'n', color: colors.yellow },
    { char: 'a', color: colors.green },
    { char: 'g', color: colors.blue },
    { char: 'e', color: colors.red },
    { char: 'r', color: colors.yellow }
  ];

  // Icon Component
  const LogoIcon = () => (
    <Box sx={{ 
      position: 'relative',
      width: iconSize,
      height: iconSize,
    }}>
      {/* Main icon shape - Precision targeting with graph */}
      <Box sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        backgroundColor: colors.blue,
        opacity: 0.1,
      }} />
      
      <Box sx={{
        position: 'absolute',
        width: '60%',
        height: '60%',
        top: '20%',
        left: '20%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Target icon */}
        <Box sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          {/* Outer circle */}
          <Box sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${colors.blue}`,
          }} />
          
          {/* Middle circle */}
          <Box sx={{
            position: 'absolute',
            width: '66%',
            height: '66%',
            top: '17%',
            left: '17%',
            borderRadius: '50%',
            border: `2px solid ${colors.red}`,
          }} />
          
          {/* Inner circle / Bullseye */}
          <Box sx={{
            position: 'absolute',
            width: '33%',
            height: '33%',
            top: '33.5%',
            left: '33.5%',
            borderRadius: '50%',
            backgroundColor: colors.green,
          }} />
          
          {/* Graph line */}
          <Box sx={{
            position: 'absolute',
            width: '80%',
            height: '2px',
            backgroundColor: colors.yellow,
            bottom: '25%',
            left: '10%',
            transform: 'rotate(-15deg)',
          }} />
        </Box>
      </Box>
    </Box>
  );

  // Full Logo Component
  const FullLogo = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 1,
    }}>
      <LogoIcon />
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 0.1,
      }}>
        {letters.map((letter, index) => (
          <Typography
            key={index}
            sx={{
              fontSize,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: letter.color,
              lineHeight: 1,
              fontFamily: "'Google Sans', 'Roboto', 'Arial', sans-serif",
            }}
          >
            {letter.char}
          </Typography>
        ))}
      </Box>
    </Box>
  );

  return variant === 'icon' ? <LogoIcon /> : <FullLogo />;
};

export default AccuManagerLogo;