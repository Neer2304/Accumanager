// components/advance/sub-bill/PaymentHistoryTable.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import {
  Payment,
  Receipt,
  CheckCircle,
  PendingActions,
  Error,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface PaymentHistoryTableProps {
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const transactions = [
    {
      id: 'TXN-004',
      date: '2024-01-01',
      description: 'Professional Plan - 4 months upfront',
      amount: 796,
      status: 'completed',
      paymentMethod: 'Credit Card',
      invoiceId: 'INV-2024-001',
    },
    {
      id: 'TXN-005',
      date: '2023-09-01',
      description: 'Basic Plan - 4 months',
      amount: 396,
      status: 'completed',
      paymentMethod: 'UPI',
      invoiceId: 'INV-2023-009',
    },
    {
      id: 'TXN-006',
      date: '2023-05-01',
      description: 'Starter Plan - 4 months',
      amount: 196,
      status: 'completed',
      paymentMethod: 'Net Banking',
      invoiceId: 'INV-2023-005',
    },
    {
      id: 'UPCOMING-001',
      date: '2024-05-01',
      description: 'Professional Plan - Monthly Renewal',
      amount: 199,
      status: 'pending',
      paymentMethod: 'Credit Card',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#34A853';
      case 'pending':
        return '#FBBC04';
      case 'failed':
        return '#EA4335';
      default:
        return currentColors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle fontSize="small" />;
      case 'pending':
        return <PendingActions fontSize="small" />;
      case 'failed':
        return <Error fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
        Payment Transaction History
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        {/* Transactions Table */}
        <Card sx={{ 
          flex: 2,
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color={currentColors.textPrimary}>
                All Transactions
              </Typography>
              <Select
                value="all"
                size="small"
                sx={{
                  background: currentColors.surface,
                  color: currentColors.textPrimary,
                  minWidth: 120
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </Box>
            
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ background: currentColors.surface }}>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Date</TableCell>
                    {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Description</TableCell>}
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Method</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }} align="right">Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell sx={{ color: currentColors.textPrimary }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      {!isMobile && (
                        <TableCell sx={{ color: currentColors.textPrimary }}>
                          <Typography variant="body2">
                            {transaction.description}
                          </Typography>
                          {transaction.invoiceId && (
                            <Typography variant="caption" color={currentColors.textSecondary}>
                              Invoice: {transaction.invoiceId}
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell sx={{ color: currentColors.textPrimary }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Payment fontSize="small" />
                          {isMobile ? transaction.paymentMethod.substring(0, 3) : transaction.paymentMethod}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: currentColors.textPrimary, fontWeight: 'bold' }}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Chip
                        //   icon={getStatusIcon(transaction.status)}
                          label={isMobile ? '' : transaction.status.toUpperCase()}
                          size="small"
                          sx={{
                            background: alpha(getStatusColor(transaction.status), 0.1),
                            color: getStatusColor(transaction.status),
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card sx={{ 
          flex: 1,
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
          minWidth: isMobile ? '100%' : '300px'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
              Payment Summary
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Total Spent
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={currentColors.textPrimary}>
                  ₹1,388
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Successful
                </Typography>
                <Chip
                  label="3"
                  size="small"
                  sx={{
                    background: alpha('#34A853', 0.1),
                    color: '#34A853',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Pending
                </Typography>
                <Chip
                  label="1"
                  size="small"
                  sx={{
                    background: alpha('#FBBC04', 0.1),
                    color: '#FBBC04',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Failed
                </Typography>
                <Chip
                  label="0"
                  size="small"
                  sx={{
                    background: alpha('#EA4335', 0.1),
                    color: '#34A853',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Average Payment
                </Typography>
                <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
                  ₹462
                </Typography>
              </Box>
            </Stack>
            
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Receipt />}
              sx={{
                mt: 3,
                borderColor: currentColors.border,
                color: currentColors.textPrimary,
                '&:hover': {
                  borderColor: primaryColor,
                  background: alpha(primaryColor, 0.04),
                }
              }}
            >
              Download All Invoices
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PaymentHistoryTable;