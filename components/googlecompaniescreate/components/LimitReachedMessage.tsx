// components/googlecompaniescreate/components/LimitReachedMessage.tsx
import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GOOGLE_COLORS } from '../constants';

interface LimitReachedMessageProps {
  current: number;
  max: number;
}

export const LimitReachedMessage: React.FC<LimitReachedMessageProps> = ({ current, max }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const router = useRouter();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      gap: 3,
      px: 3
    }}>
      <Avatar sx={{ 
        width: 80, 
        height: 80, 
        bgcolor: alpha(GOOGLE_COLORS.yellow, 0.1),
        color: GOOGLE_COLORS.yellow
      }}>
        <BusinessIcon sx={{ fontSize: 40 }} />
      </Avatar>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Company Limit Reached
        </Typography>
        <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', maxWidth: 400, mb: 3 }}>
          You already have {current} out of {max} companies.
          Delete an existing company to create a new one.
        </Typography>
        <Box
          component="button"
          onClick={() => router.push('/companies')}
          sx={{
            px: 4,
            py: 1.5,
            border: 'none',
            borderRadius: '24px',
            backgroundColor: GOOGLE_COLORS.blue,
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#1a5cb0',
            },
          }}
        >
          Back to Companies
        </Box>
      </Box>
    </Box>
  );
};