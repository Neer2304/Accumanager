// components/dppos/components/DpCustomerDetails.tsx
'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Stack, TextField, Button, Chip, Avatar, useTheme, useMediaQuery, InputAdornment } from "@mui/material";
import { Person as PersonIcon, Phone as PhoneIcon, Receipt as ReceiptIcon, Search as SearchIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface BillCustomer { name: string; phone: string; email?: string; company?: string; address?: string; city?: string; state: string; pincode?: string; gstin?: string; isInterState: boolean; }

interface DpCustomerDetailsProps { customer: BillCustomer; businessState?: string; onCustomerChange: (field: keyof BillCustomer, value: any) => void; onOpenSearch: () => void; }

export const DpCustomerDetails: React.FC<DpCustomerDetailsProps> = ({ customer, businessState, onCustomerChange, onOpenSearch }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Card sx={{ borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, boxShadow: 'none', height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: dpColors.redSoft, color: dpColors.red }}><PersonIcon sx={{ fontSize: 18 }} /></Avatar>
            <Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink }}>Customer Details 👤</Typography>
          </Stack>
          <Button size="small" startIcon={<SearchIcon sx={{ fontSize: 18 }} />} onClick={onOpenSearch} sx={{ borderRadius: '20px', px: 2, py: 0.5, color: dpColors.red, textTransform: 'none', fontWeight: 700 }}>Search</Button>
        </Stack>
        <Stack spacing={2}>
          <TextField fullWidth label="Customer Name *" value={customer.name} onChange={(e) => onCustomerChange("name", e.target.value)} size={isMobile ? "small" : "small"} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>, sx: { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="Phone *" value={customer.phone} onChange={(e) => onCustomerChange("phone", e.target.value)} size={isMobile ? "small" : "small"} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>, sx: { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
            <TextField fullWidth label="GSTIN" value={customer.gstin} onChange={(e) => onCustomerChange("gstin", e.target.value)} size={isMobile ? "small" : "small"} InputProps={{ startAdornment: <InputAdornment position="start"><ReceiptIcon /></InputAdornment>, sx: { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          </Stack>
          <TextField fullWidth label="State *" value={customer.state} onChange={(e) => onCustomerChange("state", e.target.value)} size={isMobile ? "small" : "small"} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          <Box>
            <Chip label={customer.isInterState ? "Inter-State (IGST)" : "Intra-State (CGST+SGST)"} size="small" sx={{ backgroundColor: customer.isInterState ? dpColors.goldSoft : dpColors.redSoft, color: customer.isInterState ? dpColors.gold : dpColors.red, fontWeight: 700 }} />
            {businessState && <Typography variant="caption" sx={{ display: 'block', mt: 1, color: dpColors.inkSub }}>Your business is in <strong style={{ color: dpColors.red }}>{businessState}</strong></Typography>}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};