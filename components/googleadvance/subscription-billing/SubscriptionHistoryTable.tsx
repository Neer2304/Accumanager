// components/googleadvance/subscription-billing/SubscriptionHistoryTable.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Visibility,
  Download,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface SubscriptionHistoryTableProps {
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const SubscriptionHistoryTable: React.FC<SubscriptionHistoryTableProps> = ({
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  // Mock data
  const history = [
    {
      id: '1',
      date: '2024-01-15',
      plan: 'Premium Plan',
      amount: 25000,
      status: 'active',
      paymentMethod: 'Credit Card',
    },
    {
      id: '2',
      date: '2023-12-15',
      plan: 'Premium Plan',
      amount: 25000,
      status: 'completed',
      paymentMethod: 'Credit Card',
    },
    {
      id: '3',
      date: '2023-11-15',
      plan: 'Basic Plan',
      amount: 15000,
      status: 'completed',
      paymentMethod: 'UPI',
    },
    {
      id: '4',
      date: '2023-10-15',
      plan: 'Basic Plan',
      amount: 15000,
      status: 'completed',
      paymentMethod: 'Net Banking',
    },
  ];

  return (
    <Card sx={{ background: currentColors.card }}>
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: currentColors.surface }}>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.plan}
                      size="small"
                      sx={{
                        backgroundColor: alpha(primaryColor, 0.1),
                        color: primaryColor,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    ₹{item.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {item.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        backgroundColor: item.status === 'active' 
                          ? alpha(googleColors.green, 0.1)
                          : alpha(googleColors.blue, 0.1),
                        color: item.status === 'active' ? googleColors.green : googleColors.blue,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Invoice">
                      <IconButton size="small" disabled>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton size="small" disabled>
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};