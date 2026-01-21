"use client";

import React from 'react';
import { Box, Typography, Stack, Paper, Button, Divider } from '@mui/material';
import { AccountBalanceWallet, AddCircle, TrendingUp } from '@mui/icons-material';

interface PortfolioSummaryProps {
  balance: number;
  portfolio: any[];
  onDeposit: () => void;
}

export default function PortfolioSummary({ balance, portfolio, onDeposit }: PortfolioSummaryProps) {
  // Calculate the current value of all stocks owned
  const assetValue = portfolio.reduce((acc, curr) => {
    // Basic protection against undefined values
    const qty = curr.quantity || 0;
    const price = curr.averagePrice || 0;
    return acc + (qty * price);
  }, 0);

  const totalNetWorth = balance + assetValue;

  return (
    <Paper sx={{ p: 3, bgcolor: '#1e2329', color: 'white', borderRadius: 4, border: '1px solid #2b3139' }}>
      <Stack spacing={2}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <AccountBalanceWallet sx={{ fontSize: 18, color: '#848e9c' }} />
            <Typography variant="subtitle2" sx={{ color: '#848e9c', letterSpacing: 1 }}>
              NET WORTH
            </Typography>
          </Stack>
          <Typography variant="h4" fontWeight="900" sx={{ color: '#f8fafc' }}>
            ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: '#2b3139' }} />

        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="#848e9c">V-Cash Balance</Typography>
            <Typography variant="body1" fontWeight="bold">${balance.toLocaleString()}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="#848e9c">Market Assets</Typography>
            <Typography variant="body1" fontWeight="bold">${assetValue.toLocaleString()}</Typography>
          </Stack>
        </Stack>

        <Button 
          fullWidth
          variant="contained" 
          startIcon={<AddCircle />}
          onClick={onDeposit}
          sx={{ 
            py: 1.2,
            bgcolor: '#2ebd85', 
            color: 'white', 
            borderRadius: 2,
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(46, 189, 133, 0.2)',
            '&:hover': { bgcolor: '#26a673' }
          }}
        >
          Instant $10,000 Deposit
        </Button>
      </Stack>
    </Paper>
  );
}