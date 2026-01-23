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
} from "@mui/material";
import {
  SaveIcon,
  PrintIcon,
} from "@/assets/icons/BillingIcons";
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
  return (
    <Card sx={{ position: "sticky", top: 100 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Invoice Details
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => onInvoiceNumberChange(e.target.value)}
            size="small"
          />
          
          <DatePicker
            label="Invoice Date"
            value={invoiceDate}
            onChange={(newDate) => onInvoiceDateChange(newDate || new Date())}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          
          <FormControl fullWidth size="small">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => onPaymentMethodChange(e.target.value as any)}
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
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>Subtotal:</Typography>
              <Typography>
                ₹{subtotal.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>Discount:</Typography>
              <Typography color="error">
                -₹{totalDiscount.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>Taxable Amount:</Typography>
              <Typography>
                ₹{totalTaxableAmount.toLocaleString()}
              </Typography>
            </Box>
            {!isInterState ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>CGST:</Typography>
                  <Typography>
                    ₹{totalCgst.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>SGST:</Typography>
                  <Typography>
                    ₹{totalSgst.toLocaleString()}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>IGST:</Typography>
                <Typography>
                  ₹{totalIgst.toLocaleString()}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 1,
              }}
            >
              <Typography variant="h6">Grand Total:</Typography>
              <Typography variant="h6" color="primary">
                ₹{grandTotal.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Notes */}
        <TextField
          fullWidth
          label="Notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          multiline
          rows={3}
          size="small"
          sx={{ mb: 3 }}
        />

        {/* Action Buttons */}
        <Stack spacing={1}>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<SaveIcon />}
            onClick={onSaveDraft}
            disabled={!isSubscriptionActive}
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
          >
            {isSubmitting ? 'Creating...' : 'Confirm & Print'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};