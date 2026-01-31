// app/products/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  MoreVert,
  Category,
  Inventory,
  TrendingUp,
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
} from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";

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
      "#2563eb", "#dc2626", "#059669", "#7c3aed", "#d97706",
      "#475569", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6",
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
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => router.push("/dashboard")}
          sx={{ mb: 2 }}
          size="small"
        >
          Back to Dashboard
        </Button>

        <Breadcrumbs sx={{ mb: { xs: 1, sm: 2 } }}>
          <MuiLink
            component={Link}
            href="/dashboard"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: { xs: 18, sm: 20 } }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Dashboard
            </Box>
          </MuiLink>
          <MuiLink
            component={Link}
            href="/products"
            sx={{ 
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Products
          </MuiLink>
          <Typography color="text.primary" fontSize={{ xs: '0.875rem', sm: '1rem' }}>
            Categories
          </Typography>
        </Breadcrumbs>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2
        }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              gutterBottom
              fontSize={{ xs: '1.5rem', sm: '2rem', md: '2.25rem' }}
            >
              Product Categories
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              fontSize={{ xs: '0.875rem', sm: '1rem' }}
            >
              Manage and organize your product categories
            </Typography>
          </Box>

          <Stack 
            direction="row" 
            spacing={1}
            alignItems="center"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownloadCSV}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                flexGrow: { xs: 1, sm: 0 }
              }}
            >
              New Category
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Stats Cards - Responsive Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        },
        gap: 2,
        mb: 3
      }}>
        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ 
                bgcolor: "primary.light", 
                mr: 2,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 }
              }}>
                <Category sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                  Total Categories
                </Typography>
                <Typography variant="h6" fontWeight="bold" fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
                  {totalCategories}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ 
                bgcolor: "success.light", 
                mr: 2,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 }
              }}>
                <Inventory sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                  Total Products
                </Typography>
                <Typography variant="h6" fontWeight="bold" fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
                  {totalProducts}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ 
                bgcolor: "warning.light", 
                mr: 2,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 }
              }}>
                <AttachMoney sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                  Total Revenue
                </Typography>
                <Typography variant="h6" fontWeight="bold" fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
                  ₹{totalRevenue.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ 
                bgcolor: "info.light", 
                mr: 2,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 }
              }}>
                <CheckCircle sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                  Active Categories
                </Typography>
                <Typography variant="h6" fontWeight="bold" fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
                  {activeCategories}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              width: { xs: '100%', sm: 'auto' }
            }}>
              <FormControl size="small" sx={{ minWidth: 120, flexGrow: { xs: 1, sm: 0 } }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterType}
                  label="Filter"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="hasSub">With Sub</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120, flexGrow: { xs: 1, sm: 0 } }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="products">Products</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="recent">Recent</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Header with Refresh and Export */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 2,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="h6" fontSize={{ xs: '1rem', sm: '1.25rem' }}>
          Categories ({filteredCategories.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Refresh />}
            onClick={fetchData}
            variant="outlined"
            size="small"
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={handleDownloadCSV}
            variant="outlined"
            size="small"
            sx={{ 
              display: { xs: 'flex', sm: 'none' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Export
          </Button>
          <IconButton
            onClick={fetchData}
            size="small"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Categories Table */}
      {filteredCategories.length === 0 ? (
        <Paper sx={{ textAlign: "center", p: { xs: 3, sm: 6 }, my: 2 }}>
          <Category sx={{ fontSize: { xs: 48, sm: 60 }, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom fontSize={{ xs: '1rem', sm: '1.25rem' }}>
            No categories found
          </Typography>
          <Typography color="text.secondary" paragraph fontSize={{ xs: '0.875rem', sm: '1rem' }}>
            {searchTerm ? "Try adjusting your search" : "Create your first category"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
            size="small"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Create Category
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell><Typography fontSize={{ xs: '0.75rem', sm: '0.875rem' }} fontWeight="bold">Category</Typography></TableCell>
                <TableCell><Typography fontSize={{ xs: '0.75rem', sm: '0.875rem' }} fontWeight="bold">Products</Typography></TableCell>
                <TableCell><Typography fontSize={{ xs: '0.75rem', sm: '0.875rem' }} fontWeight="bold">Revenue</Typography></TableCell>
                <TableCell><Typography fontSize={{ xs: '0.75rem', sm: '0.875rem' }} fontWeight="bold">Subcategories</Typography></TableCell>
                <TableCell><Typography fontSize={{ xs: '0.75rem', sm: '0.875rem' }} fontWeight="bold">Status</Typography></TableCell>
                <TableCell align="right"><Typography fontSize={{ xs: '0.75rem', sm: '0.875rem' }} fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => {
                const categoryColor = getCategoryColor(category.name);
                return (
                  <>
                    <TableRow key={category.name} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ 
                            bgcolor: categoryColor,
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            fontSize: { xs: '0.75rem', sm: '1rem' }
                          }}>
                            <Category fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                              {category.name}
                            </Typography>
                            {category.description && (
                              <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.625rem', sm: '0.75rem' }}>
                                {category.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.productCount}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                          ₹{category.totalRevenue.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(category.subCategories?.length || 0) > 0 ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Chip
                              label={`${category.subCategories?.length}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleToggleExpand(category.name)}
                              sx={{ p: 0.5 }}
                            >
                              {expandedCategories.has(category.name) ? (
                                <ExpandLess fontSize="small" />
                              ) : (
                                <ExpandMore fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                            None
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? "Active" : "Inactive"}
                          color={category.isActive ? "success" : "default"}
                          size="small"
                          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          icon={category.isActive ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View Products">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewProducts(category.name)}
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              <Inventory fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setEditCategory(category);
                                setOpenEditDialog(true);
                              }}
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, category.name)}
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    {/* Subcategories expanded view */}
                    {expandedCategories.has(category.name) &&
                      (category.subCategories?.length || 0) > 0 && (
                      <TableRow sx={{ backgroundColor: "action.hover" }}>
                        <TableCell colSpan={6} sx={{ py: 1, px: { xs: 1, sm: 3 } }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ mb: 0.5 }} fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                            Subcategories:
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {category.subCategories?.map((subCat) => (
                              <Chip
                                key={subCat}
                                label={subCat}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  mb: 0.5,
                                  fontSize: { xs: '0.625rem', sm: '0.75rem' }
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Category Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontSize={{ xs: '1rem', sm: '1.25rem' }}>Create New Category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Category Name *"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              fullWidth
              required
              size="small"
              helperText="This will be used when creating new products"
            />
            <TextField
              label="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              size="small"
              helperText="Optional description for the category"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)} size="small">
            Cancel
          </Button>
          <Button onClick={handleCreateCategory} variant="contained" size="small">
            Create Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setEditCategory(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontSize={{ xs: '1rem', sm: '1.25rem' }}>Edit Category</DialogTitle>
        <DialogContent>
          {editCategory && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Category Name *"
                value={editCategory.name}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                fullWidth
                required
                size="small"
                helperText="Note: Changing the name will update all products with this category"
              />
              <TextField
                label="Description"
                value={editCategory.description || ""}
                onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
                size="small"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editCategory.isActive}
                    onChange={(e) => setEditCategory({ ...editCategory, isActive: e.target.checked })}
                    size="small"
                  />
                }
                label="Active Category"
              />
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  This category has {editCategory.productCount} product(s) and 
                  has generated ₹{editCategory.totalRevenue.toLocaleString()} in revenue.
                </Typography>
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenEditDialog(false);
            setEditCategory(null);
          }} size="small">
            Cancel
          </Button>
          <Button onClick={handleEditCategory} variant="contained" size="small">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle fontSize={{ xs: '1rem', sm: '1.25rem' }}>Delete Category</DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Are you sure you want to delete this category?
              </Alert>
              <Box sx={{ p: 1, bgcolor: "background.default", borderRadius: 1 }}>
                <Typography variant="body1" fontWeight="medium" fontSize={{ xs: '0.875rem', sm: '1rem' }}>
                  {selectedCategory}
                </Typography>
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }} fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                  ⚠️ This action cannot be undone. Products using this category will need to be updated.
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} size="small">
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained" size="small">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedCategory && (
          <>
            <MenuItem onClick={() => {
              const category = categories.find(cat => cat.name === selectedCategory);
              if (category) {
                setEditCategory(category);
                setOpenEditDialog(true);
              }
              handleMenuClose();
            }}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => {
              const category = categories.find(cat => cat.name === selectedCategory);
              if (category) {
                handleDuplicateCategory(category);
              }
            }}>
              <ContentCopy fontSize="small" sx={{ mr: 1 }} />
              Duplicate
            </MenuItem>
            <MenuItem onClick={() => handleViewProducts(selectedCategory)}>
              <Inventory fontSize="small" sx={{ mr: 1 }} />
              View Products
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setOpenDeleteDialog(true);
                handleMenuClose();
              }}
              sx={{ color: "error.main" }}
            >
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Container>
  );
}