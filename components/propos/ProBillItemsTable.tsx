// components/propos/ProBillItemsTable.tsx
'use client';

import React from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, TextField, Button,
  Avatar, Stack, Paper, useTheme, useMediaQuery, InputAdornment, Chip
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Inventory as InventoryIcon } from "@mui/icons-material";

interface BillItem {
  productId: string; variationId?: string; name: string; variationName?: string;
  hsnCode: string; price: number; quantity: number; discount: number;
  taxableAmount: number; cgstAmount: number; sgstAmount: number; igstAmount: number; total: number;
}

interface ProBillItemsTableProps {
  items: BillItem[];
  isInterState: boolean;
  onAddProduct: () => void;
  onUpdateItem: (index: number, field: keyof BillItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  isOnline: boolean;
  isSubscriptionActive?: boolean;
}

export const ProBillItemsTable: React.FC<ProBillItemsTableProps> = ({
  items, isInterState, onAddProduct, onUpdateItem, onRemoveItem, isOnline, isSubscriptionActive
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, boxShadow: 'none', mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)', color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
              <InventoryIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>Bill Items ({items.length})</Typography>
          </Stack>
          <Button startIcon={<AddIcon />} onClick={onAddProduct} variant="contained" disabled={!isOnline && !isSubscriptionActive} sx={{ borderRadius: '28px', px: 3, py: 0.75, backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8', color: darkMode ? '#202124' : '#ffffff', textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', boxShadow: 'none', '&:hover': { backgroundColor: darkMode ? '#aecbfa' : '#1669c1' } }}>
            Add Product
          </Button>
        </Stack>

        <TableContainer component={Paper} sx={{ borderRadius: '12px', backgroundColor: darkMode ? '#202124' : '#f8f9fa', border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, boxShadow: 'none' }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                {['#', 'Product', 'HSN', 'Price', 'Qty', 'Disc%', 'Taxable', 'GST', 'Total', 'Action'].map(header => (
                  <TableCell key={header} sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} hover sx={{ backgroundColor: darkMode ? '#303134' : '#ffffff', '&:hover': { backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4' } }}>
                  <TableCell sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{index + 1}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{item.name}</Typography>{item.variationName && <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>{item.variationName}</Typography>}</TableCell>
                  <TableCell><Chip label={item.hsnCode} size="small" sx={{ backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)', color: darkMode ? '#9aa0a6' : '#5f6368', border: 'none', fontFamily: 'monospace' }} /></TableCell>
                  <TableCell><TextField type="number" value={item.price} onChange={(e) => onUpdateItem(index, "price", parseFloat(e.target.value) || 0)} size="small" sx={{ width: 80 }} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography></InputAdornment>, sx: { borderRadius: '8px', backgroundColor: darkMode ? '#202124' : '#ffffff' } }} /></TableCell>
                  <TableCell><TextField type="number" value={item.quantity} onChange={(e) => onUpdateItem(index, "quantity", parseInt(e.target.value) || 1)} size="small" sx={{ width: 70 }} /></TableCell>
                  <TableCell><TextField type="number" value={item.discount} onChange={(e) => onUpdateItem(index, "discount", parseFloat(e.target.value) || 0)} size="small" sx={{ width: 70 }} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500 }}>₹{item.taxableAmount.toFixed(2)}</Typography></TableCell>
                  <TableCell>{isInterState ? <Typography variant="caption" sx={{ color: darkMode ? '#fdd663' : '#fbbc04' }}>IGST: ₹{item.igstAmount.toFixed(2)}</Typography> : <Stack><Typography variant="caption" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>CGST: ₹{item.cgstAmount.toFixed(2)}</Typography><Typography variant="caption" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>SGST: ₹{item.sgstAmount.toFixed(2)}</Typography></Stack>}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>₹{item.total.toFixed(2)}</Typography></TableCell>
                  <TableCell align="center"><IconButton onClick={() => onRemoveItem(index)} size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', '&:hover': { color: darkMode ? '#f28b82' : '#ea4335' } }}><DeleteIcon fontSize="small" /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {items.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)', color: darkMode ? '#9aa0a6' : '#5f6368' }}><InventoryIcon sx={{ fontSize: 32 }} /></Avatar>
            <Typography variant="h6" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>No items in bill</Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>Click "Add Product" to start adding items</Typography>
            <Button startIcon={<AddIcon />} onClick={onAddProduct} variant="outlined" disabled={!isOnline && !isSubscriptionActive} sx={{ borderRadius: '28px', px: 3, borderColor: darkMode ? '#3c4043' : '#dadce0', color: darkMode ? '#e8eaed' : '#202124' }}>Add Product</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};