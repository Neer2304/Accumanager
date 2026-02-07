"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Alert,
  Button,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Menu,
  Divider,
  Avatar,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Refresh,
  Download,
  Home as HomeIcon,
  Warehouse,
  LocationOn,
  Storage,
  Map,
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Add,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  CloudDownload as CloudDownloadIcon,
  Inventory,
  Category,
  Scale,
  AttachMoney,
  Clear,
  Warning,
  CheckCircle,
  Error,
  LocalShipping,
  ShoppingCart,
  Person,
  Schedule,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";

// Define Warehouse type
export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  location: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: "active" | "inactive" | "maintenance";
  type: "main" | "distribution" | "storage" | "cold-storage";
  capacity: number;
  currentOccupancy: number;
  temperatureRange?: string;
  humidityRange?: string;
  supervisor?: string;
  materialsCount: number;
  totalValue: number;
  lastInventory: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseFilters {
  search: string;
  status: string;
  type: string;
  page: number;
  limit: number;
}

export default function WarehousePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const darkMode = theme.palette.mode === "dark";

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportMenuAnchor, setExportMenuAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [filters, setFilters] = useState<WarehouseFilters>({
    search: "",
    status: "",
    type: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch warehouses from API
  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError("");

      // Mock data for demonstration
      // In real app, fetch from your API: /api/material/warehouses
      setTimeout(() => {
        const mockWarehouses: Warehouse[] = [
          {
            _id: "1",
            name: "Main Warehouse",
            code: "WH-001",
            location: "New York",
            address: "123 Industrial Ave, NY 10001",
            contactPerson: "John Smith",
            phone: "+1 (555) 123-4567",
            email: "warehouse@example.com",
            status: "active",
            type: "main",
            capacity: 10000,
            currentOccupancy: 7500,
            temperatureRange: "15-25°C",
            humidityRange: "40-60%",
            supervisor: "Michael Johnson",
            materialsCount: 125,
            totalValue: 4500000,
            lastInventory: "2024-01-15",
            notes: "Primary storage facility with climate control",
            createdAt: "2023-01-01",
            updatedAt: "2024-01-15",
          },
          {
            _id: "2",
            name: "Distribution Center",
            code: "WH-002",
            location: "New Jersey",
            address: "456 Distribution Blvd, NJ 07001",
            contactPerson: "Sarah Wilson",
            phone: "+1 (555) 234-5678",
            email: "distribution@example.com",
            status: "active",
            type: "distribution",
            capacity: 8000,
            currentOccupancy: 6000,
            temperatureRange: "18-22°C",
            humidityRange: "45-55%",
            supervisor: "Robert Brown",
            materialsCount: 89,
            totalValue: 3200000,
            lastInventory: "2024-01-10",
            notes: "Regional distribution hub",
            createdAt: "2023-02-15",
            updatedAt: "2024-01-10",
          },
          {
            _id: "3",
            name: "Cold Storage",
            code: "WH-003",
            location: "Chicago",
            address: "789 Cold Storage Rd, IL 60601",
            contactPerson: "David Lee",
            phone: "+1 (555) 345-6789",
            email: "coldstorage@example.com",
            status: "active",
            type: "cold-storage",
            capacity: 5000,
            currentOccupancy: 3500,
            temperatureRange: "2-8°C",
            humidityRange: "50-70%",
            supervisor: "Jennifer Davis",
            materialsCount: 45,
            totalValue: 1800000,
            lastInventory: "2024-01-05",
            notes: "Refrigerated storage for perishables",
            createdAt: "2023-03-10",
            updatedAt: "2024-01-05",
          },
          {
            _id: "4",
            name: "Auxiliary Storage",
            code: "WH-004",
            location: "Texas",
            address: "101 Storage Lane, TX 77001",
            contactPerson: "Maria Garcia",
            phone: "+1 (555) 456-7890",
            email: "storage@example.com",
            status: "maintenance",
            type: "storage",
            capacity: 6000,
            currentOccupancy: 2000,
            temperatureRange: "10-30°C",
            humidityRange: "30-70%",
            supervisor: "James Wilson",
            materialsCount: 67,
            totalValue: 1500000,
            lastInventory: "2023-12-20",
            notes: "Under maintenance until Feb 2024",
            createdAt: "2023-04-05",
            updatedAt: "2023-12-20",
          },
        ];

        setWarehouses(mockWarehouses);
        setPagination({
          page: 0,
          limit: 20,
          total: mockWarehouses.length,
          pages: 1,
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error fetching warehouses. Please try again.",
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [filters]);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    console.log("Exporting Excel...");
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
    handleExportMenuClose();
  };

  const handleExportAll = () => {
    console.log("Exporting all data...");
    handleExportMenuClose();
  };

  const handleFilterChange = (key: keyof WarehouseFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      type: "",
      page: 1,
      limit: 20,
    });
  };

  const handleViewDetails = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setDetailsDialogOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    window.location.href = `/material/warehouse/${warehouse._id}/edit`;
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedWarehouse) return;

    try {
      // In real app, call DELETE API
      console.log("Deleting warehouse:", selectedWarehouse._id);
      setDeleteDialogOpen(false);
      setSelectedWarehouse(null);
      fetchWarehouses(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#34a853";
      case "inactive":
        return "#9aa0a6";
      case "maintenance":
        return "#fbbc04";
      default:
        return "#9aa0a6";
    }
  };

  const getStatusBackgroundColor = (status: string, darkMode: boolean) => {
    switch (status) {
      case "active":
        return darkMode ? "#0d652d" : "#d9f0e1";
      case "inactive":
        return darkMode ? "#3c4043" : "#f5f5f5";
      case "maintenance":
        return darkMode ? "#653c00" : "#fef7e0";
      default:
        return darkMode ? "#3c4043" : "#f5f5f5";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "main":
        return "#4285f4";
      case "distribution":
        return "#34a853";
      case "storage":
        return "#fbbc04";
      case "cold-storage":
        return "#8ab4f8";
      default:
        return "#9aa0a6";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateOccupancyPercentage = (current: number, capacity: number) => {
    return capacity > 0 ? Math.round((current / capacity) * 100) : 0;
  };

  if (loading && !warehouses.length) {
    return (
      <MainLayout title="Warehouse Management">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress sx={{ color: "#4285f4" }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Warehouse Management">
      <Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Fade in>
            <Breadcrumbs
              sx={{
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
              }}
            >
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 300,
                  "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
                }}
              >
                <HomeIcon
                  sx={{
                    mr: 0.5,
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  }}
                />
                Dashboard
              </MuiLink>
              <Typography
                color={darkMode ? "#e8eaed" : "#202124"}
                fontWeight={400}
              >
                Warehouse Management
              </Typography>
            </Breadcrumbs>
          </Fade>

          <Fade in timeout={300}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1.5, sm: 2 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
                  fontWeight={500}
                  gutterBottom
                  sx={{
                    fontSize: {
                      xs: "1.25rem",
                      sm: "1.5rem",
                      md: "1.75rem",
                      lg: "2rem",
                    },
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  Warehouse Management
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: darkMode ? "#9aa0a6" : "#5f6368",
                    fontWeight: 300,
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.85rem",
                      md: "0.9rem",
                      lg: "1rem",
                    },
                    lineHeight: 1.4,
                  }}
                >
                  Manage your storage facilities and inventory locations
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ width: { xs: "100%", sm: "auto" }, flexWrap: "wrap" }}
              >
                <Button
                  startIcon={<Refresh />}
                  onClick={fetchWarehouses}
                  variant="outlined"
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderRadius: "12px",
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                    color: darkMode ? "#e8eaed" : "#202124",
                    fontWeight: 500,
                    minWidth: "auto",
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 0.75 },
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                    "&:hover": {
                      borderColor: darkMode ? "#5f6368" : "#202124",
                      backgroundColor: darkMode ? "#3c4043" : "#f8f9fa",
                    },
                  }}
                >
                  {isMobile ? "" : "Refresh"}
                </Button>

                <Button
                  startIcon={<Add />}
                  onClick={() =>
                    (window.location.href = "/material/warehouse/new")
                  }
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#34a853",
                    color: "white",
                    fontWeight: 500,
                    minWidth: "auto",
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 0.75 },
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                    "&:hover": {
                      backgroundColor: "#2d9248",
                      boxShadow: "0 4px 12px rgba(52, 168, 83, 0.3)",
                    },
                  }}
                >
                  Add Warehouse
                </Button>

                <Button
                  startIcon={<Download />}
                  onClick={handleExportClick}
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#4285f4",
                    color: "white",
                    fontWeight: 500,
                    minWidth: "auto",
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 0.75 },
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                    "&:hover": {
                      backgroundColor: "#3367d6",
                      boxShadow: "0 4px 12px rgba(66, 133, 244, 0.3)",
                    },
                  }}
                >
                  {isMobile ? "" : "Export"}
                </Button>
              </Stack>
            </Box>
          </Fade>

          {/* Export Menu */}
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleExportMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
                borderRadius: "12px",
                boxShadow: darkMode
                  ? "0 8px 24px rgba(0,0,0,0.4)"
                  : "0 8px 24px rgba(0,0,0,0.1)",
                minWidth: 180,
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={handleExportCSV}
              sx={{
                color: darkMode ? "#e8eaed" : "#202124",
                fontSize: "0.875rem",
                fontWeight: 400,
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode ? "#3c4043" : "#f8f9fa",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <ExcelIcon fontSize="small" />
                <Typography variant="body2">CSV Export</Typography>
              </Stack>
            </MenuItem>
            <MenuItem
              onClick={handleExportExcel}
              sx={{
                color: darkMode ? "#e8eaed" : "#202124",
                fontSize: "0.875rem",
                fontWeight: 400,
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode ? "#3c4043" : "#f8f9fa",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <ExcelIcon fontSize="small" />
                <Typography variant="body2">Excel Export</Typography>
              </Stack>
            </MenuItem>
            <MenuItem
              onClick={handleExportPDF}
              sx={{
                color: darkMode ? "#e8eaed" : "#202124",
                fontSize: "0.875rem",
                fontWeight: 400,
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode ? "#3c4043" : "#f8f9fa",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <PdfIcon fontSize="small" />
                <Typography variant="body2">PDF Report</Typography>
              </Stack>
            </MenuItem>
            <Divider
              sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0", my: 0.5 }}
            />
            <MenuItem
              onClick={handleExportAll}
              sx={{
                color: darkMode ? "#8ab4f8" : "#1a73e8",
                fontSize: "0.875rem",
                fontWeight: 500,
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode ? "#3c4043" : "#f8f9fa",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <CloudDownloadIcon fontSize="small" />
                <Typography variant="body2">Export All</Typography>
              </Stack>
            </MenuItem>
          </Menu>
        </Box>

        {/* Error Alert */}
        {error && (
          <Fade in>
            <Alert
              severity="error"
              sx={{
                mb: { xs: 2, sm: 3 },
                borderRadius: "12px",
                backgroundColor: darkMode ? "#422006" : "#fef7e0",
                color: darkMode ? "#fbbc04" : "#f57c00",
                border: darkMode ? "1px solid #653c00" : "1px solid #ffcc80",
                fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                fontWeight: 400,
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Stats Summary */}
        <Fade in timeout={400}>
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
                title: "Total Warehouses",
                value: pagination.total,
                icon: <Warehouse />,
                color: "#4285f4",
                description: "All storage facilities",
              },
              {
                title: "Active Warehouses",
                value: warehouses.filter((w) => w.status === "active").length,
                icon: <CheckCircle />,
                color: "#34a853",
                description: "Currently operational",
              },
              {
                title: "Total Capacity",
                value: `${warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()} sq ft`,
                icon: <Storage />,
                color: "#fbbc04",
                description: "Combined storage space",
              },
              {
                title: "Total Inventory Value",
                value: formatCurrency(
                  warehouses.reduce((sum, w) => sum + w.totalValue, 0),
                ),
                icon: <AttachMoney />,
                color: "#ea4335",
                description: "Value across all warehouses",
              },
            ].map((stat, index) => (
              <Paper
                key={`stat-${index}`}
                sx={{
                  flex: "1 1 calc(25% - 24px)",
                  minWidth: { xs: "calc(50% - 12px)", sm: "calc(25% - 24px)" },
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
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
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
                    <Box sx={{ flex: 1 }}>
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
                          lineHeight: 1.2,
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                          color: stat.color,
                          fontWeight: 600,
                          fontSize: {
                            xs: "1.1rem",
                            sm: "1.25rem",
                            md: "1.5rem",
                          },
                          lineHeight: 1.2,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#9aa0a6" : "#5f6368",
                      fontWeight: 300,
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                      display: "block",
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Fade>

        {/* Filters */}
        <Fade in timeout={500}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
              borderRadius: "16px",
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FilterList sx={{ color: "#4285f4" }} />
                <Typography variant="subtitle2" fontWeight={500}>
                  Filters
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Button
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                  size="small"
                  sx={{
                    color: darkMode ? "#9aa0a6" : "#5f6368",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                >
                  Clear All
                </Button>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                useFlexGap
              >
                <TextField
                  size="small"
                  placeholder="Search warehouses..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl
                  size="small"
                  sx={{ minWidth: { xs: "100%", sm: 150 } }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    label="Status"
                    input={<OutlinedInput label="Status" />}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  size="small"
                  sx={{ minWidth: { xs: "100%", sm: 150 } }}
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    label="Type"
                    input={<OutlinedInput label="Type" />}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="main">Main Warehouse</MenuItem>
                    <MenuItem value="distribution">
                      Distribution Center
                    </MenuItem>
                    <MenuItem value="storage">Storage Facility</MenuItem>
                    <MenuItem value="cold-storage">Cold Storage</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Warehouses Table */}
        <Fade in timeout={600}>
          <Paper
            sx={{
              borderRadius: "16px",
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead
                  sx={{ backgroundColor: darkMode ? "#202124" : "#f8f9fa" }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      }}
                    >
                      Warehouse
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      }}
                    >
                      Location
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      }}
                    >
                      Capacity & Occupancy
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      }}
                    >
                      Materials
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      }}
                    >
                      Last Inventory
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {warehouses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                        >
                          No warehouses found
                        </Typography>
                        <Button
                          startIcon={<Add />}
                          onClick={() =>
                            (window.location.href = "/material/warehouse/new")
                          }
                          variant="outlined"
                          sx={{ mt: 2 }}
                        >
                          Add Your First Warehouse
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    warehouses.map((warehouse, index) => {
                      const occupancyPercent = calculateOccupancyPercentage(
                        warehouse.currentOccupancy,
                        warehouse.capacity,
                      );

                      return (
                        <TableRow
                          key={warehouse._id}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha("#4285f4", 0.1),
                                  color: "#4285f4",
                                  fontWeight: 600,
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                {getInitials(warehouse.name)}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    color: darkMode ? "#e8eaed" : "#202124",
                                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                  }}
                                >
                                  {warehouse.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: darkMode ? "#9aa0a6" : "#5f6368",
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                  }}
                                >
                                  {warehouse.code}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: darkMode ? "#e8eaed" : "#202124",
                                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <LocationOn fontSize="inherit" />{" "}
                                {warehouse.location}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: darkMode ? "#9aa0a6" : "#5f6368",
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                }}
                              >
                                {warehouse.type.charAt(0).toUpperCase() +
                                  warehouse.type.slice(1)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={1}>
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: darkMode ? "#9aa0a6" : "#5f6368",
                                    display: "block",
                                  }}
                                >
                                  {warehouse.currentOccupancy.toLocaleString()}{" "}
                                  / {warehouse.capacity.toLocaleString()} sq ft
                                </Typography>
                                <Box
                                  sx={{
                                    position: "relative",
                                    height: 6,
                                    backgroundColor: darkMode
                                      ? "#3c4043"
                                      : "#e0e0e0",
                                    borderRadius: 3,
                                    mt: 0.5,
                                    overflow: "hidden",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      left: 0,
                                      top: 0,
                                      height: "100%",
                                      width: `${occupancyPercent}%`,
                                      backgroundColor:
                                        occupancyPercent > 85
                                          ? "#ea4335"
                                          : occupancyPercent > 70
                                            ? "#fbbc04"
                                            : "#34a853",
                                      borderRadius: 3,
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: darkMode ? "#9aa0a6" : "#5f6368",
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                }}
                              >
                                {occupancyPercent}% occupied
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={warehouse.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusBackgroundColor(
                                  warehouse.status,
                                  darkMode,
                                ),
                                color: getStatusColor(warehouse.status),
                                fontWeight: 500,
                                textTransform: "capitalize",
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: darkMode ? "#e8eaed" : "#202124",
                                }}
                              >
                                {warehouse.materialsCount} materials
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: darkMode ? "#9aa0a6" : "#5f6368",
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                }}
                              >
                                {formatCurrency(warehouse.totalValue)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: darkMode ? "#e8eaed" : "#202124",
                                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                }}
                              >
                                {new Date(
                                  warehouse.lastInventory,
                                ).toLocaleDateString()}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: darkMode ? "#9aa0a6" : "#202124",
                                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: darkMode ? "#9aa0a6" : "#5f6368",
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                  }}
                                >
                                  Last updated
                                </Typography>
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(warehouse)}
                                sx={{
                                  color: "#4285f4",
                                  "&:hover": {
                                    backgroundColor: alpha("#4285f4", 0.1),
                                  },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleEditWarehouse(warehouse)}
                                sx={{
                                  color: "#fbbc04",
                                  "&:hover": {
                                    backgroundColor: alpha("#fbbc04", 0.1),
                                  },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteWarehouse(warehouse)}
                                sx={{
                                  color: "#ea4335",
                                  "&:hover": {
                                    backgroundColor: alpha("#ea4335", 0.1),
                                  },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page}
              onPageChange={handlePageChange}
              rowsPerPage={pagination.limit}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 20, 50, 100]}
              sx={{
                borderTop: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
                color: darkMode ? "#e8eaed" : "#202124",
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    color: darkMode ? "#e8eaed" : "#202124",
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  },
              }}
            />
          </Paper>
        </Fade>

        {/* Warehouse Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            },
          }}
        >
          {selectedWarehouse && (
            <>
              <DialogTitle
                sx={{
                  backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                  borderBottom: darkMode
                    ? "1px solid #3c4043"
                    : "1px solid #dadce0",
                  py: 2,
                  px: 3,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha("#4285f4", 0.1),
                      color: "#4285f4",
                      fontWeight: 600,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {getInitials(selectedWarehouse.name)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                      }}
                    >
                      {selectedWarehouse.name}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                        }}
                      >
                        {selectedWarehouse.code}
                      </Typography>
                      <Chip
                        label={selectedWarehouse.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusBackgroundColor(
                            selectedWarehouse.status,
                            darkMode,
                          ),
                          color: getStatusColor(selectedWarehouse.status),
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      />
                      <Chip
                        label={selectedWarehouse.type}
                        size="small"
                        sx={{
                          backgroundColor: alpha(
                            getTypeColor(selectedWarehouse.type),
                            0.1,
                          ),
                          color: getTypeColor(selectedWarehouse.type),
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </DialogTitle>

              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Storage fontSize="small" /> Basic Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                          }}
                        >
                          Location
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: darkMode ? "#e8eaed" : "#202124",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocationOn fontSize="small" />{" "}
                          {selectedWarehouse.location}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        >
                          {selectedWarehouse.address}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                          }}
                        >
                          Contact Information
                        </Typography>
                        <Stack spacing={0.5}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Person fontSize="small" />{" "}
                            {selectedWarehouse.contactPerson}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Schedule fontSize="small" />{" "}
                            {selectedWarehouse.phone}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Warehouse fontSize="small" />{" "}
                            {selectedWarehouse.email}
                          </Typography>
                        </Stack>
                      </Box>

                      {selectedWarehouse.supervisor && (
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              display: "block",
                            }}
                          >
                            Supervisor
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                            }}
                          >
                            {selectedWarehouse.supervisor}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>

                  {/* Capacity & Inventory */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#e8eaed" : "#202124",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Inventory fontSize="small" /> Capacity & Inventory
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                          }}
                        >
                          Storage Capacity
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: darkMode ? "#e8eaed" : "#202124",
                          }}
                        >
                          {selectedWarehouse.capacity.toLocaleString()} sq ft
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                              }}
                            >
                              Occupancy
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: darkMode ? "#e8eaed" : "#202124",
                                fontWeight: 500,
                              }}
                            >
                              {calculateOccupancyPercentage(
                                selectedWarehouse.currentOccupancy,
                                selectedWarehouse.capacity,
                              )}
                              %
                            </Typography>
                          </Stack>
                          <Box
                            sx={{
                              position: "relative",
                              height: 8,
                              backgroundColor: darkMode ? "#3c4043" : "#e0e0e0",
                              borderRadius: 4,
                              mt: 0.5,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: `${calculateOccupancyPercentage(selectedWarehouse.currentOccupancy, selectedWarehouse.capacity)}%`,
                                backgroundColor:
                                  calculateOccupancyPercentage(
                                    selectedWarehouse.currentOccupancy,
                                    selectedWarehouse.capacity,
                                  ) > 85
                                    ? "#ea4335"
                                    : calculateOccupancyPercentage(
                                          selectedWarehouse.currentOccupancy,
                                          selectedWarehouse.capacity,
                                        ) > 70
                                      ? "#fbbc04"
                                      : "#34a853",
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                              display: "block",
                              mt: 0.5,
                            }}
                          >
                            {selectedWarehouse.currentOccupancy.toLocaleString()}{" "}
                            sq ft used
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                            display: "block",
                          }}
                        >
                          Inventory Summary
                        </Typography>
                        <Stack spacing={0.5}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Category fontSize="small" />{" "}
                            {selectedWarehouse.materialsCount} materials
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AttachMoney fontSize="small" />{" "}
                            {formatCurrency(selectedWarehouse.totalValue)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: darkMode ? "#e8eaed" : "#202124",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Schedule fontSize="small" /> Last inventory:{" "}
                            {new Date(
                              selectedWarehouse.lastInventory,
                            ).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Environmental Conditions */}
                  {(selectedWarehouse.temperatureRange ||
                    selectedWarehouse.humidityRange) && (
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: darkMode ? "#e8eaed" : "#202124",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Storage fontSize="small" /> Environmental Conditions
                      </Typography>
                      <Stack spacing={2}>
                        {selectedWarehouse.temperatureRange && (
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                                display: "block",
                              }}
                            >
                              Temperature Range
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: darkMode ? "#e8eaed" : "#202124",
                              }}
                            >
                              {selectedWarehouse.temperatureRange}
                            </Typography>
                          </Box>
                        )}
                        {selectedWarehouse.humidityRange && (
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: darkMode ? "#9aa0a6" : "#5f6368",
                                display: "block",
                              }}
                            >
                              Humidity Range
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: darkMode ? "#e8eaed" : "#202124",
                              }}
                            >
                              {selectedWarehouse.humidityRange}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                  )}

                  {/* Notes */}
                  {selectedWarehouse.notes && (
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: darkMode ? "#e8eaed" : "#202124",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Warning fontSize="small" /> Notes
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                          border: darkMode
                            ? "1px solid #3c4043"
                            : "1px solid #dadce0",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: darkMode ? "#e8eaed" : "#202124",
                          }}
                        >
                          {selectedWarehouse.notes}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>

              <DialogActions
                sx={{
                  px: 3,
                  py: 2,
                  borderTop: darkMode
                    ? "1px solid #3c4043"
                    : "1px solid #dadce0",
                }}
              >
                <Button
                  onClick={() => setDetailsDialogOpen(false)}
                  sx={{
                    color: darkMode ? "#9aa0a6" : "#5f6368",
                    fontWeight: 500,
                  }}
                >
                  Close
                </Button>
                <Button
                  startIcon={<Edit />}
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditWarehouse(selectedWarehouse);
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: "#4285f4",
                    color: "white",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#3367d6",
                    },
                  }}
                >
                  Edit Warehouse
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: darkMode ? "#e8eaed" : "#202124",
              fontWeight: 600,
              pb: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Error sx={{ color: "#ea4335" }} />
              <Typography variant="h6">Delete Warehouse</Typography>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "#e8eaed" : "#202124",
                mb: 2,
              }}
            >
              Are you sure you want to delete warehouse "
              {selectedWarehouse?.name}"? This action cannot be undone.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: darkMode ? "#ea4335" : "#d93025",
                fontWeight: 500,
              }}
            >
              Warning: This will permanently remove all warehouse data.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button
              startIcon={<Delete />}
              onClick={confirmDelete}
              variant="contained"
              sx={{
                backgroundColor: "#ea4335",
                color: "white",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#d93025",
                },
              }}
            >
              Delete Warehouse
            </Button>
          </DialogActions>
        </Dialog>

        {/* Empty State */}
        {warehouses.length === 0 && !loading && (
          <Fade in>
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
              }}
            >
              <Warehouse
                sx={{
                  fontSize: 80,
                  color: darkMode ? "#3c4043" : "#dadce0",
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: darkMode ? "#e8eaed" : "#202124",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                No Warehouses Found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  mb: 3,
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                You haven't added any warehouses yet. Add your first warehouse
                to start managing your inventory storage locations.
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={() =>
                  (window.location.href = "/material/warehouse/new")
                }
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#4285f4",
                  color: "white",
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#3367d6",
                    boxShadow: "0 8px 24px rgba(66, 133, 244, 0.3)",
                  },
                }}
              >
                Add Your First Warehouse
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </MainLayout>
  );
}
