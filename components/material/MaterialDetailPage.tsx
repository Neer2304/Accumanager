"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  Divider,
  Alert,
  LinearProgress,
  useTheme,
  alpha,
  Tab,
  Tabs,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Inventory,
  AttachMoney,
  Business,
  LocationOn,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
  History,
  Receipt,
  Download,
  Share,
  Print,
  MoreVert,
  ShoppingCart,
  Category,
  Numbers,
  AccessTime,
  LocalShipping,
  SafetyCheck,
  CalendarToday,
  QrCode,
  Image,
  Attachment,
  Person,
  Build,
  Science,
  Memory,
  LocalOffer,
  Storage,
  Height,
  Scale,
  Straighten,
  FiberManualRecord,
  NavigateNext,
  Home,
} from "@mui/icons-material";
import { useMaterials } from "./hooks/useMaterials";
import {
  getStatusColor,
  getStatusLabel,
  getCategoryLabel,
  getUnitLabel,
  getCategoryColor,
} from "./types/material.types";
import { MaterialUseDialog } from "./components/MaterialUseDialog";
import { MaterialRestockDialog } from "./components/MaterialRestockDialog";
import { formatCurrency } from "@/lib/utils";

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();

  const {
    currentMaterial,
    loading,
    error,
    fetchMaterial,
    deleteMaterial,
    useMaterial,
    restockMaterial,
    setError,
  } = useMaterials();

  const [activeTab, setActiveTab] = useState(0);
  const [useDialogOpen, setUseDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchMaterial(id as string);
    }
  }, [id]);

  const handleEdit = () => {
    if (currentMaterial) {
      router.push(`/materials/${currentMaterial._id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (currentMaterial) {
      try {
        await deleteMaterial(currentMaterial._id);
        setDeleteDialogOpen(false);
        router.push("/materials");
      } catch (err) {
        // Error handled by hook
      }
    }
  };

  const handleUse = async (request: any) => {
    try {
      await useMaterial(request);
      setUseDialogOpen(false);
      fetchMaterial(id as string);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleRestock = async (request: any) => {
    try {
      await restockMaterial(request);
      setRestockDialogOpen(false);
      fetchMaterial(id as string);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: string) => {
    setExportFormat(format);
    handleMenuClose();
    console.log(`Exporting material as ${format}`);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  if (loading && !currentMaterial) {
    return (
      <Container sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!currentMaterial) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Material Not Found
          </Typography>
          <Typography variant="body2">
            The material you're looking for doesn't exist or you don't have
            permission to view it.
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/materials")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Back to Materials
        </Button>
      </Container>
    );
  }

  const material = currentMaterial;
  const stockPercentage = material.maximumStock
    ? (material.currentStock / material.maximumStock) * 100
    : (material.currentStock / (material.minimumStock * 3)) * 100;

  const isLowStock = material.currentStock <= material.minimumStock;
  const isOutOfStock = material.currentStock === 0;
  const isNearExpiry =
    material.expirationDate &&
    new Date(material.expirationDate) <
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const tabs = [
    { label: "Overview", icon: <Inventory /> },
    { label: "History", icon: <History /> },
    { label: "Documents", icon: <Attachment /> },
    { label: "Settings", icon: <Build /> },
  ];

  const getStatusIcon = () => {
    switch (material.status) {
      case "in-stock":
        return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      case "low-stock":
        return <Warning sx={{ color: theme.palette.warning.main }} />;
      case "out-of-stock":
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <Inventory sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  const getCategoryIcon = () => {
    switch (material.category) {
      case "raw":
        return <Science sx={{ color: getCategoryColor(material.category) }} />;
      case "packaging":
        return (
          <LocalOffer sx={{ color: getCategoryColor(material.category) }} />
        );
      case "tool":
        return <Build sx={{ color: getCategoryColor(material.category) }} />;
      case "electronic":
        return <Memory sx={{ color: getCategoryColor(material.category) }} />;
      case "chemical":
        return <Science sx={{ color: getCategoryColor(material.category) }} />;
      case "mechanical":
        return <Build sx={{ color: getCategoryColor(material.category) }} />;
      case "consumable":
        return (
          <LocalOffer sx={{ color: getCategoryColor(material.category) }} />
        );
      default:
        return <Category sx={{ color: getCategoryColor(material.category) }} />;
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, md: 3 } }}
      className={isPrinting ? "print-mode" : ""}
    >
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-mode * {
            visibility: visible;
          }
          .no-print {
            display: none !important;
          }
          .print-mode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/materials"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Inventory sx={{ mr: 0.5 }} fontSize="inherit" />
          Materials
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LocalOffer sx={{ mr: 0.5 }} fontSize="inherit" />
          {material.name}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(
            getStatusColor(material.status),
            0.08
          )} 0%, ${alpha(getStatusColor(material.status), 0.03)} 100%)`,
          border: `1px solid ${alpha(getStatusColor(material.status), 0.2)}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              getStatusColor(material.status),
              0.1
            )} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                {getStatusIcon()}
                <Chip
                  label={getStatusLabel(material.status)}
                  size="small"
                  sx={{
                    backgroundColor: alpha(
                      getStatusColor(material.status),
                      0.1
                    ),
                    color: getStatusColor(material.status),
                    fontWeight: 600,
                  }}
                />
                {isNearExpiry && (
                  <Chip
                    label="Expiring Soon"
                    size="small"
                    color="warning"
                    icon={<Warning />}
                  />
                )}
              </Box>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {material.name}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Numbers fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    SKU: {material.sku}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {getCategoryIcon()}
                  <Typography variant="body2" color="text.secondary">
                    {getCategoryLabel(material.category)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Updated: {new Date(material.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>

              {material.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1, maxWidth: "800px" }}
                >
                  {material.description}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1} className="no-print">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push("/materials")}
                variant="outlined"
                size="small"
              >
                Back
              </Button>

              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleExport("pdf")}>
                  <Download sx={{ mr: 1 }} />
                  Export as PDF
                </MenuItem>
                <MenuItem onClick={() => handleExport("csv")}>
                  <Download sx={{ mr: 1 }} />
                  Export as CSV
                </MenuItem>
                <MenuItem onClick={handlePrint}>
                  <Print sx={{ mr: 1 }} />
                  Print
                </MenuItem>
                <MenuItem onClick={() => {}}>
                  <Share sx={{ mr: 1 }} />
                  Share
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleEdit}>
                  <Edit sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ color: theme.palette.error.main }}
                >
                  <Delete sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </Stack>
          </Box>

          {/* Quick Stats - Using Flexbox instead of Grid */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                flex: "1 1 calc(25% - 16px)",
                minWidth: { xs: "100%", sm: "200px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Current Stock
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {material.currentStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getUnitLabel(material.unit)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Min: {material.minimumStock} • Max:{" "}
                {material.maximumStock || "∞"}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                flex: "1 1 calc(25% - 16px)",
                minWidth: { xs: "100%", sm: "200px" },
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Total Value
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {formatCurrency(material.currentStock * material.unitCost)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Unit Cost: {formatCurrency(material.unitCost)}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                flex: "1 1 calc(25% - 16px)",
                minWidth: { xs: "100%", sm: "200px" },
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Usage Stats
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {material.totalQuantityUsed}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Used
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {material.averageMonthlyUsage.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg/Month
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                flex: "1 1 calc(25% - 16px)",
                minWidth: { xs: "100%", sm: "200px" },
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Location
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="body1">
                    {material.storageLocation || "Not Set"}
                  </Typography>
                  {material.shelf || material.bin ? (
                    <Typography variant="caption" color="text.secondary">
                      {material.shelf && `Shelf ${material.shelf}`}
                      {material.bin && ` • Bin ${material.bin}`}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
          onClose={() => setError(null)}
        >
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} className="no-print">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          flexWrap="wrap"
          gap={2}
        >
          <Button
            startIcon={<ShoppingCart />}
            onClick={() => setRestockDialogOpen(true)}
            variant="contained"
            color="success"
            size="large"
            sx={{ minWidth: 200 }}
          >
            Restock Material
          </Button>
          <Button
            startIcon={<Receipt />}
            onClick={() => setUseDialogOpen(true)}
            variant="contained"
            color="error"
            size="large"
            disabled={material.currentStock === 0}
            sx={{ minWidth: 200 }}
          >
            Use Material
          </Button>
          <Button
            startIcon={<Edit />}
            onClick={handleEdit}
            variant="outlined"
            size="large"
            sx={{ minWidth: 200 }}
          >
            Edit Details
          </Button>
        </Stack>
      </Paper>

      {/* Stock Progress */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Stock Level
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current stock: {material.currentStock}{" "}
              {getUnitLabel(material.unit)}
            </Typography>
          </Box>
          <Chip
            label={material.status.toUpperCase()}
            size="small"
            color={
              material.status === "low-stock"
                ? "warning"
                : material.status === "out-of-stock"
                ? "error"
                : "success"
            }
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Stock Level Visualization */}
        <Box sx={{ mb: 4 }}>
          {/* Visual representation of stock level */}
          <Box
            sx={{
              position: "relative",
              height: 40,
              backgroundColor: alpha(theme.palette.grey[200], 0.5),
              borderRadius: 8,
              mb: 3,
              overflow: "hidden",
              border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
            }}
          >
            {/* Current stock level - filled portion */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${stockPercentage}%`,
                backgroundColor: getStatusColor(material.status),
                transition: "width 0.5s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                pr: 2,
              }}
            >
              {stockPercentage > 30 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {material.currentStock}
                </Typography>
              )}
            </Box>

            {/* Stock level number on the right when percentage is low */}
            {stockPercentage <= 30 && (
              <Box
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={getStatusColor(material.status)}
                >
                  {material.currentStock}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Reference Points */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "relative",
              height: 40,
              px: 1,
            }}
          >
            {/* Starting point */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                position: "absolute",
                left: 0,
                bottom: 0,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                0
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.65rem"
              >
                Empty
              </Typography>
            </Box>

            {/* Minimum Stock Marker */}
            <Box
              sx={{
                position: "absolute",
                left: `${Math.min(
                  100,
                  Math.max(
                    0,
                    (material.minimumStock /
                      (material.maximumStock || material.minimumStock * 3)) *
                      100
                  )
                )}%`,
                bottom: 0,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 12,
                  backgroundColor: theme.palette.error.main,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: "white",
                  px: 1,
                  py: 0.25,
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  fontSize="0.65rem"
                >
                  MIN: {material.minimumStock}
                </Typography>
              </Box>
            </Box>

            {/* Reorder Point Marker */}
            {material.reorderPoint &&
              material.reorderPoint > material.minimumStock && (
                <Box
                  sx={{
                    position: "absolute",
                    left: `${Math.min(
                      100,
                      Math.max(
                        0,
                        (material.reorderPoint /
                          (material.maximumStock ||
                            material.minimumStock * 3)) *
                          100
                      )
                    )}%`,
                    bottom: 0,
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 2,
                      height: 12,
                      backgroundColor: theme.palette.info.main,
                      mb: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      backgroundColor: theme.palette.info.main,
                      color: "white",
                      px: 1,
                      py: 0.25,
                      borderRadius: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      fontSize="0.65rem"
                    >
                      REORDER: {material.reorderPoint}
                    </Typography>
                  </Box>
                </Box>
              )}

            {/* Maximum Stock Marker */}
            {material.maximumStock && (
              <Box
                sx={{
                  position: "absolute",
                  left: `${Math.min(
                    100,
                    Math.max(
                      0,
                      (material.maximumStock /
                        (material.maximumStock || material.minimumStock * 3)) *
                        100
                    )
                  )}%`,
                  bottom: 0,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 2,
                    height: 12,
                    backgroundColor: theme.palette.warning.main,
                    mb: 0.5,
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: theme.palette.warning.main,
                    color: "white",
                    px: 1,
                    py: 0.25,
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontSize="0.65rem"
                  >
                    MAX: {material.maximumStock}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* End point */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                position: "absolute",
                right: 0,
                bottom: 0,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {material.maximumStock || material.minimumStock * 3}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.65rem"
              >
                Full
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mt: 3,
          }}
        >
          {/* Stock Level Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: "1 1 200px",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: getStatusColor(material.status),
              }}
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Stock Level
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {stockPercentage.toFixed(1)}% of capacity
              </Typography>
            </Box>
          </Box>

          {/* Low Stock Alert */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: "1 1 200px",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: isLowStock
                  ? theme.palette.warning.main
                  : theme.palette.grey[400],
              }}
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Low Stock Alert
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                color={isLowStock ? "warning.main" : "text.primary"}
              >
                {isLowStock ? "Active" : "Inactive"}
              </Typography>
            </Box>
          </Box>

          {/* Expiration Status */}
          {material.expirationDate && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flex: "1 1 200px",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: isNearExpiry
                    ? theme.palette.error.main
                    : theme.palette.grey[400],
                }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Expires
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color={isNearExpiry ? "error.main" : "text.primary"}
                >
                  {new Date(material.expirationDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            "& .MuiTab-root": {
              py: 2,
              minWidth: 120,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: 60 }}
            />
          ))}
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 3,
              }}
            >
              {/* Left Column */}
              <Box sx={{ flex: 2 }}>
                <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Detailed Information
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
                    }}
                  >
                    {/* Basic Information */}
                    <Box sx={{ flex: 1 }}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <Category />
                          </ListItemIcon>
                          <ListItemText
                            primary="Category"
                            secondary={getCategoryLabel(material.category)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Scale />
                          </ListItemIcon>
                          <ListItemText
                            primary="Unit"
                            secondary={getUnitLabel(material.unit)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AttachMoney />
                          </ListItemIcon>
                          <ListItemText
                            primary="Unit Cost"
                            secondary={formatCurrency(material.unitCost)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Storage />
                          </ListItemIcon>
                          <ListItemText
                            primary="Stock Status"
                            secondary={
                              <Chip
                                component="span"
                                label={getStatusLabel(material.status)}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(
                                    getStatusColor(material.status),
                                    0.1
                                  ),
                                  color: getStatusColor(material.status),
                                  display: 'inline-flex',
                                }}
                              />
                            }
                          />
                        </ListItem>
                      </List>
                    </Box>

                    {/* Supplier Information */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        color="text.secondary"
                      >
                        Supplier Details
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <Business />
                          </ListItemIcon>
                          <ListItemText
                            primary="Supplier"
                            secondary={material.supplierName || "Not specified"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Numbers />
                          </ListItemIcon>
                          <ListItemText
                            primary="Supplier Code"
                            secondary={material.supplierCode || "Not specified"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText
                            primary="Contact"
                            secondary={
                              material.supplierContact || "Not specified"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LocalShipping />
                          </ListItemIcon>
                          <ListItemText
                            primary="Lead Time"
                            secondary={
                              material.leadTime
                                ? `${material.leadTime} days`
                                : "Not specified"
                            }
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Box>

                  {/* Location Details */}
                  {material.storageLocation && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        color="text.secondary"
                      >
                        Storage Location
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LocationOn />
                          <Box>
                            <Typography variant="body2">Location</Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {material.storageLocation}
                            </Typography>
                          </Box>
                        </Box>
                        {material.shelf && (
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Height />
                            <Box>
                              <Typography variant="body2">Shelf</Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {material.shelf}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        {material.bin && (
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Storage />
                            <Box>
                              <Typography variant="body2">Bin</Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {material.bin}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </>
                  )}

                  {/* Additional Info */}
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    color="text.secondary"
                  >
                    Additional Information
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {material.batchNumber && (
                      <Chip
                        icon={<Numbers />}
                        label={`Batch: ${material.batchNumber}`}
                        variant="outlined"
                      />
                    )}
                    {material.expirationDate && (
                      <Chip
                        icon={<CalendarToday />}
                        label={`Expires: ${new Date(
                          material.expirationDate
                        ).toLocaleDateString()}`}
                        color={isNearExpiry ? "warning" : "default"}
                        variant="outlined"
                      />
                    )}
                    <Chip
                      icon={<SafetyCheck />}
                      label={
                        material.lowStockAlert
                          ? "Alerts Active"
                          : "Alerts Inactive"
                      }
                      color={material.lowStockAlert ? "success" : "default"}
                      variant="outlined"
                    />
                  </Box>
                </Paper>
              </Box>

              {/* Right Column - Stats */}
              <Box sx={{ flex: 1 }}>
                <Stack spacing={3}>
                  {/* Inventory Stats */}
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Inventory Statistics
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Added
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {material.totalQuantityAdded}{" "}
                          {getUnitLabel(material.unit)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Used
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {material.totalQuantityUsed}{" "}
                          {getUnitLabel(material.unit)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Average Monthly Usage
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {material.averageMonthlyUsage.toFixed(1)}{" "}
                          {getUnitLabel(material.unit)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Reorder Point
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {material.reorderPoint} {getUnitLabel(material.unit)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Last Activity */}
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Last Activity
                    </Typography>
                    <List dense>
                      {material.lastUsed && (
                        <ListItem>
                          <ListItemIcon>
                            <Receipt />
                          </ListItemIcon>
                          <ListItemText
                            primary="Last Used"
                            secondary={new Date(
                              material.lastUsed
                            ).toLocaleDateString()}
                          />
                        </ListItem>
                      )}
                      {material.lastRestocked && (
                        <ListItem>
                          <ListItemIcon>
                            <ShoppingCart />
                          </ListItemIcon>
                          <ListItemText
                            primary="Last Restocked"
                            secondary={new Date(
                              material.lastRestocked
                            ).toLocaleDateString()}
                          />
                        </ListItem>
                      )}
                      <ListItem>
                        <ListItemIcon>
                          <Edit />
                        </ListItemIcon>
                        <ListItemText
                          primary="Last Updated"
                          secondary={new Date(
                            material.updatedAt
                          ).toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday />
                        </ListItemIcon>
                        <ListItemText
                          primary="Created"
                          secondary={new Date(
                            material.createdAt
                          ).toLocaleDateString()}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Stack>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              {/* Usage History */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Usage History
                  </Typography>
                  {material.usageHistory.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <Receipt
                        sx={{
                          fontSize: 48,
                          color: theme.palette.grey[300],
                          mb: 2,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        No usage history recorded yet.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ maxHeight: 400, overflow: "auto" }}>
                      {material.usageHistory
                        .slice()
                        .reverse()
                        .map((usage, index) => (
                          <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                              <ListItemIcon>
                                <Receipt color="error" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    -{usage.quantity}{" "}
                                    {getUnitLabel(material.unit)}
                                  </Typography>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      variant="body2"
                                      color="text.primary"
                                      gutterBottom
                                    >
                                      Used by {usage.usedBy}
                                      {usage.project &&
                                        ` • Project: ${usage.project}`}
                                    </Typography>
                                    {usage.note && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                      >
                                        Note: {usage.note}
                                      </Typography>
                                    )}
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Cost: {formatCurrency(usage.cost)} •{" "}
                                      {new Date(usage.usedAt).toLocaleString()}
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            {index < material.usageHistory.length - 1 && (
                              <Divider variant="inset" component="li" />
                            )}
                          </React.Fragment>
                        ))}
                    </List>
                  )}
                </Paper>
              </Box>

              {/* Restock History */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Restock History
                  </Typography>
                  {material.restockHistory.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <ShoppingCart
                        sx={{
                          fontSize: 48,
                          color: theme.palette.grey[300],
                          mb: 2,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        No restock history recorded yet.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ maxHeight: 400, overflow: "auto" }}>
                      {material.restockHistory
                        .slice()
                        .reverse()
                        .map((restock, index) => (
                          <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                              <ListItemIcon>
                                <ShoppingCart color="success" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    +{restock.quantity}{" "}
                                    {getUnitLabel(material.unit)}
                                  </Typography>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      variant="body2"
                                      color="text.primary"
                                      gutterBottom
                                    >
                                      {restock.supplier &&
                                        `Supplier: ${restock.supplier}`}
                                      {restock.purchaseOrder &&
                                        ` • PO: ${restock.purchaseOrder}`}
                                    </Typography>
                                    {restock.note && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                      >
                                        Note: {restock.note}
                                      </Typography>
                                    )}
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Unit: {formatCurrency(restock.unitCost)} •
                                      Total: {formatCurrency(restock.totalCost)}{" "}
                                      •{" "}
                                      {new Date(
                                        restock.restockedAt
                                      ).toLocaleString()}
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            {index < material.restockHistory.length - 1 && (
                              <Divider variant="inset" component="li" />
                            )}
                          </React.Fragment>
                        ))}
                    </List>
                  )}
                </Paper>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Documents & Images
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Images */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="text.secondary"
                  >
                    Images ({material.images?.length || 0})
                  </Typography>
                  {!material.images || material.images.length === 0 ? (
                    <Box
                      sx={{
                        py: 4,
                        textAlign: "center",
                        border: `2px dashed ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                        borderRadius: 2,
                      }}
                    >
                      <Image
                        sx={{
                          fontSize: 48,
                          color: theme.palette.grey[300],
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        No images uploaded
                      </Typography>
                      <Button variant="outlined" startIcon={<Image />}>
                        Upload Image
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {material.images.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "calc(50% - 8px)",
                              md: "calc(33.333% - 11px)",
                            },
                          }}
                        >
                          <Card>
                            <Box
                              sx={{
                                height: 150,
                                backgroundImage: `url(${image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <CardContent sx={{ p: 1 }}>
                              <Button size="small">View</Button>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Documents */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="text.secondary"
                  >
                    Documents ({material.documents?.length || 0})
                  </Typography>
                  {!material.documents || material.documents.length === 0 ? (
                    <Box
                      sx={{
                        py: 4,
                        textAlign: "center",
                        border: `2px dashed ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                        borderRadius: 2,
                      }}
                    >
                      <Attachment
                        sx={{
                          fontSize: 48,
                          color: theme.palette.grey[300],
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        No documents uploaded
                      </Typography>
                      <Button variant="outlined" startIcon={<Attachment />}>
                        Upload Document
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {material.documents.map((doc, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton edge="end">
                              <Download />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <Attachment />
                          </ListItemIcon>
                          <ListItemText
                            primary={doc.name}
                            secondary={`${
                              doc.type
                            } • Uploaded: ${new Date().toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Box>
            </Paper>
          )}

          {activeTab === 3 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Material Settings
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        color="text.secondary"
                      >
                        Alert Settings
                      </Typography>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography>Low Stock Alerts</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Get notified when stock is low
                            </Typography>
                          </Box>
                          <Button
                            variant={
                              material.lowStockAlert ? "contained" : "outlined"
                            }
                            color={
                              material.lowStockAlert ? "success" : "inherit"
                            }
                            size="small"
                          >
                            {material.lowStockAlert ? "Enabled" : "Disabled"}
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography>Expiration Alerts</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Get notified before expiration
                            </Typography>
                          </Box>
                          <Button variant="outlined" size="small">
                            {material.expirationDate ? "Enabled" : "Disabled"}
                          </Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        color="text.secondary"
                      >
                        Integration
                      </Typography>
                      <Stack spacing={2}>
                        <Button
                          startIcon={<QrCode />}
                          variant="outlined"
                          fullWidth
                        >
                          Generate QR Code
                        </Button>
                        <Button
                          startIcon={<Share />}
                          variant="outlined"
                          fullWidth
                        >
                          Share Access
                        </Button>
                        <Button
                          startIcon={<Print />}
                          variant="outlined"
                          fullWidth
                          onClick={handlePrint}
                        >
                          Print Label
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <MaterialUseDialog
        open={useDialogOpen}
        material={material}
        onClose={() => setUseDialogOpen(false)}
        onSubmit={handleUse}
        loading={loading}
      />

      <MaterialRestockDialog
        open={restockDialogOpen}
        material={material}
        onClose={() => setRestockDialogOpen(false)}
        onSubmit={handleRestock}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Delete color="error" />
            <Typography variant="h6">Delete Material</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Warning: This action cannot be undone!
            </Typography>
          </Alert>

          <Typography gutterBottom>
            Are you sure you want to delete the following material?
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              my: 2,
              backgroundColor: alpha(theme.palette.error.main, 0.05),
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {material.name}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                SKU: {material.sku}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Stock: {material.currentStock} {getUnitLabel(material.unit)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Value:{" "}
                {formatCurrency(material.currentStock * material.unitCost)}
              </Typography>
            </Box>
          </Paper>

          {material.currentStock > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This material still has {material.currentStock}{" "}
                {getUnitLabel(material.unit)} in stock. Deleting it will remove
                all stock and usage history permanently.
              </Typography>
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary">
            This will delete:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              <ListItemText primary="Material record" />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              <ListItemText primary="Stock history and tracking" />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              <ListItemText primary="All usage and restock records" />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              <ListItemText primary="Any attached images and documents" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Deleting..." : "Delete Material"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog
        open={!!exportFormat}
        onClose={() => setExportFormat("")}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Export {material.name}</DialogTitle>
        <DialogContent>
          <Typography>
            Exporting material as {exportFormat?.toUpperCase()}...
          </Typography>
          {exportFormat && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportFormat("")}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};