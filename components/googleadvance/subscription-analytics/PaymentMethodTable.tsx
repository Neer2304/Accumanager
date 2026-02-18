// components/googleadvance/subscription-analytics/PaymentMethodTable.tsx

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
  LinearProgress,
  Typography,
  Box,
  alpha,
} from '@mui/material';
import { RevenueByMethod } from '../types';
import { googleColors } from '../common/GoogleColors';

interface PaymentMethodTableProps {
  revenueByMethod: RevenueByMethod[];
  currentColors: any;
  primaryColor: string;
}

export const PaymentMethodTable: React.FC<PaymentMethodTableProps> = ({
  revenueByMethod,
  currentColors,
  primaryColor,
}) => {
  const total = revenueByMethod.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Revenue by Payment Method
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Method</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revenueByMethod.map((method) => {
                const percentage = (method.amount / total) * 100;
                
                return (
                  <TableRow key={method.method} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {method.method}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="500">
                        ₹{method.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: currentColors.chipBackground,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: method.method === 'Credit Card' 
                                  ? googleColors.blue
                                  : method.method === 'UPI'
                                  ? googleColors.green
                                  : method.method === 'Net Banking'
                                  ? googleColors.yellow
                                  : method.method === 'Wallet'
                                  ? googleColors.red
                                  : primaryColor,
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="caption" fontWeight="bold">
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${currentColors.border}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Total</Typography>
            <Typography variant="h6" fontWeight="bold" color={primaryColor}>
              ₹{total.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};