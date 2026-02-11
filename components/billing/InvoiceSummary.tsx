'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  CircularProgress,
  Avatar,
  InputAdornment,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Payment as PaymentIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface InvoiceSummaryProps {
  invoiceNumber: string;
  invoiceDate: Date;
  paymentMethod: "cash" | "card" | "upi" | "credit";
  notes: string;
  isInterState: boolean;
  subtotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
  isSubmitting: boolean;
  itemsCount: number;
  customerName: string;
  customerPhone: string;
  customerState: string;
  isSubscriptionActive: boolean;
  isOnline: boolean;
  onInvoiceNumberChange: (value: string) => void;
  onInvoiceDateChange: (date: Date) => void;
  onPaymentMethodChange: (method: "cash" | "card" | "upi" | "credit") => void;
  onNotesChange: (notes: string) => void;
  onSaveDraft: () => void;
  onConfirmBill: () => void;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  invoiceNumber,
  invoiceDate,
  paymentMethod,
  notes,
  isInterState,
  subtotal,
  totalDiscount,
  totalTaxableAmount,
  totalCgst,
  totalSgst,
  totalIgst,
  grandTotal,
  isSubmitting,
  itemsCount,
  customerName,
  customerPhone,
  customerState,
  isSubscriptionActive,
  isOnline,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onPaymentMethodChange,
  onNotesChange,
  onSaveDraft,
  onConfirmBill,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: 'none',
        position: 'sticky',
        top: 100,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }}
          >
            <ReceiptIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Invoice Details
          </Typography>
        </Stack>

        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => onInvoiceNumberChange(e.target.value)}
            size={isMobile ? "small" : "small"}
            InputProps={{
              sx: {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                },
                '&.Mui-focused': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                },
              },
            }}
          />
          
          <DatePicker
            label="Invoice Date"
            value={invoiceDate}
            onChange={(newDate) => onInvoiceDateChange(newDate || new Date())}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&.Mui-focused': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  },
                },
              },
            }}
          />
          
          <FormControl
            fullWidth
            size={isMobile ? "small" : "small"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                },
                '&.Mui-focused': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                },
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&.Mui-focused': {
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              },
            }}
          >
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => onPaymentMethodChange(e.target.value as any)}
              startAdornment={
                <InputAdornment position="start">
                  <PaymentIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="credit">Credit</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
            Summary
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Subtotal:
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  ₹{subtotal.toLocaleString()}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Discount:
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#f28b82' : '#ea4335' }}>
                  -₹{totalDiscount.toLocaleString()}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Taxable Amount:
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  ₹{totalTaxableAmount.toLocaleString()}
                </Typography>
              </Stack>
              
              {!isInterState ? (
                <>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      CGST:
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                      ₹{totalCgst.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      SGST:
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                      ₹{totalSgst.toLocaleString()}
                    </Typography>
                  </Stack>
                </>
              ) : (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    IGST:
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#fdd663' : '#fbbc04' }}>
                    ₹{totalIgst.toLocaleString()}
                  </Typography>
                </Stack>
              )}
              
              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Grand Total:
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8', fontSize: '1.1rem' }}>
                  ₹{grandTotal.toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Notes */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1.5 }}>
            Notes
          </Typography>
          <TextField
            fullWidth
            placeholder="Add any additional notes..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            multiline
            rows={3}
            size={isMobile ? "small" : "small"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <NotesIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                },
                '&.Mui-focused': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                },
              },
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={onSaveDraft}
            disabled={!isSubscriptionActive}
            sx={{
              borderRadius: '28px',
              py: 1.25,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
              '&:disabled': {
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            Save Draft
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PrintIcon />}
            onClick={onConfirmBill}
            disabled={
              isSubmitting ||
              itemsCount === 0 ||
              !customerName ||
              !customerPhone ||
              !customerState ||
              (!isSubscriptionActive && isOnline)
            }
            size="large"
            sx={{
              borderRadius: '28px',
              py: 1.25,
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                boxShadow: darkMode
                  ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                  : '0 4px 12px rgba(26, 115, 232, 0.3)',
              },
              '&:disabled': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            {isSubmitting ? 'Creating...' : 'Confirm & Print'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};