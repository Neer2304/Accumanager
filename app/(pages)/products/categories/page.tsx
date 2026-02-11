'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  Avatar,
  Tooltip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  MoreVert,
  Category,
  Inventory,
  AttachMoney,
  Refresh,
  Download,
  ContentCopy,
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";
import { MainLayout } from "@/components/Layout/MainLayout";

interface ProductCategory {
  name: string;
  description?: string;
  productCount: number;
  totalRevenue: number;
  isActive: boolean;
  subCategories?: string[];
  lastUpdated?: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  subCategory?: string;
  basePrice: number;
  brand?: string;
  isActive: boolean;
  createdAt?: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editCategory, setEditCategory] = useState<ProductCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Fetch products from API and extract categories
  const fetchData = async () => {
    setLoading(true);
    try {
      const productsResponse = await fetch("/api/products?limit=1000");
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
        
        // Extract unique categories from products
        const categoryMap = new Map<string, ProductCategory>();
        
        productsData.products?.forEach((product: Product) => {
          if (product.category) {
            const categoryName = product.category.trim();
            if (!categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, {
                name: categoryName,
                description: "",
                productCount: 0,
                totalRevenue: 0,
                isActive: true,
                subCategories: [],
                lastUpdated: product.createdAt,
              });
            }
            
            const category = categoryMap.get(categoryName)!;
            category.productCount += 1;
            category.totalRevenue += product.basePrice || 0;
            
            if (product.subCategory && !category.subCategories?.includes(product.subCategory)) {
              category.subCategories = [...(category.subCategories || []), product.subCategory];
            }
          }
        });
        
        const categoriesArray = Array.from(categoryMap.values());
        setCategories(categoriesArray);
        setFilteredCategories(categoriesArray);
      } else {
        toast.error("Failed to load products");
        setProducts([]);
        setCategories([]);
        setFilteredCategories([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
      setProducts([]);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...categories];

    if (searchTerm) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType === "active") {
      result = result.filter((category) => category.isActive);
    } else if (filterType === "inactive") {
      result = result.filter((category) => !category.isActive);
    } else if (filterType === "hasSub") {
      result = result.filter((category) => (category.subCategories?.length || 0) > 0);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "products":
          return b.productCount - a.productCount;
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        case "recent":
          const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return dateB - dateA;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCategories(result);
  }, [searchTerm, filterType, sortBy, categories]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, categoryName: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(categoryName);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase().trim())) {
      toast.error("Category already exists");
      return;
    }

    try {
      const newCategoryObj: ProductCategory = {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        productCount: 0,
        totalRevenue: 0,
        isActive: true,
        subCategories: [],
        lastUpdated: new Date().toISOString(),
      };

      setCategories([...categories, newCategoryObj]);
      setOpenCreateDialog(false);
      setNewCategory({
        name: "",
        description: "",
      });
      toast.success("Category created successfully");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleEditCategory = () => {
    if (!editCategory) return;

    try {
      setCategories(categories.map(cat => 
        cat.name === editCategory.name ? editCategory : cat
      ));
      
      setOpenEditDialog(false);
      setEditCategory(null);
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    const category = categories.find(cat => cat.name === selectedCategory);
    if (category?.productCount && category.productCount > 0) {
      toast.error("Cannot delete category with products. Please reassign or delete products first.");
      setOpenDeleteDialog(false);
      handleMenuClose();
      return;
    }

    try {
      setCategories(categories.filter(cat => cat.name !== selectedCategory));
      setOpenDeleteDialog(false);
      handleMenuClose();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleToggleExpand = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleViewProducts = (categoryName: string) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleDuplicateCategory = (category: ProductCategory) => {
    setNewCategory({
      name: `${category.name} (Copy)`,
      description: category.description || "",
    });
    setOpenCreateDialog(true);
    handleMenuClose();
  };

  const handleDownloadCSV = () => {
    if (filteredCategories.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Name", "Description", "Products", "Revenue", "Status", "Subcategories"];
    const csvData = filteredCategories.map(cat => [
      cat.name,
      cat.description || "",
      cat.productCount,
      cat.totalRevenue,
      cat.isActive ? "Active" : "Inactive",
      cat.subCategories?.join(", ") || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `categories_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("Categories exported successfully");
  };

  const getCategoryColor = (categoryName: string) => {
    const colors = [
      "#1a73e8", "#ea4335", "#34a853", "#fbbc04", "#8ab4f8",
      "#5f6368", "#4285f4", "#f28b82", "#81c995", "#fdd663",
    ];
    
    const hash = categoryName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Calculate totals
  const totalCategories = categories.length;
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
  const totalRevenue = categories.reduce((sum, cat) => sum + cat.totalRevenue, 0);
  const activeCategories = categories.filter((cat) => cat.isActive).length;

  // Loading skeleton
  if (loading) {
    return (
      <MainLayout title="Product Categories">
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
          <Stack spacing={3}>
            <Skeleton variant="rectangular" width="40%" height={48} sx={{ borderRadius: '12px' }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '16px' }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
          </Stack>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Product Categories">
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header - Google Material Design Style */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title="Back to Dashboard">
              <IconButton
                onClick={() => router.push("/dashboard")}
                sx={{
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '12px',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <BackIcon sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            
            <Breadcrumbs>
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: 16, sm: 18 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Dashboard
                </Box>
              </MuiLink>
              <MuiLink
                component={Link}
                href="/products"
                sx={{
                  textDecoration: 'none',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Products
              </MuiLink>
              <Typography
                color={darkMode ? '#e8eaed' : '#202124'}
                fontSize={{ xs: '0.875rem', sm: '1rem' }}
              >
                Categories
              </Typography>
            </Breadcrumbs>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={500}
                sx={{
                  color: darkMode ? '#e8eaed' : '#202124',
                  letterSpacing: '-0.5px',
                  mb: 1,
                }}
              >
                Product Categories
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                Manage and organize your product categories
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadCSV}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  borderRadius: '28px',
                  px: 3,
                  py: 1,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenCreateDialog(true)}
                sx={{
                  borderRadius: '28px',
                  px: 3,
                  py: 1,
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  color: darkMode ? '#202124' : '#ffffff',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                  flexGrow: { xs: 1, sm: 0 },
                  '&:hover': {
                    backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                    boxShadow: darkMode
                      ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                      : '0 4px 12px rgba(26, 115, 232, 0.3)',
                  },
                }}
              >
                New Category
              </Button>
            </Stack>
          </Box>
        </Stack>

        {/* Stats Cards - Google Material Design Style */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: darkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}
                >
                  <Category sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 0.5 }}
                  >
                    Total Categories
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={500}
                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  >
                    {totalCategories}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: darkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                    color: darkMode ? '#81c995' : '#34a853',
                  }}
                >
                  <Inventory sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 0.5 }}
                  >
                    Total Products
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={500}
                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  >
                    {totalProducts}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: darkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                    color: darkMode ? '#fdd663' : '#fbbc04',
                  }}
                >
                  <AttachMoney sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 0.5 }}
                  >
                    Total Revenue
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={500}
                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  >
                    ₹{totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: darkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}
                >
                  <CheckCircle sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 0.5 }}
                  >
                    Active Categories
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={500}
                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  >
                    {activeCategories}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Filters and Search - Google Material Design Style */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                  },
                  '&.Mui-focused': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                  },
                },
              }}
              sx={{ flexGrow: 1 }}
            />

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  flexGrow: { xs: 1, sm: 0 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&.Mui-focused': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  },
                }}
              >
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterType}
                  label="Filter"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="hasSub">With Subcategories</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  flexGrow: { xs: 1, sm: 0 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&.Mui-focused': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  },
                }}
              >
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="products">Products Count</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="recent">Recently Added</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          {/* Active filters display */}
          {(searchTerm || filterType !== 'all' || sortBy !== 'name') && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  size="small"
                  onDelete={() => setSearchTerm("")}
                  icon={<Search sx={{ fontSize: '1rem !important' }} />}
                  sx={{
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    border: 'none',
                    '& .MuiChip-deleteIcon': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  }}
                />
              )}
              {filterType !== 'all' && (
                <Chip
                  label={`Filter: ${filterType}`}
                  size="small"
                  onDelete={() => setFilterType('all')}
                  sx={{
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    border: 'none',
                  }}
                />
              )}
              {sortBy !== 'name' && (
                <Chip
                  label={`Sort: ${sortBy}`}
                  size="small"
                  onDelete={() => setSortBy('name')}
                  sx={{
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    border: 'none',
                  }}
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Header with Refresh and Export - Google Material Design Style */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h6"
            fontWeight={500}
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Categories ({filteredCategories.length})
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchData}
                size="small"
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                  },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<Download />}
              onClick={handleDownloadCSV}
              variant="outlined"
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.75rem',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            >
              Export
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={fetchData}
              variant="outlined"
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.75rem',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {/* Categories Table - Google Material Design Style */}
        {filteredCategories.length === 0 ? (
          <Paper
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
            }}
          >
            <Avatar
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                margin: '0 auto 16px',
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
              <Category sx={{ fontSize: { xs: 32, sm: 40 } }} />
            </Avatar>
            <Typography
              variant="h6"
              fontWeight={500}
              gutterBottom
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              No categories found
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}
            >
              {searchTerm
                ? "Try adjusting your search or filters"
                : "Create your first category to organize products"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{
                borderRadius: '28px',
                px: 3,
                py: 1,
                backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                color: darkMode ? '#202124' : '#ffffff',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                    : '0 4px 12px rgba(26, 115, 232, 0.3)',
                },
              }}
            >
              Create Category
            </Button>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
              overflow: 'hidden',
              mb: 3,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    '& th': {
                      borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                      fontWeight={600}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      Category
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                      fontWeight={600}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      Products
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                      fontWeight={600}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      Revenue
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                      fontWeight={600}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      Subcategories
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                      fontWeight={600}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                      fontWeight={600}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.map((category) => {
                  const categoryColor = getCategoryColor(category.name);
                  return (
                    <React.Fragment key={category.name}>
                      <TableRow
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: darkMode ? alpha('#8ab4f8', 0.08) : alpha('#1a73e8', 0.04),
                          },
                          '& td': {
                            borderBottom: expandedCategories.has(category.name) && (category.subCategories?.length || 0) > 0
                              ? 'none'
                              : `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          },
                        }}
                      >
                        <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar
                              sx={{
                                width: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                                bgcolor: categoryColor,
                                color: '#ffffff',
                                fontSize: { xs: '0.75rem', sm: '1rem' },
                              }}
                            >
                              <Category sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                              >
                                {category.name}
                              </Typography>
                              {category.description && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                >
                                  {category.description}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                          <Chip
                            label={category.productCount}
                            size="small"
                            sx={{
                              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                              border: 'none',
                              minWidth: 40,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                          >
                            ₹{category.totalRevenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                          {(category.subCategories?.length || 0) > 0 ? (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Chip
                                label={`${category.subCategories?.length}`}
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                                  color: darkMode ? '#fdd663' : '#fbbc04',
                                  border: 'none',
                                  minWidth: 30,
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleToggleExpand(category.name)}
                                sx={{
                                  p: 0.5,
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                  '&:hover': {
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                                  },
                                }}
                              >
                                {expandedCategories.has(category.name) ? (
                                  <ExpandLess fontSize="small" />
                                ) : (
                                  <ExpandMore fontSize="small" />
                                )}
                              </IconButton>
                            </Stack>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                            >
                              None
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                          <Chip
                            label={category.isActive ? "Active" : "Inactive"}
                            color={category.isActive ? "success" : "default"}
                            size="small"
                            icon={
                              category.isActive ? (
                                <CheckCircle sx={{ fontSize: '1rem !important' }} />
                              ) : (
                                <Cancel sx={{ fontSize: '1rem !important' }} />
                              )
                            }
                            sx={{
                              backgroundColor: category.isActive
                                ? darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)'
                                : darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                              color: category.isActive
                                ? darkMode ? '#81c995' : '#34a853'
                                : darkMode ? '#9aa0a6' : '#5f6368',
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: { xs: 1.5, sm: 2 } }}>
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="View Products">
                              <IconButton
                                size="small"
                                onClick={() => handleViewProducts(category.name)}
                                sx={{
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                  '&:hover': {
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                                  },
                                }}
                              >
                                <Inventory fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditCategory(category);
                                  setOpenEditDialog(true);
                                }}
                                sx={{
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                  '&:hover': {
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                                  },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More actions">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, category.name)}
                                sx={{
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                  '&:hover': {
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                                  },
                                }}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>

                      {/* Subcategories expanded view - Google Material Design Style */}
                      {expandedCategories.has(category.name) &&
                        (category.subCategories?.length || 0) > 0 && (
                        <TableRow
                          sx={{
                            backgroundColor: darkMode ? alpha('#202124', 0.5) : alpha('#f8f9fa', 0.7),
                          }}
                        >
                          <TableCell
                            colSpan={6}
                            sx={{
                              py: 1.5,
                              px: { xs: 2, sm: 3 },
                              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}
                            >
                              Subcategories:
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {category.subCategories?.map((subCat) => (
                                <Chip
                                  key={subCat}
                                  label={subCat}
                                  size="small"
                                  sx={{
                                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    border: 'none',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Create Category Dialog - Google Material Design Style */}
        <Dialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <DialogTitle
            sx={{
              p: 3,
              pb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            Create New Category
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
                >
                  Category Name <span style={{ color: darkMode ? '#f28b82' : '#ea4335' }}>*</span>
                </Typography>
                <TextField
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  fullWidth
                  required
                  size="small"
                  placeholder="e.g. Electronics"
                  helperText="This will be used when creating new products"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                      '&.Mui-focused': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
                >
                  Description
                </Typography>
                <TextField
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  placeholder="Optional description for the category"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                      '&.Mui-focused': {
                        borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                      },
                    },
                  }}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              p: 3,
              pt: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Button
              onClick={() => setOpenCreateDialog(false)}
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              variant="contained"
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                color: darkMode ? '#202124' : '#ffffff',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                },
              }}
            >
              Create Category
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Category Dialog - Google Material Design Style */}
        <Dialog
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setEditCategory(null);
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <DialogTitle
            sx={{
              p: 3,
              pb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            Edit Category
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {editCategory && (
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
                  >
                    Category Name <span style={{ color: darkMode ? '#f28b82' : '#ea4335' }}>*</span>
                  </Typography>
                  <TextField
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    fullWidth
                    required
                    size="small"
                    helperText="Note: Changing the name will update all products with this category"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
                  >
                    Description
                  </Typography>
                  <TextField
                    value={editCategory.description || ""}
                    onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                    }}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editCategory.isActive}
                      onChange={(e) => setEditCategory({ ...editCategory, isActive: e.target.checked })}
                      size="small"
                      sx={{
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&.Mui-checked': {
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Active Category
                    </Typography>
                  }
                />
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                    border: `1px solid ${darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)'}`,
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    '& .MuiAlert-icon': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  }}
                >
                  <Typography variant="body2">
                    This category has <strong>{editCategory.productCount}</strong> product(s) and
                    has generated <strong>₹{editCategory.totalRevenue.toLocaleString()}</strong> in revenue.
                  </Typography>
                </Alert>
              </Stack>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              p: 3,
              pt: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Button
              onClick={() => {
                setOpenEditDialog(false);
                setEditCategory(null);
              }}
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              variant="contained"
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                color: darkMode ? '#202124' : '#ffffff',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog - Google Material Design Style */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <DialogTitle
            sx={{
              p: 3,
              pb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 500,
              color: darkMode ? '#f28b82' : '#ea4335',
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            Delete Category
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedCategory && (
              <Stack spacing={2}>
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
                    border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'}`,
                    color: darkMode ? '#fdd663' : '#b45a1c',
                    '& .MuiAlert-icon': {
                      color: darkMode ? '#fdd663' : '#b45a1c',
                    },
                  }}
                >
                  Are you sure you want to delete this category?
                </Alert>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
                  >
                    {selectedCategory}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? '#f28b82' : '#ea4335', display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    ⚠️ This action cannot be undone. Products using this category will need to be updated.
                  </Typography>
                </Paper>
              </Stack>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              p: 3,
              pt: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                color: darkMode ? '#e8eaed' : '#202124',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCategory}
              variant="contained"
              color="error"
              sx={{
                borderRadius: '20px',
                px: 2.5,
                py: 0.75,
                backgroundColor: darkMode ? '#f28b82' : '#ea4335',
                color: darkMode ? '#202124' : '#ffffff',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: darkMode ? '#f28b82' : '#d32f2f',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu - Google Material Design Style */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode
                ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                : '0 8px 16px rgba(0, 0, 0, 0.08)',
              mt: 1,
              minWidth: 180,
            },
          }}
        >
          {selectedCategory && (
            <>
              <MenuItem
                onClick={() => {
                  const category = categories.find(cat => cat.name === selectedCategory);
                  if (category) {
                    setEditCategory(category);
                    setOpenEditDialog(true);
                  }
                  handleMenuClose();
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                  },
                }}
              >
                <Edit fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const category = categories.find(cat => cat.name === selectedCategory);
                  if (category) {
                    handleDuplicateCategory(category);
                  }
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                  },
                }}
              >
                <ContentCopy fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                Duplicate
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleViewProducts(selectedCategory);
                  handleMenuClose();
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                  },
                }}
              >
                <Inventory fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                View Products
              </MenuItem>
              <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
              <MenuItem
                onClick={() => {
                  setOpenDeleteDialog(true);
                  handleMenuClose();
                }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  color: darkMode ? '#f28b82' : '#ea4335',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                  },
                }}
              >
                <Delete fontSize="small" sx={{ mr: 1.5 }} />
                Delete
              </MenuItem>
            </>
          )}
        </Menu>
      </Container>
    </MainLayout>
  );
}