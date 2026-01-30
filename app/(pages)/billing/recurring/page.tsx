// app/billing/recurring/page.tsx
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
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Avatar,
  Tooltip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Menu,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  MoreVert,
  PlayArrow,
  Pause,
  CalendarMonth,
  Repeat,
  Schedule,
  CheckCircle,
  Cancel,
  Error,
  Refresh,
  TrendingUp,
  AttachMoney,
  Receipt,
} from "@mui/icons-material";
import { format } from "date-fns";
import { toast } from "sonner";

interface RecurringInvoice {
  _id: string;
  name: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  startDate: string;
  endDate?: string;
  nextInvoiceDate: string;
  totalInvoices: number;
  amount: number;
  status: "active" | "paused" | "completed" | "cancelled";
  lastInvoiceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RecurringInvoicesPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<RecurringInvoice | null>(null);

  // Fetch data from API
  const fetchRecurringInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/recurring");
      
      if (!response.ok) {
        // throw new Error("Failed to fetch recurring invoices");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRecurringInvoices(data.recurringInvoices || []);
        setFilteredInvoices(data.recurringInvoices || []);
      } else {
        toast.error(data.message || "Failed to load recurring invoices");
        setRecurringInvoices([]);
        setFilteredInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching recurring invoices:", error);
      toast.error("Failed to load recurring invoices");
      setRecurringInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  useEffect(() => {
    let result = [...recurringInvoices];

    // Tab filtering
    if (tabValue === 1) {
      result = result.filter((invoice) => invoice.status === "active");
    } else if (tabValue === 2) {
      result = result.filter((invoice) => invoice.status === "paused");
    } else if (tabValue === 3) {
      result = result.filter((invoice) => invoice.status === "completed");
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (invoice) =>
          invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((invoice) => invoice.status === statusFilter);
    }

    // Frequency filter
    if (frequencyFilter !== "all") {
      result = result.filter((invoice) => invoice.frequency === frequencyFilter);
    }

    setFilteredInvoices(result);
  }, [searchTerm, statusFilter, frequencyFilter, tabValue, recurringInvoices]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoice: RecurringInvoice) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const handleToggleStatus = async (invoiceId: string, newStatus: RecurringInvoice["status"]) => {
    try {
      const response = await fetch(`/api/billing/recurring/${invoiceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRecurringInvoices(
          recurringInvoices.map((invoice) =>
            invoice._id === invoiceId ? { ...invoice, status: newStatus } : invoice
          )
        );
        toast.success(`Invoice ${newStatus === "active" ? "activated" : "paused"}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
    handleMenuClose();
  };

  const handleDelete = async (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this recurring invoice?")) {
      try {
        const response = await fetch(`/api/billing/recurring/${invoiceId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setRecurringInvoices(recurringInvoices.filter((inv) => inv._id !== invoiceId));
          toast.success("Recurring invoice deleted");
        } else {
          toast.error("Failed to delete invoice");
        }
      } catch (error) {
        toast.error("Failed to delete invoice");
      }
      handleMenuClose();
    }
  };

  const handleRunNow = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/billing/recurring/${invoiceId}/run`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Invoice generated successfully");
        fetchRecurringInvoices(); // Refresh data
      } else {
        toast.error("Failed to generate invoice");
      }
    } catch (error) {
      toast.error("Failed to generate invoice");
    }
    handleMenuClose();
  };

  const handleEdit = (invoiceId: string) => {
    router.push(`/billing/recurring/${invoiceId}/edit`);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success" as const;
      case "paused":
        return "warning" as const;
      case "completed":
        return "info" as const;
      case "cancelled":
        return "error" as const;
      default:
        return "default" as const;
    }
  };

  const getStatusIcon = (status: string) => {
    const iconSize = isSmallMobile ? "small" : "medium";
    switch (status) {
      case "active":
        return <CheckCircle fontSize={iconSize} />;
      case "paused":
        return <Pause fontSize={iconSize} />;
      case "completed":
        return <CheckCircle fontSize={iconSize} />;
      case "cancelled":
        return <Cancel fontSize={iconSize} />;
      default:
        return <Error fontSize={iconSize} />;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    if (isMobile) {
      switch (frequency) {
        case "daily":
          return "Day";
        case "weekly":
          return "Week";
        case "monthly":
          return "Month";
        case "yearly":
          return "Year";
        default:
          return frequency;
      }
    }
    switch (frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return frequency;
    }
  };

  const calculateTotalRevenue = () => {
    return recurringInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const calculateActiveSubscriptions = () => {
    return recurringInvoices.filter((inv) => inv.status === "active").length;
  };

  const calculateUpcomingInvoices = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return recurringInvoices.filter((inv) => {
      const nextDate = new Date(inv.nextInvoiceDate);
      return inv.status === "active" && nextDate <= nextWeek;
    }).length;
  };

  // Mobile-friendly table rendering
  const renderMobileView = () => (
    <Stack spacing={2}>
      {filteredInvoices.map((invoice) => (
        <Card key={invoice._id} variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant={isSmallMobile ? "subtitle1" : "h6"} 
                    fontWeight="medium"
                    sx={{ fontSize: isSmallMobile ? "0.9rem" : "1rem" }}
                  >
                    {invoice.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    Total: {invoice.totalInvoices} invoices
                  </Typography>
                </Box>
                <Chip
                  label={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  color={getStatusColor(invoice.status)}
                  size="small"
                  icon={getStatusIcon(invoice.status)}
                  sx={{ fontSize: "0.7rem" }}
                />
              </Box>

              {/* Customer Info */}
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: "0.85rem" }}>
                  {invoice.customer.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                  {invoice.customer.email}
                </Typography>
              </Box>

              {/* Details Row */}
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: 1,
                textAlign: "center" 
              }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem" }}>
                    Frequency
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {getFrequencyLabel(invoice.frequency)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem" }}>
                    Next Invoice
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {format(new Date(invoice.nextInvoiceDate), "dd MMM")}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem" }}>
                    Amount
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" sx={{ fontSize: "0.8rem" }}>
                    ₹{invoice.amount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
                {invoice.status === "active" ? (
                  <Tooltip title="Pause">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => handleToggleStatus(invoice._id, "paused")}
                    >
                      <Pause fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Activate">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleToggleStatus(invoice._id, "active")}
                    >
                      <PlayArrow fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Run Now">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleRunNow(invoice._id)}
                  >
                    <PlayArrow fontSize="small" />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, invoice)}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  // Desktop table rendering
  const renderDesktopView = () => (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "action.hover" }}>
            <TableCell sx={{ fontSize: "0.875rem" }}><strong>Name</strong></TableCell>
            <TableCell sx={{ fontSize: "0.875rem" }}><strong>Customer</strong></TableCell>
            <TableCell sx={{ fontSize: "0.875rem" }}><strong>Frequency</strong></TableCell>
            <TableCell sx={{ fontSize: "0.875rem" }}><strong>Next Invoice</strong></TableCell>
            <TableCell align="right" sx={{ fontSize: "0.875rem" }}><strong>Amount</strong></TableCell>
            <TableCell sx={{ fontSize: "0.875rem" }}><strong>Status</strong></TableCell>
            <TableCell align="right" sx={{ fontSize: "0.875rem" }}><strong>Actions</strong></TableCell>
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
                <Box>
                  <Typography variant="body2" fontWeight="medium" sx={{ fontSize: "0.875rem" }}>
                    {invoice.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Total Invoices: {invoice.totalInvoices}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {invoice.customer.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    {invoice.customer.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getFrequencyLabel(invoice.frequency)}
                  size="small"
                  icon={<Repeat fontSize="small" />}
                  sx={{ fontSize: "0.75rem" }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonth fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {format(new Date(invoice.nextInvoiceDate), "dd MMM yyyy")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: "0.875rem" }}>
                  ₹{invoice.amount.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  color={getStatusColor(invoice.status)}
                  size="small"
                  icon={getStatusIcon(invoice.status)}
                  sx={{ fontSize: "0.75rem" }}
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {invoice.status === "active" ? (
                    <Tooltip title="Pause">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleToggleStatus(invoice._id, "paused")}
                      >
                        <Pause fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Activate">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleToggleStatus(invoice._id, "active")}
                      >
                        <PlayArrow fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Run Now">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleRunNow(invoice._id)}
                    >
                      <PlayArrow fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, invoice)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 1 : 2 }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ 
      py: isMobile ? 2 : 4, 
      px: isMobile ? 1 : 2,
      minHeight: "100vh"
    }}>
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: isMobile ? "flex-start" : "center", 
        mb: 4,
        gap: isMobile ? 2 : 0
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{ fontSize: isMobile ? "1.5rem" : "2rem" }}
          >
            Recurring Invoices
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
          >
            Automate your billing with recurring invoices
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/billing/recurring/new")}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          New Recurring Invoice
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { 
          xs: "1fr", 
          sm: "repeat(2, 1fr)", 
          md: "repeat(3, 1fr)" 
        }, 
        gap: isMobile ? 2 : 3, 
        mb: 4 
      }}>
        <Card>
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: "success.light", 
                mr: 2,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48
              }}>
                <TrendingUp fontSize={isMobile ? "small" : "medium"} />
              </Avatar>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.875rem" }}
                >
                  Total Revenue
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
                >
                  ₹{calculateTotalRevenue().toLocaleString()}/mo
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: "primary.light", 
                mr: 2,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48
              }}>
                <Repeat fontSize={isMobile ? "small" : "medium"} />
              </Avatar>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.875rem" }}
                >
                  Active Subscriptions
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
                >
                  {calculateActiveSubscriptions()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 1" } }}>
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: "warning.light", 
                mr: 2,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48
              }}>
                <Schedule fontSize={isMobile ? "small" : "medium"} />
              </Avatar>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.875rem" }}
                >
                  Upcoming This Week
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
                >
                  {calculateUpcomingInvoices()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ 
            borderBottom: 1, 
            borderColor: "divider",
            '& .MuiTab-root': {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              minHeight: isMobile ? 48 : 56,
              padding: isMobile ? "8px 12px" : "12px 16px"
            }
          }}
        >
          <Tab label="All" />
          <Tab label="Active" />
          <Tab label="Paused" />
          <Tab label="Completed" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: { 
              xs: "1fr", 
              sm: "repeat(2, 1fr)", 
              md: "repeat(4, 1fr)" 
            }, 
            gap: isMobile ? 2 : 3 
          }}>
            <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 2" } }}>
              <TextField
                fullWidth
                placeholder="Search recurring invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize={isMobile ? "small" : "medium"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={frequencyFilter}
                  label="Frequency"
                  onChange={(e) => setFrequencyFilter(e.target.value)}
                >
                  <MenuItem value="all">All Frequencies</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Content Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ 
          p: isMobile ? 2 : 3,
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <Typography 
            variant="h6"
            sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
          >
            Recurring Invoices ({filteredInvoices.length})
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={fetchRecurringInvoices}
            size={isMobile ? "small" : "medium"}
            variant="outlined"
          >
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* Data Display */}
      {filteredInvoices.length === 0 ? (
        <Paper sx={{ 
          textAlign: "center", 
          py: isMobile ? 6 : 8, 
          px: 2,
          backgroundColor: "background.default",
        }}>
          <Repeat sx={{ 
            fontSize: isMobile ? 48 : 60, 
            color: "text.secondary", 
            mb: 2 
          }} />
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
            No recurring invoices found
          </Typography>
          <Typography 
            color="text.secondary" 
            paragraph
            sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
          >
            {searchTerm ? "Try adjusting your search" : "Create your first recurring invoice"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push("/billing/recurring/new")}
            size={isMobile ? "small" : "medium"}
          >
            Create Recurring Invoice
          </Button>
        </Paper>
      ) : isMobile ? (
        renderMobileView()
      ) : (
        renderDesktopView()
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedInvoice && (
          <>
            <MenuItem onClick={() => handleEdit(selectedInvoice._id)}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleRunNow(selectedInvoice._id)}>
              <PlayArrow fontSize="small" sx={{ mr: 1 }} />
              Run Now
            </MenuItem>
            <MenuItem onClick={() => window.open(`/billing/invoice?customer=${selectedInvoice.customer.id}`, "_blank")}>
              <Receipt fontSize="small" sx={{ mr: 1 }} />
              View Invoices
            </MenuItem>
            <MenuItem
              onClick={() => handleDelete(selectedInvoice._id)}
              sx={{ color: "error.main" }}
            >
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Container>
  );
}