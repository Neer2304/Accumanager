// app/billing/invoice/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Grid,
  Skeleton,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  Search,
  Download,
  Person,
  AttachMoney,
  FilterList,
  AddCircle,
  Print,
  ContentCopy,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Refresh,
  TrendingUp,
  Receipt,
  Payment,
} from "@mui/icons-material";
import { format } from "date-fns";
import { toast } from "sonner";
import { FileTextIcon } from "@/assets/icons/SecurityIcons";
import { Eye, FileText } from "lucide-react";

// Define interface
interface Invoice {
  _id: string;
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    gstin?: string;
    state?: string;
    isInterState: boolean;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "partially_paid";
  status: "draft" | "completed" | "cancelled" | "returned";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Status Chip Component
const StatusChip = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return { color: "success", label: "Completed" };
      case "draft":
        return { color: "default", label: "Draft" };
      case "cancelled":
        return { color: "error", label: "Cancelled" };
      case "returned":
        return { color: "warning", label: "Returned" };
      default:
        return { color: "default", label: status };
    }
  };

  const config = getStatusConfig();
  return <Chip label={config.label} color={config.color as any} size="small" />;
};

// Payment Status Chip Component
const PaymentChip = ({ status }: { status: string }) => {
  const getPaymentConfig = () => {
    switch (status) {
      case "paid":
        return { color: "success", label: "Paid" };
      case "pending":
        return { color: "warning", label: "Pending" };
      case "partially_paid":
        return { color: "info", label: "Partial" };
      default:
        return { color: "default", label: status };
    }
  };

  const config = getPaymentConfig();
  return <Chip label={config.label} color={config.color as any} size="small" />;
};

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/billing/recent?limit=100&days=365");
      
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.orders);
        setFilteredInvoices(data.orders);
      } else {
        toast.error(data.message || "Failed to load invoices");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...invoices];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.phone.includes(searchTerm) ||
          invoice.customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((invoice) => invoice.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      result = result.filter((invoice) => invoice.paymentStatus === paymentFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const invoiceDate = new Date();

      switch (dateFilter) {
        case "today":
          result = result.filter((invoice) => {
            const invDate = new Date(invoice.invoiceDate);
            return invDate.toDateString() === now.toDateString();
          });
          break;
        case "week":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          result = result.filter((invoice) => {
            const invDate = new Date(invoice.invoiceDate);
            return invDate >= weekAgo;
          });
          break;
        case "month":
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          result = result.filter((invoice) => {
            const invDate = new Date(invoice.invoiceDate);
            return invDate >= monthAgo;
          });
          break;
      }
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.invoiceDate);
      const dateB = new Date(b.invoiceDate);

      switch (sortBy) {
        case "newest":
          return dateB.getTime() - dateA.getTime();
        case "oldest":
          return dateA.getTime() - dateB.getTime();
        case "highest":
          return b.grandTotal - a.grandTotal;
        case "lowest":
          return a.grandTotal - b.grandTotal;
        default:
          return dateB.getTime() - dateA.getTime();
      }
    });

    setFilteredInvoices(result);
  }, [searchTerm, statusFilter, paymentFilter, dateFilter, sortBy, invoices]);

  // View invoice details
  const viewInvoice = (invoiceId: string) => {
    router.push(`/billing/invoice/${invoiceId}`);
  };

  // Copy invoice number
  const copyInvoiceNumber = (invoiceNumber: string) => {
    navigator.clipboard.writeText(invoiceNumber);
    toast.success("Invoice number copied to clipboard");
  };

  // Calculate totals
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  const pendingAmount = invoices
    .filter(inv => inv.paymentStatus === "pending")
    .reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  const totalInvoices = invoices.length;

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Invoices
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and view all your invoices in one place
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchInvoices}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => router.push("/billing/new")}
          >
            Create Invoice
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                From {totalInvoices} invoices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.light", mr: 2 }}>
                  <Receipt />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Amount
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{pendingAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {invoices.filter(inv => inv.paymentStatus === "pending").length} unpaid invoices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.light", mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recent Activity
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {invoices.filter(inv => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(inv.invoiceDate) >= weekAgo;
                    }).length}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Invoices this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by invoice number, customer name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {/* Filters */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="returned">Returned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Payment</InputLabel>
                <Select
                  value={paymentFilter}
                  label="Payment"
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <MenuItem value="all">All Payments</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="partially_paid">Partial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="highest">Highest Amount</MenuItem>
                  <MenuItem value="lowest">Lowest Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Date Filter Chips */}
          <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ].map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => setDateFilter(option.value)}
                color={dateFilter === option.value ? "primary" : "default"}
                variant={dateFilter === option.value ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6">All Invoices</Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredInvoices.length} invoices found
            </Typography>
          </Box>
          
          {filteredInvoices.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <FileTextIcon/>
              <Typography variant="h6" gutterBottom>
                No invoices found
              </Typography>
              <Typography color="text.secondary" paragraph>
                {searchTerm ? "Try adjusting your search" : "Create your first invoice"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => router.push("/billing/new")}
              >
                Create Invoice
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell><strong>Invoice No.</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Payment</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow
                      key={invoice._id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FileText fontSize="small" color="action" />
                          <Typography
                            variant="body2"
                            sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            onClick={() => viewInvoice(invoice._id)}
                          >
                            {invoice.invoiceNumber}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => copyInvoiceNumber(invoice.invoiceNumber)}
                            title="Copy invoice number"
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.invoiceDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {invoice.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invoice.customer.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          ₹{invoice.grandTotal.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={invoice.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentChip status={invoice.paymentStatus} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => viewInvoice(invoice._id)}
                            title="View Details"
                          >
                            <Eye fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            title="Download"
                          >
                            <Download fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            title="Print"
                          >
                            <Print fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}