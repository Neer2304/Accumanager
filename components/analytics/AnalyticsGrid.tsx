"use client";

import React from 'react';
import {
  Box,
  Typography,
  alpha,
} from '@mui/material';
import { Card } from '@/components/ui/Card';

interface AnalyticsGridProps {
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentInvoices: Array<{
    invoiceNumber: string;
    invoiceDate: Date;
    grandTotal: number;
    paymentStatus: string;
    customer: {
      name: string;
    };
  }>;
  darkMode?: boolean;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({
  topProducts,
  recentInvoices,
  darkMode = false,
}) => {
  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      gap: 3,
      mb: 3
    }}>
      {/* Top Products */}
      <Card
        title="🏆 Top Products"
        subtitle="Best performing products by revenue"
        sx={{
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          {topProducts.map((product, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 1.5,
                border: '1px solid',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                borderRadius: 1,
                bgcolor: index === 0 ? alpha('#1976d2', darkMode ? 0.15 : 0.05) : 'transparent'
              }}
            >
              <Box sx={{ maxWidth: '70%' }}>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ 
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  {product.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  {product.sales} units sold
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                color="#4285f4"
                sx={{ fontSize: '0.875rem' }}
              >
                ₹{product.revenue.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Recent Invoices */}
      <Card
        title="📄 Recent Invoices"
        subtitle="Latest invoice transactions"
        sx={{
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          {recentInvoices.slice(0, 5).map((invoice, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 1.5,
                borderBottom: index < 4 ? '1px solid' : 'none',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              }}
            >
              <Box sx={{ maxWidth: '70%' }}>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ 
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  {invoice.invoiceNumber || `INV-${index + 1}`}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  {new Date(invoice.invoiceDate || new Date()).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="body2" 
                  fontWeight="bold" 
                  color="#4285f4"
                  sx={{ fontSize: '0.875rem' }}
                >
                  ₹{(invoice.grandTotal || 0).toLocaleString()}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: invoice.paymentStatus === 'paid' ? '#34a853' : 
                          invoice.paymentStatus === 'pending' ? '#ea4335' : '#fbbc04',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                >
                  {invoice.paymentStatus || 'Pending'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
};