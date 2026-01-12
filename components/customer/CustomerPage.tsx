"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useCustomers } from '@/hooks/useCustomers';
import { useSubscription } from '@/hooks/useSubscription';
import { CustomerStats } from '@/components/customer/CustomerStats';
import { CustomerForm } from '@/components/customer/CustomerForm';
import { DataTable } from '@/components/common/Table/DataTable';
import { CustomerTableRow } from '@/components/customer/CustomerTableRow';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Person } from '@mui/icons-material';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  isInterState: boolean;
  totalOrders: number;
  city?: string;
  state?: string;
  gstin?: string;
}

export default function CustomersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { customers, isLoading, error, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { subscription, usage, isLoading: subscriptionLoading, canAddCustomer } = useSubscription();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const customersArray: Customer[] = Array.isArray(customers) ? customers : [];
  
  const filteredCustomers = customersArray.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.gstin?.includes(searchTerm)
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreateCustomer = () => {
    if (!canAddCustomer) {
      alert(`Customer limit reached. Please upgrade your plan.`);
      return;
    }
    setSelectedCustomer(null);
    setOpenDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleSubmitCustomer = async (data: any) => {
    try {
      if (selectedCustomer) {
        await updateCustomer({ ...data, id: selectedCustomer._id });
      } else {
        await addCustomer(data);
      }
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to save customer:', err);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customer._id);
      } catch (err) {
        console.error('Failed to delete customer:', err);
      }
    }
  };

  const columns = [
    { id: 'name', label: 'Customer', minWidth: 200 },
    ...(!isMobile ? [{ id: 'contact', label: 'Contact', minWidth: 150 }] : []),
    { id: 'business', label: 'Business', minWidth: 150 },
    ...(isDesktop ? [{ id: 'location', label: 'Location', minWidth: 150 }] : []),
    { id: 'actions', label: 'Actions', align: 'right' as const, minWidth: 100 },
  ];

  if (!isMounted || isLoading || subscriptionLoading) {
    return (
      <MainLayout title="Customers">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Customers">
      <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                Customers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your customer database
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateCustomer}
              disabled={!canAddCustomer || !subscription?.isActive}
            >
              Add Customer
            </Button>
          </Box>

          {/* Subscription Alerts */}
          {!subscription?.isActive && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Your subscription has expired. Please renew to manage customers.
            </Alert>
          )}
          {!canAddCustomer && subscription?.isActive && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Customer limit reached. Please upgrade your plan.
            </Alert>
          )}
        </Box>

        {/* Stats */}
        <CustomerStats
          totalCustomers={customersArray.length}
          activeCustomers={customersArray.filter(c => c.totalOrders > 0).length}
          totalRevenue={customersArray.reduce((sum, c) => sum + (c.totalOrders * 1000), 0)} // Example calculation
          interStateCustomers={customersArray.filter(c => c.isInterState).length}
          customerUsage={usage?.customers}
          customerLimit={subscription?.limits?.customers}
          isMobile={isMobile}
        />

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search customers..."
            />
          </CardContent>
        </Card>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={filteredCustomers.length}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          emptyMessage={
            <EmptyState
              title={searchTerm ? "No customers found" : "No customers yet"}
              description={searchTerm ? "Try different search terms" : "Add your first customer to get started"}
              icon={<Person sx={{ fontSize: 48 }} />}
              action={
                !searchTerm
                  ? {
                      label: "Add First Customer",
                      onClick: handleCreateCustomer,
                      disabled: !canAddCustomer || !subscription?.isActive,
                    }
                  : undefined
              }
            />
          }
          renderRow={(customer, index) => (
            <CustomerTableRow
              key={customer._id}
              customer={customer}
              onMenuClick={(e) => {
                e.stopPropagation();
                setSelectedCustomer(customer);
              }}
              isMobile={isMobile}
              isDesktop={isDesktop}
            />
          )}
        />

        {/* Context Menu */}
        {selectedCustomer && (
          <ActionMenu
            items={[
              {
                label: 'Edit',
                icon: <Edit fontSize="small" sx={{ mr: 1 }} />,
                onClick: () => handleEditCustomer(selectedCustomer),
              },
              {
                label: 'Delete',
                icon: <Delete fontSize="small" sx={{ mr: 1 }} />,
                onClick: () => handleDeleteCustomer(selectedCustomer),
                color: 'error.main',
              },
            ]}
          />
        )}

        {/* Customer Form Dialog */}
        <CustomerForm
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleSubmitCustomer}
          isMobile={isMobile}
          title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
          initialData={selectedCustomer ? {
            name: selectedCustomer.name,
            phone: selectedCustomer.phone,
            email: selectedCustomer.email || '',
            company: selectedCustomer.company || '',
            address: '', // Add if available
            state: selectedCustomer.state || '',
            city: selectedCustomer.city || '',
            pincode: '', // Add if available
            gstin: selectedCustomer.gstin || '',
            isInterState: selectedCustomer.isInterState,
          } : undefined}
        />
      </Box>
    </MainLayout>
  );
}