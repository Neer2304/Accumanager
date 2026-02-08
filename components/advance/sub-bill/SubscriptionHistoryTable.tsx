// components/advance/sub-bill/SubscriptionHistoryTable.tsx
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
  IconButton,
  Paper,
} from '@mui/material';
import {
  Visibility,
  Receipt,
  CheckCircle,
  PendingActions,
  Schedule,
  Cancel,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface SubscriptionHistoryTableProps {
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const SubscriptionHistoryTable: React.FC<SubscriptionHistoryTableProps> = ({
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const mockSubscriptionHistory = [
    {
      id: 'SUB-2024-001',
      planName: 'Professional Plan',
      startDate: '2024-01-01',
      endDate: '2024-04-30',
      status: 'active',
      totalAmount: 796,
      duration: '4 months',
    },
    {
      id: 'SUB-2023-003',
      planName: 'Basic Plan',
      startDate: '2023-09-01',
      endDate: '2023-12-31',
      status: 'expired',
      totalAmount: 396,
      duration: '4 months',
    },
    {
      id: 'SUB-2023-002',
      planName: 'Starter Plan',
      startDate: '2023-05-01',
      endDate: '2023-08-31',
      status: 'expired',
      totalAmount: 196,
      duration: '4 months',
    },
    {
      id: 'SUB-2023-001',
      planName: 'Trial',
      startDate: '2023-04-15',
      endDate: '2023-04-30',
      status: 'expired',
      totalAmount: 0,
      duration: '15 days',
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
      case 'active':
        return '#34A853';
      case 'pending':
        return '#FBBC04';
      case 'expired':
      case 'cancelled':
        return '#EA4335';
      default:
        return currentColors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle fontSize="small" />;
      case 'pending':
        return <PendingActions fontSize="small" />;
      case 'expired':
        return <Schedule fontSize="small" />;
      case 'cancelled':
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
        Your Subscription Journey
      </Typography>
      
      <Card sx={{ 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
      }}>
        <CardContent>
          <TableContainer>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow sx={{ background: currentColors.surface }}>
                  <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Subscription ID</TableCell>
                  {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Plan</TableCell>}
                  {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Duration</TableCell>}
                  <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Status</TableCell>
                  {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {mockSubscriptionHistory.map((subscription) => (
                  <TableRow 
                    key={subscription.id}
                    sx={{
                      '&:hover': {
                        background: alpha(primaryColor, 0.02),
                      }
                    }}
                  >
                    <TableCell sx={{ color: currentColors.textPrimary }}>
                      <Typography variant="body2" fontWeight="medium">
                        {subscription.id}
                      </Typography>
                      {isMobile && (
                        <Typography variant="caption" color={currentColors.textSecondary}>
                          {subscription.planName}
                        </Typography>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Chip
                          label={subscription.planName}
                          size="small"
                          sx={{
                            background: alpha(primaryColor, 0.1),
                            color: primaryColor,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell sx={{ color: currentColors.textPrimary }}>
                        {subscription.duration}
                      </TableCell>
                    )}
                    <TableCell sx={{ color: currentColors.textPrimary }}>
                      <Box>
                        <Typography variant="body2">
                          {new Date(subscription.startDate).toLocaleDateString()}
                        </Typography>
                        {!isMobile && (
                          <Typography variant="caption" color={currentColors.textSecondary}>
                            to {new Date(subscription.endDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: currentColors.textPrimary, fontWeight: 'bold' }}>
                      {formatCurrency(subscription.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        // icon={getStatusIcon(subscription.status)}
                        label={isMobile ? '' : subscription.status.toUpperCase()}
                        size="small"
                        sx={{
                          background: alpha(getStatusColor(subscription.status), 0.1),
                          color: getStatusColor(subscription.status),
                          fontWeight: 'medium'
                        }}
                      />
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <IconButton size="small" sx={{ color: currentColors.textSecondary }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: currentColors.textSecondary }}>
                          <Receipt fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isMobile && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ color: currentColors.textSecondary }}>
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: currentColors.textSecondary }}>
                <Receipt fontSize="small" />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubscriptionHistoryTable;