"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Breadcrumbs,
  CircularProgress,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add,
  Search,
  FilterList,
  Person,
  Work,
  Business,
  Phone,
  Email,
  CalendarToday,
  TrendingUp,
  Star,
  LocationOn,
  Refresh,
  Delete,
  Edit,
  Visibility,
  FileDownload,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { useEmployees } from "@/hooks/useEmployees";
import {
  Employee,
  EmployeeFilters as FiltersType,
  defaultEmployeeFilters,
} from "@/types/employee.types";
import { useSubscription } from "@/hooks/useSubscription";

export default function EmployeesPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const darkMode = theme.palette.mode === "dark";
  const [isMounted, setIsMounted] = useState(false);

  const {
    employees,
    selectedEmployees,
    loading,
    error,
    pagination,
    fetchEmployees,
    deleteEmployee,
    toggleEmployeeSelection,
    clearSelection,
    setError,
  } = useEmployees();

  const { subscription, isLoading: subscriptionLoading } = useSubscription();

  const [filters, setFilters] = useState<FiltersType>(defaultEmployeeFilters);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchEmployees(filters);
  }, [filters, fetchEmployees]);

  const handleFiltersChange = (newFilters: Partial<FiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleCreateEmployee = () => {
    if (!subscription?.isActive) {
      alert(
        "Your subscription is not active. Please renew your subscription to add employees.",
      );
      return;
    }

    router.push("/employees/create");
  };

  const handleEditEmployee = (employee: Employee) => {
    router.push(`/employees/${employee._id}/edit`);
  };

  const handleViewDetails = (employee: Employee) => {
    router.push(`/employees/${employee._id}`);
  };

  const handleMarkAttendance = (employee: Employee) => {
    router.push(`/employees/${employee._id}/attendance`);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    const employeesToDelete = employeeToDelete
      ? [employeeToDelete._id]
      : selectedEmployees;

    if (employeesToDelete.length === 0) return;

    try {
      setDeleting(true);

      // Delete all selected employees
      await Promise.all(employeesToDelete.map((id) => deleteEmployee(id)));

      setSuccessMessage(
        `${employeesToDelete.length} employee(s) deleted successfully`,
      );
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      clearSelection();
      fetchEmployees(filters); // Refresh list
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Failed to delete employee(s)");
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchEmployees(filters);
  };

  const handleDownload = (type: string) => {
    console.log(`Downloading ${type}...`);
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    handleFiltersChange({ search: "", page: 1 });
  };

  // Filter employees based on search term
  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((emp) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          emp.name?.toLowerCase().includes(term) ||
          emp.email?.toLowerCase().includes(term) ||
          emp.phone?.includes(searchTerm) ||
          emp.department?.toLowerCase().includes(term) ||
          emp.role?.toLowerCase().includes(term)
        );
      })
    : [];

  // Stats calculation
  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter((e) => e.isActive).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  const avgSalary =
    totalEmployees > 0
      ? filteredEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0) /
        totalEmployees
      : 0;

  const totalSalary = filteredEmployees.reduce(
    (sum, emp) => sum + (emp.salary || 0),
    0,
  );
  const avgExperience =
    totalEmployees > 0
      ? filteredEmployees.reduce((sum, emp) => {
          const joinDate = new Date(emp.joiningDate);
          const today = new Date();
          const months =
            (today.getFullYear() - joinDate.getFullYear()) * 12 +
            (today.getMonth() - joinDate.getMonth());
          return sum + months / 12;
        }, 0) / totalEmployees
      : 0;

  if (!isMounted || (loading && !employees.length) || subscriptionLoading) {
    return (
      <MainLayout title="Employee Management">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            backgroundColor: darkMode ? "#202124" : "#ffffff",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{ color: darkMode ? "#e8eaed" : "#202124", mb: 2 }}
            >
              Loading employees...
            </Typography>
            <CircularProgress sx={{ color: "#4285f4" }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Employee Management">
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
            p: { xs: 1, sm: 2, md: 3 },
            borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
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
              Employee Management
            </Typography>
          </Breadcrumbs>

          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Employee Management
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 300,
                fontSize: { xs: "0.85rem", sm: "1rem", md: "1.125rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Manage your team, track attendance, and process payroll
              efficiently
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
              mt: 3,
            }}
          >
            <Chip
              label={`${totalEmployees} Total Employees`}
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
              label={`${activeEmployees} Active`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode
                  ? alpha("#34a853", 0.1)
                  : alpha("#34a853", 0.08),
                borderColor: alpha("#34a853", 0.3),
                color: darkMode ? "#81c995" : "#34a853",
              }}
            />
            {!isOnline && (
              <Chip
                label="Offline Mode"
                variant="outlined"
                color="warning"
                sx={{
                  backgroundColor: darkMode
                    ? alpha("#fbbc04", 0.1)
                    : alpha("#fbbc04", 0.08),
                  borderColor: alpha("#fbbc04", 0.3),
                  color: darkMode ? "#fdd663" : "#fbbc04",
                }}
              />
            )}
            {subscription?.status === "trial" && (
              <Chip
                label={`Trial: ${subscription.daysRemaining} days left`}
                variant="outlined"
                sx={{
                  backgroundColor: darkMode
                    ? alpha("#fbbc04", 0.1)
                    : alpha("#fbbc04", 0.08),
                  borderColor: alpha("#fbbc04", 0.3),
                  color: darkMode ? "#fdd663" : "#fbbc04",
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
              title="Error Loading Employees"
              message={typeof error === "string" ? error : "An error occurred"}
              dismissible
              onDismiss={() => setError(null)}
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            />
          )}

          {/* Success Snackbar */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MuiAlert
              severity="success"
              sx={{
                backgroundColor: darkMode ? alpha("#34a853", 0.9) : "#34a853",
                color: "#ffffff",
                borderRadius: "12px",
              }}
            >
              {successMessage}
            </MuiAlert>
          </Snackbar>

          {/* Subscription Alerts */}
          <Box sx={{ mb: 3 }}>
            {!subscription?.isActive && (
              <Alert
                severity="error"
                title="Subscription Inactive"
                message="Your subscription has expired. Please renew your subscription to manage employees."
                dismissible={false}
                action={
                  <Button
                    variant="text"
                    href="/pricing"
                    sx={{ color: darkMode ? "#8ab4f8" : "#4285f4" }}
                  >
                    Upgrade Now
                  </Button>
                }
                sx={{
                  mb: 2,
                  backgroundColor: darkMode
                    ? alpha("#ea4335", 0.1)
                    : alpha("#ea4335", 0.08),
                  borderColor: alpha("#ea4335", 0.3),
                }}
              />
            )}
          </Box>

          {/* Header Controls */}
          <Card
            title="Employee Management"
            subtitle={`${totalEmployees} employees • ${selectedEmployees.length} selected`}
            action={
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => handleDownload("csv")}
                  iconLeft={<FileDownload />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                    color: darkMode ? "#e8eaed" : "#202124",
                  }}
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateEmployee}
                  iconLeft={<Add />}
                  size="medium"
                  disabled={!subscription?.isActive}
                  sx={{
                    backgroundColor: "#34a853",
                    "&:hover": { backgroundColor: "#2d9248" },
                  }}
                >
                  Add Employee
                </Button>
              </Box>
            }
            hover
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? "#202124" : "#ffffff",
              border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "center" },
                mt: 2,
              }}
            >
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFiltersChange({ search: e.target.value, page: 1 });
                }}
                startIcon={<Search />}
                size="small"
                sx={{ flex: 1 }}
                clearable={!!searchTerm}
                onClear={handleClearSearch}
              />

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  size="medium"
                  iconLeft={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                    color: darkMode ? "#e8eaed" : "#202124",
                  }}
                >
                  Filters
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  iconLeft={<Refresh />}
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                    color: darkMode ? "#e8eaed" : "#202124",
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>
          </Card>

          {/* Stats Overview */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 1.5, sm: 2, md: 3 },
              mb: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {[
              {
                title: "Total Employees",
                value: totalEmployees,
                icon: <Person />,
                color: "#4285f4",
                description: "All employees in system",
              },
              {
                title: "Active",
                value: activeEmployees,
                icon: <Star />,
                color: "#34a853",
                description: "Currently working",
              },
              {
                title: "Total Salary",
                value: `₹${totalSalary.toLocaleString("en-IN")}`,
                icon: <TrendingUp />,
                color: "#fbbc04",
                description: "Monthly payroll",
              },
              {
                title: "Avg. Salary",
                value: `₹${avgSalary.toFixed(0)}`,
                icon: <Work />,
                color: "#ea4335",
                description: "Per employee",
              },
              {
                title: "Avg. Experience",
                value: `${avgExperience.toFixed(1)}y`,
                icon: <CalendarToday />,
                color: "#8ab4f8",
                description: "Years with company",
              },
              {
                title: "Inactive",
                value: inactiveEmployees,
                icon: <Business />,
                color: "#9aa0a6",
                description: "Not currently working",
              },
            ].map((stat, index) => (
              <Card
                key={`stat-${index}`}
                hover
                sx={{
                  flex: "1 1 calc(33.333% - 16px)",
                  minWidth: {
                    xs: "calc(50% - 12px)",
                    sm: "calc(33.333% - 16px)",
                  },
                  p: { xs: 1.5, sm: 2, md: 3 },
                  borderRadius: "16px",
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  background: darkMode
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          fontWeight: 400,
                          fontSize: {
                            xs: "0.65rem",
                            sm: "0.7rem",
                            md: "0.75rem",
                          },
                          display: "block",
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{
                          color: stat.color,
                          fontWeight: 600,
                          fontSize: {
                            xs: "1.1rem",
                            sm: "1.25rem",
                            md: "1.5rem",
                          },
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: { xs: 0.75, sm: 1 },
                        borderRadius: "10px",
                        backgroundColor: alpha(stat.color, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        sx: {
                          fontSize: { xs: 20, sm: 24, md: 28 },
                          color: stat.color,
                        },
                      })}
                    </Box>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#9aa0a6" : "#5f6368",
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                      display: "block",
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Bulk Actions */}
          {selectedEmployees.length > 0 && (
            <Card
              hover
              sx={{
                mb: 3,
                backgroundColor: darkMode
                  ? alpha("#4285f4", 0.1)
                  : alpha("#4285f4", 0.05),
                border: `1px solid ${alpha("#4285f4", 0.3)}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                  p: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ color: "#4285f4" }}
                  >
                    {selectedEmployees.length} employee(s) selected
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#9aa0a6" : "#5f6368",
                      display: "block",
                    }}
                  >
                    Click on employees to select multiple
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    iconLeft={<Delete />}
                    onClick={() => {
                      setEmployeeToDelete(null);
                      setDeleteDialogOpen(true);
                    }}
                    size="medium"
                    sx={{
                      borderColor: alpha("#ea4335", 0.5),
                      color: "#ea4335",
                    }}
                  >
                    Delete Selected
                  </Button>
                  <Button
                    variant="text"
                    onClick={clearSelection}
                    size="medium"
                    sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                  >
                    Clear Selection
                  </Button>
                </Box>
              </Box>
            </Card>
          )}

          {/* Employee Grid */}
          {filteredEmployees.length === 0 ? (
            <Card
              hover
              sx={{
                p: 6,
                textAlign: "center",
                border: `2px dashed ${darkMode ? "#3c4043" : "#dadce0"}`,
                backgroundColor: darkMode ? "#202124" : "#f8f9fa",
              }}
            >
              <Person
                sx={{
                  fontSize: 60,
                  mb: 2,
                  color: darkMode ? "#5f6368" : "#9aa0a6",
                }}
              />
              <Typography
                variant="h5"
                fontWeight={500}
                gutterBottom
                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
              >
                {searchTerm ? "No Employees Found" : "No Employees Yet"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                }}
              >
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Add your first employee to get started"}
              </Typography>
              <Button
                variant="contained"
                onClick={handleCreateEmployee}
                iconLeft={<Add />}
                size="medium"
                disabled={!subscription?.isActive}
                sx={{
                  backgroundColor: "#4285f4",
                  "&:hover": { backgroundColor: "#3367d6" },
                }}
              >
                Add First Employee
              </Button>
            </Card>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {filteredEmployees.map((employee, index) => (
                <Card
                  key={employee._id}
                  hover
                  sx={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    "@keyframes fadeInUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                    border: selectedEmployees.includes(employee._id)
                      ? `2px solid ${alpha("#4285f4", 0.8)}`
                      : `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    overflow: "hidden",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: darkMode
                        ? "0 8px 24px rgba(0, 0, 0, 0.3)"
                        : "0 8px 24px rgba(0, 0, 0, 0.1)",
                    },
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Employee Status Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: employee.isActive
                        ? "#34a853"
                        : "#ea4335",
                    }}
                  />

                  <Box
                    sx={{
                      p: 2.5,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Header - FIXED: Better spacing and alignment */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          flex: 1,
                          minWidth: 0, // Important for text truncation
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: getAvatarColor(employee.name),
                            fontSize: "1rem",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </Avatar>
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0, // Allows text truncation
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            noWrap
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {employee.name || "Unnamed Employee"}
                          </Typography>
                          <Chip
                            label={employee.role || "Employee"}
                            size="small"
                            sx={{
                              backgroundColor: darkMode
                                ? alpha("#4285f4", 0.1)
                                : alpha("#4285f4", 0.08),
                              color: "#4285f4",
                              borderColor: alpha("#4285f4", 0.3),
                              mt: 0.5,
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          />
                        </Box>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => toggleEmployeeSelection(employee._id)}
                        sx={{
                          color: selectedEmployees.includes(employee._id)
                            ? "#4285f4"
                            : darkMode
                              ? "#9aa0a6"
                              : "#5f6368",
                          flexShrink: 0,
                          ml: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            border: `2px solid ${selectedEmployees.includes(employee._id) ? "#4285f4" : darkMode ? "#9aa0a6" : "#5f6368"}`,
                            borderRadius: "4px",
                            backgroundColor: selectedEmployees.includes(
                              employee._id,
                            )
                              ? "#4285f4"
                              : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {selectedEmployees.includes(employee._id) && (
                            <Typography
                              sx={{
                                color: "#ffffff",
                                fontSize: "0.75rem",
                                lineHeight: 1,
                              }}
                            >
                              ✓
                            </Typography>
                          )}
                        </Box>
                      </IconButton>
                    </Box>

                    {/* Contact Info - FIXED: Better spacing */}
                    <Box
                      sx={{
                        mb: 2.5,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <Phone
                          sx={{
                            fontSize: 16,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: darkMode ? "#e8eaed" : "#202124",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {employee.phone || "No phone"}
                        </Typography>
                      </Box>
                      {employee.email && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1.5,
                          }}
                        >
                          <Email
                            sx={{
                              fontSize: 16,
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {employee.email}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Business
                          sx={{
                            fontSize: 16,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: darkMode ? "#e8eaed" : "#202124",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {employee.department || "No department"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Stats Grid - FIXED: Better balanced grid */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 1.5,
                        mb: 2.5,
                        p: 1.5,
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Salary
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="#4285f4"
                          noWrap
                        >
                          ₹{(employee.salary || 0).toLocaleString("en-IN")}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Type
                        </Typography>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {employee.salaryType || "Monthly"}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Joined
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {new Date(employee.joiningDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Status
                        </Typography>
                        <Chip
                          label={employee.isActive ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            backgroundColor: employee.isActive
                              ? darkMode
                                ? alpha("#34a853", 0.1)
                                : alpha("#34a853", 0.08)
                              : darkMode
                                ? alpha("#ea4335", 0.1)
                                : alpha("#ea4335", 0.08),
                            color: employee.isActive ? "#34a853" : "#ea4335",
                            borderColor: alpha(
                              employee.isActive ? "#34a853" : "#ea4335",
                              0.3,
                            ),
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Action Buttons - FIXED: Better spacing */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1.5,
                        borderTop: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                        mt: "auto",
                      }}
                    >
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleViewDetails(employee)}
                        iconLeft={<Visibility fontSize="small" />}
                        sx={{
                          color: darkMode ? "#e8eaed" : "#202124",
                          minWidth: "auto",
                          px: 1,
                        }}
                      >
                        Details
                      </Button>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAttendance(employee)}
                          title="Mark Attendance"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            "&:hover": {
                              backgroundColor: alpha("#4285f4", 0.1),
                              color: "#4285f4",
                            },
                          }}
                        >
                          <CalendarToday fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditEmployee(employee)}
                          title="Edit"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            "&:hover": {
                              backgroundColor: alpha("#fbbc04", 0.1),
                              color: "#fbbc04",
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteEmployee(employee)}
                          title="Delete"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            "&:hover": {
                              backgroundColor: alpha("#ea4335", 0.1),
                              color: "#ea4335",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          {/* Pagination */}
          {filteredEmployees.length > 0 && pagination.pages > 1 && (
            <Card
              hover
              sx={{
                mt: 4,
                p: 2,
                backgroundColor: darkMode ? "#202124" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                >
                  Page {pagination.page} of {pagination.pages} • Showing{" "}
                  {filteredEmployees.length} employees
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handleFiltersChange({ page: pagination.page - 1 })
                    }
                    disabled={pagination.page === 1 || loading}
                    size="medium"
                    sx={{
                      borderColor: darkMode ? "#3c4043" : "#dadce0",
                      color: darkMode ? "#e8eaed" : "#202124",
                    }}
                  >
                    Previous
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? "#9aa0a6" : "#5f6368", px: 2 }}
                  >
                    Page {pagination.page}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handleFiltersChange({ page: pagination.page + 1 })
                    }
                    disabled={pagination.page === pagination.pages || loading}
                    size="medium"
                    sx={{
                      borderColor: darkMode ? "#3c4043" : "#dadce0",
                      color: darkMode ? "#e8eaed" : "#202124",
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Card>
          )}
        </Container>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              color: darkMode ? "#e8eaed" : "#202124",
              borderRadius: "16px",
              p: 2,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, p: 0, mb: 2 }}>
            Delete{" "}
            {employeeToDelete ? employeeToDelete.name : "Selected Employees"}?
          </DialogTitle>
          <DialogContent sx={{ p: 0, mb: 3 }}>
            <Typography
              variant="body1"
              sx={{ color: darkMode ? "#e8eaed" : "#202124", mb: 2 }}
            >
              Are you sure you want to delete{" "}
              {employeeToDelete
                ? `"${employeeToDelete.name}"`
                : selectedEmployees.length > 1
                  ? `${selectedEmployees.length} employees`
                  : "this employee"}
              ? This action cannot be undone.
            </Typography>
            <Alert
              severity="warning"
              title="Warning"
              message="This will also delete all attendance records and salary history for the employee."
              sx={{
                backgroundColor: darkMode
                  ? alpha("#fbbc04", 0.1)
                  : alpha("#fbbc04", 0.08),
                borderColor: alpha("#fbbc04", 0.3),
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 0, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
              }}
              disabled={deleting}
              sx={{
                borderColor: darkMode ? "#3c4043" : "#dadce0",
                color: darkMode ? "#e8eaed" : "#202124",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteEmployee}
              disabled={deleting}
              iconLeft={
                deleting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Delete />
                )
              }
              sx={{
                backgroundColor: "#ea4335",
                "&:hover": { backgroundColor: "#d33426" },
              }}
            >
              {deleting
                ? "Deleting..."
                : `Delete${!employeeToDelete && selectedEmployees.length > 1 ? ` (${selectedEmployees.length})` : ""}`}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

// Helper function for avatar colors
function getAvatarColor(name: string) {
  const colors = [
    "#4285f4",
    "#34a853",
    "#ea4335",
    "#fbbc04",
    "#8ab4f8",
    "#81c995",
    "#f28b82",
    "#fdd663",
    "#5f6368",
    "#9aa0a6",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
