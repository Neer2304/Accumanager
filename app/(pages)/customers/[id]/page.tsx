"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link as MuiLink,
  Tab,
  Tabs,
  alpha,
  Alert,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Person,
  Phone,
  Email,
  LocationOn,
  Business,
  Receipt,
  AttachMoney,
  CalendarToday,
  ShoppingCart,
  TrendingUp,
  Home as HomeIcon,
  MoreVert,
  Delete,
  Refresh,
  Print,
  Visibility,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Store as StoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import { format } from "date-fns";
import { EditIcon } from "lucide-react";
import { useTheme } from "@mui/material/styles";

interface Customer {
  _id: string;
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  state: string;
  city?: string;
  pincode?: string;
  gstin?: string;
  gstNumber?: string;
  isInterState: boolean;
  totalOrders: number;
  totalPurchases: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  notes?: string;
  tags?: string[];
}

interface CustomerStatistics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  pendingPayments: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  daysSinceLastOrder: number | null;
  paymentSummary: {
    pending: number;
    completed: number;
    failed: number;
  };
  orderStatusSummary: {
    completed: number;
    pending: number;
    draft: number;
    cancelled: number;
  };
}

interface Order {
  _id: string;
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  subtotal: number;
  discount: number;
  tax: number;
  paymentMethod?: string;
  paymentStatus: string;
  status: string;
  itemsCount: number;
  items?: Array<{
    productId: string;
    name: string;
    hsnCode: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [statistics, setStatistics] = useState<CustomerStatistics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    gstin: "",
    isInterState: false,
    notes: "",
  });
  // const [darkMode, setDarkMode] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");
  const [orderSortBy, setOrderSortBy] = useState("date");
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  useEffect(() => {
    if (params.id) {
      fetchCustomerData();
    }
  }, [params.id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError("");

      const customerId = params.id as string;

      const response = await fetch(`/api/customers/${customerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load customer");
      }

      setCustomer(data.customer);
      setStatistics(data.statistics);
      setRecentOrders(data.recentOrders || []);
      setAllOrders(data.allOrders || []);
    } catch (err: any) {
      setError(err.message || "Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCustomerData();
    setSnackbar({
      open: true,
      message: "Customer data refreshed",
      severity: "success",
    });
  };

  const handleEditClick = () => {
    if (customer) {
      setEditFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        company: customer.company || "",
        address: customer.address || "",
        state: customer.state || "",
        city: customer.city || "",
        pincode: customer.pincode || "",
        gstin: customer.gstin || "",
        isInterState: customer.isInterState || false,
        notes: customer.notes || "",
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update customer");
      }

      setSnackbar({
        open: true,
        message: "Customer updated successfully",
        severity: "success",
      });

      setEditDialogOpen(false);
      fetchCustomerData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update customer",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete customer");
      }

      setSnackbar({
        open: true,
        message: "Customer deleted successfully",
        severity: "success",
      });

      setDeleteDialogOpen(false);

      setTimeout(() => {
        router.push("/customers");
      }, 1500);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete customer",
        severity: "error",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/billing/${orderId}`);
  };

  const handlePrintInvoice = (orderId: string) => {
    window.open(`/billing/print/${orderId}`, "_blank");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
      case "success":
        return "#34a853";
      case "pending":
        return "#fbbc04";
      case "draft":
        return "#5f6368";
      case "cancelled":
      case "failed":
        return "#ea4335";
      default:
        return "#5f6368";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "#1a73e8",
      "#34a853",
      "#ea4335",
      "#fbbc04",
      "#8ab4f8",
      "#81c995",
      "#f28b82",
      "#fdd663",
      "#5f6368",
      "#9aa0a6",
    ];
    const index = name?.charCodeAt(0) || 0;
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter and sort orders
  const filteredOrders = allOrders.filter((order) => {
    if (!order) return false;

    const searchLower = orderSearchTerm.toLowerCase();
    const matchesSearch =
      order.invoiceNumber?.toLowerCase().includes(searchLower) ||
      order.paymentStatus?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower);

    let matchesFilter = true;
    if (orderFilter === "paid") {
      matchesFilter =
        order.paymentStatus?.toLowerCase() === "paid" ||
        order.paymentStatus?.toLowerCase() === "completed";
    } else if (orderFilter === "pending") {
      matchesFilter = order.paymentStatus?.toLowerCase() === "pending";
    } else if (orderFilter === "failed") {
      matchesFilter =
        order.paymentStatus?.toLowerCase() === "failed" ||
        order.paymentStatus?.toLowerCase() === "cancelled";
    }

    return matchesSearch && matchesFilter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (orderSortBy === "date") {
      return (
        new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
      );
    } else if (orderSortBy === "amount") {
      return (b.amount || 0) - (a.amount || 0);
    } else if (orderSortBy === "invoice") {
      return a.invoiceNumber.localeCompare(b.invoiceNumber);
    }
    return 0;
  });

  if (loading) {
    return (
      <MainLayout title="Customer Details">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "60vh",
            gap: 2,
            backgroundColor: darkMode ? "#202124" : "#ffffff",
          }}
        >
          <CircularProgress
            size={48}
            sx={{ color: darkMode ? "#8ab4f8" : "#1a73e8" }}
          />
          <Typography
            variant="h6"
            sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
          >
            Loading customer details...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  if (error || !customer) {
    return (
      <MainLayout title="Error">
        <Box
          sx={{
            p: 4,
            backgroundColor: darkMode ? "#202124" : "#ffffff",
            minHeight: "100vh",
          }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              mb: 3,
              backgroundColor: darkMode ? "rgba(234, 67, 53, 0.1)" : undefined,
              color: darkMode ? "#f28b82" : undefined,
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => router.push("/customers")}
              >
                Back to Customers
              </Button>
            }
          >
            {error || "Customer not found"}
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${customer.name} - Customer Details`}>
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
        }}
      >
        {/* Header with Gradient Background */}
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            background: darkMode
              ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
              : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs
            sx={{
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
            }}
          >
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
                "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
              }}
            >
              <HomeIcon
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                }}
              />
              Dashboard
            </MuiLink>
            <MuiLink
              component={Link}
              href="/customers"
              sx={{
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
                "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
              }}
            >
              Customers
            </MuiLink>
            <Typography color={darkMode ? "#e8eaed" : "#202124"}>
              {customer.name}
            </Typography>
          </Breadcrumbs>

          {/* Title Section */}
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 2, sm: 3 },
              px: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="h3"
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: darkMode ? "#e8eaed" : "#202124",
              }}
            >
              Customer Profile
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 300,
                fontSize: { xs: "0.85rem", sm: "1rem", md: "1.125rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              View and manage customer information, orders, and transaction
              history
            </Typography>
          </Box>

          {/* Stats Chips */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <Chip
              label={`${statistics?.totalOrders || 0} Total Orders`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode
                  ? alpha("#4285f4", 0.1)
                  : alpha("#4285f4", 0.08),
                borderColor: alpha("#4285f4", 0.3),
                color: darkMode ? "#8ab4f8" : "#4285f4",
              }}
            />
            <Chip
              label={`${formatCurrency(statistics?.totalRevenue || 0)} Revenue`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode
                  ? alpha("#34a853", 0.1)
                  : alpha("#34a853", 0.08),
                borderColor: alpha("#34a853", 0.3),
                color: darkMode ? "#81c995" : "#34a853",
              }}
            />
            {customer.isInterState ? (
              <Chip
                label="Inter-State Customer"
                variant="outlined"
                sx={{
                  backgroundColor: darkMode
                    ? alpha("#fbbc04", 0.1)
                    : alpha("#fbbc04", 0.08),
                  borderColor: alpha("#fbbc04", 0.3),
                  color: darkMode ? "#fdd663" : "#fbbc04",
                }}
              />
            ) : (
              <Chip
                label="Intra-State Customer"
                variant="outlined"
                sx={{
                  backgroundColor: darkMode
                    ? alpha("#34a853", 0.1)
                    : alpha("#34a853", 0.08),
                  borderColor: alpha("#34a853", 0.3),
                  color: darkMode ? "#81c995" : "#34a853",
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Action Bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip title="Back to Customers">
                <IconButton
                  onClick={() => router.push("/customers")}
                  sx={{
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                    borderRadius: 2,
                    width: 40,
                    height: 40,
                    "&:hover": {
                      backgroundColor: darkMode ? "#3c4043" : "#f1f3f4",
                    },
                  }}
                >
                  <ArrowBack sx={{ color: darkMode ? "#e8eaed" : "#202124" }} />
                </IconButton>
              </Tooltip>
              <Typography
                variant="h5"
                fontWeight={500}
                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
              >
                {customer.name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: darkMode ? "#3c4043" : "#f1f3f4",
                    },
                  }}
                >
                  <Refresh sx={{ color: darkMode ? "#e8eaed" : "#202124" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="More actions">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: darkMode ? "#3c4043" : "#f1f3f4",
                    },
                  }}
                >
                  <MoreVert sx={{ color: darkMode ? "#e8eaed" : "#202124" }} />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditClick}
                sx={{
                  borderRadius: "24px",
                  px: 3,
                  py: 1,
                  backgroundColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  color: darkMode ? "#202124" : "#ffffff",
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: darkMode ? "#aecbfa" : "#1669c1",
                    boxShadow: darkMode
                      ? "0 4px 8px rgba(138, 180, 248, 0.2)"
                      : "0 4px 8px rgba(26, 115, 232, 0.2)",
                  },
                }}
              >
                Edit Customer
              </Button>
            </Box>
          </Box>

          {/* Customer Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 4,
              borderRadius: "16px",
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${getAvatarColor(customer.name)}, #8ab4f8, #fbbc04)`,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Tooltip
                    title={
                      customer.isInterState
                        ? "Inter-State Customer"
                        : "Intra-State Customer"
                    }
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: customer.isInterState ? "#fbbc04" : "#34a853",
                        border: `2px solid ${darkMode ? "#303134" : "#ffffff"}`,
                      }}
                    >
                      {customer.isInterState ? "IGST" : "GST"}
                    </Avatar>
                  </Tooltip>
                }
              >
                <Avatar
                  sx={{
                    width: { xs: 80, sm: 100, md: 120 },
                    height: { xs: 80, sm: 100, md: 120 },
                    bgcolor: getAvatarColor(customer.name),
                    color: "#ffffff",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  {getInitials(customer.name)}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: darkMode ? "#e8eaed" : "#202124",
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                  }}
                >
                  {customer.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Chip
                    icon={<Phone sx={{ fontSize: "0.9rem !important" }} />}
                    label={customer.phone}
                    size="small"
                    sx={{
                      backgroundColor: darkMode
                        ? "rgba(138, 180, 248, 0.1)"
                        : "rgba(26, 115, 232, 0.1)",
                      color: darkMode ? "#8ab4f8" : "#1a73e8",
                      border: "none",
                      fontWeight: 500,
                    }}
                  />

                  {customer.email && (
                    <Chip
                      icon={<Email sx={{ fontSize: "0.9rem !important" }} />}
                      label={customer.email}
                      size="small"
                      sx={{
                        backgroundColor: darkMode
                          ? "rgba(52, 168, 83, 0.1)"
                          : "rgba(52, 168, 83, 0.1)",
                        color: darkMode ? "#81c995" : "#34a853",
                        border: "none",
                        fontWeight: 500,
                      }}
                    />
                  )}

                  {customer.company && (
                    <Chip
                      icon={<Business sx={{ fontSize: "0.9rem !important" }} />}
                      label={customer.company}
                      size="small"
                      sx={{
                        backgroundColor: darkMode
                          ? "rgba(251, 188, 4, 0.1)"
                          : "rgba(251, 188, 4, 0.1)",
                        color: darkMode ? "#fdd663" : "#fbbc04",
                        border: "none",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {(customer.city || customer.state) && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocationOn
                        sx={{
                          fontSize: 16,
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                      >
                        {[customer.city, customer.state]
                          .filter(Boolean)
                          .join(", ")}
                        {customer.pincode && ` - ${customer.pincode}`}
                      </Typography>
                    </Box>
                  )}

                  {customer.gstin &&
                    customer.gstin !== "NO" &&
                    customer.gstin !== "NA" && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Receipt
                          sx={{
                            fontSize: 16,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: darkMode ? "#e8eaed" : "#202124",
                            fontFamily: "monospace",
                          }}
                        >
                          GST: {customer.gstin}
                        </Typography>
                      </Box>
                    )}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarToday
                      sx={{
                        fontSize: 16,
                        color: darkMode ? "#9aa0a6" : "#5f6368",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                    >
                      Customer since {formatDate(customer.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Stats Cards - Flexbox Layout */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
            }}
          >
            {/* Total Orders Card */}
            <Paper
              sx={{
                flex: "1 1 calc(25% - 12px)",
                minWidth: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(25% - 12px)",
                },
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: "16px",
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: darkMode
                    ? "0 8px 16px rgba(0,0,0,0.4)"
                    : "0 8px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? "#9aa0a6" : "#5f6368", mb: 1 }}
                  >
                    Total Orders
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                    }}
                  >
                    {statistics?.totalOrders || 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#9aa0a6" : "#5f6368",
                      display: "block",
                      mt: 1,
                    }}
                  >
                    Last order:{" "}
                    {customer.lastOrderDate
                      ? formatDate(customer.lastOrderDate)
                      : "Never"}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: darkMode
                      ? "rgba(138, 180, 248, 0.1)"
                      : "rgba(26, 115, 232, 0.1)",
                    color: darkMode ? "#8ab4f8" : "#1a73e8",
                    width: 48,
                    height: 48,
                  }}
                >
                  <ShoppingCart />
                </Avatar>
              </Box>
            </Paper>

            {/* Total Revenue Card */}
            <Paper
              sx={{
                flex: "1 1 calc(25% - 12px)",
                minWidth: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(25% - 12px)",
                },
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: "16px",
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: darkMode
                    ? "0 8px 16px rgba(0,0,0,0.4)"
                    : "0 8px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? "#9aa0a6" : "#5f6368", mb: 1 }}
                  >
                    Total Revenue
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#81c995" : "#34a853",
                    }}
                  >
                    {formatCurrency(statistics?.totalRevenue || 0)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#9aa0a6" : "#5f6368",
                      display: "block",
                      mt: 1,
                    }}
                  >
                    Avg: {formatCurrency(statistics?.avgOrderValue || 0)}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: darkMode
                      ? "rgba(52, 168, 83, 0.1)"
                      : "rgba(52, 168, 83, 0.1)",
                    color: darkMode ? "#81c995" : "#34a853",
                    width: 48,
                    height: 48,
                  }}
                >
                  <AttachMoney />
                </Avatar>
              </Box>
            </Paper>

            {/* Pending Payments Card */}
            <Paper
              sx={{
                flex: "1 1 calc(25% - 12px)",
                minWidth: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(25% - 12px)",
                },
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: "16px",
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: darkMode
                    ? "0 8px 16px rgba(0,0,0,0.4)"
                    : "0 8px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? "#9aa0a6" : "#5f6368", mb: 1 }}
                  >
                    Pending Payments
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#fdd663" : "#fbbc04",
                    }}
                  >
                    {formatCurrency(statistics?.pendingPayments || 0)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#9aa0a6" : "#5f6368",
                      display: "block",
                      mt: 1,
                    }}
                  >
                    {statistics?.paymentSummary.pending || 0} pending invoices
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: darkMode
                      ? "rgba(251, 188, 4, 0.1)"
                      : "rgba(251, 188, 4, 0.1)",
                    color: darkMode ? "#fdd663" : "#fbbc04",
                    width: 48,
                    height: 48,
                  }}
                >
                  <Receipt />
                </Avatar>
              </Box>
            </Paper>

            {/* GST Summary Card */}
            <Paper
              sx={{
                flex: "1 1 calc(25% - 12px)",
                minWidth: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(25% - 12px)",
                },
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: "16px",
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: darkMode
                    ? "0 8px 16px rgba(0,0,0,0.4)"
                    : "0 8px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? "#9aa0a6" : "#5f6368", mb: 1 }}
                  >
                    GST Summary
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                      }}
                    >
                      CGST: {formatCurrency(statistics?.totalCgst || 0)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                      }}
                    >
                      SGST: {formatCurrency(statistics?.totalSgst || 0)}
                    </Typography>
                    {customer.isInterState && (
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: darkMode ? "#fdd663" : "#fbbc04",
                        }}
                      >
                        IGST: {formatCurrency(statistics?.totalIgst || 0)}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: darkMode
                      ? "rgba(138, 180, 248, 0.1)"
                      : "rgba(26, 115, 232, 0.1)",
                    color: darkMode ? "#8ab4f8" : "#1a73e8",
                    width: 48,
                    height: 48,
                  }}
                >
                  <Receipt />
                </Avatar>
              </Box>
            </Paper>
          </Box>

          {/* Tabs */}
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: "12px",
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              overflow: "hidden",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                "& .MuiTabs-indicator": {
                  backgroundColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  minHeight: 56,
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  "&.Mui-selected": {
                    color: darkMode ? "#8ab4f8" : "#1a73e8",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Tab
                icon={<Person sx={{ fontSize: "1.2rem" }} />}
                iconPosition="start"
                label="Overview"
              />
              <Tab
                icon={<ShoppingCart sx={{ fontSize: "1.2rem" }} />}
                iconPosition="start"
                label={`Orders (${allOrders.length})`}
              />
              <Tab
                icon={<Business sx={{ fontSize: "1.2rem" }} />}
                iconPosition="start"
                label="Details"
              />
              {customer.notes && (
                <Tab
                  icon={<Receipt sx={{ fontSize: "1.2rem" }} />}
                  iconPosition="start"
                  label="Notes"
                />
              )}
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box sx={{ animation: "fadeIn 0.3s ease" }}>
            {/* Overview Tab */}
            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Payment Summary */}
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: "16px",
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      mb: 2,
                    }}
                  >
                    Payment Summary
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: { xs: "100%", sm: "calc(33.333% - 16px)" },
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#34a853",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {statistics?.paymentSummary.completed || 0}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          textAlign: "center",
                        }}
                      >
                        Paid
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: { xs: "100%", sm: "calc(33.333% - 16px)" },
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#fbbc04",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {statistics?.paymentSummary.pending || 0}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          textAlign: "center",
                        }}
                      >
                        Pending
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: { xs: "100%", sm: "calc(33.333% - 16px)" },
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#ea4335",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {statistics?.paymentSummary.failed || 0}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          textAlign: "center",
                        }}
                      >
                        Failed
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Recent Orders */}
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: "16px",
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                      }}
                    >
                      Recent Orders
                    </Typography>
                    {recentOrders.length > 0 && (
                      <Button
                        size="small"
                        onClick={() => setActiveTab(1)}
                        sx={{
                          color: darkMode ? "#8ab4f8" : "#1a73e8",
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        View All
                      </Button>
                    )}
                  </Box>

                  {recentOrders.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                      <ShoppingCart
                        sx={{
                          fontSize: 48,
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          mb: 2,
                          opacity: 0.5,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: darkMode ? "#e8eaed" : "#202124", mb: 1 }}
                      >
                        No orders yet
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                      >
                        This customer hasn't placed any orders
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        backgroundColor: "transparent",
                        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                        borderRadius: 2,
                      }}
                    >
                      <Table size="medium">
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                            }}
                          >
                            <TableCell
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                                fontWeight: 600,
                              }}
                            >
                              Invoice
                            </TableCell>
                            <TableCell
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                                fontWeight: 600,
                              }}
                            >
                              Date
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                                fontWeight: 600,
                              }}
                            >
                              Amount
                            </TableCell>
                            <TableCell
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                                fontWeight: 600,
                              }}
                            >
                              Status
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                                fontWeight: 600,
                              }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recentOrders.slice(0, 5).map((order) => (
                            <TableRow
                              key={order._id}
                              hover
                              sx={{
                                backgroundColor: darkMode
                                  ? "#303134"
                                  : "#ffffff",
                                "&:hover": {
                                  backgroundColor: darkMode
                                    ? "#3c4043"
                                    : "#f1f3f4",
                                },
                              }}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: darkMode ? "#8ab4f8" : "#1a73e8",
                                    cursor: "pointer",
                                    "&:hover": { textDecoration: "underline" },
                                  }}
                                  onClick={() => handleViewOrder(order._id)}
                                >
                                  {order.invoiceNumber}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: darkMode ? "#e8eaed" : "#202124",
                                  }}
                                >
                                  {formatDate(order.invoiceDate)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: darkMode ? "#81c995" : "#34a853",
                                  }}
                                >
                                  {formatCurrency(order.amount)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={order.paymentStatus}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(
                                      getStatusColor(order.paymentStatus),
                                      0.1,
                                    ),
                                    color: getStatusColor(order.paymentStatus),
                                    border: "none",
                                    fontWeight: 500,
                                    textTransform: "capitalize",
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Tooltip title="View Invoice">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewOrder(order._id)}
                                      sx={{
                                        color: darkMode ? "#8ab4f8" : "#1a73e8",
                                      }}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Print">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handlePrintInvoice(order._id)
                                      }
                                      sx={{
                                        color: darkMode ? "#9aa0a6" : "#5f6368",
                                      }}
                                    >
                                      <Print fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>

                {/* Customer Information */}
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: "16px",
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      mb: 2,
                    }}
                  >
                    Customer Information
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 3,
                    }}
                  >
                    {/* Contact Information */}
                    <Box
                      sx={{
                        flex: "1 1 calc(50% - 12px)",
                        minWidth: { xs: "100%", md: "calc(50% - 12px)" },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Contact Information
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Phone
                              sx={{
                                fontSize: 18,
                                color: darkMode ? "#8ab4f8" : "#1a73e8",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                            >
                              {customer.phone}
                            </Typography>
                          </Box>
                          {customer.email && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Email
                                sx={{
                                  fontSize: 18,
                                  color: darkMode ? "#81c995" : "#34a853",
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                              >
                                {customer.email}
                              </Typography>
                            </Box>
                          )}
                          {customer.company && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Business
                                sx={{
                                  fontSize: 18,
                                  color: darkMode ? "#fdd663" : "#fbbc04",
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                              >
                                {customer.company}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    </Box>

                    {/* Address Information */}
                    <Box
                      sx={{
                        flex: "1 1 calc(50% - 12px)",
                        minWidth: { xs: "100%", md: "calc(50% - 12px)" },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Address Information
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <LocationOn
                            sx={{
                              fontSize: 18,
                              color: darkMode ? "#f28b82" : "#ea4335",
                              mt: 0.3,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                            >
                              {customer.address || "No address provided"}
                            </Typography>
                            {(customer.city ||
                              customer.state ||
                              customer.pincode) && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: darkMode ? "#9aa0a6" : "#5f6368",
                                  mt: 0.5,
                                }}
                              >
                                {[
                                  customer.city,
                                  customer.state,
                                  customer.pincode,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Box>

                    {/* GST Information */}
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        GST Information
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Receipt
                              sx={{
                                fontSize: 18,
                                color: darkMode ? "#8ab4f8" : "#1a73e8",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: darkMode ? "#e8eaed" : "#202124",
                                fontFamily: "monospace",
                              }}
                            >
                              {customer.gstin &&
                              customer.gstin !== "NO" &&
                              customer.gstin !== "NA"
                                ? customer.gstin
                                : "Not Registered"}
                            </Typography>
                          </Box>
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                              borderColor: darkMode ? "#3c4043" : "#dadce0",
                            }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                            >
                              Transaction Type:
                            </Typography>
                            <Chip
                              label={
                                customer.isInterState
                                  ? "Inter-State (IGST)"
                                  : "Intra-State (CGST+SGST)"
                              }
                              size="small"
                              sx={{
                                backgroundColor: customer.isInterState
                                  ? darkMode
                                    ? "rgba(251, 188, 4, 0.1)"
                                    : "rgba(251, 188, 4, 0.1)"
                                  : darkMode
                                    ? "rgba(52, 168, 83, 0.1)"
                                    : "rgba(52, 168, 83, 0.1)",
                                color: customer.isInterState
                                  ? darkMode
                                    ? "#fdd663"
                                    : "#fbbc04"
                                  : darkMode
                                    ? "#81c995"
                                    : "#34a853",
                                border: "none",
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Orders Tab */}
            {activeTab === 1 && (
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: "16px",
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: darkMode ? "#e8eaed" : "#202124",
                    mb: 2,
                  }}
                >
                  Order History
                </Typography>

                {/* Order Filters */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search orders by invoice number, status..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontSize: 20,
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: orderSearchTerm && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setOrderSearchTerm("")}
                          >
                            <CloseIcon
                              sx={{
                                fontSize: 18,
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                              }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#202124" : "#ffffff",
                        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                        color: darkMode ? "#e8eaed" : "#202124",
                        "&:hover": {
                          borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                        },
                        "&.Mui-focused": {
                          borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                          boxShadow: `0 0 0 3px ${darkMode ? "rgba(138, 180, 248, 0.1)" : "rgba(26, 115, 232, 0.1)"}`,
                        },
                      },
                    }}
                    sx={{ flex: 1 }}
                  />

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: 120,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: darkMode ? "#202124" : "#ffffff",
                          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                          color: darkMode ? "#e8eaed" : "#202124",
                          "&:hover": {
                            borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                          },
                          "&.Mui-focused": {
                            borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                            boxShadow: `0 0 0 3px ${darkMode ? "rgba(138, 180, 248, 0.1)" : "rgba(26, 115, 232, 0.1)"}`,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          "&.Mui-focused": {
                            color: darkMode ? "#8ab4f8" : "#1a73e8",
                          },
                        },
                      }}
                    >
                      <InputLabel>Filter</InputLabel>
                      <Select
                        value={orderFilter}
                        label="Filter"
                        onChange={(e) => setOrderFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Orders</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl
                      size="small"
                      sx={{
                        minWidth: 120,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: darkMode ? "#202124" : "#ffffff",
                          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                          color: darkMode ? "#e8eaed" : "#202124",
                          "&:hover": {
                            borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                          },
                          "&.Mui-focused": {
                            borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                            boxShadow: `0 0 0 3px ${darkMode ? "rgba(138, 180, 248, 0.1)" : "rgba(26, 115, 232, 0.1)"}`,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          "&.Mui-focused": {
                            color: darkMode ? "#8ab4f8" : "#1a73e8",
                          },
                        },
                      }}
                    >
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={orderSortBy}
                        label="Sort by"
                        onChange={(e) => setOrderSortBy(e.target.value)}
                      >
                        <MenuItem value="date">Date (Recent)</MenuItem>
                        <MenuItem value="amount">Amount</MenuItem>
                        <MenuItem value="invoice">Invoice Number</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Active Filters Display */}
                {(orderSearchTerm ||
                  orderFilter !== "all" ||
                  orderSortBy !== "date") && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      mb: 2,
                    }}
                  >
                    {orderSearchTerm && (
                      <Chip
                        label={`Search: "${orderSearchTerm}"`}
                        size="small"
                        onDelete={() => setOrderSearchTerm("")}
                        icon={
                          <SearchIcon sx={{ fontSize: "1rem !important" }} />
                        }
                        sx={{
                          backgroundColor: darkMode
                            ? "rgba(138, 180, 248, 0.1)"
                            : "rgba(26, 115, 232, 0.1)",
                          color: darkMode ? "#8ab4f8" : "#1a73e8",
                          border: "none",
                        }}
                      />
                    )}
                    {orderFilter !== "all" && (
                      <Chip
                        label={`Filter: ${orderFilter}`}
                        size="small"
                        onDelete={() => setOrderFilter("all")}
                        sx={{
                          backgroundColor: darkMode
                            ? "rgba(138, 180, 248, 0.1)"
                            : "rgba(26, 115, 232, 0.1)",
                          color: darkMode ? "#8ab4f8" : "#1a73e8",
                          border: "none",
                        }}
                      />
                    )}
                    {orderSortBy !== "date" && (
                      <Chip
                        label={`Sort: ${orderSortBy}`}
                        size="small"
                        onDelete={() => setOrderSortBy("date")}
                        sx={{
                          backgroundColor: darkMode
                            ? "rgba(138, 180, 248, 0.1)"
                            : "rgba(26, 115, 232, 0.1)",
                          color: darkMode ? "#8ab4f8" : "#1a73e8",
                          border: "none",
                        }}
                      />
                    )}
                  </Box>
                )}

                {sortedOrders.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: "center" }}>
                    <ShoppingCart
                      sx={{
                        fontSize: 64,
                        color: darkMode ? "#9aa0a6" : "#5f6368",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: darkMode ? "#e8eaed" : "#202124", mb: 1 }}
                    >
                      {orderSearchTerm || orderFilter !== "all"
                        ? "No matching orders"
                        : "No orders yet"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                    >
                      {orderSearchTerm || orderFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "This customer hasn't placed any orders"}
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                      backgroundColor: "transparent",
                      border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                      borderRadius: 2,
                    }}
                  >
                    <Table size="medium">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                          }}
                        >
                          <TableCell
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Invoice #
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Items
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Subtotal
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Tax
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Payment
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              fontWeight: 600,
                            }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedOrders.map((order) => (
                          <TableRow
                            key={order._id}
                            hover
                            sx={{
                              backgroundColor: darkMode ? "#303134" : "#ffffff",
                              "&:hover": {
                                backgroundColor: darkMode
                                  ? "#3c4043"
                                  : "#f1f3f4",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: darkMode ? "#8ab4f8" : "#1a73e8",
                                  cursor: "pointer",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                                onClick={() => handleViewOrder(order._id)}
                              >
                                {order.invoiceNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                              >
                                {formatDate(order.invoiceDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.itemsCount}
                                size="small"
                                sx={{
                                  backgroundColor: darkMode
                                    ? "rgba(138, 180, 248, 0.1)"
                                    : "rgba(26, 115, 232, 0.1)",
                                  color: darkMode ? "#8ab4f8" : "#1a73e8",
                                  border: "none",
                                  minWidth: 30,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                              >
                                {formatCurrency(order.subtotal)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                              >
                                {formatCurrency(order.tax)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: darkMode ? "#81c995" : "#34a853",
                                }}
                              >
                                {formatCurrency(order.amount)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.paymentStatus}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(
                                    getStatusColor(order.paymentStatus),
                                    0.1,
                                  ),
                                  color: getStatusColor(order.paymentStatus),
                                  border: "none",
                                  textTransform: "capitalize",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(
                                    getStatusColor(order.status),
                                    0.1,
                                  ),
                                  color: getStatusColor(order.status),
                                  border: "none",
                                  textTransform: "capitalize",
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Tooltip title="View Invoice">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewOrder(order._id)}
                                    sx={{
                                      color: darkMode ? "#8ab4f8" : "#1a73e8",
                                    }}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Print">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handlePrintInvoice(order._id)
                                    }
                                    sx={{
                                      color: darkMode ? "#9aa0a6" : "#5f6368",
                                    }}
                                  >
                                    <Print fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}

            {/* Details Tab */}
            {activeTab === 2 && (
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: "16px",
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: darkMode ? "#e8eaed" : "#202124",
                    mb: 2,
                  }}
                >
                  Additional Details
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                  }}
                >
                  {/* Account Information */}
                  <Box
                    sx={{
                      flex: "1 1 calc(50% - 12px)",
                      minWidth: { xs: "100%", md: "calc(50% - 12px)" },
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: darkMode ? "#e8eaed" : "#202124",
                          mb: 1.5,
                        }}
                      >
                        Account Information
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Customer ID
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              fontFamily: "monospace",
                            }}
                          >
                            {customer._id.slice(-8).toUpperCase()}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Created On
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                          >
                            {formatDateTime(customer.createdAt)}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Last Updated
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                          >
                            {formatDateTime(customer.updatedAt)}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Last Order
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                          >
                            {customer.lastOrderDate
                              ? formatDateTime(customer.lastOrderDate)
                              : "Never"}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>

                  {/* Order Statistics */}
                  <Box
                    sx={{
                      flex: "1 1 calc(50% - 12px)",
                      minWidth: { xs: "100%", md: "calc(50% - 12px)" },
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: darkMode ? "#e8eaed" : "#202124",
                          mb: 1.5,
                        }}
                      >
                        Order Statistics
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Total Orders
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: darkMode ? "#8ab4f8" : "#1a73e8",
                            }}
                          >
                            {statistics?.totalOrders || 0}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Total Spent
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: darkMode ? "#81c995" : "#34a853",
                            }}
                          >
                            {formatCurrency(statistics?.totalRevenue || 0)}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Average Order Value
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: darkMode ? "#fdd663" : "#fbbc04",
                            }}
                          >
                            {formatCurrency(statistics?.avgOrderValue || 0)}
                          </Typography>
                        </Box>
                        <Divider
                          sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                          >
                            Pending Payments
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: darkMode ? "#f28b82" : "#ea4335",
                            }}
                          >
                            {formatCurrency(statistics?.pendingPayments || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>

                  {/* Tags */}
                  {customer.tags && customer.tags.length > 0 && (
                    <Box sx={{ width: "100%" }}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: darkMode ? "#e8eaed" : "#202124",
                            mb: 1.5,
                          }}
                        >
                          Tags
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {customer.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: darkMode
                                  ? "rgba(138, 180, 248, 0.1)"
                                  : "rgba(26, 115, 232, 0.1)",
                                color: darkMode ? "#8ab4f8" : "#1a73e8",
                                border: "none",
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}

            {/* Notes Tab */}
            {activeTab === 3 && customer.notes && (
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: "16px",
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: darkMode ? "#e8eaed" : "#202124",
                    mb: 2,
                  }}
                >
                  Notes
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                    border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkMode ? "#e8eaed" : "#202124",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {customer.notes}
                  </Typography>
                </Paper>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>

      {/* Action Menu - Google Material Design Style */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: darkMode ? "#303134" : "#ffffff",
            border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            boxShadow: darkMode
              ? "0 8px 16px rgba(0, 0, 0, 0.4)"
              : "0 8px 16px rgba(0, 0, 0, 0.08)",
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={handleEditClick}
          sx={{
            py: 1.5,
            px: 2.5,
            color: darkMode ? "#e8eaed" : "#202124",
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(138, 180, 248, 0.1)"
                : "rgba(26, 115, 232, 0.05)",
            },
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Edit Customer
            </Typography>
          </ListItemText>
        </MenuItem>

        <Divider sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }} />

        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            py: 1.5,
            px: 2.5,
            color: darkMode ? "#f28b82" : "#ea4335",
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(242, 139, 130, 0.1)"
                : "rgba(234, 67, 53, 0.05)",
            },
          }}
        >
          <ListItemIcon>
            <Delete
              fontSize="small"
              sx={{ color: darkMode ? "#f28b82" : "#ea4335" }}
            />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Delete Customer</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Customer Dialog - Google Material Design Style */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            backgroundColor: darkMode ? "#303134" : "#ffffff",
            border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            boxShadow: darkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.4)"
              : "0 8px 32px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            px: 3,
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: darkMode ? "#e8eaed" : "#202124" }}
          >
            Edit Customer
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 0.5,
            }}
          >
            <TextField
              fullWidth
              label="Name *"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              required
              size="small"
              sx={{
                flex: "1 1 100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="Phone *"
              value={editFormData.phone}
              onChange={(e) =>
                setEditFormData({ ...editFormData, phone: e.target.value })
              }
              required
              size="small"
              sx={{
                flex: "1 1 calc(50% - 8px)",
                minWidth: { xs: "100%", sm: "calc(50% - 8px)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
              size="small"
              sx={{
                flex: "1 1 calc(50% - 8px)",
                minWidth: { xs: "100%", sm: "calc(50% - 8px)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="Company"
              value={editFormData.company}
              onChange={(e) =>
                setEditFormData({ ...editFormData, company: e.target.value })
              }
              size="small"
              sx={{
                flex: "1 1 calc(50% - 8px)",
                minWidth: { xs: "100%", sm: "calc(50% - 8px)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="Address"
              value={editFormData.address}
              onChange={(e) =>
                setEditFormData({ ...editFormData, address: e.target.value })
              }
              size="small"
              sx={{
                flex: "1 1 100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="City"
              value={editFormData.city}
              onChange={(e) =>
                setEditFormData({ ...editFormData, city: e.target.value })
              }
              size="small"
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: { xs: "100%", sm: "calc(33.333% - 16px)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="State"
              value={editFormData.state}
              onChange={(e) =>
                setEditFormData({ ...editFormData, state: e.target.value })
              }
              size="small"
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: { xs: "100%", sm: "calc(33.333% - 16px)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="Pincode"
              value={editFormData.pincode}
              onChange={(e) =>
                setEditFormData({ ...editFormData, pincode: e.target.value })
              }
              size="small"
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: { xs: "100%", sm: "calc(33.333% - 16px)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <TextField
              fullWidth
              label="GSTIN"
              value={editFormData.gstin}
              onChange={(e) =>
                setEditFormData({ ...editFormData, gstin: e.target.value })
              }
              size="small"
              sx={{
                flex: "1 1 calc(50% - 8px)",
                minWidth: { xs: "100%", sm: "calc(50% - 8px)" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />

            <Box
              sx={{
                flex: "1 1 calc(50% - 8px)",
                minWidth: { xs: "100%", sm: "calc(50% - 8px)" },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Chip
                label={
                  editFormData.isInterState
                    ? "Inter-State Customer"
                    : "Intra-State Customer"
                }
                onClick={() =>
                  setEditFormData({
                    ...editFormData,
                    isInterState: !editFormData.isInterState,
                  })
                }
                sx={{
                  backgroundColor: editFormData.isInterState
                    ? darkMode
                      ? "rgba(251, 188, 4, 0.1)"
                      : "rgba(251, 188, 4, 0.1)"
                    : darkMode
                      ? "rgba(52, 168, 83, 0.1)"
                      : "rgba(52, 168, 83, 0.1)",
                  color: editFormData.isInterState
                    ? darkMode
                      ? "#fdd663"
                      : "#fbbc04"
                    : darkMode
                      ? "#81c995"
                      : "#34a853",
                  border: "none",
                  fontWeight: 500,
                  height: 40,
                  "&:hover": {
                    backgroundColor: editFormData.isInterState
                      ? darkMode
                        ? "rgba(251, 188, 4, 0.2)"
                        : "rgba(251, 188, 4, 0.2)"
                      : darkMode
                        ? "rgba(52, 168, 83, 0.2)"
                        : "rgba(52, 168, 83, 0.2)",
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Notes"
              value={editFormData.notes}
              onChange={(e) =>
                setEditFormData({ ...editFormData, notes: e.target.value })
              }
              multiline
              rows={3}
              size="small"
              sx={{
                flex: "1 1 100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: darkMode ? "#202124" : "#ffffff",
                  "& fieldset": {
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#8ab4f8" : "#1a73e8",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{
              borderRadius: "20px",
              px: 3,
              py: 1,
              color: darkMode ? "#e8eaed" : "#5f6368",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            sx={{
              borderRadius: "20px",
              px: 3,
              py: 1,
              backgroundColor: darkMode ? "#8ab4f8" : "#1a73e8",
              color: darkMode ? "#202124" : "#ffffff",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: darkMode ? "#aecbfa" : "#1669c1",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog - Google Material Design Style */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            backgroundColor: darkMode ? "#303134" : "#ffffff",
            border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            boxShadow: darkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.4)"
              : "0 8px 32px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            px: 3,
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: darkMode ? "#f28b82" : "#ea4335" }}
          >
            Delete Customer
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2}>
            <Alert
              severity="warning"
              sx={{
                borderRadius: "12px",
                backgroundColor: darkMode
                  ? "rgba(251, 188, 4, 0.1)"
                  : "rgba(251, 188, 4, 0.05)",
                border: `1px solid ${darkMode ? "rgba(251, 188, 4, 0.2)" : "rgba(251, 188, 4, 0.1)"}`,
                color: darkMode ? "#fdd663" : "#b45a1c",
              }}
            >
              Are you sure you want to delete this customer?
            </Alert>

            <Paper
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: darkMode ? "#e8eaed" : "#202124",
                  mb: 1,
                }}
              >
                {customer?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: darkMode ? "#9aa0a6" : "#5f6368", mb: 0.5 }}
              >
                Phone: {customer?.phone}
              </Typography>
              {customer?.email && (
                <Typography
                  variant="body2"
                  sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                >
                  Email: {customer?.email}
                </Typography>
              )}
              {(customer?.totalOrders || 0) > 0 && (
                <Typography
                  variant="body2"
                  sx={{ color: darkMode ? "#f28b82" : "#ea4335", mt: 1 }}
                >
                  ⚠️ This customer has {customer?.totalOrders} order(s).
                  Deleting will remove all associated data.
                </Typography>
              )}
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              borderRadius: "20px",
              px: 3,
              py: 1,
              color: darkMode ? "#e8eaed" : "#5f6368",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: "20px",
              px: 3,
              py: 1,
              backgroundColor: darkMode ? "#f28b82" : "#ea4335",
              color: darkMode ? "#202124" : "#ffffff",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: darkMode ? "#f28b82" : "#d32f2f",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbar.severity as "success" | "error" | "info" | "warning"
          }
          sx={{
            borderRadius: "12px",
            backgroundColor:
              snackbar.severity === "success"
                ? darkMode
                  ? "rgba(52, 168, 83, 0.9)"
                  : "#34a853"
                : darkMode
                  ? "rgba(234, 67, 53, 0.9)"
                  : "#ea4335",
            color: "#ffffff",
            "& .MuiAlert-icon": {
              color: "#ffffff",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </MainLayout>
  );
}
