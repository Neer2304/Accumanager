'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
} from "@mui/icons-material";

interface HeaderSectionProps {
  isOnline: boolean;
  grandTotal: number;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  isOnline,
  grandTotal,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        borderRadius: '16px',
        background: darkMode
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #1a73e8, #8ab4f8, #fbbc04)',
          zIndex: 1,
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }}
          >
            <ReceiptIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </Avatar>
          <Box>
            <Typography
              variant={isOnline ? "h4" : "h5"}
              component="h1"
              fontWeight={500}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                letterSpacing: '-0.5px',
                mb: 0.5,
              }}
            >
              🧾 Point of Sale
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
                opacity: 0.9,
              }}
            >
              {isOnline
                ? "Create professional invoices with GST calculations"
                : "Offline Mode - Bills saved locally"}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              mb: 0.5,
            }}
          >
            Grand Total
          </Typography>
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              fontSize: { xs: '1.75rem', sm: '2rem' },
            }}
          >
            ₹{grandTotal.toLocaleString()}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};