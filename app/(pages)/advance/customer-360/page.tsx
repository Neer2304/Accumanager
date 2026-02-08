"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  alpha,
  useMediaQuery,
  Breadcrumbs,
  Button,
} from "@mui/material";
import {
  Person,
  PersonAdd,
  Home,
  Refresh,
  Add,
} from "@mui/icons-material";
import { useAdvanceThemeContext } from "@/contexts/AdvanceThemeContexts";
import Link from "next/link";

// Import Components
import Customer360Header from "@/components/advance/customer-360/Customer360Header";
import SearchFilters from "@/components/advance/customer-360/SearchFilters";
import StatsOverview from "@/components/advance/customer-360/StatsOverview";
import CustomersTable from "@/components/advance/customer-360/CustomersTable";
import Notifications from "@/components/advance/customer-360/Notifications";

// Google colors
const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
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

export default function Customer360Page() {
  const { mode } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [customers, setCustomers] = useState<AdvancedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [initializing, setInitializing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light;
  const primaryColor = googleColors.blue; // Main color for branding

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

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filter, fetchCustomers]);

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
        <Card sx={{ 
          p: 3, 
          textAlign: 'center',
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
        }}>
          <Person sx={{ 
            fontSize: 48, 
            color: primaryColor,
            mb: 2 
          }} />
          <Typography variant="h6" color={currentColors.textPrimary}>
            Loading Customer 360...
          </Typography>
        </Card>
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
      <Customer360Header
        currentColors={currentColors}
        isMobile={isMobile}
        googleColors={googleColors}
        mode={mode}
        onRefresh={fetchCustomers}
        loading={loading}
        onInitialize={initializeProfiles}
        initializing={initializing}
        customersCount={customers.length}
      />

      {/* Search and Filters */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        currentColors={currentColors}
        isMobile={isMobile}
        primaryColor={primaryColor}
        alpha={alpha}
      />

      {/* Stats Overview */}
      <StatsOverview
        customers={customers}
        currentColors={currentColors}
        isMobile={isMobile}
        primaryColor={primaryColor}
        alpha={alpha}
      />

      {/* Customers Table */}
      <CustomersTable
        customers={customers}
        loading={loading}
        isMobile={isMobile}
        currentColors={currentColors}
        primaryColor={primaryColor}
        alpha={alpha}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        selected={selected}
        setSelected={setSelected}
        expandedRow={expandedRow}
        setExpandedRow={setExpandedRow}
        search={search}
        onInitialize={initializeProfiles}
        initializing={initializing}
        onCustomerSelect={() => {}} // You can implement this
      />

      {/* Notifications */}
      <Notifications
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
        isMobile={isMobile}
      />
    </Box>
  );
}