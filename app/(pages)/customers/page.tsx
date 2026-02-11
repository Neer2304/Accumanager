'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Container,
  alpha,
  Breadcrumbs,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Menu,
  ListItemIcon,
  ListItemText,
  // Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Store as StoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button as CustomButton } from '@/components/ui/Button';
import { Chip as CustomChip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { useCustomers } from '@/hooks/useCustomers';
import { useSubscription } from '@/hooks/useSubscription';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  state: string;
  city?: string;
  pincode?: string;
  gstin?: string;
  isInterState: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { customers, isLoading, error, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { subscription, usage, isLoading: subscriptionLoading, canAddCustomer, getUsagePercentage, getRemaining } = useSubscription();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    gstin: '',
    isInterState: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const customersArray: Customer[] = Array.isArray(customers) ? customers as unknown as Customer[] : [];

  const filteredCustomers = customersArray.filter(customer => {
    if (!customer) return false;
    
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower) ||
      customer.gstin?.includes(searchTerm) ||
      customer.city?.toLowerCase().includes(searchLower) ||
      customer.state?.toLowerCase().includes(searchLower);
    
    // Type filter
    let matchesFilter = true;
    if (filterType === 'active') {
      matchesFilter = customer.totalOrders > 0;
    } else if (filterType === 'inactive') {
      matchesFilter = customer.totalOrders === 0;
    } else if (filterType === 'interState') {
      matchesFilter = customer.isInterState === true;
    } else if (filterType === 'intraState') {
      matchesFilter = customer.isInterState === false;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'orders') {
      return (b.totalOrders || 0) - (a.totalOrders || 0);
    } else if (sortBy === 'spent') {
      return (b.totalSpent || 0) - (a.totalSpent || 0);
    } else if (sortBy === 'recent') {
      const dateA = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
      const dateB = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  const handleCreateCustomer = () => {
    if (!canAddCustomer) {
      alert(`You've reached the customer limit for your ${subscription?.plan} plan. Please upgrade to add more customers.`);
      return;
    }

    if (!subscription?.isActive) {
      alert('Your subscription is not active. Please renew your subscription to add customers.');
      return;
    }

    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      address: '',
      state: '',
      city: '',
      pincode: '',
      gstin: '',
      isInterState: false,
    });
    setSelectedCustomer(null);
    setOpenDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      company: customer.company || '',
      address: customer.address || '',
      state: customer.state || '',
      city: customer.city || '',
      pincode: customer.pincode || '',
      gstin: customer.gstin || '',
      isInterState: customer.isInterState || false,
    });
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedCustomer) {
        await updateCustomer({ ...formData, id: selectedCustomer._id });
      } else {
        await addCustomer(formData);
      }
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to save customer:', err);
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    
    try {
      await deleteCustomer(customerToDelete._id);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      setSelectedCustomer(null);
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCustomer(null);
  };

  const handleViewDetails = (customerId: string) => {
    router.push(`/customers/${customerId}`);
    handleMenuClose();
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const customerUsage = usage?.customers || 0;
  const customerLimit = subscription?.limits?.customers || 0;
  const customerUsagePercent = getUsagePercentage('customers');
  const remainingCustomers = getRemaining('customers');

  const getAvatarColor = (name: string) => {
    const colors = [
      '#4285f4', '#34a853', '#ea4335', '#fbbc04', '#8ab4f8',
      '#81c995', '#f28b82', '#fdd663', '#5f6368', '#9aa0a6',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isMounted || isLoading || subscriptionLoading) {
    return (
      <MainLayout title="Customers">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading customers...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Customers">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header - Original Style Restored */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Customers
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Customer Management
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Manage your customer database, contacts, and business relationships
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label={`${customersArray.length} Total Customers`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <Chip
              label={`${customerUsage}/${customerLimit} Used`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
            {subscription?.status === 'trial' && (
              <Chip
                label={`Trial: ${subscription.daysRemaining} days left`}
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                  borderColor: alpha('#fbbc04', 0.3),
                  color: darkMode ? '#fdd663' : '#fbbc04',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              title="Error Loading Customers"
              message={typeof error === 'string' ? error : 'An error occurred'}
              dismissible
              onDismiss={() => {}}
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            />
          )}

          {/* Subscription Alerts */}
          <Box sx={{ mb: 3 }}>
            {!subscription?.isActive && (
              <Alert
                severity="error"
                title="Subscription Inactive"
                message="Your subscription has expired. Please renew to manage customers."
                dismissible={false}
                action={
                  <Button
                    variant="text"
                    href="/pricing"
                    sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}
                  >
                    Upgrade Now
                  </Button>
                }
                sx={{ 
                  mb: 2,
                  backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                  borderColor: alpha('#ea4335', 0.3),
                }}
              />
            )}

            {!canAddCustomer && subscription?.isActive && (
              <Alert
                severity="warning"
                title="Customer Limit Reached"
                message={`You've reached the limit of ${customerLimit} customers. Upgrade to add more.`}
                dismissible={false}
                action={
                  <Button
                    variant="text"
                    href="/pricing"
                    sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}
                  >
                    Upgrade Plan
                  </Button>
                }
                sx={{ 
                  mb: 2,
                  backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                  borderColor: alpha('#fbbc04', 0.3),
                }}
              />
            )}
          </Box>

          {/* Header Controls */}
          <Card
            title="Customer Management"
            subtitle={`${customersArray.length} customers • ${filteredCustomers.length} filtered`}
            action={
              <Button
                variant="contained"
                onClick={handleCreateCustomer}
                startIcon={<AddIcon />}
                size="medium"
                disabled={!canAddCustomer || !subscription?.isActive}
                sx={{ 
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' }
                }}
              >
                Add Customer
              </Button>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 2,
            }}>
              <TextField
                fullWidth
                placeholder="Search customers by name, phone, email, company, GSTIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm("")}>
                        <CloseIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </IconButton>
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
                sx={{ flex: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
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
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filterType}
                    label="Filter"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">All Customers</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="interState">Inter-State</MenuItem>
                    <MenuItem value="intraState">Intra-State</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  size="small"
                  sx={{
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
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
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="orders">Orders Count</MenuItem>
                    <MenuItem value="spent">Total Spent</MenuItem>
                    <MenuItem value="recent">Recent Order</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Active filters display */}
            {(searchTerm || filterType !== 'all' || sortBy !== 'name') && (
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    size="small"
                    onDelete={() => setSearchTerm("")}
                    icon={<SearchIcon sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                    }}
                  />
                )}
                {filterType !== 'all' && (
                  <Chip
                    label={`Filter: ${filterType}`}
                    size="small"
                    onDelete={() => setFilterType('all')}
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                    }}
                  />
                )}
                {sortBy !== 'name' && (
                  <Chip
                    label={`Sort: ${sortBy}`}
                    size="small"
                    onDelete={() => setSortBy('name')}
                    sx={{
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                    }}
                  />
                )}
              </Box>
            )}
          </Card>

          {/* Stats Overview */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Total Customers', 
                value: customersArray.length, 
                icon: <PersonIcon />, 
                color: '#4285f4',
                description: 'All customers in system' 
              },
              { 
                title: 'Active Customers', 
                value: customersArray.filter(c => c.totalOrders > 0).length, 
                icon: <StarIcon />, 
                color: '#34a853',
                description: 'Made purchases' 
              },
              { 
                title: 'Total Revenue', 
                value: `₹${customersArray.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString('en-IN')}`, 
                icon: <TrendingUpIcon />, 
                color: '#fbbc04',
                description: 'From all customers' 
              },
              { 
                title: 'Inter-State', 
                value: customersArray.filter(c => c.isInterState).length, 
                icon: <LocationIcon />, 
                color: '#ea4335',
                description: 'Cross-state customers' 
              },
              { 
                title: 'Avg. Orders', 
                value: customersArray.length > 0 
                  ? (customersArray.reduce((sum, c) => sum + (c.totalOrders || 0), 0) / customersArray.length).toFixed(1)
                  : '0.0', 
                icon: <CalendarIcon />, 
                color: '#8ab4f8',
                description: 'Per customer' 
              },
              { 
                title: 'Usage', 
                value: `${customerUsagePercent}%`, 
                icon: <BusinessIcon />, 
                color: '#81c995',
                description: `${remainingCustomers} remaining` 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(33.333% - 16px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  borderRadius: '16px', 
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  background: darkMode 
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 }, 
                      borderRadius: '10px', 
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {React.cloneElement(stat.icon, { 
                        sx: { 
                          fontSize: { xs: 20, sm: 24, md: 28 }, 
                          color: stat.color,
                        } 
                      })}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                    }}
                  >
                    {stat.description}
                  </Typography>
                  
                  {stat.title === 'Usage' && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                          }}
                        >
                          Usage Progress
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: stat.color,
                            fontWeight: 500,
                            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                          }}
                        >
                          {customerUsage}/{customerLimit}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        position: 'relative', 
                        height: 6, 
                        backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${customerUsagePercent}%`,
                            backgroundColor: stat.color,
                            borderRadius: 3,
                          }} 
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Card>
            ))}
          </Box>

          {/* Customer List Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="h6"
              fontWeight={500}
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              Customer Directory
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
            >
              {sortedCustomers.length} customers
            </Typography>
          </Stack>

          {/* Customer List */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
            }}>
              {sortedCustomers.length === 0 ? (
                <Box sx={{ 
                  py: 6,
                  textAlign: 'center',
                }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      margin: '0 auto 16px',
                      backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    fontWeight={500}
                    gutterBottom
                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  >
                    {searchTerm || filterType !== 'all' ? 'No Customers Found' : 'No Customers Yet'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}
                  >
                    {searchTerm || filterType !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Add your first customer to get started'}
                  </Typography>
                  {!searchTerm && filterType === 'all' && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateCustomer}
                      disabled={!canAddCustomer || !subscription?.isActive}
                      sx={{
                        borderRadius: '28px',
                        px: 3,
                        py: 1,
                        backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        color: darkMode ? '#202124' : '#ffffff',
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                        },
                      }}
                    >
                      Add First Customer
                    </Button>
                  )}
                </Box>
              ) : (
                sortedCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
                  <Box
                    key={customer._id}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      transition: 'all 0.3s ease',
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                      '@keyframes fadeInUp': {
                        from: {
                          opacity: 0,
                          transform: 'translateY(20px)',
                        },
                        to: {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: darkMode 
                          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                          : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: getAvatarColor(customer.name),
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#ffffff',
                        }}
                      >
                        {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography 
                              variant="subtitle1" 
                              fontWeight={600} 
                              sx={{ 
                                color: darkMode ? '#e8eaed' : '#202124',
                                cursor: 'pointer',
                                '&:hover': {
                                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                                  textDecoration: 'underline',
                                },
                              }}
                              onClick={() => handleViewDetails(customer._id)}
                            >
                              {customer.name || 'N/A'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                  {customer.phone || 'N/A'}
                                </Typography>
                              </Box>
                              {customer.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    {customer.email}
                                  </Typography>
                                </Box>
                              )}
                              {customer.company && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <BusinessIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    {customer.company}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={customer.isInterState ? 'Inter-State' : 'Intra-State'}
                              size="small"
                              sx={{
                                backgroundColor: customer.isInterState 
                                  ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'
                                  : darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                                color: customer.isInterState 
                                  ? darkMode ? '#fdd663' : '#fbbc04'
                                  : darkMode ? '#81c995' : '#34a853',
                                border: 'none',
                                fontWeight: 500,
                              }}
                            />
                            <Tooltip title="More actions">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, customer)}
                                sx={{
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                  '&:hover': {
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                                  },
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                          gap: 1.5,
                          mt: 1.5,
                        }}>
                          <Box sx={{ 
                            p: 1.5,
                            borderRadius: '8px',
                            backgroundColor: darkMode ? '#303134' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                              Location
                            </Typography>
                            <Typography variant="body2" fontWeight={500} noWrap sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {customer.city || customer.state || 'Not specified'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            p: 1.5,
                            borderRadius: '8px',
                            backgroundColor: darkMode ? '#303134' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                              Orders
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {customer.totalOrders || 0} orders
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            p: 1.5,
                            borderRadius: '8px',
                            backgroundColor: darkMode ? '#303134' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                              Total Spent
                            </Typography>
                            <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                              {formatCurrency(customer.totalSpent || 0)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {customer.gstin && (
                          <Box sx={{ 
                            mt: 1.5,
                            p: 1,
                            borderRadius: '6px',
                            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.08)',
                            border: `1px solid ${alpha('#4285f4', 0.2)}`,
                            display: 'inline-block',
                          }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8', fontWeight: 500 }}>
                              GST: {customer.gstin}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
            
            {/* Pagination */}
            {sortedCustomers.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    size="small"
                    sx={{
                      borderRadius: '20px',
                      px: 2.5,
                      py: 0.75,
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  >
                    Previous
                  </Button>
                  
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', px: 2 }}>
                    Page {page + 1} of {Math.ceil(sortedCustomers.length / rowsPerPage)}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    onClick={() => setPage(prev => Math.min(Math.ceil(sortedCustomers.length / rowsPerPage) - 1, prev + 1))}
                    disabled={page >= Math.ceil(sortedCustomers.length / rowsPerPage) - 1}
                    size="small"
                    sx={{
                      borderRadius: '20px',
                      px: 2.5,
                      py: 0.75,
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>

        {/* Customer Menu - Google Material Design Style - FIXED */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode
                ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                : '0 8px 16px rgba(0, 0, 0, 0.08)',
              mt: 1,
              minWidth: 180,
            },
          }}
        >
          {/* FIXED: Removed Fragment, using direct MenuItems */}
          <MenuItem
            onClick={() => {
              if (selectedCustomer) {
                handleViewDetails(selectedCustomer._id);
              }
            }}
            sx={{
              py: 1.5,
              px: 2.5,
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500}>View Details</Typography>
            </ListItemText>
          </MenuItem>
          
          <MenuItem
            onClick={() => {
              if (selectedCustomer) {
                handleEditCustomer(selectedCustomer);
                handleMenuClose();
              }
            }}
            sx={{
              py: 1.5,
              px: 2.5,
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Edit</Typography>
            </ListItemText>
          </MenuItem>
          
          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
          
          <MenuItem
            onClick={() => {
              if (selectedCustomer) {
                handleDeleteClick(selectedCustomer);
              }
            }}
            sx={{
              py: 1.5,
              px: 2.5,
              color: darkMode ? '#f28b82' : '#ea4335',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: darkMode ? '#f28b82' : '#ea4335' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Delete</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog - Google Material Design Style */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <DialogTitle
            sx={{
              p: 3,
              pb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 500,
              color: darkMode ? '#f28b82' : '#ea4335',
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            Delete Customer
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {customerToDelete && (
              <Stack spacing={2}>
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
                    border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'}`,
                    color: darkMode ? '#fdd663' : '#b45a1c',
                  }}
                >
                  Are you sure you want to delete this customer?
                </Alert>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Typography variant="body1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                    {customerToDelete.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 0.5 }}>
                    Phone: {customerToDelete.phone}
                  </Typography>
                  {customerToDelete.totalOrders > 0 && (
                    <Typography variant="body2" sx={{ color: darkMode ? '#f28b82' : '#ea4335', mt: 1 }}>
                      ⚠️ This customer has {customerToDelete.totalOrders} order(s). Deleting will remove all associated data.
                    </Typography>
                  )}
                </Paper>
              </Stack>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              p: 3,
              pt: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                backgroundColor: darkMode ? '#f28b82' : '#ea4335',
                color: darkMode ? '#202124' : '#ffffff',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: darkMode ? '#f28b82' : '#d32f2f',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}