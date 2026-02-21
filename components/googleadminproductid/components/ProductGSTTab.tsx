// components/googleadminproductid/components/ProductGSTTab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Paper,
  Avatar,
  Divider,
  Alert,
  useTheme,
  alpha,
  Box
} from '@mui/material';
import {
  Receipt
} from '@mui/icons-material';
import { Product } from './types';

interface ProductGSTTabProps {
  product: Product;
  formatCurrency: (amount: number) => string;
}

export const ProductGSTTab: React.FC<ProductGSTTabProps> = ({
  product,
  formatCurrency
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const gstDetails = product.gstDetails;

  if (!gstDetails) {
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent>
          <Alert severity="info" sx={{ 
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            No GST details configured for this product. Add GST details in the edit page.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const calculateTotalTax = (basePrice: number = 1000) => {
    const cgst = (basePrice * (gstDetails.cgstRate || 0)) / 100;
    const sgst = (basePrice * (gstDetails.sgstRate || 0)) / 100;
    const igst = (basePrice * (gstDetails.igstRate || 0)) / 100;
    return {
      base: basePrice,
      cgst,
      sgst,
      igst,
      total: basePrice + cgst + sgst + igst
    };
  };

  const example = calculateTotalTax();

  return (
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: darkMode ? '#e8eaed' : '#202124',
        }}>
          <Receipt /> GST & Tax Details
        </Typography>
        
        <Stack spacing={3}>
          {/* GST Summary */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
              <Avatar sx={{ 
                width: 60, 
                height: 60, 
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Receipt fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>GST Type</Typography>
                <Typography variant="h6" textTransform="uppercase" color={darkMode ? '#e8eaed' : '#202124'}>
                  {gstDetails.type?.replace('_', ' + ')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>HSN Code</Typography>
                <Typography variant="h6" fontFamily="monospace" color={darkMode ? '#e8eaed' : '#202124'}>
                  {gstDetails.hsnCode}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Tax Rates */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            {gstDetails.cgstRate && gstDetails.cgstRate > 0 && (
              <Card sx={{ 
                flex: 1, 
                minWidth: 150,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <CardContent>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                    CGST
                  </Typography>
                  <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
                    {gstDetails.cgstRate}%
                  </Typography>
                  <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Central Goods & Services Tax
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            {gstDetails.sgstRate && gstDetails.sgstRate > 0 && (
              <Card sx={{ 
                flex: 1, 
                minWidth: 150,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <CardContent>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                    SGST
                  </Typography>
                  <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
                    {gstDetails.sgstRate}%
                  </Typography>
                  <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    State Goods & Services Tax
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            {gstDetails.igstRate && gstDetails.igstRate > 0 && (
              <Card sx={{ 
                flex: 1, 
                minWidth: 150,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <CardContent>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                    IGST
                  </Typography>
                  <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
                    {gstDetails.igstRate}%
                  </Typography>
                  <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Integrated Goods & Services Tax
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>

          {/* Tax Calculation Example */}
          <Card sx={{ 
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 500,
              }}>
                Tax Calculation Example (for ₹1,000)
              </Typography>
              
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Base Price</Typography>
                  <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>₹1,000.00</Typography>
                </Stack>
                
                {gstDetails.cgstRate && gstDetails.cgstRate > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      CGST ({gstDetails.cgstRate}%)
                    </Typography>
                    <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                      ₹{example.cgst.toFixed(2)}
                    </Typography>
                  </Stack>
                )}
                
                {gstDetails.sgstRate && gstDetails.sgstRate > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      SGST ({gstDetails.sgstRate}%)
                    </Typography>
                    <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                      ₹{example.sgst.toFixed(2)}
                    </Typography>
                  </Stack>
                )}
                
                {gstDetails.igstRate && gstDetails.igstRate > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      IGST ({gstDetails.igstRate}%)
                    </Typography>
                    <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                      ₹{example.igst.toFixed(2)}
                    </Typography>
                  </Stack>
                )}
                
                <Divider sx={{ my: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                    Total Price
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color={darkMode ? '#8ab4f8' : '#1a73e8'}>
                    ₹{example.total.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
};