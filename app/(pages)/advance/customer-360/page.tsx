// app/(pages)/advance/customer-360/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Paper,
  Stack,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Tooltip,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  LinearProgress,
  Breadcrumbs,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  ShoppingCart,
  Star,
  Edit,
  MoreVert,
  Search,
  FilterList,
  Add,
  TrendingUp,
  AttachMoney,
  FamilyRestroom,
  Call,
  Schedule,
  WhatsApp,
  Chat,
  Refresh,
  Close,
  Visibility,
  Payment,
  Receipt,
  AccountBalanceWallet,
  PersonAdd,
  Business,
  Work,
  Cake,
  Home,
  ExpandMore,
  ExpandLess,
  NoteAdd,
  WorkspacePremium,
} from "@mui/icons-material";
import { useAdvanceThemeContext } from "@/contexts/AdvanceThemeContexts";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Simplified Types
interface BaseCustomer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  gstin?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

interface AdvancedCustomer {
  _id: string;
  customerId: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  gender?: string;
  birthday?: string;
  occupation?: string;
  designation?: string;
  companyName?: string;
  customerScore: number;
  loyaltyLevel: string;
  lifecycleStage: string;
  familyMembers: any[];
  preferences: any[];
  interests: string[];
  tags: any[];
  communications: any[];
  notes: any[];
  createdAt: string;
  needsUpgrade?: boolean;
}

interface CustomerListResponse {
  success: boolean;
  data: {
    customers: AdvancedCustomer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    summary?: any;
  };
}

interface Customer360Response {
  success: boolean;
  data: {
    customer: BaseCustomer;
    advancedProfile?: AdvancedCustomer;
    familyMembers: any[];
    tags: any[];
    preferences: any[];
    interests: string[];
    communications: any[];
    notes: any[];
    orders: any[];
    statistics: {
      totalOrders: number;
      totalSpent: number;
      avgOrderValue: number;
      lastOrderDate?: string;
      daysSinceLastOrder?: number;
    };
    timeline: any[];
    summary: any;
  };
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Sort function for table
type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function Customer360Page() {
  const { currentScheme } = useAdvanceThemeContext();
  const [tabValue, setTabValue] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer360Response["data"] | null
  >(null);
  const [customers, setCustomers] = useState<AdvancedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] =
    useState<keyof AdvancedCustomer>("customerScore");
  const [selected, setSelected] = useState<string[]>([]);
  const [initializing, setInitializing] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Fetch customers
  // In your Customer360Page component - SIMPLIFIED
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 Fetching customers for 360° view...");

      // This will automatically create advanced profiles if missing
      const response = await fetch("/api/advance/customer-360");
      const data = await response.json();

