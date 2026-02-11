'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Avatar,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Store as StoreIcon,
} from "@mui/icons-material";

interface Business {
  businessName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BusinessDetailsProps {
  business: Business | null;
}

export const BusinessDetails: React.FC<BusinessDetailsProps> = ({ business }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: 'none',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }}
          >
            <StoreIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Seller Details
          </Typography>
        </Stack>

        {business ? (
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {business.businessName}
              </Typography>
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ fontWeight: 500 }}>GST:</span> {business.gstNumber}
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ fontWeight: 500 }}>📍</span> {business.address}, {business.city}
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ fontWeight: 500 }}>🏛️</span> {business.state}, {business.pincode}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Alert
            severity="info"
            sx={{
              borderRadius: '12px',
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              border: `1px solid ${darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)'}`,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '& .MuiAlert-icon': {
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          >
            <Typography variant="body2">
              Please set up your business profile in settings.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};