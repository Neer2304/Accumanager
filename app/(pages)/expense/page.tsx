"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
  Button,
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseStats from "@/components/expenses/ExpenseStats";
import ExpenseTabs from "@/components/expenses/ExpenseTabs";
import AddExpenseDialog from "@/components/expenses/AddExpenseDialog";

// Types
interface Expense {
  _id?: string;
  id?: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  paymentMethod: string;
  date: string;
  description: string;
  isBusinessExpense: boolean;
  gstAmount: number;
  vendor?: {
    name: string;
    gstin: string;
    contact: string;
  };
  tags: string[];
  isRecurring: boolean;
  recurrence?: string | null;
  status: string;
  userId?: string;
}

interface ExpenseStatsType {
  categoryStats: Array<{
    _id: string;
    totalAmount: number;
    count: number;
    averageAmount: number;
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    totalAmount: number;
    businessExpenses: number;
    personalExpenses: number;
    count: number;
  }>;
  paymentStats: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  period: { year: number; month: number };
}

// Main Expenses Page Component
export default function ExpensesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ExpenseStatsType | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      console.log("Fetching expenses...");

      const response = await fetch('/api/expenses', {
        credentials: "include",
        cache: "no-cache",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data.expenses?.length || 0, "expenses");
        setExpenses(data.expenses || []);
      } else {
        console.error("Server fetch failed:", response.status);
        setExpenses([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      console.log("Fetching stats...");
      const response = await fetch('/api/expenses/stats', {
        credentials: "include",
        cache: "no-cache",
      });
      
      if (response.ok) {
        const data = await response.json() as ExpenseStatsType;
        console.log("Stats loaded:", data);
        setStats(data);
      } else {
        console.error("Failed to fetch stats:", response.status);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchExpenses();
    fetchStats();
  }, []);

  // Save expense
  const handleSaveExpense = async (expenseData: Expense) => {
    console.log('Saving expense data:', expenseData);
    
    // Prepare the expense object
    const expenseToSave: any = {
      title: expenseData.title.trim(),
      amount: parseFloat(expenseData.amount.toString()),
      currency: expenseData.currency || 'INR',
      category: expenseData.category,
      paymentMethod: expenseData.paymentMethod || 'cash',
      date: new Date(expenseData.date).toISOString(),
      description: expenseData.description?.trim() || '',
      isBusinessExpense: Boolean(expenseData.isBusinessExpense),
      gstAmount: parseFloat(expenseData.gstAmount?.toString() || '0'),
      tags: Array.isArray(expenseData.tags) ? expenseData.tags : [],
      isRecurring: Boolean(expenseData.isRecurring),
      recurrence: expenseData.isRecurring
        ? expenseData.recurrence || 'monthly'
        : null,
      status: expenseData.status || 'pending',
    };

    // Add vendor data if it's a business expense
    if (expenseToSave.isBusinessExpense && expenseData.vendor) {
      expenseToSave.vendor = {
        name: expenseData.vendor.name?.trim() || '',
        gstin: expenseData.vendor.gstin?.trim() || '',
        contact: expenseData.vendor.contact?.trim() || '',
      };
    }

    try {
      const url = editingExpense && editingExpense._id
        ? `/api/expenses/${editingExpense._id}`
        : '/api/expenses';

      const method = editingExpense && editingExpense._id ? 'PUT' : 'POST';

      console.log(`Making ${method} request to:`, url);

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(expenseToSave),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (response.ok) {
        console.log('Expense saved successfully');
        await fetchExpenses();
        await fetchStats();
        alert(
          editingExpense
            ? 'Expense updated successfully!'
            : 'Expense added successfully!',
        );
        return;
      } else {
        console.error('Server returned error:', responseData);
        throw new Error(responseData.error || 'Failed to save expense');
      }
    } catch (error: any) {
      console.error('Save failed:', error.message);
      alert('Failed to save expense. Please try again.');
    }
  };

  // Delete expense
  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    console.log("Deleting expense:", expenseId);

    try {
      console.log("Deleting expense from server");
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Expense deleted from server");
        await fetchExpenses();
        await fetchStats();
        alert("Expense deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Server deletion failed:", errorData);
        alert('Failed to delete expense. Please try again.');
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert('Network error. Please try again.');
    }
  };

  // Edit expense
  const handleEditExpense = (expense: Expense) => {
    console.log('Editing expense:', expense);
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExpense(null);
  };

  // Handle download expenses
  const handleDownloadExpenses = () => {
    if (expenses.length === 0) {
      alert("No expenses to download");
      return;
    }

    try {
      // Create CSV content
      const headers = [
        'Title',
        'Amount',
        'Currency',
        'Category',
        'Payment Method',
        'Date',
        'Description',
        'Business Expense',
        'GST Amount',
        'Vendor Name',
        'Vendor GSTIN',
        'Vendor Contact',
        'Tags',
        'Recurring',
        'Recurrence',
        'Status'
      ];

      const csvContent = [
        headers.join(','),
        ...expenses.map(expense => {
          const escape = (text: any) => `"${String(text || '').replace(/"/g, '""')}"`;
          
          return [
            escape(expense.title),
            expense.amount,
            expense.currency,
            escape(expense.category),
            escape(expense.paymentMethod),
            new Date(expense.date).toLocaleDateString(),
            escape(expense.description),
            expense.isBusinessExpense ? 'Yes' : 'No',
            expense.gstAmount || 0,
            escape(expense.vendor?.name),
            escape(expense.vendor?.gstin),
            escape(expense.vendor?.contact),
            escape(expense.tags?.join(', ')),
            expense.isRecurring ? 'Yes' : 'No',
            expense.recurrence || 'None',
            escape(expense.status)
          ].join(',');
        })
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`${expenses.length} expenses exported successfully`);
    } catch (error) {
      console.error('Error exporting expenses:', error);
      alert('Failed to export expenses');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Calculate totals
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const businessTotal = expenses
    .filter((e) => e.isBusinessExpense)
    .reduce((sum, e) => sum + e.amount, 0);
  const personalTotal = expenses
    .filter((e) => !e.isBusinessExpense)
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate category counts
  const businessCount = expenses.filter(e => e.isBusinessExpense).length;
  const personalCount = expenses.filter(e => !e.isBusinessExpense).length;

  return (
    <MainLayout title="Expense Management">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header - Same style as Events page */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
            variant="outlined"
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
            <Typography color="text.primary">Expenses</Typography>
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
                💰 Expense Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage all your business and personal expenses in one place
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              spacing={1}
              alignItems="center"
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-between', sm: 'flex-end' }
              }}
            >
              {/* Status Chips */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label={`₹${totalAmount.toLocaleString('en-IN')}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  label={`${expenses.length} Expenses`}
                  size="small"
                  color="default"
                  variant="outlined"
                />
                {businessCount > 0 && (
                  <Chip 
                    label={`${businessCount} Business`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {personalCount > 0 && (
                  <Chip 
                    label={`${personalCount} Personal`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Stack>

              {/* Download Button */}
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadExpenses}
                size={isMobile ? 'small' : 'medium'}
                disabled={expenses.length === 0}
                sx={{
                  borderRadius: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'action.disabled',
                    color: 'action.disabled',
                  }
                }}
              >
                {isMobile ? 'Export' : 'Export Expenses'}
              </Button>
            </Stack>
          </Box>

          {/* Action Bar */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'background.paper',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {/* Left side - Totals */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total: <strong style={{ color: theme.palette.primary.main }}>₹{totalAmount.toLocaleString('en-IN')}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Business: <strong style={{ color: theme.palette.success.main }}>₹{businessTotal.toLocaleString('en-IN')}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Personal: <strong style={{ color: theme.palette.info.main }}>₹{personalTotal.toLocaleString('en-IN')}</strong>
                </Typography>
              </Box>

              {/* Right side - Add Expense Button */}
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                size="small"
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                + Add Expense
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Statistics Cards */}
        <ExpenseStats
          totalAmount={totalAmount}
          businessTotal={businessTotal}
          personalTotal={personalTotal}
          totalRecords={expenses.length}
        />

        {/* Main Content */}
        <Paper
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <ExpenseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            expenses={expenses}
            stats={stats}
            loading={loading}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            isMobile={isMobile}
          />
        </Paper>

        {/* Add/Edit Expense Dialog */}
        <AddExpenseDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveExpense}
          editingExpense={editingExpense}
        />
      </Container>
    </MainLayout>
  );
}