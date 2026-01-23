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
}

const RecentInvoicesList: React.FC<RecentInvoicesListProps> = ({ invoices, loading = false }) => {
  if (loading) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InvoiceIcon />
            Recent Invoices
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Loading invoices...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InvoiceIcon />
            Recent Invoices
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No invoice data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InvoiceIcon />
          Recent Invoices
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {invoices.slice(0, 5).map((invoice, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 2,
                borderBottom: index < 4 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {invoice.invoiceNumber || `INV-${index + 1}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(invoice.invoiceDate || new Date()).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" fontWeight="bold" color="primary.main">
                  ₹{(invoice.grandTotal || 0).toLocaleString()}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: invoice.paymentStatus === 'paid' ? 'success.main' : 
                          invoice.paymentStatus === 'pending' ? 'error.main' : 'warning.main',
                    fontWeight: 500
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