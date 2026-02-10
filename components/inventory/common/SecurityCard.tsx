import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';

interface SecurityCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SecurityCard = ({ title, icon, children, className = '' }: SecurityCardProps) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Paper 
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: darkMode 
            ? `0 8px 24px ${alpha('#4285f4', 0.3)}`
            : `0 8px 24px ${alpha('#4285f4', 0.15)}`,
          borderColor: darkMode ? '#4285f4' : '#4285f4',
        },
        ...(className && { [className]: true }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {React.isValidElement(icon) && 
          React.cloneElement(icon as React.ReactElement<any>, {
            sx: {
              fontSize: { xs: 20, sm: 24 },
              color: darkMode ? '#8ab4f8' : '#4285f4',
              mr: 2,
            }
          })
        }
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            color: darkMode ? '#e8eaed' : '#202124',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ 
        color: darkMode ? '#9aa0a6' : '#5f6368',
        '& p': {
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          lineHeight: 1.6,
          mb: 2,
          '&:last-child': { mb: 0 },
        },
        '& ul, & ol': {
          pl: 2,
          mb: 2,
        },
        '& li': {
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          lineHeight: 1.6,
          mb: 1,
          '&:last-child': { mb: 0 },
        },
      }}>
        {children}
      </Box>
    </Paper>
  );
};