// components/dppos/components/DpBillItemsTable.tsx
'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Button, Avatar, Stack, Paper, useTheme, useMediaQuery, InputAdornment, Chip } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface BillItem {
  productId: string; variationId?: string; name: string; variationName?: string;
  hsnCode: string; price: number; quantity: number; discount: number;
  taxableAmount: number; cgstAmount: number; sgstAmount: number; igstAmount: number; total: number;
}

interface DpBillItemsTableProps {
  items: BillItem[];
  isInterState: boolean;
  onAddProduct: () => void;
  onUpdateItem: (index: number, field: keyof BillItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  isOnline: boolean;
  isSubscriptionActive?: boolean;
}

export const DpBillItemsTable: React.FC<DpBillItemsTableProps> = ({ items, isInterState, onAddProduct, onUpdateItem, onRemoveItem, isOnline, isSubscriptionActive }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, boxShadow: `0 4px 12px ${dpColors.redGlow}`, mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: dpColors.redSoft, color: dpColors.red }}><InventoryIcon sx={{ fontSize: 18 }} /></Avatar>
            <Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink, letterSpacing: '-0.02em' }}>Bill Items ({items.length}) 🦸</Typography>
          </Stack>
          <Button startIcon={<AddIcon />} onClick={onAddProduct} variant="contained" disabled={!isOnline && !isSubscriptionActive} sx={{ borderRadius: '28px', px: 3, py: 0.75, backgroundColor: dpColors.red, color: '#fff', textTransform: 'none', fontWeight: 700, '&:hover': { backgroundColor: dpColors.redHov, transform: 'translateY(-1px)' } }}>Add Product</Button>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: '12px', backgroundColor: dpColors.surface2, border: `2px solid ${dpColors.border}`, boxShadow: 'none' }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: dpColors.surface2 }}>
                {['#', 'Product', 'HSN', 'Price', 'Qty', 'Disc%', 'Taxable', 'GST', 'Total', 'Action'].map(header => (
                  <TableCell key={header} sx={{ color: dpColors.red, fontWeight: 700, borderBottom: `2px solid ${dpColors.border}`, textTransform: 'uppercase', fontSize: '0.75rem' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} hover sx={{ backgroundColor: dpColors.surface, '&:hover': { backgroundColor: dpColors.redSoft } }}>
                  <TableCell sx={{ color: dpColors.ink }}>{index + 1}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.ink }}>{item.name}</Typography>{item.variationName && <Typography variant="caption" sx={{ color: dpColors.inkSub }}>{item.variationName}</Typography>}</TableCell>
                  <TableCell><Chip label={item.hsnCode} size="small" sx={{ backgroundColor: dpColors.redSoft, color: dpColors.red, border: 'none', fontFamily: 'monospace', fontWeight: 700 }} /></TableCell>
                  <TableCell><TextField type="number" value={item.price} onChange={(e) => onUpdateItem(index, "price", parseFloat(e.target.value) || 0)} size="small" sx={{ width: 80 }} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: dpColors.red }}>₹</Typography></InputAdornment>, sx: { borderRadius: '8px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} /></TableCell>
                  <TableCell><TextField type="number" value={item.quantity} onChange={(e) => onUpdateItem(index, "quantity", parseInt(e.target.value) || 1)} size="small" sx={{ width: 70, '& .MuiOutlinedInput-root': { backgroundColor: dpColors.surface2 } }} /></TableCell>
                  <TableCell><TextField type="number" value={item.discount} onChange={(e) => onUpdateItem(index, "discount", parseFloat(e.target.value) || 0)} size="small" sx={{ width: 70 }} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: dpColors.ink, fontWeight: 700 }}>₹{item.taxableAmount.toFixed(2)}</Typography></TableCell>
                  <TableCell>{isInterState ? <Typography variant="caption" sx={{ color: dpColors.gold, fontWeight: 700 }}>IGST: ₹{item.igstAmount.toFixed(2)}</Typography> : <Stack><Typography variant="caption" sx={{ color: dpColors.red, fontWeight: 700 }}>CGST: ₹{item.cgstAmount.toFixed(2)}</Typography><Typography variant="caption" sx={{ color: dpColors.red, fontWeight: 700 }}>SGST: ₹{item.sgstAmount.toFixed(2)}</Typography></Stack>}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={800} sx={{ color: dpColors.gold }}>₹{item.total.toFixed(2)}</Typography></TableCell>
                  <TableCell align="center"><IconButton onClick={() => onRemoveItem(index)} size="small" sx={{ color: dpColors.inkMuted, '&:hover': { color: dpColors.error } }}><DeleteIcon fontSize="small" /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {items.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: dpColors.redSoft, color: dpColors.red }}><InventoryIcon sx={{ fontSize: 32 }} /></Avatar>
            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: dpColors.ink }}>No items in bill</Typography>
            <Typography variant="body2" sx={{ color: dpColors.inkSub, mb: 3 }}>Click "Add Product" to start adding items - Maximum effort!</Typography>
            <Button startIcon={<AddIcon />} onClick={onAddProduct} variant="outlined" disabled={!isOnline && !isSubscriptionActive} sx={{ borderRadius: '28px', px: 3, borderColor: dpColors.border, color: dpColors.ink, '&:hover': { borderColor: dpColors.red, color: dpColors.red } }}>Add Product</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};