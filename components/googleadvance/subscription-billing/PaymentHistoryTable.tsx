// components/googleadvance/subscription-billing/PaymentHistoryTable.tsx

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
  alpha,
} from '@mui/material';
import { googleColors } from '../common/GoogleColors';

interface PaymentHistoryTableProps {
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  // Mock data
  const payments = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Subscription Payment - Premium Plan',
      amount: 25000,
      status: 'success',
      method: 'Credit Card',
      transactionId: 'TXN123456',
    },
    {
      id: '2',
      date: '2023-12-15',
      description: 'Subscription Payment - Premium Plan',
      amount: 25000,
      status: 'success',
      method: 'Credit Card',
      transactionId: 'TXN123457',
    },
    {
      id: '3',
      date: '2023-11-15',
      description: 'Subscription Payment - Basic Plan',
      amount: 15000,
      status: 'success',
      method: 'UPI',
      transactionId: 'TXN123458',
    },
    {
      id: '4',
      date: '2023-10-15',
      description: 'Subscription Payment - Basic Plan',
      amount: 15000,
      status: 'failed',
      method: 'Net Banking',
      transactionId: 'TXN123459',
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
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {payment.description}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    ₹{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {payment.method}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.transactionId}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: currentColors.border,
                        color: currentColors.textPrimary,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      size="small"
                      sx={{
                        backgroundColor: payment.status === 'success' 
                          ? alpha(googleColors.green, 0.1)
                          : alpha(googleColors.red, 0.1),
                        color: payment.status === 'success' ? googleColors.green : googleColors.red,
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
  );
};