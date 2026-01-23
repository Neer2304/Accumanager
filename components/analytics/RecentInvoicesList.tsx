// components/analytics/RecentInvoicesList.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { InvoiceIcon } from '@/assets/icons/AnalyticsIcons';

interface RecentInvoicesListProps {
  invoices: Array<{
    invoiceNumber: string;
    invoiceDate: Date;
    grandTotal: number;
    paymentStatus: string;
    customer: {
      name: string;
    };
  }>;
  loading?: boolean;
  isMobile?: boolean;
}

const RecentInvoicesList: React.FC<RecentInvoicesListProps> = ({ 
  invoices, 
  loading = false,
  isMobile = false 
}) => {
  if (loading) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            <InvoiceIcon />
            Recent Invoices
          </Typography>
          <Typography 
            color="text.secondary" 
            align="center" 
            sx={{ 
              py: isMobile ? 2 : 4,
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            Loading invoices...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            <InvoiceIcon />
            Recent Invoices
          </Typography>
          <Typography 
            color="text.secondary" 
            align="center" 
            sx={{ 
              py: isMobile ? 2 : 4,
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            No invoice data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent sx={{ p: isMobile ? 1 : 2 }}>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          fontWeight="bold" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}
        >
          <InvoiceIcon />
          Recent Invoices
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 2 }}>
          {invoices.slice(0, 5).map((invoice, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: isMobile ? 1 : 2,
                borderBottom: index < 4 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ maxWidth: isMobile ? '60%' : '70%' }}>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {invoice.invoiceNumber || `INV-${index + 1}`}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                >
                  {new Date(invoice.invoiceDate || new Date()).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="body2" 
                  fontWeight="bold" 
                  color="primary.main"
                  sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                >
                  ₹{isMobile && invoice.grandTotal > 9999 ? `${(invoice.grandTotal/1000).toFixed(0)}k` : (invoice.grandTotal || 0).toLocaleString()}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: invoice.paymentStatus === 'paid' ? 'success.main' : 
                          invoice.paymentStatus === 'pending' ? 'error.main' : 'warning.main',
                    fontWeight: 500,
                    fontSize: isMobile ? '0.65rem' : '0.75rem'
                  }}
                >
                  {invoice.paymentStatus || 'Pending'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentInvoicesList;