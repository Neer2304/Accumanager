'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

interface BillCustomer {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state: string;
  pincode?: string;
  gstin?: string;
  isInterState: boolean;
}

interface CustomerDetailsProps {
  customer: BillCustomer;
  businessState?: string;
  onCustomerChange: (field: keyof BillCustomer, value: any) => void;
  onOpenSearch: () => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  businessState,
  onCustomerChange,
  onOpenSearch,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}
            >
              <PersonIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Customer Details
            </Typography>
          </Stack>
          <Button
            size="small"
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
            onClick={onOpenSearch}
            sx={{
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              },
            }}
          >
            Search
          </Button>
        </Stack>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Customer Name *"
            value={customer.name || ''}
            onChange={(e) => onCustomerChange("name", e.target.value)}
            size={isMobile ? "small" : "small"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                },
                '&.Mui-focused': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                },
              },
            }}
          />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Phone *"
              value={customer.phone || ''}
              onChange={(e) => onCustomerChange("phone", e.target.value)}
              size={isMobile ? "small" : "small"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                  },
                  '&.Mui-focused': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="GSTIN"
              value={customer.gstin || ''}
              onChange={(e) => onCustomerChange("gstin", e.target.value)}
              size={isMobile ? "small" : "small"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ReceiptIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                  },
                  '&.Mui-focused': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                  },
                },
              }}
            />
          </Stack>

          <TextField
            fullWidth
            label="State *"
            value={customer.state || ''}
            onChange={(e) => onCustomerChange("state", e.target.value)}
            size={isMobile ? "small" : "small"}
            placeholder="Enter customer state"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                },
                '&.Mui-focused': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                },
              },
            }}
          />

          <Box>
            <Chip
              label={
                customer.isInterState
                  ? "Inter-State Transaction (IGST)"
                  : "Intra-State Transaction (CGST+SGST)"
              }
              size="small"
              sx={{
                backgroundColor: customer.isInterState
                  ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'
                  : darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: customer.isInterState
                  ? darkMode ? '#fdd663' : '#fbbc04'
                  : darkMode ? '#8ab4f8' : '#1a73e8',
                border: 'none',
                fontWeight: 500,
              }}
            />
            {businessState && (
              <Typography
                variant="caption"
                sx={{ display: 'block', mt: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                Your business is in <strong>{businessState}</strong>
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};