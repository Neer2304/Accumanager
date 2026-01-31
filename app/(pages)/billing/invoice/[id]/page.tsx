// app/billing/invoice/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  IconButton,
  Avatar,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Download,
  Print,
  Email,
  ContentCopy,
  Person,
  Phone,
  Mail as MailIcon,
  Business,
  LocationOn,
  Description,
  CheckCircle,
  Pending,
  Schedule,
} from "@mui/icons-material";
import { format } from "date-fns";
import { toast } from "sonner";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    address?: string;
    state?: string;
    city?: string;
    pincode?: string;
    gstin?: string;
    isInterState: boolean;
  };
  items: Array<{
    productId: string;
    variationId?: string;
    name: string;
    variationName?: string;
    hsnCode?: string;
    price: number;
    quantity: number;
    discount: number;
    taxableAmount: number;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    total: number;
    stockDeducted: boolean;
  }>;
  subtotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  roundOff: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "partially_paid";
  status: "draft" | "completed" | "cancelled" | "returned";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Invoice not found");
          router.push("/billing/invoice");
          return;
        }
        throw new Error("Failed to fetch invoice");
      }
      
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice");
      router.push("/billing/invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyInvoiceNumber = () => {
    if (invoice) {
      navigator.clipboard.writeText(invoice.invoiceNumber);
      toast.success("Invoice number copied");
    }
  };

  const handleSendEmail = () => {
    if (invoice?.customer.email) {
      toast.success(`Invoice sent to ${invoice.customer.email}`);
    } else {
      toast.error("Customer email not available");
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle color="success" />;
      case "pending":
        return <Pending color="warning" />;
      case "partially_paid":
        return <Schedule color="info" />;
      default:
        return null;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return "Cash";
      case "card":
        return "Credit Card";
      case "upi":
        return "UPI";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 3 }} />
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: 3 
        }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
      </Container>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        mb: 4 
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => router.push("/billing/invoice")}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Invoice Details
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Description color="action" />
              <Typography variant="body1" fontWeight="medium">
                {invoice.invoiceNumber}
              </Typography>
              <IconButton
                size="small"
                onClick={handleCopyInvoiceNumber}
                title="Copy invoice number"
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            startIcon={<Email />}
            onClick={handleSendEmail}
            disabled={!invoice.customer.email}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Send Email
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => toast.success("Download started")}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Print
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
        gap: 3 
      }}>
        {/* Left Column - Customer Info & Status */}
        <Box>
          {/* Status Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice Status
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Invoice Status:
                  </Typography>
                  <Chip
                    label={invoice.status.toUpperCase()}
                    color={
                      invoice.status === "completed" ? "success" :
                      invoice.status === "draft" ? "default" :
                      invoice.status === "cancelled" ? "error" : "warning"
                    }
                    size="small"
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getPaymentStatusIcon(invoice.paymentStatus)}
                    <Chip
                      label={invoice.paymentStatus.toUpperCase()}
                      color={
                        invoice.paymentStatus === "paid" ? "success" :
                        invoice.paymentStatus === "pending" ? "warning" : "info"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {getPaymentMethodLabel(invoice.paymentMethod)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Customer Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.light" }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography fontWeight="medium">{invoice.customer.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Customer</Typography>
                  </Box>
                </Box>

                <Divider />

                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{invoice.customer.phone}</Typography>
                  </Box>
                  
                  {invoice.customer.email && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{invoice.customer.email}</Typography>
                    </Box>
                  )}
                  
                  {invoice.customer.company && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Business fontSize="small" color="action" />
                      <Typography variant="body2">{invoice.customer.company}</Typography>
                    </Box>
                  )}
                  
                  {invoice.customer.address && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">
                        {invoice.customer.address}
                        {invoice.customer.city && `, ${invoice.customer.city}`}
                        {invoice.customer.state && `, ${invoice.customer.state}`}
                        {invoice.customer.pincode && ` - ${invoice.customer.pincode}`}
                      </Typography>
                    </Box>
                  )}
                  
                  {invoice.customer.gstin && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Description fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">GSTIN:</Typography>
                        <Typography variant="body2">{invoice.customer.gstin}</Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dates
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Invoice Date:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {format(new Date(invoice.invoiceDate), "dd MMM yyyy")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Created:</Typography>
                  <Typography variant="body2">
                    {format(new Date(invoice.createdAt), "dd MMM yyyy HH:mm")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Last Updated:</Typography>
                  <Typography variant="body2">
                    {format(new Date(invoice.updatedAt), "dd MMM yyyy HH:mm")}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Items & Summary */}
        <Box>
          {/* Items Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between", 
                alignItems: { xs: "flex-start", sm: "center" }, 
                mb: 3,
                gap: 1
              }}>
                <Typography variant="h6">Items</Typography>
                <Typography variant="body2" color="text.secondary">
                  {invoice.items.length} item(s) in this invoice
                </Typography>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "action.hover" }}>
                      <TableCell><strong>Item</strong></TableCell>
                      <TableCell align="center"><strong>HSN</strong></TableCell>
                      <TableCell align="right"><strong>Price</strong></TableCell>
                      <TableCell align="center"><strong>Qty</strong></TableCell>
                      <TableCell align="right"><strong>Discount</strong></TableCell>
                      <TableCell align="right"><strong>Taxable</strong></TableCell>
                      <TableCell align="right"><strong>GST</strong></TableCell>
                      <TableCell align="right"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {item.name}
                            </Typography>
                            {item.variationName && (
                              <Typography variant="caption" color="text.secondary">
                                {item.variationName}
                              </Typography>
                            )}
                            {item.stockDeducted && (
                              <Chip
                                label="Stock Deducted"
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.hsnCode || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ₹{item.price.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="error">
                            {item.discount}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ₹{item.taxableAmount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {invoice.customer.isInterState ? (
                            <Typography variant="caption">
                              IGST: {item.igstRate}%
                            </Typography>
                          ) : (
                            <Box>
                              <Typography variant="caption" display="block">
                                CGST: {item.cgstRate}%
                              </Typography>
                              <Typography variant="caption" display="block">
                                SGST: {item.sgstRate}%
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            ₹{item.total.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice Summary
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Subtotal:</Typography>
                  <Typography>₹{invoice.subtotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Discount:</Typography>
                  <Typography color="error">-₹{invoice.totalDiscount.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Taxable Amount:</Typography>
                  <Typography>₹{invoice.totalTaxableAmount.toLocaleString()}</Typography>
                </Box>
                
                {invoice.customer.isInterState ? (
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography color="text.secondary">IGST:</Typography>
                    <Typography>₹{invoice.totalIgst.toLocaleString()}</Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography color="text.secondary">CGST:</Typography>
                      <Typography>₹{invoice.totalCgst.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography color="text.secondary">SGST:</Typography>
                      <Typography>₹{invoice.totalSgst.toLocaleString()}</Typography>
                    </Box>
                  </>
                )}
                
                <Divider />
                
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Grand Total:</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{invoice.grandTotal.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
              
              {invoice.notes && (
                <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invoice.notes}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}