      if (data.success) {
        console.log(`✅ Loaded ${data.data.customers.length} customers`);
        setCustomers(data.data.customers);
        setTotalCustomers(data.data.pagination.total);

        // Show stats
        const stats = data.data.summary?.byLifecycle || {};
        console.log("📊 Customer stats:", stats);
      } else {
        setError(data.message || "Failed to load customers");
      }
    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  // Handle adding family member
  const handleAddFamilyMember = async (customerId: string, familyData: any) => {
    try {
      const response = await fetch(`/api/advance/customer-360`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          operation: "add_family",
          ...familyData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Family member added successfully");
        fetchCustomers(); // Refresh
        if (selectedCustomer) {
          fetchCustomerDetails(selectedCustomer.customer._id); // Refresh details
        }
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle adding tag
  const handleAddTag = async (customerId: string, tagData: any) => {
    try {
      const response = await fetch(`/api/advance/customer-360`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          operation: "add_tag",
          ...tagData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Tag added successfully");
        fetchCustomers();
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Initialize advanced profiles
  const initializeProfiles = async () => {
    try {
      setInitializing(true);
      setError(null);

      const response = await fetch("/api/advance/customer-360/init", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          `✅ Created ${data.data.created} advanced customer profiles!`,
        );
        setTimeout(() => fetchCustomers(), 1000);
      } else {
        setError(data.message || "Failed to initialize profiles");
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize profiles");
    } finally {
      setInitializing(false);
    }
  };

  // Fetch customer details
  const fetchCustomerDetails = useCallback(async (customerId: string) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/advance/customer-360/${customerId}`);
      const data: Customer360Response = await response.json();

      if (data.success) {
        setSelectedCustomer(data.data);
        setDrawerOpen(true);
      } else {
        setError(data.message || "Failed to load customer details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load customer details");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filter, fetchCustomers]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCustomerSelect = (customer: AdvancedCustomer) => {
    fetchCustomerDetails(customer.customerId || customer._id);
  };

  const getLoyaltyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "diamond":
        return "#E5E4E2";
      case "platinum":
        return "#E5E4E2";
      case "gold":
        return "#FFD700";
      case "silver":
        return "#C0C0C0";
      case "bronze":
        return "#CD7F32";
      default:
        return currentScheme.colors.text.secondary;
    }
  };

  const getLifecycleColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case "vip":
        return currentScheme.colors.buttons.success;
      case "customer":
        return currentScheme.colors.primary;
      case "prospect":
        return currentScheme.colors.buttons.warning;
      case "lead":
        return currentScheme.colors.text.secondary;
      case "churned":
        return currentScheme.colors.buttons.error;
      default:
        return currentScheme.colors.text.secondary;
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Call />;
      case "email":
        return <Email />;
      case "meeting":
        return <Schedule />;
      case "whatsapp":
        return <WhatsApp />;
      case "sms":
        return <Chat />;
      default:
        return <Chat />;
    }
  };

  // Handle table sorting
  const handleRequestSort = (property: keyof AdvancedCustomer) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = customers.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get sorted and filtered customers
  const sortedCustomers = [...customers].sort(getComparator(order, orderBy));
  const filteredCustomers = sortedCustomers.filter((customer) => {
    if (!customer) return false;
    const searchLower = search.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(search) ||
      customer.company?.toLowerCase().includes(searchLower)
    );
  });

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (loading && customers.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress sx={{ color: currentScheme.colors.primary }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Box
            component={Link}
            href="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: 20 }} />
            Dashboard
          </Box>
          <Typography color="text.primary">Customer 360°</Typography>
        </Breadcrumbs>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Person sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                👥 Customer 360°
              </Typography>
              <Typography
                variant="body1"
                color={currentScheme.colors.text.secondary}
              >
                Complete customer profiles with advanced insights and
                relationship management
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchCustomers}
              disabled={loading}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
              }}
            >
              Refresh
            </Button>

            {customers.length === 0 && (
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={initializeProfiles}
                disabled={initializing}
                sx={{
                  background: `linear-gradient(135deg, ${currentScheme.colors.buttons.success} 0%, ${currentScheme.colors.buttons.info} 100%)`,
                }}
              >
                {initializing ? "Initializing..." : "Initialize Profiles"}
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              }}
            >
              Add Customer
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              fullWidth
              placeholder="Search by name, email, phone, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                background: currentScheme.colors.components.input,
                "& .MuiOutlinedInput-root": {
                  color: currentScheme.colors.text.primary,
                  "& fieldset": {
                    borderColor: currentScheme.colors.components.border,
                  },
                },
                minWidth: "300px",
                flex: 1,
              }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Lifecycle Stage</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Lifecycle Stage"
                sx={{
                  background: currentScheme.colors.components.input,
                  color: currentScheme.colors.text.primary,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: currentScheme.colors.components.border,
                  },
                }}
              >
                <MenuItem value="all">All Stages</MenuItem>
                <MenuItem value="lead">Lead</MenuItem>
                <MenuItem value="prospect">Prospect</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
                <MenuItem value="churned">Churned</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
              }}
            >
              More Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Overview - Using Flexbox instead of Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          "& > *": {
            flex: "1 1 calc(25% - 16px)",
            minWidth: "200px",
          },
        }}
      >
        <Card sx={{ background: currentScheme.colors.components.card }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {customers.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Customers
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: `${currentScheme.colors.primary}20`,
                  color: currentScheme.colors.primary,
                }}
              >
                <Person />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ background: currentScheme.colors.components.card }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {
                    customers.filter(
                      (c) =>
                        c.loyaltyLevel === "gold" ||
                        c.loyaltyLevel === "platinum" ||
                        c.loyaltyLevel === "diamond",
                    ).length
                  }
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Loyal Customers
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: `${getLoyaltyColor("gold")}20`,
                  color: getLoyaltyColor("gold"),
                }}
              >
                <Star />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ background: currentScheme.colors.components.card }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  ₹
                  {customers
                    .reduce((sum, c) => sum + (c.totalSpent || 0), 0)
                    .toLocaleString("en-IN")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Revenue
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: `${currentScheme.colors.buttons.success}20`,
                  color: currentScheme.colors.buttons.success,
                }}
              >
                <AttachMoney />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ background: currentScheme.colors.components.card }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {customers.filter((c) => c.lifecycleStage === "vip").length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  VIP Customers
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: `${getLifecycleColor("vip")}20`,
                  color: getLifecycleColor("vip"),
                }}
              >
                <WorkspacePremium />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Customers Table */}
      <Card sx={{ background: currentScheme.colors.components.card, mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: `1px solid ${currentScheme.colors.components.border}`,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Customers ({totalCustomers})
            </Typography>

            {selected.length > 0 && (
              <Box display="flex" gap={1}>
                <Typography variant="body2" color="textSecondary">
                  {selected.length} selected
                </Typography>
                <Button size="small">Bulk Actions</Button>
              </Box>
            )}
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < customers.length
                      }
                      checked={
                        customers.length > 0 &&
                        selected.length === customers.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Customer
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === "totalSpent"}
                      direction={orderBy === "totalSpent" ? order : "asc"}
                      onClick={() => handleRequestSort("totalSpent")}
                    >
                      Total Spent
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "customerScore"}
                      direction={orderBy === "customerScore" ? order : "asc"}
                      onClick={() => handleRequestSort("customerScore")}
                    >
                      Score
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <Person
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 2,
                              opacity: 0.5,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                          >
                            No customers found
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 3 }}
                          >
                            {search
                              ? "Try a different search term"
                              : "Get started by initializing customer profiles"}
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={initializeProfiles}
                            disabled={initializing}
                          >
                            {initializing
                              ? "Initializing..."
                              : "Initialize Profiles"}
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => {
                    const isItemSelected =
                      selected.indexOf(customer._id) !== -1;
                    const isExpanded = expandedRow === customer._id;

                    return (
                      <React.Fragment key={customer._id}>
                        <TableRow hover selected={isItemSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleClick(customer._id);
                              }}
                            />
                          </TableCell>

                          <TableCell
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : customer._id)
                            }
                            sx={{ cursor: "pointer" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              {isExpanded ? <ExpandLess /> : <ExpandMore />}
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  bgcolor: currentScheme.colors.primary,
                                  fontSize: 14,
                                }}
                              >
                                {customer.name?.charAt(0) || "C"}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="medium"
                                >
                                  {customer.name || "Unnamed Customer"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {customer.company || "No company"}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              {customer.email && (
                                <Typography variant="body2">
                                  {customer.email}
                                </Typography>
                              )}
                              <Typography variant="body2" color="textSecondary">
                                {customer.phone || "No phone"}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="right">
                            <Typography variant="subtitle2" fontWeight="medium">
                              {formatCurrency(customer.totalSpent || 0)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {customer.totalOrders || 0} orders
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={customer.customerScore || 0}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: `${currentScheme.colors.primary}20`,
                                }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight="medium"
                                sx={{ minWidth: 40 }}
                              >
                                {customer.customerScore || 0}%
                              </Typography>
                            </Box>
                            <Chip
                              label={customer.loyaltyLevel || "Bronze"}
                              size="small"
                              sx={{
                                mt: 0.5,
                                bgcolor: `${getLoyaltyColor(customer.loyaltyLevel)}20`,
                                color: getLoyaltyColor(customer.loyaltyLevel),
                                fontWeight: "medium",
                                fontSize: "0.7rem",
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={customer.lifecycleStage || "Customer"}
                              size="small"
                              sx={{
                                bgcolor: `${getLifecycleColor(customer.lifecycleStage)}20`,
                                color: getLifecycleColor(
                                  customer.lifecycleStage,
                                ),
                                fontWeight: "medium",
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleCustomerSelect(customer)}
                                  sx={{
                                    color: currentScheme.colors.primary,
                                    "&:hover": {
                                      bgcolor: `${currentScheme.colors.primary}10`,
                                    },
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="More Actions">
                                <IconButton size="small">
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Row Details */}
                        {isExpanded && (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              sx={{
                                bgcolor: `${currentScheme.colors.background}90`,
                                borderBottom: `2px solid ${currentScheme.colors.components.border}`,
                              }}
                            >
                              <Box sx={{ p: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                  }}
                                >
                                  <Box sx={{ flex: "1 1 300px" }}>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight="bold"
                                      gutterBottom
                                    >
                                      Customer Details
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Email
                                          sx={{
                                            fontSize: 16,
                                            color: "text.secondary",
                                          }}
                                        />
                                        <Typography variant="body2">
                                          {customer.email || "No email"}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Phone
                                          sx={{
                                            fontSize: 16,
                                            color: "text.secondary",
                                          }}
                                        />
                                        <Typography variant="body2">
                                          {customer.phone || "No phone"}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Business
                                          sx={{
                                            fontSize: 16,
                                            color: "text.secondary",
                                          }}
                                        />
                                        <Typography variant="body2">
                                          {customer.company || "No company"}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>

                                  <Box sx={{ flex: "1 1 300px" }}>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight="bold"
                                      gutterBottom
                                    >
                                      Quick Stats
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                      }}
                                    >
                                      <Paper
                                        sx={{
                                          p: 1,
                                          textAlign: "center",
                                          bgcolor: "background.default",
                                          flex: "1 1 140px",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                        >
                                          Last Order
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="medium"
                                        >
                                          {customer.lastOrderDate
                                            ? formatDistanceToNow(
                                                parseISO(
                                                  customer.lastOrderDate,
                                                ),
                                                { addSuffix: true },
                                              )
                                            : "Never"}
                                        </Typography>
                                      </Paper>
                                      <Paper
                                        sx={{
                                          p: 1,
                                          textAlign: "center",
                                          bgcolor: "background.default",
                                          flex: "1 1 140px",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                        >
                                          Member Since
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="medium"
                                        >
                                          {customer.createdAt
                                            ? format(
                                                parseISO(customer.createdAt),
                                                "MMM yyyy",
                                              )
                                            : "Unknown"}
                                        </Typography>
                                      </Paper>
                                    </Box>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    mt: 2,
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    onClick={() =>
                                      handleCustomerSelect(customer)
                                    }
                                  >
                                    Edit Profile
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<NoteAdd />}
                                    onClick={() =>
                                      handleCustomerSelect(customer)
                                    }
                                  >
                                    Add Note
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Call />}
                                    onClick={() =>
                                      handleCustomerSelect(customer)
                                    }
                                  >
                                    Log Call
                                  </Button>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Customer Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "80%", md: "70%", lg: "60%" },
            background: currentScheme.colors.components.card,
          },
        }}
      >
        {detailLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress sx={{ color: currentScheme.colors.primary }} />
          </Box>
        ) : selectedCustomer ? (
          <Box sx={{ p: 3, height: "100vh", overflow: "auto" }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: currentScheme.colors.primary,
                      fontSize: 32,
                    }}
                  >
                    {selectedCustomer.customer.name?.charAt(0) || "?"}
                  </Avatar>
                  <Box>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="h5" fontWeight="bold">
                        {selectedCustomer.customer.name}
                      </Typography>
                      {selectedCustomer.advancedProfile && (
                        <>
                          <Chip
                            label={
                              selectedCustomer.advancedProfile.loyaltyLevel
                            }
                            size="small"
                            sx={{
                              bgcolor: `${getLoyaltyColor(selectedCustomer.advancedProfile.loyaltyLevel)}20`,
                              color: getLoyaltyColor(
                                selectedCustomer.advancedProfile.loyaltyLevel,
                              ),
                            }}
                          />
                          <Chip
                            label={
                              selectedCustomer.advancedProfile.lifecycleStage
                            }
                            size="small"
                            sx={{
                              bgcolor: `${getLifecycleColor(selectedCustomer.advancedProfile.lifecycleStage)}20`,
                              color: getLifecycleColor(
                                selectedCustomer.advancedProfile.lifecycleStage,
                              ),
                            }}
                          />
                        </>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color={currentScheme.colors.text.secondary}
                    >
                      {selectedCustomer.customer.company || "No company"} •
                      Customer since{" "}
                      {format(
                        parseISO(selectedCustomer.customer.createdAt),
                        "MMM yyyy",
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    Edit
                  </Button>
                  <IconButton onClick={() => setDrawerOpen(false)}>
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Stats Cards - Using Flexbox */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
                "& > *": {
                  flex: "1 1 calc(20% - 16px)",
                  minWidth: "150px",
                },
              }}
            >
              {[
                {
                  label: "Total Orders",
                  value: selectedCustomer.statistics.totalOrders,
                  icon: <ShoppingCart />,
                  color: currentScheme.colors.primary,
                },
                {
                  label: "Total Spent",
                  value: formatCurrency(selectedCustomer.statistics.totalSpent),
                  icon: <AccountBalanceWallet />,
                  color: currentScheme.colors.buttons.success,
                },
                {
                  label: "Avg Order",
                  value: formatCurrency(
                    selectedCustomer.statistics.avgOrderValue,
                  ),
                  icon: <TrendingUp />,
                  color: currentScheme.colors.secondary,
                },
                {
                  label: "Customer Score",
                  value: `${selectedCustomer.advancedProfile?.customerScore || 50}%`,
                  icon: <Star />,
                  color: currentScheme.colors.buttons.warning,
                },
                {
                  label: "Last Order",
                  value: selectedCustomer.statistics.lastOrderDate
                    ? formatDistanceToNow(
                        parseISO(selectedCustomer.statistics.lastOrderDate),
                        { addSuffix: true },
                      )
                    : "Never",
                  icon: <CalendarToday />,
                  color: currentScheme.colors.text.secondary,
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  sx={{
                    background: currentScheme.colors.background,
                    border: `1px solid ${currentScheme.colors.components.border}`,
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: `${stat.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: stat.color,
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={currentScheme.colors.text.secondary}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Tabs */}
            <Box
              sx={{
                borderBottom: 1,
                borderColor: currentScheme.colors.components.border,
                mb: 2,
              }}
            >
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="Details" />
                <Tab label="Communications" />
                <Tab label="Orders" />
                <Tab label="Family" />
                <Tab label="Preferences" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {/* Contact Info */}
              <Card sx={{ mb: 3, background: currentScheme.colors.background }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: "1 1 300px" }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Email
                          sx={{
                            color: currentScheme.colors.text.secondary,
                            fontSize: 20,
                          }}
                        />
                        <Typography>
                          {selectedCustomer.customer.email || "No email"}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Phone
                          sx={{
                            color: currentScheme.colors.text.secondary,
                            fontSize: 20,
                          }}
                        />
                        <Typography>
                          {selectedCustomer.customer.phone}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocationOn
                          sx={{
                            color: currentScheme.colors.text.secondary,
                            fontSize: 20,
                          }}
                        />
                        <Typography>
                          {[
                            selectedCustomer.customer.address,
                            selectedCustomer.customer.city,
                            selectedCustomer.customer.state,
                            selectedCustomer.customer.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ") || "No address"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: "1 1 300px" }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Business
                          sx={{
                            color: currentScheme.colors.text.secondary,
                            fontSize: 20,
                          }}
                        />
                        <Typography>
                          {selectedCustomer.customer.company || "No company"}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Receipt
                          sx={{
                            color: currentScheme.colors.text.secondary,
                            fontSize: 20,
                          }}
                        />
                        <Typography>
                          GST:{" "}
                          {selectedCustomer.customer.gstin || "Not provided"}
                        </Typography>
                      </Box>
                      {selectedCustomer.advancedProfile?.occupation && (
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Work
                            sx={{
                              color: currentScheme.colors.text.secondary,
                              fontSize: 20,
                            }}
                          />
                          <Typography>
                            {selectedCustomer.advancedProfile.occupation}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Communications */}
              {selectedCustomer.communications &&
                selectedCustomer.communications.length > 0 && (
                  <Card
                    sx={{ mb: 3, background: currentScheme.colors.background }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Recent Communications
                        </Typography>
                        <Button size="small" startIcon={<Add />}>
                          Add New
                        </Button>
                      </Box>
                      <List>
                        {selectedCustomer.communications
                          .slice(0, 5)
                          .map((comm: any) => (
                            <ListItem key={comm._id} sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    bgcolor: `${getLifecycleColor("customer")}20`,
                                  }}
                                >
                                  {getCommunicationIcon(comm.type)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  comm.subject ||
                                  `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}`
                                }
                                secondary={
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color={
                                        currentScheme.colors.text.secondary
                                      }
                                    >
                                      {format(
                                        parseISO(comm.date),
                                        "MMM d, yyyy • h:mm a",
                                      )}
                                    </Typography>
                                    {comm.notes && (
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 0.5 }}
                                      >
                                        {comm.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                )}
            </TabPanel>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Typography>No customer selected</Typography>
          </Box>
        )}
      </Drawer>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
