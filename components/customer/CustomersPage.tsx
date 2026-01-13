"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useCustomers } from '@/hooks/useCustomers';
import { useSubscription } from '@/hooks/useSubscription';

// Import components
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { CustomerStats } from '@/components/customer/CustomersStats';
import { SubscriptionAlert } from '@/components/customer/SubscriptionAlert';
import { UsageIndicator } from '@/components/customer/UsageIndicator';
import { SearchBar } from '@/components/customer/SearchBar';
import { CustomerTable } from '@/components/customer/CustomerTable';
import { CustomerDialog } from '@/components/customer/CustomerDialog';
import { MobileFiltersDrawer } from '@/components/customer/MobileFiltersDrawer';
import { CustomerContextMenu } from '@/components/customer/CustomerContextMenu';
import { Customer } from '@/components/customer/types';

// Define types for subscription data
interface Subscription {
  isActive?: boolean;
  plan?: string;
  status?: string;
  limits?: {
    customers?: number;
  };
  daysRemaining?: number;
}

interface Usage {
  customers?: number;
}

export default function CustomersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { customers, isLoading, error, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { subscription, usage, isLoading: subscriptionLoading } = useSubscription();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Type-safe subscription and usage data
  const subscriptionData: Subscription = subscription || {};
  const usageData: Usage = usage || {};

  // Safely handle customers data with proper type checking
  const customersArray: Customer[] = Array.isArray(customers) ? customers : [];

  // Filter customers based on search term
  const filteredCustomers = customersArray.filter(customer => {
    if (!customer || typeof customer !== 'object') return false;
    
    const searchLower = searchTerm.toLowerCase();
    const name = customer.name || '';
    const phone = customer.phone || '';
    const email = customer.email || '';
    const company = customer.company || '';
    const gstin = customer.gstin || '';

    return (
      name.toLowerCase().includes(searchLower) ||
      phone.includes(searchTerm) ||
      email.toLowerCase().includes(searchLower) ||
      company.toLowerCase().includes(searchLower) ||
      gstin.includes(searchTerm)
    );
  });

  // Event handlers
  const handleCreateCustomer = () => {
    // Check if subscription is active
    if (!subscriptionData.isActive) {
      alert('Please activate your subscription first.');
      return;
    }
    
    // Check if customer limit is reached
    const customerLimit = subscriptionData.limits?.customers || 0;
    const currentUsage = usageData.customers || 0;
    
    if (currentUsage >= customerLimit) {
      alert('Customer limit reached. Please upgrade your plan.');
      return;
    }
    
    setSelectedCustomer(null);
    setOpenDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer || !selectedCustomer._id) {
      setApiError('No customer selected for deletion');
      return;
    }

    try {
      await deleteCustomer(selectedCustomer._id);
      setMenuAnchor(null);
      setSelectedCustomer(null);
      setApiError(null);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  const handleCustomerSubmit = async (data: any) => {
    try {
      if (selectedCustomer) {
        await updateCustomer({ ...data, id: selectedCustomer._id });
      } else {
        await addCustomer(data);
      }
      setOpenDialog(false);
      setApiError(null);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to save customer');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setPage(0); // Reset to first page when rows per page changes
  };

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state
  if (!isMounted || isLoading || subscriptionLoading) {
    return (
      <MainLayout title="Customers">
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 400 
        }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Customers">
      <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Mobile filters drawer */}
        <MobileFiltersDrawer
          open={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          totalCustomers={customersArray.length}
          activeCustomers={customersArray.filter(c => c.totalOrders > 0).length}
          usage={usageData.customers || 0}
          limit={subscriptionData.limits?.customers || 0}
        />

        {/* Header section with title and action buttons */}
        <CustomerHeader
          title="Customers"
          subscriptionPlan={subscriptionData.plan}
          totalCustomers={customersArray.length}
          activeCustomers={customersArray.filter(c => c.totalOrders > 0).length}
          onAddClick={handleCreateCustomer}
          onFilterClick={() => setShowMobileFilters(true)}
          canAddCustomer={(usageData.customers || 0) < (subscriptionData.limits?.customers || 0)}
          isSubscriptionActive={subscriptionData.isActive || false}
          isMobile={isMobile}
        />

        {/* Display any API errors */}
        {apiError && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setApiError(null)}
          >
            {apiError}
          </Alert>
        )}

        {/* Subscription-related alerts */}
        <SubscriptionAlert
          isSubscriptionActive={subscriptionData.isActive || false}
          canAddCustomer={(usageData.customers || 0) < (subscriptionData.limits?.customers || 0)}
          customerLimit={subscriptionData.limits?.customers || 0}
          subscriptionStatus={subscriptionData.status}
          daysRemaining={subscriptionData.daysRemaining}
          onUpgradeClick={() => window.open('/pricing', '_blank')}
          isMobile={isMobile}
        />

        {/* Customer usage indicator (hidden on mobile) */}
        {!isMobile && (
          <UsageIndicator
            usage={usageData.customers || 0}
            limit={subscriptionData.limits?.customers || 0}
          />
        )}

        {/* Statistics cards showing customer metrics */}
        <CustomerStats customers={customersArray} />

        {/* Search bar for filtering customers */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search customers by name, phone, email, company, or GSTIN..."
          isMobile={isMobile}
        />

        {/* Main customer data table */}
        <Card sx={{ overflow: 'hidden', mt: 2 }}>
          <CustomerTable
            customers={filteredCustomers}
            searchTerm={searchTerm}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onMenuClick={handleMenuClick}
            onAddClick={handleCreateCustomer}
            isMobile={isMobile}
            isDesktop={isDesktop}
          />
        </Card>

        {/* Dialog for adding/editing customers */}
        <CustomerDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          customer={selectedCustomer}
          onSubmit={handleCustomerSubmit}
          isMobile={isMobile}
        />

        {/* Context menu for customer actions */}
        <CustomerContextMenu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          onEdit={() => {
            if (selectedCustomer) {
              handleEditCustomer(selectedCustomer);
              setMenuAnchor(null);
            }
          }}
          onDelete={handleDeleteCustomer}
          customerDetails={selectedCustomer ? {
            name: selectedCustomer.name,
            phone: selectedCustomer.phone,
            email: selectedCustomer.email,
            company: selectedCustomer.company,
            orders: selectedCustomer.totalOrders,
            location: `${selectedCustomer.city || ''} ${selectedCustomer.state || ''}`.trim(),
          } : undefined}
        />
      </Box>
    </MainLayout>
  );
}