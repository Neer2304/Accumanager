// components/batmanpos/components/BatmanBillItemsTable.tsx
'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Button, Avatar, Stack, Paper, useTheme, useMediaQuery, InputAdornment, Chip } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import { batmanColors } from '../types';

interface BillItem {
  productId: string; variationId?: string; name: string; variationName?: string;
  hsnCode: string; price: number; quantity: number; discount: number;
  taxableAmount: number; cgstAmount: number; sgstAmount: number; igstAmount: number; total: number;
}

interface BatmanBillItemsTableProps {
  items: BillItem[];
  isInterState: boolean;
  onAddProduct: () => void;
  onUpdateItem: (index: number, field: keyof BillItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  isOnline: boolean;
  isSubscriptionActive?: boolean;
}

export const BatmanBillItemsTable: React.FC<BatmanBillItemsTableProps> = ({ items, isInterState, onAddProduct, onUpdateItem, onRemoveItem, isOnline, isSubscriptionActive }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ borderRadius: '20px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}`, boxShadow: `0 4px 12px ${batmanColors.goldGlow}`, mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: batmanColors.goldSoft, color: batmanColors.gold }}><InventoryIcon sx={{ fontSize: 18 }} /></Avatar>
            <Typography variant="h6" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em' }}>Bill Items ({items.length}) 🦇</Typography>
          </Stack>
          <Button startIcon={<AddIcon />} onClick={onAddProduct} variant="contained" disabled={!isOnline && !isSubscriptionActive} sx={{ borderRadius: '28px', px: 3, py: 0.75, backgroundColor: batmanColors.gold, color: '#0a0a0a', textTransform: 'none', fontWeight: 700, '&:hover': { backgroundColor: batmanColors.goldHov, transform: 'translateY(-1px)' } }}>Add Product</Button>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: '12px', backgroundColor: batmanColors.surface2, border: `2px solid ${batmanColors.gold}`, boxShadow: 'none' }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: batmanColors.surface2 }}>
                {['#', 'Product', 'HSN', 'Price', 'Qty', 'Disc%', 'Taxable', 'GST', 'Total', 'Action'].map(header => (
                  <TableCell key={header} sx={{ color: batmanColors.gold, fontWeight: 700, borderBottom: `2px solid ${batmanColors.gold}`, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} hover sx={{ backgroundColor: batmanColors.surface, '&:hover': { backgroundColor: batmanColors.goldSoft } }}>
                  <TableCell sx={{ color: batmanColors.ink }}>{index + 1}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={700} sx={{ color: batmanColors.ink }}>{item.name}</Typography>{item.variationName && <Typography variant="caption" sx={{ color: batmanColors.inkSub }}>{item.variationName}</Typography>}</TableCell>
                  <TableCell><Chip label={item.hsnCode} size="small" sx={{ backgroundColor: batmanColors.goldSoft, color: batmanColors.gold, border: 'none', fontFamily: 'monospace', fontWeight: 700 }} /></TableCell>
                  <TableCell><TextField type="number" value={item.price} onChange={(e) => onUpdateItem(index, "price", parseFloat(e.target.value) || 0)} size="small" sx={{ width: 80 }} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: batmanColors.gold }}>₹</Typography></InputAdornment>, sx: { borderRadius: '8px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border } } }} /></TableCell>
                  <TableCell><TextField type="number" value={item.quantity} onChange={(e) => onUpdateItem(index, "quantity", parseInt(e.target.value) || 1)} size="small" sx={{ width: 70, '& .MuiOutlinedInput-root': { backgroundColor: batmanColors.surface2 } }} /></TableCell>
                  <TableCell><TextField type="number" value={item.discount} onChange={(e) => onUpdateItem(index, "discount", parseFloat(e.target.value) || 0)} size="small" sx={{ width: 70 }} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: batmanColors.ink, fontWeight: 700 }}>₹{item.taxableAmount.toFixed(2)}</Typography></TableCell>
                  <TableCell>{isInterState ? <Typography variant="caption" sx={{ color: batmanColors.gold, fontWeight: 700 }}>IGST: ₹{item.igstAmount.toFixed(2)}</Typography> : <Stack><Typography variant="caption" sx={{ color: batmanColors.gold, fontWeight: 700 }}>CGST: ₹{item.cgstAmount.toFixed(2)}</Typography><Typography variant="caption" sx={{ color: batmanColors.gold, fontWeight: 700 }}>SGST: ₹{item.sgstAmount.toFixed(2)}</Typography></Stack>}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={800} sx={{ color: batmanColors.gold }}>₹{item.total.toFixed(2)}</Typography></TableCell>
                  <TableCell align="center"><IconButton onClick={() => onRemoveItem(index)} size="small" sx={{ color: batmanColors.inkMuted, '&:hover': { color: batmanColors.error } }}><DeleteIcon fontSize="small" /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {items.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: batmanColors.goldSoft, color: batmanColors.gold }}><InventoryIcon sx={{ fontSize: 32 }} /></Avatar>
            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: batmanColors.gold }}>No items in bill</Typography>
            <Typography variant="body2" sx={{ color: batmanColors.inkSub, mb: 3 }}>Click "Add Product" to start adding items - Justice awaits!</Typography>
            <Button startIcon={<AddIcon />} onClick={onAddProduct} variant="outlined" disabled={!isOnline && !isSubscriptionActive} sx={{ borderRadius: '28px', px: 3, borderColor: batmanColors.gold, color: batmanColors.gold, '&:hover': { borderColor: batmanColors.gold, backgroundColor: batmanColors.goldSoft } }}>Add Product</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};