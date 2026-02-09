"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { AccessTime, SupportAgent } from '@mui/icons-material';

const supportHours = [
  { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM IST' },
  { day: 'Saturday', time: '10:00 AM - 2:00 PM IST' },
  { day: 'Sunday', time: 'Emergency Support Only' },
];

export const SupportHours: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccessTime sx={{ fontSize: 20, color: '#4285f4' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Support Hours
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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
                borderColor: darkMode ? alpha('#3c4043', 0.5) : alpha('#dadce0', 0.5),
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {item.day}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
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
            p: 2,
            borderRadius: 2,
            backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.05),
            border: `1px solid ${darkMode ? alpha('#34a853', 0.3) : alpha('#34a853', 0.2)}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              fontWeight: 600,
              color: darkMode ? '#81c995' : '#34a853',
            }}
          >
            <SupportAgent fontSize="small" />
            <span>
              <span style={{ fontWeight: 700 }}>Emergency Support:</span> Available 24/7 for critical issues
            </span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};