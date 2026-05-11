// components/dppos/components/DpInvoiceSummary.tsx
'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Stack, TextField, FormControl, InputLabel, Select, MenuItem, Button, Divider, CircularProgress, Avatar, InputAdornment, Paper } from "@mui/material";
import { Receipt as ReceiptIcon, Save as SaveIcon, Print as PrintIcon, Payment as PaymentIcon, Notes as NotesIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { dpColors } from '../types';

interface DpInvoiceSummaryProps {
  invoiceNumber: string; invoiceDate: Date; paymentMethod: "cash" | "card" | "upi" | "credit"; notes: string; isInterState: boolean;
  subtotal: number; totalDiscount: number; totalTaxableAmount: number; totalCgst: number; totalSgst: number; totalIgst: number; grandTotal: number;
  isSubmitting: boolean; itemsCount: number; customerName: string; customerPhone: string; customerState: string; isSubscriptionActive: boolean; isOnline: boolean;
  onInvoiceNumberChange: (value: string) => void; onInvoiceDateChange: (date: Date) => void; onPaymentMethodChange: (method: "cash" | "card" | "upi" | "credit") => void;
  onNotesChange: (notes: string) => void; onSaveDraft: () => void; onConfirmBill: () => void;
}

export const DpInvoiceSummary: React.FC<DpInvoiceSummaryProps> = ({
  invoiceNumber, invoiceDate, paymentMethod, notes, isInterState, subtotal, totalDiscount, totalTaxableAmount,
  totalCgst, totalSgst, totalIgst, grandTotal, isSubmitting, itemsCount, customerName, customerPhone, customerState,
  isSubscriptionActive, isOnline, onInvoiceNumberChange, onInvoiceDateChange, onPaymentMethodChange, onNotesChange, onSaveDraft, onConfirmBill
}) => {
  const isMobile = false;

  return (
    <Card sx={{ borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, boxShadow: `0 4px 12px ${dpColors.redGlow}`, position: 'sticky', top: 100 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: dpColors.redSoft, color: dpColors.red }}><ReceiptIcon sx={{ fontSize: 18 }} /></Avatar>
          <Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink }}>Invoice Details 🦸</Typography>
        </Stack>
        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <TextField fullWidth label="Invoice Number" value={invoiceNumber} onChange={(e) => onInvoiceNumberChange(e.target.value)} size={isMobile ? "small" : "small"} InputProps={{ sx: { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
          <DatePicker label="Invoice Date" value={invoiceDate} onChange={(newDate) => onInvoiceDateChange(newDate || new Date())} slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } } } }} />
          <FormControl fullWidth size={isMobile ? "small" : "small"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2 } }}>
            <InputLabel sx={{ color: dpColors.inkSub }}>Payment Method</InputLabel>
            <Select value={paymentMethod} label="Payment Method" onChange={(e) => onPaymentMethodChange(e.target.value as any)} startAdornment={<InputAdornment position="start"><PaymentIcon sx={{ color: dpColors.red }} /></InputAdornment>}>
              <MenuItem value="cash">Cash</MenuItem><MenuItem value="card">Card</MenuItem><MenuItem value="upi">UPI</MenuItem><MenuItem value="credit">Credit</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: dpColors.ink, mb: 2 }}>Summary</Typography>
          <Paper sx={{ p: 2, borderRadius: '12px', backgroundColor: dpColors.surface2, border: `2px solid ${dpColors.border}` }}>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: dpColors.inkSub }}>Subtotal:</Typography><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.ink }}>₹{subtotal.toLocaleString()}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: dpColors.inkSub }}>Discount:</Typography><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.error }}>-₹{totalDiscount.toLocaleString()}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: dpColors.inkSub }}>Taxable Amount:</Typography><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.ink }}>₹{totalTaxableAmount.toLocaleString()}</Typography></Stack>
              {!isInterState ? (<><Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: dpColors.inkSub }}>CGST:</Typography><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.red }}>₹{totalCgst.toLocaleString()}</Typography></Stack><Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: dpColors.inkSub }}>SGST:</Typography><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.red }}>₹{totalSgst.toLocaleString()}</Typography></Stack></>) : (<Stack direction="row" justifyContent="space-between"><Typography variant="body2" sx={{ color: dpColors.inkSub }}>IGST:</Typography><Typography variant="body2" fontWeight={700} sx={{ color: dpColors.gold }}>₹{totalIgst.toLocaleString()}</Typography></Stack>)}
              <Divider sx={{ borderColor: dpColors.border }} />
              <Stack direction="row" justifyContent="space-between"><Typography variant="body1" fontWeight={800} sx={{ color: dpColors.ink }}>Grand Total:</Typography><Typography variant="body1" fontWeight={800} sx={{ color: dpColors.gold, fontSize: '1.1rem' }}>₹{grandTotal.toLocaleString()}</Typography></Stack>
            </Stack>
          </Paper>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: dpColors.ink, mb: 1.5 }}>Notes</Typography>
          <TextField fullWidth placeholder="Add any additional notes..." value={notes} onChange={(e) => onNotesChange(e.target.value)} multiline rows={3} InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}><NotesIcon sx={{ color: dpColors.red }} /></InputAdornment>, sx: { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} />
        </Box>
        <Stack spacing={1.5}>
          <Button fullWidth variant="outlined" startIcon={<SaveIcon />} onClick={onSaveDraft} disabled={!isSubscriptionActive} sx={{ borderRadius: '28px', py: 1.25, borderColor: dpColors.border, color: dpColors.ink, '&:hover': { borderColor: dpColors.red, color: dpColors.red } }}>Save Draft</Button>
          <Button fullWidth variant="contained" startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PrintIcon />} onClick={onConfirmBill} disabled={isSubmitting || itemsCount === 0 || !customerName || !customerPhone || !customerState || (!isSubscriptionActive && isOnline)} size="large" sx={{ borderRadius: '28px', py: 1.25, backgroundColor: dpColors.red, '&:hover': { backgroundColor: dpColors.redHov }, fontWeight: 800 }}>{isSubmitting ? 'Creating...' : 'Confirm & Print'}</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};