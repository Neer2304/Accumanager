"use client";

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
  LinearProgress,
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
  Person,
  ArrowForward,
  FilterList,
  Star,
  TrendingUp,
  CalendarToday,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        {/* Header */}
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
                iconLeft={<Add />}
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
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                size="small"
                sx={{ flex: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="medium"
                  iconLeft={<FilterList />}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Filter
                </Button>
              </Box>
            </Box>
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
                icon: <Person />, 
                color: '#4285f4',
                description: 'All customers in system' 
              },
              { 
                title: 'Active Customers', 
                value: customersArray.filter(c => c.totalOrders > 0).length, 
                icon: <Star />, 
                color: '#34a853',
                description: 'Made purchases' 
              },
              { 
                title: 'Total Revenue', 
                value: `₹${customersArray.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString('en-IN')}`, 
                icon: <TrendingUp />, 
                color: '#fbbc04',
                description: 'From all customers' 
              },
              { 
                title: 'Inter-State', 
                value: customersArray.filter(c => c.isInterState).length, 
                icon: <LocationOn />, 
                color: '#ea4335',
                description: 'Cross-state customers' 
              },
              { 
                title: 'Avg. Orders', 
                value: customersArray.length > 0 
                  ? (customersArray.reduce((sum, c) => sum + (c.totalOrders || 0), 0) / customersArray.length).toFixed(1)
                  : '0.0', 
                icon: <CalendarToday />, 
                color: '#8ab4f8',
                description: 'Per customer' 
              },
              { 
                title: 'Usage', 
                value: `${customerUsagePercent}%`, 
                icon: <Business />, 
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

          {/* Customer List */}
          <Card
            title="Customer Directory"
            subtitle={`Showing ${Math.min(filteredCustomers.length, rowsPerPage)} of ${filteredCustomers.length} customers`}
            hover
            sx={{ 
              mb: 3,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}>
              {filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
                <Box
                  key={customer._id}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
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
                      }}
                    >
                      {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {customer.name || 'N/A'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Phone sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {customer.phone || 'N/A'}
                              </Typography>
                            </Box>
                            {customer.email && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Email sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                  {customer.email}
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
                                ? darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08)
                                : darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                              color: customer.isInterState ? '#4285f4' : '#34a853',
                              borderColor: alpha(customer.isInterState ? '#4285f4' : '#34a853', 0.3),
                              fontWeight: 500,
                            }}
                          />
                          <Button
                            variant="text"
                            size="small"
                            onClick={(e) => handleMenuOpen(e, customer)}
                            sx={{ 
                              minWidth: 'auto',
                              p: 0.5,
                              color: darkMode ? '#e8eaed' : '#202124',
                            }}
                          >
                            <MoreVert />
                          </Button>
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
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Company
                          </Typography>
                          <Typography variant="body2" fontWeight={500} noWrap>
                            {customer.company || 'Not specified'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          p: 1.5,
                          borderRadius: '8px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Location
                          </Typography>
                          <Typography variant="body2" fontWeight={500} noWrap>
                            {customer.city || customer.state || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          p: 1.5,
                          borderRadius: '8px',
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            Orders & Revenue
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {customer.totalOrders || 0} orders • ₹{(customer.totalSpent || 0).toLocaleString('en-IN')}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {customer.gstin && (
                        <Box sx={{ 
                          mt: 1.5,
                          p: 1,
                          borderRadius: '6px',
                          backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                          border: `1px solid ${alpha('#4285f4', 0.2)}`,
                          display: 'inline-block',
                        }}>
                          <Typography variant="caption" sx={{ color: '#4285f4', fontWeight: 500 }}>
                            GST: {customer.gstin}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
              
              {filteredCustomers.length === 0 && (
                <Box sx={{ 
                  p: 6,
                  textAlign: 'center',
                  border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                }}>
                  <Person sx={{ 
                    fontSize: 60, 
                    mb: 2,
                    color: darkMode ? '#5f6368' : '#9aa0a6',
                  }} />
                  <Typography 
                    variant="h5" 
                    fontWeight={500}
                    gutterBottom
                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  >
                    {searchTerm ? 'No Customers Found' : 'No Customers Yet'}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3,
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Add your first customer to get started'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleCreateCustomer}
                    iconLeft={<Add />}
                    size="medium"
                    disabled={!canAddCustomer || !subscription?.isActive}
                    sx={{ 
                      backgroundColor: '#4285f4',
                      '&:hover': { backgroundColor: '#3367d6' }
                    }}
                  >
                    Add First Customer
                  </Button>
                </Box>
              )}
            </Box>
            
            {/* Pagination */}
            {filteredCustomers.length > 0 && (
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
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  >
                    Previous
                  </Button>
                  
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', px: 2 }}>
                    Page {page + 1} of {Math.ceil(filteredCustomers.length / rowsPerPage)}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    onClick={() => setPage(prev => Math.min(Math.ceil(filteredCustomers.length / rowsPerPage) - 1, prev + 1))}
                    disabled={page >= Math.ceil(filteredCustomers.length / rowsPerPage) - 1}
                    size="small"
                    sx={{
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </Card>
        </Container>
      </Box>
    </MainLayout>
  );
}