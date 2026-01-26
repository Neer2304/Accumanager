"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Stack,
  LinearProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Container,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add,
  MoreVert,
  Edit,
  Delete,
  Search,
  Phone,
  Email,
  LocationOn,
  Business,
  AttachMoney,
  Receipt,
  Upgrade,
  Warning,
  Person,
  ArrowBack,
  FilterList,
  Sort,
  Menu as MenuIcon,
  Info,
  Star,
  TrendingUp,
  CalendarToday,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useCustomers } from '@/hooks/useCustomers';
import { useSubscription } from '@/hooks/useSubscription';

// Define the Customer interface locally to avoid conflicts
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
  const [isMounted, setIsMounted] = useState(false);
  const { customers, isLoading, error, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { subscription, usage, isLoading: subscriptionLoading, canAddCustomer, getUsagePercentage, getRemaining } = useSubscription();
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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

  // Fix the type error by casting the customers to our local Customer type
  const customersArray: Customer[] = Array.isArray(customers) ? customers as unknown as Customer[] : [];

  // Filter customers based on search
  const filteredCustomers = customersArray.filter(customer => {
    if (!customer) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower) ||
      customer.gstin?.includes(searchTerm)
    );
  });

  const handleCreateCustomer = () => {
    // Check subscription limits
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

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    try {
      await deleteCustomer(selectedCustomer._id);
      setMenuAnchor(null);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBack = () => {
    window.history.back();
  };

  // Pagination
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Subscription info
  const customerUsage = usage?.customers || 0;
  const customerLimit = subscription?.limits?.customers || 0;
  const customerUsagePercent = getUsagePercentage('customers');
  const remainingCustomers = getRemaining('customers');

  // Get avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!isMounted || isLoading || subscriptionLoading) {
    return (
      <MainLayout title="Customers">
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 400 
          }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  // Mobile Navigation Drawer
  const MobileFilters = () => (
    <Drawer
      anchor="right"
      open={showMobileFilters}
      onClose={() => setShowMobileFilters(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 320,
          p: 2,
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          Filters & Stats
        </Typography>
      </Box>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="subtitle2" color="text.secondary">
                Total Customers
              </Typography>
            }
            secondary={
              <Typography variant="h5" fontWeight="bold" color="primary">
                {customersArray.length}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="subtitle2" color="text.secondary">
                Active Customers
              </Typography>
            }
            secondary={
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {customersArray.filter((c: Customer) => c.totalOrders > 0).length}
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="subtitle2" color="text.secondary">
                Customer Usage
              </Typography>
            }
            secondary={
              <Box>
                <Typography variant="body2">
                  {customerUsage} / {customerLimit}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={customerUsagePercent} 
                  sx={{ mt: 1 }}
                />
              </Box>
            }
          />
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <MainLayout title="Customers">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header - Same style as other pages */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Dashboard
          </Button>

          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Customers</Typography>
          </Breadcrumbs>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Customers
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your customer database and contacts
              </Typography>
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {subscription?.status === 'trial' && (
                <Chip 
                  label={`Trial: ${subscription.daysRemaining} days left`} 
                  size="small" 
                  color="warning" 
                  variant="outlined"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              )}
              {/* {!isOnline && (
                <Chip 
                  label="Offline Mode" 
                  size="small" 
                  color="warning" 
                  variant="outlined"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              )} */}
            </Stack>
          </Box>
        </Box>

        {/* Mobile Filters Drawer */}
        <MobileFilters />

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 3,
          width: { xs: '100%', sm: 'auto' },
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          {isMobile && (
            <IconButton
              onClick={() => setShowMobileFilters(true)}
              size="small"
              sx={{ 
                border: 1,
                borderColor: 'divider'
              }}
            >
              <FilterList />
            </IconButton>
          )}
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateCustomer}
            size={isMobile ? "medium" : "large"}
            disabled={!canAddCustomer || !subscription?.isActive}
            fullWidth={isMobile}
            sx={{ 
              minHeight: isMobile ? 44 : 48,
              whiteSpace: 'nowrap',
              flex: { xs: 1, sm: 'none' }
            }}
          >
            {isMobile ? 'Add' : 'Add Customer'}
          </Button>
        </Box>

        {/* Subscription Alerts */}
        <Box sx={{ mb: 3 }}>
          {!subscription?.isActive && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" href="/pricing">
                  {isMobile ? 'Upgrade' : 'Upgrade Now'}
                </Button>
              }
            >
              Your subscription has expired. Please renew to manage customers.
            </Alert>
          )}

          {!canAddCustomer && subscription?.isActive && (
            <Alert 
              severity="warning" 
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" href="/pricing">
                  {isMobile ? 'Upgrade' : 'Upgrade Plan'}
                </Button>
              }
            >
              Customer limit reached ({customerLimit} customers). Upgrade to add more.
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {typeof error === 'string' ? error : 'An error occurred'}
            </Alert>
          )}
        </Box>

        {/* Usage Indicator - Desktop */}
        {!isMobile && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Customer Usage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customerUsage} of {customerLimit} customers used
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200, flex: 1, maxWidth: 300 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={customerUsagePercent} 
                    color={customerUsagePercent > 90 ? 'error' : customerUsagePercent > 75 ? 'warning' : 'primary'}
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      mb: 1
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      {remainingCustomers} remaining
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {customerUsagePercent}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '200px' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                {customersArray.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Customers
              </Typography>
            </Paper>
            
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '200px' },
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                {customersArray.filter((c: Customer) => c.totalOrders > 0).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Active Customers
              </Typography>
            </Paper>
            
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '200px' },
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                ₹{customersArray.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Revenue
              </Typography>
            </Paper>
            
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              flex: 1,
              minWidth: { xs: '100%', sm: '200px' },
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                {customersArray.filter((c: Customer) => c.isInterState).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Inter-State
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Search Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search customers by name, phone, email, company, or GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { 
                  height: isMobile ? 48 : 56,
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }
              }}
              variant="outlined"
            />
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card sx={{ 
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isMobile ? 'none' : theme.shadows[1],
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: { xs: 1.5, sm: 2 },
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" fontWeight="bold">
                Customers ({filteredCustomers.length})
              </Typography>
              {isMobile && (
                <IconButton size="small">
                  <Sort />
                </IconButton>
              )}
            </Box>

            <TableContainer sx={{ 
              maxHeight: isMobile ? 500 : 600,
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.grey[100],
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.grey[400],
                borderRadius: '4px',
                '&:hover': {
                  background: theme.palette.grey[500],
                },
              },
            }}>
              <Table 
                stickyHeader
                sx={{ 
                  minWidth: isMobile ? 800 : 'auto',
                  '& .MuiTableCell-head': {
                    fontWeight: 'bold',
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    fontSize: isMobile ? '0.85rem' : '0.875rem',
                    py: isMobile ? 1 : 1.5,
                  },
                  '& .MuiTableCell-body': {
                    py: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? '0.85rem' : '0.875rem',
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    {!isMobile && <TableCell>Contact</TableCell>}
                    <TableCell>Business</TableCell>
                    {isDesktop && <TableCell>Location</TableCell>}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 3 : 5} align="center" sx={{ py: 6 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            {searchTerm ? 'No customers found' : 'No customers yet'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm ? 'Try different search terms' : 'Add your first customer to get started'}
                          </Typography>
                          {!searchTerm && (
                            <Button
                              variant="contained"
                              startIcon={<Add />}
                              onClick={handleCreateCustomer}
                              disabled={!canAddCustomer || !subscription?.isActive}
                              sx={{ mt: 2 }}
                              size={isMobile ? "small" : "medium"}
                            >
                              Add First Customer
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCustomers.map((customer) => (
                      <TableRow 
                        key={customer._id} 
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: isMobile ? 32 : 40,
                                height: isMobile ? 32 : 40,
                                bgcolor: getAvatarColor(customer.name),
                                fontSize: isMobile ? '0.9rem' : '1rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant={isMobile ? "body2" : "subtitle2"} fontWeight="bold" noWrap>
                                {customer.name || 'N/A'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <Phone sx={{ fontSize: 12, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {customer.phone || 'N/A'}
                                </Typography>
                              </Box>
                              {isMobile && customer.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email sx={{ fontSize: 12, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary" noWrap>
                                    {customer.email}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        
                        {!isMobile && (
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="body2">{customer.phone || 'N/A'}</Typography>
                              </Box>
                              {customer.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {customer.email}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        )}
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {customer.company && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Business sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant={isMobile ? "caption" : "body2"} noWrap>
                                  {customer.company}
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={customer.isInterState ? 'Inter-State' : 'Intra-State'}
                                color={customer.isInterState ? 'primary' : 'default'}
                                size="small"
                                sx={{ height: 20 }}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Receipt sx={{ fontSize: 12, color: 'text.secondary' }} />
                                <Typography variant="caption">
                                  {customer.totalOrders || 0} orders
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        {isDesktop && (
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {customer.city || customer.state || 'N/A'}
                                </Typography>
                              </Box>
                              {customer.gstin && (
                                <Typography variant="caption" color="text.secondary">
                                  GST: {customer.gstin}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                        )}
                        
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, customer)}
                            sx={{ 
                              border: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              }
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCustomers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  minHeight: isMobile ? 52 : 64,
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Customer Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ 
            p: { xs: 2, sm: 3 },
            borderBottom: `1px solid ${theme.palette.divider}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
              </Typography>
              {isMobile && (
                <IconButton onClick={() => setOpenDialog(false)} size="small">
                  <ArrowBack />
                </IconButton>
              )}
            </Box>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    size={isMobile ? "small" : "medium"}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    size={isMobile ? "small" : "medium"}
                  />
                </Stack>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                  />
                  <TextField
                    fullWidth
                    label="Company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                  />
                </Stack>
                
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  size={isMobile ? "small" : "medium"}
                />
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                  />
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    size={isMobile ? "small" : "medium"}
                  />
                </Stack>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="PIN Code"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                  />
                  <TextField
                    fullWidth
                    label="GSTIN"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    size={isMobile ? "small" : "medium"}
                  />
                </Stack>
                
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={formData.isInterState ? 'interstate' : 'intrastate'}
                    label="Transaction Type"
                    onChange={(e) => setFormData({ ...formData, isInterState: e.target.value === 'interstate' })}
                  >
                    <MenuItem value="intrastate">Intra-State (CGST + SGST)</MenuItem>
                    <MenuItem value="interstate">Inter-State (IGST)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ 
              p: { xs: 2, sm: 3 },
              borderTop: `1px solid ${theme.palette.divider}`
            }}>
              {!isMobile && (
                <Button onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
              >
                {selectedCustomer ? 'Update Customer' : 'Add Customer'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem 
            onClick={() => { 
              if (selectedCustomer) {
                handleEditCustomer(selectedCustomer); 
                handleMenuClose(); 
              }
            }}
          >
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit Customer
          </MenuItem>
          <MenuItem 
            onClick={handleDeleteCustomer} 
            sx={{ color: 'error.main' }}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete Customer
          </MenuItem>
        </Menu>
      </Container>
    </MainLayout>
  );
}