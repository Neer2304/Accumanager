"use client";

import React, { useState, useMemo } from 'react';
import { 
  Paper, Typography, TextField, Button, Stack, 
  ToggleButton, ToggleButtonGroup, Divider, Box, 
  InputAdornment, CircularProgress, Alert 
} from '@mui/material';
import { AccountBalanceWallet, ShoppingCart, Sell } from '@mui/icons-material';

interface OrderPanelProps {
  symbol: string;
  price: number;
  balance: number;
  onTrade: (type: 'BUY' | 'SELL', qty: number) => Promise<void>;
}

export default function OrderPanel({ symbol, price, balance, onTrade }: OrderPanelProps) {
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCost = useMemo(() => (quantity * price).toFixed(2), [quantity, price]);

  const handleTradeAction = async () => {
    if (quantity <= 0) return;
    setLoading(true);
    setError(null);
    
    try {
      await onTrade(type, quantity);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || (type === 'BUY' && parseFloat(totalCost) > balance);

  return (
    <Paper 
      elevation={0} 
      sx={{ p: 3, bgcolor: '#1e2329', color: '#f8fafc', borderRadius: 3, border: '1px solid #2b3139', height: '100%' }}
    >
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(_, val) => val && setType(val)}
        fullWidth
        sx={{ 
          mb: 3, bgcolor: '#0b0e11', border: '1px solid #2b3139',
          '& .MuiToggleButton-root': {
            border: 'none', color: '#848e9c', fontWeight: 'bold',
            '&.Mui-selected': {
              bgcolor: type === 'BUY' ? '#2ebd85' : '#f6465d',
              color: 'white',
              '&:hover': { bgcolor: type === 'BUY' ? '#2ebd85cc' : '#f6465dcc' }
            }
          }
        }}
      >
        <ToggleButton value="BUY">BUY</ToggleButton>
        <ToggleButton value="SELL">SELL</ToggleButton>
      </ToggleButtonGroup>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountBalanceWallet sx={{ fontSize: 18, color: '#848e9c' }} />
          <Typography variant="body2" color="#848e9c">Available Balance</Typography>
        </Stack>
        <Typography variant="body2" fontWeight="bold" color="#f8fafc">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <Box>
          <Typography variant="caption" color="#848e9c" gutterBottom display="block">Market Price</Typography>
          <Typography variant="h5" fontWeight="900" color={type === 'BUY' ? '#2ebd85' : '#f6465d'}>
            ${price.toFixed(2)}
          </Typography>
        </Box>

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Typography color="gray">Units</Typography></InputAdornment>,
            style: { color: 'white', backgroundColor: '#0b0e11' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#2b3139' },
              '&:hover fieldset': { borderColor: '#474d57' },
              '&.Mui-focused fieldset': { borderColor: type === 'BUY' ? '#2ebd85' : '#f6465d' },
            },
            '& .MuiInputLabel-root': { color: '#848e9c' }
          }}
        />

        <Divider sx={{ bgcolor: '#2b3139' }} />

        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="#848e9c">Estimated Total</Typography>
            <Typography variant="body2" fontWeight="bold">${totalCost}</Typography>
          </Stack>
        </Stack>

        {error && <Alert severity="error" variant="filled" sx={{ py: 0, fontSize: '0.75rem' }}>{error}</Alert>}

        <Button 
          variant="contained" fullWidth size="large"
          disabled={isDisabled}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : type === 'BUY' ? <ShoppingCart /> : <Sell />}
          onClick={handleTradeAction}
          sx={{ 
            py: 1.5, fontWeight: 'bold', bgcolor: type === 'BUY' ? '#2ebd85' : '#f6465d',
            '&:hover': { bgcolor: type === 'BUY' ? '#26a673' : '#d03e51' },
            '&.Mui-disabled': { bgcolor: '#2b3139', color: '#474d57' }
          }}
        >
          {loading ? 'Processing...' : `${type} ${symbol}`}
        </Button>

        {type === 'BUY' && parseFloat(totalCost) > balance && (
          <Typography variant="caption" color="#f6465d" textAlign="center">Insufficient funds.</Typography>
        )}
      </Stack>
    </Paper>
  );
}