// components/contacts/SupportHours.tsx
"use client";

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { Schedule, SupportAgent } from '@mui/icons-material';

const supportHours = [
  { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM IST' },
  { day: 'Saturday', time: '10:00 AM - 2:00 PM IST' },
  { day: 'Sunday', time: 'Emergency Support Only' },
];

export const SupportHours: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Schedule sx={{ fontSize: 24, color: theme.palette.info.main }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Support Hours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We&apos;re here when you need us
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        {supportHours.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderBottom: index < supportHours.length - 1 ? '1px solid' : 'none',
              borderColor: alpha(theme.palette.divider, 0.2),
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {item.day}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {item.time}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.info.main, 0.08),
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontWeight: 600,
            color: theme.palette.info.dark,
          }}
        >
          <SupportAgent fontSize="small" />
          <Box>
            <Typography component="span" fontWeight={700}>
              Emergency Support:
            </Typography>{' '}
            Available 24/7 for critical issues
          </Box>
        </Typography>
      </Box>
    </Paper>
  );
};