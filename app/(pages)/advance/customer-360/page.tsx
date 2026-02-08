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
  Divider,
  alpha,
  useMediaQuery,
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
  Home,
  ExpandMore,
  ExpandLess,
  NoteAdd,
  WorkspacePremium,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { useAdvanceThemeContext } from "@/contexts/AdvanceThemeContexts";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Single color theme - using Google Blue
const primaryColor = '#4285F4';
const secondaryColor = '#EA4335'; // For accents only

const googleColors = {
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
};

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

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Customer360Page() {
  const { mode } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");
  const [tabValue, setTabValue] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState<AdvancedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof AdvancedCustomer>("customerScore");
  const [selected, setSelected] = useState<string[]>([]);
  const [initializing, setInitializing] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light;

  // Update rows per page on mobile
  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/advance/customer-360");
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data.customers);
        setTotalCustomers(data.data.pagination.total);
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
        setSuccess(`✅ Created ${data.data.created} advanced customer profiles!`);
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
      const data = await response.json();

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
  const sortedCustomers = [...customers].sort((a, b) => {
    if (order === "desc") {
      return (b[orderBy] as any) < (a[orderBy] as any) ? -1 : 1;
    }
    return (a[orderBy] as any) < (b[orderBy] as any) ? -1 : 1;
  });

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
        sx={{
          backgroundColor: currentColors.background,
          transition: 'background-color 0.3s ease'
        }}
      >
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundColor: currentColors.background,
      minHeight: '100vh',
      color: currentColors.textPrimary,
      transition: 'background-color 0.3s ease',
      p: isMobile ? 1 : 2,
    }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Breadcrumbs sx={{ 
          mb: 1, 
          color: currentColors.textSecondary,
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          <Box
            component={Link}
            href="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: currentColors.textSecondary,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              "&:hover": { color: primaryColor },
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: isMobile ? 16 : 20 }} />
            Dashboard
          </Box>
          <Typography color={currentColors.textPrimary} fontSize={isMobile ? '0.75rem' : '0.875rem'}>
            Customer 360°
          </Typography>
        </Breadcrumbs>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
        >
          <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
            <Box
              sx={{
                width: isMobile ? 48 : 60,
                height: isMobile ? 48 : 60,
                borderRadius: isMobile ? 2 : 3,
                background: primaryColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: '0 2px 8px rgba(66,133,244,0.4)',
              }}
            >
              <Person sx={{ 
                fontSize: isMobile ? 24 : 32, 
                color: "white" 
              }} />
            </Box>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold"
                fontSize={isMobile ? '1.25rem' : '1.5rem'}
              >
                👥 Customer 360°
              </Typography>
              <Typography
                variant="body2"
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Complete customer profiles
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: "flex", 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchCustomers}
              disabled={loading}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: currentColors.textPrimary,
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                px: isMobile ? 1 : 2,
                minWidth: 'auto',
                '&:hover': {
                  borderColor: primaryColor,
                  backgroundColor: alpha(primaryColor, 0.04),
                }
              }}
            >
              {isMobile ? '' : 'Refresh'}
            </Button>

            {customers.length === 0 && (
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={initializeProfiles}
                disabled={initializing}
                sx={{
                  background: primaryColor,
                  color: 'white',
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  px: isMobile ? 1 : 2,
                  minWidth: 'auto',
                  boxShadow: '0 1px 2px rgba(66,133,244,0.3)',
                  '&:hover': {
                    background: '#3367D6',
                    boxShadow: '0 2px 4px rgba(66,133,244,0.3)',
                  },
                }}
              >
                {initializing ? (isMobile ? '...' : 'Initializing...') : (isMobile ? 'Init' : 'Initialize')}
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: primaryColor,
                color: 'white',
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                px: isMobile ? 1 : 2,
                minWidth: 'auto',
                boxShadow: '0 1px 2px rgba(66,133,244,0.3)',
                '&:hover': {
                  background: '#3367D6',
                  boxShadow: '0 2px 4px rgba(66,133,244,0.3)',
                },
              }}
            >
              {isMobile ? 'Add' : 'Add Customer'}
            </Button>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ 
          mb: 2, 
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: isMobile ? 1 : 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                fullWidth
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ 
                        color: currentColors.textSecondary,
                        fontSize: isMobile ? 18 : 20
                      }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                  }
                }}
                sx={{
                  background: currentColors.surface,
                  minWidth: isMobile ? '100%' : '300px',
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: currentColors.textPrimary,
                    '& fieldset': {
                      borderColor: currentColors.border,
                    },
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />

              <FormControl sx={{ 
                minWidth: isMobile ? '120px' : '150px' 
              }} size={isMobile ? "small" : "medium"}>
                <InputLabel sx={{ 
                  color: currentColors.textSecondary,
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  '&.Mui-focused': {
                    color: primaryColor,
                  }
                }}>
                  Filter
                </InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Filter"
                  sx={{
                    background: currentColors.surface,
                    color: currentColors.textPrimary,
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: currentColors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: primaryColor,
                    },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="lead">Lead</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>

              {!isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{
                    border: `1px solid ${currentColors.border}`,
                    color: currentColors.textPrimary,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                      borderColor: primaryColor,
                      backgroundColor: alpha(primaryColor, 0.04),
                    }
                  }}
                >
                  More Filters
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Stats Overview - Using Flexbox */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Card sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold"
                    fontSize={isMobile ? '1.25rem' : '1.5rem'}
                  >
                    {customers.length}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={currentColors.textSecondary}
                    fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  >
                    Total Customers
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    bgcolor: alpha(primaryColor, 0.1),
                    color: primaryColor,
                  }}
                >
                  <Person fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold"
                    fontSize={isMobile ? '1.25rem' : '1.5rem'}
                  >
                    {customers.filter(
                      (c) =>
                        c.loyaltyLevel === "gold" ||
                        c.loyaltyLevel === "platinum" ||
                        c.loyaltyLevel === "diamond",
                    ).length}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={currentColors.textSecondary}
                    fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  >
                    Loyal Customers
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    bgcolor: alpha(primaryColor, 0.1),
                    color: primaryColor,
                  }}
                >
                  <Star fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold"
                    fontSize={isMobile ? '1.25rem' : '1.5rem'}
                  >
                    ₹
                    {customers
                      .reduce((sum, c) => sum + (c.totalSpent || 0), 0)
                      .toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                        notation: 'compact'
                      })}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={currentColors.textSecondary}
                    fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  >
                    Total Revenue
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    bgcolor: alpha(primaryColor, 0.1),
                    color: primaryColor,
                  }}
                >
                  <AttachMoney fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold"
                    fontSize={isMobile ? '1.25rem' : '1.5rem'}
                  >
                    {customers.filter((c) => c.lifecycleStage === "vip").length}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={currentColors.textSecondary}
                    fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  >
                    VIP Customers
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    bgcolor: alpha(primaryColor, 0.1),
                    color: primaryColor,
                  }}
                >
                  <WorkspacePremium fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Customers Table */}
        <Card sx={{ 
          background: currentColors.card, 
          mb: 2,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          overflow: 'auto',
        }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: isMobile ? 1.5 : 2,
              borderBottom: `1px solid ${currentColors.border}`,
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight="bold"
              fontSize={isMobile ? '1rem' : '1.125rem'}
            >
              Customers ({totalCustomers})
            </Typography>

            {selected.length > 0 && !isMobile && (
              <Box display="flex" gap={1}>
                <Typography 
                  variant="body2" 
                  color={currentColors.textSecondary}
                  fontSize="0.875rem"
                >
                  {selected.length} selected
                </Typography>
                <Button 
                  size="small" 
                  sx={{ fontSize: '0.75rem', px: 1 }}
                >
                  Bulk Actions
                </Button>
              </Box>
            )}
          </Box>

          <TableContainer sx={{ maxHeight: isMobile ? 400 : 500 }}>
            <Table size={isMobile ? "small" : "medium"} stickyHeader>
              <TableHead>
                <TableRow>
                  {!isMobile && (
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
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newSelected = customers.map((n) => n._id);
                            setSelected(newSelected);
                          } else {
                            setSelected([]);
                          }
                        }}
                      />
                    </TableCell>
                  )}
                  
                  <TableCell sx={{ 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: 600
                  }}>
                    Customer
                  </TableCell>
                  
                  {!isMobile && (
                    <TableCell sx={{ 
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      fontWeight: 600
                    }}>
                      Contact
                    </TableCell>
                  )}
                  
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    Spent
                  </TableCell>
                  
                  {!isMobile && (
                    <TableCell sx={{ 
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      fontWeight: 600
                    }}>
                      Score
                    </TableCell>
                  )}
                  
                  <TableCell sx={{ 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: 600
                  }}>
                    Status
                  </TableCell>
                  
                  <TableCell sx={{ 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: 600
                  }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={isMobile ? 4 : 7} 
                      align="center" 
                      sx={{ 
                        py: 4,
                        fontSize: isMobile ? '0.875rem' : '1rem'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={isMobile ? 24 : 32} />
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <Person
                            sx={{
                              fontSize: isMobile ? 32 : 48,
                              color: currentColors.textSecondary,
                              mb: 1,
                              opacity: 0.5,
                            }}
                          />
                          <Typography
                            variant={isMobile ? "body1" : "h6"}
                            color={currentColors.textSecondary}
                            gutterBottom
                          >
                            No customers found
                          </Typography>
                          <Typography
                            variant="body2"
                            color={currentColors.textSecondary}
                            sx={{ mb: 2 }}
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
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              background: primaryColor,
                              color: 'white',
                              borderRadius: '6px',
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                            }}
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
                    const isItemSelected = selected.indexOf(customer._id) !== -1;
                    const isExpanded = expandedRow === customer._id;

                    return (
                      <React.Fragment key={customer._id}>
                        <TableRow 
                          hover 
                          selected={isItemSelected}
                          sx={{
                            '&:hover': {
                              backgroundColor: currentColors.hover,
                            }
                          }}
                        >
                          {!isMobile && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  const selectedIndex = selected.indexOf(customer._id);
                                  let newSelected: string[] = [];

                                  if (selectedIndex === -1) {
                                    newSelected = newSelected.concat(selected, customer._id);
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
                                }}
                                size={isMobile ? "small" : "medium"}
                              />
                            </TableCell>
                          )}
                          
                          <TableCell
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : customer._id)
                            }
                            sx={{ 
                              cursor: "pointer",
                              fontSize: isMobile ? '0.75rem' : '0.875rem'
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: isMobile ? 28 : 32,
                                  height: isMobile ? 28 : 32,
                                  bgcolor: primaryColor,
                                  fontSize: isMobile ? 12 : 14,
                                }}
                              >
                                {customer.name?.charAt(0) || "C"}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant={isMobile ? "caption" : "body2"}
                                  fontWeight="medium"
                                  sx={{
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    lineHeight: 1.2
                                  }}
                                >
                                  {customer.name || "Unnamed"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color={currentColors.textSecondary}
                                  sx={{
                                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                                    display: 'block'
                                  }}
                                >
                                  {customer.company || "No company"}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          {!isMobile && (
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                }}
                              >
                                {customer.email && (
                                  <Typography 
                                    variant="body2"
                                    sx={{ fontSize: '0.875rem' }}
                                  >
                                    {customer.email}
                                  </Typography>
                                )}
                                <Typography 
                                  variant="body2" 
                                  color={currentColors.textSecondary}
                                  sx={{ fontSize: '0.875rem' }}
                                >
                                  {customer.phone || "No phone"}
                                </Typography>
                              </Box>
                            </TableCell>
                          )}
                          
                          <TableCell 
                            align="right"
                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                          >
                            <Typography 
                              variant={isMobile ? "caption" : "body2"} 
                              fontWeight="medium"
                            >
                              {formatCurrency(customer.totalSpent || 0)}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color={currentColors.textSecondary}
                              sx={{ display: 'block' }}
                            >
                              {customer.totalOrders || 0} orders
                            </Typography>
                          </TableCell>
                          
                          {!isMobile && (
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
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
                                    backgroundColor: currentColors.chipBackground,
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: primaryColor,
                                      borderRadius: 3,
                                    }
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  sx={{ 
                                    minWidth: 40,
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {customer.customerScore || 0}%
                                </Typography>
                              </Box>
                            </TableCell>
                          )}
                          
                          <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                            <Chip
                              label={customer.lifecycleStage || "Customer"}
                              size={isMobile ? "small" : "medium"}
                              sx={{
                                bgcolor: alpha(primaryColor, 0.1),
                                color: primaryColor,
                                fontWeight: "medium",
                                textTransform: "capitalize",
                                border: `1px solid ${alpha(primaryColor, 0.3)}`,
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                height: isMobile ? 24 : 32,
                              }}
                            />
                          </TableCell>
                          
                          <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size={isMobile ? "small" : "medium"}
                                  onClick={() => handleCustomerSelect(customer)}
                                  sx={{
                                    color: primaryColor,
                                    "&:hover": {
                                      bgcolor: alpha(primaryColor, 0.1),
                                    },
                                    padding: isMobile ? '4px' : '8px',
                                  }}
                                >
                                  <Visibility fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                              </Tooltip>

                              {!isMobile && (
                                <Tooltip title="More Actions">
                                  <IconButton 
                                    size="small" 
                                    sx={{ 
                                      color: currentColors.textSecondary,
                                      padding: '8px'
                                    }}
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              }
            }}
          />
        </Card>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ 
          vertical: isMobile ? "top" : "bottom", 
          horizontal: "center" 
        }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ 
            width: '100%',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ 
          vertical: isMobile ? "top" : "bottom", 
          horizontal: "center" 
        }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ 
            width: '100%',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}