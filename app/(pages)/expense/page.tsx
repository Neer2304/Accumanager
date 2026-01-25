"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
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

interface ExpenseStats {
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
  const [stats, setStats] = useState<ExpenseStats | null>(null);
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
        const data = await response.json() as ExpenseStats;
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

  return (
    <MainLayout title="Expense Tracker">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <ExpenseHeader
          onAddExpense={() => setDialogOpen(true)}
          totalExpenses={expenses.length}
        />

        {/* Statistics */}
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
      </Box>
    </MainLayout>
  );
}