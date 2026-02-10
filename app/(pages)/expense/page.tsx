"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download,
  TrendingUp,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import ExpenseStats from "@/components/expenses/ExpenseStats";
import ExpenseTabs from "@/components/expenses/ExpenseTabs";
import AddExpenseDialog from "@/components/expenses/AddExpenseDialog";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

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

// Skeleton Component for Expenses Page
const ExpensesSkeleton = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  return (
    <>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton
          variant="text"
          width={120}
          height={40}
          sx={{
            mb: 2,
            bgcolor: darkMode ? "#3c4043" : "#f1f3f4",
          }}
        />

        <Box sx={{ mb: 2 }}>
          <Skeleton
            variant="text"
            width={200}
            height={25}
            sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Skeleton
              variant="text"
              width={300}
              height={50}
              sx={{
                mb: 1,
                bgcolor: darkMode ? "#3c4043" : "#f1f3f4",
              }}
            />
            <Skeleton
              variant="text"
              width={250}
              height={25}
              sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton
              variant="rectangular"
              width={150}
              height={40}
              sx={{
                borderRadius: 1,
                bgcolor: darkMode ? "#3c4043" : "#f1f3f4",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={120}
              height={40}
              sx={{
                borderRadius: 1,
                bgcolor: darkMode ? "#3c4043" : "#f1f3f4",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Action Bar Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: darkMode ? "#303134" : "#ffffff",
          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton
              variant="text"
              width={100}
              height={30}
              sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={30}
              sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={30}
              sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
            />
          </Box>
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{
              borderRadius: 1,
              bgcolor: darkMode ? "#3c4043" : "#f1f3f4",
            }}
          />
        </Box>
      </Paper>

      {/* Stats Cards Skeleton */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1.5, sm: 2, md: 3 },
          mb: 4,
          "& > *": {
            flex: "1 1 calc(50% - 12px)",
            minWidth: 0,
            "@media (min-width: 600px)": {
              flex: "1 1 calc(50% - 16px)",
            },
            "@media (min-width: 900px)": {
              flex: "1 1 calc(25% - 18px)",
            },
          },
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <Card
            key={item}
            sx={{
              p: 2,
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: "16px !important" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Skeleton
                  variant="circular"
                  width={48}
                  height={48}
                  sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={25}
                    sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={35}
                    sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
                  />
                </Box>
              </Box>
              <Skeleton
                variant="text"
                width="70%"
                height={20}
                sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Main Content Skeleton */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,
          backgroundColor: darkMode ? "#303134" : "#ffffff",
          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
          mb: 3,
        }}
      >
        {/* Tabs Skeleton */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: darkMode ? "#3c4043" : "#dadce0",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={100}
                height={40}
                sx={{
                  borderRadius: 1,
                  bgcolor: darkMode ? "#3c4043" : "#f1f3f4",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Table Skeleton */}
        <Box sx={{ p: 3 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{
              borderRadius: 2,
              bgcolor: darkMode ? "#3c4043" : "#f1f3f4",
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

// Main Expenses Page Component
export default function ExpensesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = theme.palette.mode === "dark";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [stats, setStats] = useState<ExpenseStatsType | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      console.log("Fetching expenses...");

      const response = await fetch("/api/expenses", {
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
      setPageLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      console.log("Fetching stats...");
      const response = await fetch("/api/expenses/stats", {
        credentials: "include",
        cache: "no-cache",
      });

      if (response.ok) {
        const data = (await response.json()) as ExpenseStatsType;
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

    // Simulate initial page loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveExpense = async (expenseData: Expense) => {
    console.log("Saving expense data:", expenseData);

    try {
      // Prepare the expense object
      const expenseToSave: any = {
        title: expenseData.title.trim(),
        amount: parseFloat(expenseData.amount.toString()),
        currency: expenseData.currency || "INR",
        category: expenseData.category,
        paymentMethod: expenseData.paymentMethod || "cash",
        date: new Date(expenseData.date).toISOString(),
        description: expenseData.description?.trim() || "",
        isBusinessExpense: Boolean(expenseData.isBusinessExpense),
        gstAmount: parseFloat(expenseData.gstAmount?.toString() || "0"),
        tags: Array.isArray(expenseData.tags) ? expenseData.tags : [],
        isRecurring: Boolean(expenseData.isRecurring),
        recurrence: expenseData.isRecurring
          ? expenseData.recurrence || "monthly"
          : null,
        status: expenseData.status || "pending",
      };

      // Add vendor data if it's a business expense
      if (expenseToSave.isBusinessExpense && expenseData.vendor) {
        expenseToSave.vendor = {
          name: expenseData.vendor.name?.trim() || "",
          gstin: expenseData.vendor.gstin?.trim() || "",
          contact: expenseData.vendor.contact?.trim() || "",
        };
      }

      const url =
        editingExpense && editingExpense._id
          ? `/api/expenses/${editingExpense._id}`
          : "/api/expenses";

      const method = editingExpense && editingExpense._id ? "PUT" : "POST";

      console.log(`Making ${method} request to:`, url);
      console.log("Request data:", expenseToSave);

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(expenseToSave),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (response.ok) {
        console.log("Expense saved successfully");
        await fetchExpenses();
        await fetchStats();
        alert(
          editingExpense
            ? "Expense updated successfully!"
            : "Expense added successfully!",
        );
        return;
      } else {
        console.error("Server returned error:", responseData);

        // Handle different error types
        if (response.status === 404) {
          throw new Error(
            "Expense not found. It may have been deleted or you may not have permission to edit it.",
          );
        } else if (response.status === 401) {
          throw new Error("Please login again to continue.");
        } else if (responseData.error) {
          throw new Error(responseData.error);
        } else if (responseData.details) {
          throw new Error(
            `Validation failed: ${responseData.details.join(", ")}`,
          );
        } else {
          throw new Error("Failed to save expense. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Save failed:", error.message);
      alert(error.message || "Failed to save expense. Please try again.");
    }
  };

  // Delete expense
  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    console.log("Deleting expense:", expenseId);

    try {
      console.log("Making DELETE request to:", `/api/expenses/${expenseId}`);

      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      let responseData;
      const textResponse = await response.text();
      console.log("Raw response text:", textResponse);

      try {
        responseData = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        responseData = { error: "Invalid server response" };
      }

      console.log("Parsed response data:", responseData);

      if (response.ok) {
        console.log("Expense deleted successfully");
        await fetchExpenses();
        await fetchStats();
        alert("Expense deleted successfully!");
      } else {
        console.error("Server deletion failed. Status:", response.status);
        console.error("Response data:", responseData);

        if (response.status === 404) {
          alert("Expense not found. It may have already been deleted.");
          // Refresh the list to sync with server
          await fetchExpenses();
        } else if (response.status === 401) {
          alert("Please login again to continue.");
        } else if (responseData?.error) {
          alert(`Failed to delete: ${responseData.error}`);
        } else {
          alert(`Failed to delete expense. Server returned ${response.status}`);
        }
      }
    } catch (error: any) {
      console.error("Network error deleting expense:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  // Edit expense
  const handleEditExpense = (expense: Expense) => {
    console.log("Editing expense:", expense);
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
        "Title",
        "Amount",
        "Currency",
        "Category",
        "Payment Method",
        "Date",
        "Description",
        "Business Expense",
        "GST Amount",
        "Vendor Name",
        "Vendor GSTIN",
        "Vendor Contact",
        "Tags",
        "Recurring",
        "Recurrence",
        "Status",
      ];

      const csvContent = [
        headers.join(","),
        ...expenses.map((expense) => {
          const escape = (text: any) =>
            `"${String(text || "").replace(/"/g, '""')}"`;

          return [
            escape(expense.title),
            expense.amount,
            expense.currency,
            escape(expense.category),
            escape(expense.paymentMethod),
            new Date(expense.date).toLocaleDateString(),
            escape(expense.description),
            expense.isBusinessExpense ? "Yes" : "No",
            expense.gstAmount || 0,
            escape(expense.vendor?.name),
            escape(expense.vendor?.gstin),
            escape(expense.vendor?.contact),
            escape(expense.tags?.join(", ")),
            expense.isRecurring ? "Yes" : "No",
            expense.recurrence || "None",
            escape(expense.status),
          ].join(",");
        }),
      ].join("\n");

      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `expenses_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`${expenses.length} expenses exported successfully`);
    } catch (error) {
      console.error("Error exporting expenses:", error);
      alert("Failed to export expenses");
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
  const businessCount = expenses.filter((e) => e.isBusinessExpense).length;
  const personalCount = expenses.filter((e) => !e.isBusinessExpense).length;

  return (
    <MainLayout title="Expense Management">
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            background: darkMode
              ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
              : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          }}
        >
          <Breadcrumbs
            sx={{
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
            }}
          >
            <Link
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 300,
              }}
            >
              <HomeIcon
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                }}
              />
              Dashboard
            </Link>
            <Typography
              color={darkMode ? "#e8eaed" : "#202124"}
              fontWeight={400}
            >
              Expenses
            </Typography>
          </Breadcrumbs>

          <Box
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight={500}
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: darkMode ? "#e8eaed" : "#202124",
                  }}
                >
                  💰 Expense Management
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: darkMode ? "#9aa0a6" : "#5f6368",
                    fontWeight: 300,
                    fontSize: { xs: "0.85rem", sm: "1rem", md: "1.125rem" },
                    lineHeight: 1.5,
                    maxWidth: 600,
                  }}
                >
                  Track and manage all your business and personal expenses in
                  one place
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: { xs: 1, sm: 0 },
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    label={`₹${totalAmount.toLocaleString("en-IN")}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: darkMode
                        ? alpha("#4285f4", 0.1)
                        : alpha("#4285f4", 0.08),
                      borderColor: alpha("#4285f4", 0.3),
                      color: darkMode ? "#8ab4f8" : "#4285f4",
                    }}
                  />
                  <Chip
                    label={`${expenses.length} Expenses`}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: darkMode
                        ? alpha("#5f6368", 0.1)
                        : alpha("#5f6368", 0.08),
                      borderColor: alpha("#5f6368", 0.3),
                      color: darkMode ? "#9aa0a6" : "#5f6368",
                    }}
                  />
                  {businessCount > 0 && (
                    <Chip
                      label={`${businessCount} Business`}
                      size="small"
                      variant="outlined"
                      sx={{
                        backgroundColor: darkMode
                          ? alpha("#34a853", 0.1)
                          : alpha("#34a853", 0.08),
                        borderColor: alpha("#34a853", 0.3),
                        color: darkMode ? "#81c995" : "#34a853",
                      }}
                    />
                  )}
                  {personalCount > 0 && (
                    <Chip
                      label={`${personalCount} Personal`}
                      size="small"
                      variant="outlined"
                      sx={{
                        backgroundColor: darkMode
                          ? alpha("#4285f4", 0.1)
                          : alpha("#4285f4", 0.08),
                        borderColor: alpha("#4285f4", 0.3),
                        color: darkMode ? "#8ab4f8" : "#4285f4",
                      }}
                    />
                  )}
                </Box>

                <Button
                  variant="outlined"
                  onClick={handleDownloadExpenses}
                  iconLeft={<Download />}
                  size="medium"
                  disabled={expenses.length === 0}
                  sx={{
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                    color: darkMode ? "#e8eaed" : "#202124",
                    "&:hover": {
                      borderColor: darkMode ? "#5f6368" : "#bdc1c6",
                      backgroundColor: darkMode ? "#3c4043" : "#f8f9fa",
                    },
                    "&.Mui-disabled": {
                      borderColor: darkMode ? "#3c4043" : "#dadce0",
                      color: darkMode ? "#5f6368" : "#9aa0a6",
                    },
                  }}
                >
                  {isMobile ? "Export" : "Export Expenses"}
                </Button>
              </Box>
            </Box>

            {/* Action Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {/* Left side - Totals */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode ? "#e8eaed" : "#202124",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    }}
                  >
                    Total:{" "}
                    <strong style={{ color: "#4285f4" }}>
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode ? "#e8eaed" : "#202124",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    }}
                  >
                    Business:{" "}
                    <strong style={{ color: "#34a853" }}>
                      ₹{businessTotal.toLocaleString("en-IN")}
                    </strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode ? "#e8eaed" : "#202124",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    }}
                  >
                    Personal:{" "}
                    <strong style={{ color: "#4285f4" }}>
                      ₹{personalTotal.toLocaleString("en-IN")}
                    </strong>
                  </Typography>
                </Box>

                {/* Right side - Add Expense Button */}
                <Button
                  variant="contained"
                  onClick={() => setDialogOpen(true)}
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#4285f4",
                    "&:hover": {
                      backgroundColor: "#3367d6",
                    },
                  }}
                >
                  + Add Expense
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Loading State */}
          {pageLoading ? (
            <ExpensesSkeleton />
          ) : (
            <>
              {/* Statistics Cards - Show skeleton if loading */}
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: { xs: 1.5, sm: 2, md: 3 },
                    mb: 4,
                    "& > *": {
                      flex: "1 1 calc(50% - 12px)",
                      minWidth: 0,
                      "@media (min-width: 600px)": {
                        flex: "1 1 calc(50% - 16px)",
                      },
                      "@media (min-width: 900px)": {
                        flex: "1 1 calc(25% - 18px)",
                      },
                    },
                  }}
                >
                  {[1, 2, 3, 4].map((item) => (
                    <Card
                      key={item}
                      sx={{
                        p: 2,
                        backgroundColor: darkMode ? "#303134" : "#ffffff",
                        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: "16px !important" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Skeleton
                            variant="circular"
                            width={48}
                            height={48}
                            sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton
                              variant="text"
                              width="60%"
                              height={25}
                              sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
                            />
                            <Skeleton
                              variant="text"
                              width="80%"
                              height={35}
                              sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
                            />
                          </Box>
                        </Box>
                        <Skeleton
                          variant="text"
                          width="70%"
                          height={20}
                          sx={{ bgcolor: darkMode ? "#3c4043" : "#f1f3f4" }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <ExpenseStats
                  totalAmount={totalAmount}
                  businessTotal={businessTotal}
                  personalTotal={personalTotal}
                  totalRecords={expenses.length}
                />
              )}

              {/* Main Content */}
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
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
            </>
          )}

          {/* Empty State */}
          {!pageLoading && !loading && expenses.length === 0 && (
            <Card
              elevation={0}
              sx={{
                textAlign: "center",
                py: 8,
                px: 3,
                mt: 4,
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  fontSize: 60,
                  mb: 2,
                  color: darkMode ? "#5f6368" : "#9aa0a6",
                }}
              >
                💰
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: darkMode ? "#e8eaed" : "#202124",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                No Expenses Found
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  maxWidth: 500,
                  mx: "auto",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Start tracking your expenses to get insights into your spending
                habits
              </Typography>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                size="medium"
                sx={{
                  backgroundColor: "#4285f4",
                  "&:hover": {
                    backgroundColor: "#3367d6",
                  },
                }}
              >
                Add Your First Expense
              </Button>
            </Card>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}
