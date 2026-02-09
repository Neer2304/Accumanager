"use client";

import React from 'react';
import { Chip, alpha } from '@mui/material';

interface DepartmentChipProps {
  department: string;
  darkMode?: boolean;
}

export const DepartmentChip: React.FC<DepartmentChipProps> = ({ 
  department,
  darkMode = false 
}) => {
  
  // Google Material Design colors for both modes
  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, { 
      light: { bg: string, text: string, border: string },
      dark: { bg: string, text: string, border: string }
    }> = {
      Sales: {
        light: { bg: '#e3f2fd', text: '#0d47a1', border: '#bbdefb' }, // Blue
        dark: { bg: '#0d3064', text: '#8ab4f8', border: '#1a4d8f' }
      },
      Marketing: {
        light: { bg: '#fce4ec', text: '#880e4f', border: '#f8bbd9' }, // Pink
        dark: { bg: '#4d194d', text: '#f28b82', border: '#6d3a6d' }
      },
      Development: {
        light: { bg: '#e8f5e9', text: '#1b5e20', border: '#c8e6c9' }, // Green
        dark: { bg: '#0d3c2e', text: '#81c995', border: '#1c553f' }
      },
      Design: {
        light: { bg: '#f3e5f5', text: '#4a148c', border: '#e1bee7' }, // Purple
        dark: { bg: '#3e2b5f', text: '#c58af9', border: '#523d80' }
      },
      HR: {
        light: { bg: '#fff3e0', text: '#e65100', border: '#ffe0b2' }, // Orange
        dark: { bg: '#5c4033', text: '#ffb74d', border: '#7d5d4d' }
      },
      Finance: {
        light: { bg: '#e8f5e9', text: '#2e7d32', border: '#c8e6c9' }, // Success green
        dark: { bg: '#1e4620', text: '#81c995', border: '#2d5c2f' }
      },
      Operations: {
        light: { bg: '#fff8e1', text: '#ff6f00', border: '#ffecb3' }, // Amber
        dark: { bg: '#5d4037', text: '#ffcc80', border: '#7d5f4d' }
      },
      Support: {
        light: { bg: '#e0f7fa', text: '#006064', border: '#b2ebf2' }, // Cyan
        dark: { bg: '#004d40', text: '#80deea', border: '#006d5b' }
      },
      Management: {
        light: { bg: '#f5f5f5', text: '#212121', border: '#e0e0e0' }, // Grey
        dark: { bg: '#3c4043', text: '#e8eaed', border: '#5f6368' }
      },
      Other: {
        light: { bg: '#f5f5f5', text: '#616161', border: '#e0e0e0' }, // Grey
        dark: { bg: '#5f6368', text: '#9aa0a6', border: '#80868b' }
      },
      IT: {
        light: { bg: '#e8eaf6', text: '#283593', border: '#c5cae9' }, // Indigo
        dark: { bg: '#1a237e', text: '#8c9eff', border: '#283593' }
      },
      Engineering: {
        light: { bg: '#e0f2f1', text: '#004d40', border: '#b2dfdb' }, // Teal
        dark: { bg: '#00251a', text: '#80cbc4', border: '#004d40' }
      },
      Production: {
        light: { bg: '#fffde7', text: '#f57f17', border: '#fff9c4' }, // Yellow
        dark: { bg: '#5d4037', text: '#ffd54f', border: '#7d5f4d' }
      },
      Quality: {
        light: { bg: '#e0f7fa', text: '#00838f', border: '#b2ebf2' }, // Cyan
        dark: { bg: '#006064', text: '#4dd0e1', border: '#00838f' }
      },
      Research: {
        light: { bg: '#fce4ec', text: '#ad1457', border: '#f8bbd9' }, // Pink
        dark: { bg: '#880e4f', text: '#f48fb1', border: '#ad1457' }
      },
      Legal: {
        light: { bg: '#ede7f6', text: '#4527a0', border: '#d1c4e9' }, // Deep purple
        dark: { bg: '#311b92', text: '#b39ddb', border: '#4527a0' }
      }
    };
    
    const mode = darkMode ? 'dark' : 'light';
    return colors[dept]?.[mode] || colors.Other[mode];
  };

  const color = getDepartmentColor(department);

  return (
    <Chip
      label={department}
      size="small"
      sx={{
        backgroundColor: color.bg,
        color: color.text,
        fontWeight: 500,
        borderRadius: '6px',
        border: `1px solid ${color.border}`,
        fontSize: '0.75rem',
        height: '24px',
        '&:hover': {
          backgroundColor: darkMode 
            ? alpha(color.bg, 0.9)
            : alpha(color.bg, 0.95),
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        '& .MuiChip-label': {
          px: 1,
        },
        transition: 'all 0.2s ease',
      }}
    />
  );
};