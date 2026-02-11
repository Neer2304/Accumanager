'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  Typography,
  Button,
  Avatar,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
}

interface CustomerSearchDialogProps {
  open: boolean;
  searchTerm: string;
  searchResults: Customer[];
  onClose: () => void;
  onSearchChange: (term: string) => void;
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerSearchDialog: React.FC<CustomerSearchDialogProps> = ({
  open,
  searchTerm,
  searchResults,
  onClose,
  onSearchChange,
  onSelectCustomer,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          fontWeight: 500,
          color: darkMode ? '#e8eaed' : '#202124',
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        Search Customer
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <CloseIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </IconButton>
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
          sx={{ mb: 2 }}
          autoFocus
        />
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {searchResults.map((cust, index) => (
            <Card
              key={index}
              sx={{
                mb: 1,
                p: 2,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                cursor: "pointer",
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
              onClick={() => onSelectCustomer(cust)}
            >
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {cust.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    📞 {cust.phone} {cust.email && `• ✉️ ${cust.email}`}
                  </Typography>
                  {cust.company && (
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
                      🏢 {cust.company}
                    </Typography>
                  )}
                  {cust.address && (
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mt: 0.5 }}>
                      📍 {cust.address}, {cust.city}
                    </Typography>
                  )}
                  {cust.gstin && (
                    <Chip
                      label={`GST: ${cust.gstin}`}
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        border: 'none',
                        fontSize: '0.65rem',
                      }}
                    />
                  )}
                </Box>
              </Stack>
            </Card>
          ))}
          {searchResults.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  margin: '0 auto 16px',
                  backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                No customers found
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Try adjusting your search for "{searchTerm}"
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '20px',
            px: 3,
            py: 0.75,
            color: darkMode ? '#e8eaed' : '#202124',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};