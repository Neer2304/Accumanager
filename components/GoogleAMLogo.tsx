import React from 'react';
import { Box } from '@mui/material';

interface GoogleAMLogoProps {
  size?: number;
  darkMode?: boolean;
}

const GoogleAMLogo: React.FC<GoogleAMLogoProps> = ({ size = 64, darkMode = false }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          filter: 'brightness(1.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <svg
        viewBox="0 0 120 80" // Wider viewbox to fit both letters clearly
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* --- LETTER A --- */}
        {/* Left Leg of A (Blue) */}
        <path
          d="M10 70L35 10L45 10L55 35"
          stroke="#4285F4"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crossbar of A (Red) */}
        <path
          d="M23 45H48"
          stroke="#EA4335"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* --- THE LINK / CENTER PILLAR --- */}
        {/* This part finishes the A and starts the M (Yellow) */}
        <path
          d="M45 10L70 70"
          stroke="#FBBC04"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* --- LETTER M --- */}
        {/* The "V" and Right Leg of M (Green) */}
        <path
          d="M70 70L85 30L100 70L110 70"
          stroke="#34A853"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Subtle Shadow for depth where they overlap */}
        <circle cx="45" cy="10" r="4" fill="rgba(0,0,0,0.1)" />
      </svg>
    </Box>
  );
};

export default GoogleAMLogo;