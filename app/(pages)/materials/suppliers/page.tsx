'use client';

import React, { useState, useEffect } from 'react';
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
  Rating,
  Card,
  CardContent
} from '@mui/material';
import {
  Refresh,
  Download,
  Home as HomeIcon,
  Business,
  Phone,
  Email,
  LocationOn,
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
  Star,
  LocalShipping,
  AttachMoney,
  CalendarToday,
  Clear,
  Inventory,
  Person,
  Warning,
  CheckCircle,
  Schedule,
  Description,
  Numbers,
  Category,
  Scale,
  Storage,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';

// Define Supplier type based on your API data
export interface Supplier {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  rating?: number;
  totalOrders?: number;
  totalSpent?: number;
  leadTime?: number;
  paymentTerms?: string;
  materialsSupplied?: string[];
  notes?: string;
  lastOrderDate?: string;
  createdAt?: string;
  updatedAt?: string;
  supplierCode?: string;
  averageMonthlyUsage?: number;
  lowStockAlert?: boolean;
  batchNumber?: string;
  storageLocation?: string;
  shelf?: string;
  bin?: string;
  reorderPoint?: number;
  unit?: string;
  unitCost?: number;
  currentStock?: number;
  totalValue?: number;
  description?: string;
  category?: string;
  sku?: string;
  materials?: Array<{
    _id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    unit: string;
    unitCost: number;
    totalValue: number;
    status: string;
    minimumStock: number;
    reorderPoint: number;
    lastRestocked?: string;
    lastUsed?: string;
  }>;
  performance?: {
    onTimeDelivery: number;
    qualityScore: number;
    responseTime: number;
  };
}

export interface SupplierFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function SuppliersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<SupplierFilters>({
    search: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState<PaginationData>({
    page: 0,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      const response = await fetch(`/api/material/suppliers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuppliers(data.data.suppliers || []);
        setPagination({
          page: (data.data.pagination?.page || 1) - 1,
          limit: data.data.pagination?.limit || 20,
          total: data.data.pagination?.total || 0,
          pages: data.data.pagination?.pages || 1,
        });
      } else {
        setError(data.message || 'Failed to fetch suppliers');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching suppliers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single supplier details
  const fetchSupplierDetails = async (supplierName: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/material/suppliers/${encodeURIComponent(supplierName)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSelectedSupplier(data.data);
        setDetailsDialogOpen(true);
      } else {
        setError(data.message || 'Failed to fetch supplier details');
      }
    } catch (err) {
      console.error('Fetch supplier details error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching supplier details');
    } finally {
      setLoading(false);
    }
  };

  // Delete supplier
  const deleteSupplier = async (supplierName: string) => {
    try {
      const response = await fetch(`/api/material/suppliers/${encodeURIComponent(supplierName)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        fetchSuppliers(); // Refresh the list
        return true;
      } else {
        setError(data.message || 'Failed to delete supplier');
        return false;
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Error deleting supplier');
      return false;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [filters]);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel...');
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    handleExportMenuClose();
  };

  const handleExportAll = () => {
    console.log('Exporting all data...');
    handleExportMenuClose();
  };

  const handleFilterChange = (key: keyof SupplierFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      limit: 20,
    });
  };

  const handleViewDetails = (supplier: Supplier) => {
    fetchSupplierDetails(supplier.name);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    // Navigate to edit page - you can implement this based on your routing
    console.log('Edit supplier:', supplier.name);
    // window.location.href = `/materials/suppliers/${supplier._id}/edit`;
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSupplier) return;
    
    try {
      const success = await deleteSupplier(selectedSupplier.name);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedSupplier(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ 
      ...prev, 
      limit: parseInt(event.target.value, 10), 
      page: 1 
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34a853';
      case 'inactive': return '#9aa0a6';
      case 'pending': return '#fbbc04';
      default: return '#9aa0a6';
    }
  };

  const getStatusBackgroundColor = (status: string, darkMode: boolean) => {
    switch (status) {
      case 'active': return darkMode ? '#0d652d' : '#d9f0e1';
      case 'inactive': return darkMode ? '#3c4043' : '#f5f5f5';
      case 'pending': return darkMode ? '#653c00' : '#fef7e0';
      default: return darkMode ? '#3c4043' : '#f5f5f5';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading && !suppliers.length) {
    return (
      <MainLayout title="Suppliers">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#4285f4' }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Suppliers">
      <Box sx={{ 
        p: { xs: 1, sm: 2, md: 3 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Fade in>
            <Breadcrumbs sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } }}>
              <MuiLink component={Link} href="/dashboard" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 300, "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } }}>
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
                Dashboard
              </MuiLink>
              <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>Suppliers</Typography>
            </Breadcrumbs>
          </Fade>

          <Fade in timeout={300}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
              <Box>
                <Typography variant={isMobile ? "h6" : isTablet ? "h5" : "h4"} fontWeight={500} gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Suppliers Management
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 300, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' }, lineHeight: 1.4 }}>
                  Manage your material suppliers and vendor relationships
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
                <Button startIcon={<Refresh />} onClick={fetchSuppliers} variant="outlined" disabled={loading} size={isMobile ? "small" : "medium"} sx={{ borderRadius: '12px', borderColor: darkMode ? '#3c4043' : '#dadce0', color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 0.5, sm: 0.75 }, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }, "&:hover": { borderColor: darkMode ? '#5f6368' : '#202124', backgroundColor: darkMode ? '#3c4043' : '#f8f9fa' } }}>
                  {isMobile ? '' : 'Refresh'}
                </Button>

                <Button startIcon={<Add />} onClick={() => window.location.href = '/materials/suppliers/new'} variant="contained" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '12px', backgroundColor: '#34a853', color: 'white', fontWeight: 500, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 0.5, sm: 0.75 }, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }, "&:hover": { backgroundColor: '#2d9248', boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)' } }}>
                  Add Supplier
                </Button>

                <Button startIcon={<Download />} onClick={handleExportClick} variant="contained" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '12px', backgroundColor: '#4285f4', color: 'white', fontWeight: 500, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 0.5, sm: 0.75 }, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }, "&:hover": { backgroundColor: '#3367d6', boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)' } }}>
                  {isMobile ? '' : 'Export'}
                </Button>
              </Stack>
            </Box>
          </Fade>

          {/* Export Menu */}
          <Menu anchorEl={exportMenuAnchor} open={Boolean(exportMenuAnchor)} onClose={handleExportMenuClose} PaperProps={{ sx: { backgroundColor: darkMode ? '#303134' : '#ffffff', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0', borderRadius: '12px', boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)', minWidth: 180, mt: 1 } }}>
            <MenuItem onClick={handleExportCSV} sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: '0.875rem', fontWeight: 400, py: 1.5, '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f8f9fa' } }}>
              <Stack direction="row" alignItems="center" spacing={1.5}><ExcelIcon fontSize="small" /><Typography variant="body2">CSV Export</Typography></Stack>
            </MenuItem>
            <MenuItem onClick={handleExportExcel} sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: '0.875rem', fontWeight: 400, py: 1.5, '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f8f9fa' } }}>
              <Stack direction="row" alignItems="center" spacing={1.5}><ExcelIcon fontSize="small" /><Typography variant="body2">Excel Export</Typography></Stack>
            </MenuItem>
            <MenuItem onClick={handleExportPDF} sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: '0.875rem', fontWeight: 400, py: 1.5, '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f8f9fa' } }}>
              <Stack direction="row" alignItems="center" spacing={1.5}><PdfIcon fontSize="small" /><Typography variant="body2">PDF Report</Typography></Stack>
            </MenuItem>
            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0', my: 0.5 }} />
            <MenuItem onClick={handleExportAll} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8', fontSize: '0.875rem', fontWeight: 500, py: 1.5, '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f8f9fa' } }}>
              <Stack direction="row" alignItems="center" spacing={1.5}><CloudDownloadIcon fontSize="small" /><Typography variant="body2">Export All</Typography></Stack>
            </MenuItem>
          </Menu>
        </Box>

        {/* Error Alert */}
        {error && (
          <Fade in>
            <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 }, borderRadius: '12px', backgroundColor: darkMode ? '#422006' : '#fef7e0', color: darkMode ? '#fbbc04' : '#f57c00', border: darkMode ? '1px solid #653c00' : '1px solid #ffcc80', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, fontWeight: 400 }} onClose={() => setError('')}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Stats Summary */}
        <Fade in timeout={400}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2, md: 3 }, mb: { xs: 2, sm: 3, md: 4 } }}>
            {[
              { 
                title: 'Total Suppliers', 
                value: pagination.total, 
                icon: <Business />, 
                color: '#4285f4', 
                description: 'All suppliers' 
              },
              { 
                title: 'Active Suppliers', 
                value: suppliers.filter(s => s.status === 'active').length, 
                icon: <CheckCircle />, 
                color: '#34a853', 
                description: 'Currently active' 
              },
              { 
                title: 'Total Orders', 
                value: suppliers.reduce((sum, s) => sum + (s.totalOrders || 0), 0), 
                icon: <LocalShipping />, 
                color: '#fbbc04', 
                description: 'All-time orders' 
              },
              { 
                title: 'Total Value', 
                value: formatCurrency(suppliers.reduce((sum, s) => sum + (s.totalValue || 0), 0)), 
                icon: <AttachMoney />, 
                color: '#ea4335', 
                description: 'Total inventory value' 
              },
            ].map((stat, index) => (
              <Paper key={index} sx={{ flex: '1 1 calc(25% - 24px)', minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' }, p: { xs: 1.5, sm: 2, md: 3 }, borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: `1px solid ${alpha(stat.color, 0.2)}`, background: darkMode ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)` : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}` } }}>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ p: { xs: 0.75, sm: 1 }, borderRadius: '10px', backgroundColor: alpha(stat.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 20, sm: 24, md: 28 }, color: stat.color } })}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 400, fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }, display: 'block', lineHeight: 1.2 }}>{stat.title}</Typography>
                      <Typography variant={isMobile ? "h6" : "h5"} sx={{ color: stat.color, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }, lineHeight: 1.2 }}>{stat.value}</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 300, fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' }, display: 'block' }}>{stat.description}</Typography>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Fade>

        {/* Filters */}
        <Fade in timeout={500}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 }, borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FilterList sx={{ color: '#4285f4' }} />
                <Typography variant="subtitle2" fontWeight={500}>Filters</Typography>
                <Box sx={{ flex: 1 }} />
                <Button startIcon={<Clear />} onClick={handleClearFilters} size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Clear All
                </Button>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap>
                <TextField 
                  size="small" 
                  placeholder="Search suppliers..." 
                  value={filters.search} 
                  onChange={(e) => handleFilterChange('search', e.target.value)} 
                  sx={{ flex: 1 }} 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> 
                  }} 
                />

                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} label="Status" input={<OutlinedInput label="Status" />}>
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)} label="Sort By" input={<OutlinedInput label="Sort By" />}>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="totalOrders">Total Orders</MenuItem>
                    <MenuItem value="totalSpent">Total Spent</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="createdAt">Date Added</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Suppliers Table */}
        <Fade in timeout={600}>
          <Paper sx={{ borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Supplier</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Business Info</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Last Activity</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          No suppliers found
                        </Typography>
                        <Button 
                          startIcon={<Add />} 
                          onClick={() => window.location.href = '/materials/suppliers/new'} 
                          variant="outlined" 
                          sx={{ mt: 2 }}
                        >
                          Add Your First Supplier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    suppliers.map((supplier) => (
                      <TableRow key={supplier._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: alpha('#4285f4', 0.1), color: '#4285f4', fontWeight: 600, width: 40, height: 40 }}>
                              {getInitials(supplier.name)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>{supplier.name}</Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                {supplier.supplierCode || 'No code'}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            {supplier.contactPerson && (
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Person fontSize="inherit" /> {supplier.contactPerson}
                              </Typography>
                            )}
                            {supplier.email && (
                              <Typography variant="caption" sx={{ color: darkMode ? '#8ab4f8' : '#4285f4', fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Email fontSize="inherit" /> {supplier.email}
                              </Typography>
                            )}
                            {supplier.phone && (
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone fontSize="inherit" /> {supplier.phone}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={1}>
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Materials</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {supplier.materialsSupplied?.length || 0} materials
                              </Typography>
                            </Box>
                            {supplier.totalOrders !== undefined && (
                              <Box>
                                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Total Orders</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{supplier.totalOrders}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={supplier.status} 
                            size="small" 
                            sx={{ 
                              backgroundColor: getStatusBackgroundColor(supplier.status, darkMode),
                              color: getStatusColor(supplier.status),
                              fontWeight: 500, 
                              textTransform: 'capitalize', 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' } 
                            }} 
                          />
                          {supplier.lowStockAlert && (
                            <Box sx={{ mt: 0.5 }}>
                              <Chip 
                                label="Low Stock Alert" 
                                size="small" 
                                sx={{ 
                                  backgroundColor: darkMode ? '#422006' : '#fef7e0',
                                  color: darkMode ? '#fbbc04' : '#f57c00',
                                  fontWeight: 500,
                                  fontSize: { xs: '0.6rem', sm: '0.65rem' }
                                }}
                              />
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                            {supplier.lastOrderDate ? new Date(supplier.lastOrderDate).toLocaleDateString() : 'No orders'}
                          </Typography>
                          {supplier.leadTime && (
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {supplier.leadTime} day lead time
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => handleViewDetails(supplier)} sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleEditSupplier(supplier)} sx={{ color: '#fbbc04' }}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteSupplier(supplier)} sx={{ color: '#ea4335' }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 20, 50, 100]}
              component="div"
              count={pagination.total}
              rowsPerPage={filters.limit}
              page={pagination.page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              sx={{
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: { xs: '0.8rem', sm: '0.85rem' }
                }
              }}
            />
          </Paper>
        </Fade>

        {/* Supplier Details Dialog */}
        <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { backgroundColor: darkMode ? '#303134' : '#ffffff', color: darkMode ? '#e8eaed' : '#202124', borderRadius: '16px', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0', maxHeight: '90vh', overflow: 'auto' } }}>
          {selectedSupplier && (
            <>
              <DialogTitle sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }, color: darkMode ? '#e8eaed' : '#202124', borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Supplier Details</span>
                <Chip 
                  label={selectedSupplier.status} 
                  size="small" 
                  sx={{ 
                    backgroundColor: getStatusBackgroundColor(selectedSupplier.status, darkMode),
                    color: getStatusColor(selectedSupplier.status),
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }} 
                />
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={3}>
                  {/* Header Section */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: alpha('#4285f4', 0.1), color: '#4285f4', fontWeight: 700, width: 60, height: 60, fontSize: '1.5rem' }}>
                        {getInitials(selectedSupplier.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>{selectedSupplier.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          {selectedSupplier.supplierCode && (
                            <Chip 
                              label={`Code: ${selectedSupplier.supplierCode}`} 
                              size="small" 
                              sx={{ 
                                backgroundColor: alpha('#34a853', 0.1),
                                color: '#34a853',
                                fontWeight: 500
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                    
                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Created: {selectedSupplier.createdAt ? new Date(selectedSupplier.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Updated: {selectedSupplier.updatedAt ? new Date(selectedSupplier.updatedAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Basic Information */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Stack spacing={3} sx={{ flex: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business fontSize="small" /> Basic Information
                        </Typography>
                        <Stack spacing={2}>
                          {selectedSupplier.description && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Description</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400 }}>{selectedSupplier.description}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" /> Contact Information
                        </Typography>
                        <Stack spacing={2}>
                          {selectedSupplier.contactPerson && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Contact Person</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400 }}>{selectedSupplier.contactPerson}</Typography>
                            </Box>
                          )}
                          {selectedSupplier.email && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Email</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" /> 
                                <a href={`mailto:${selectedSupplier.email}`} style={{ color: darkMode ? '#8ab4f8' : '#4285f4', textDecoration: 'none' }}>
                                  {selectedSupplier.email}
                                </a>
                              </Typography>
                            </Box>
                          )}
                          {selectedSupplier.phone && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Phone</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" /> 
                                <a href={`tel:${selectedSupplier.phone}`} style={{ color: darkMode ? '#e8eaed' : '#202124', textDecoration: 'none' }}>
                                  {selectedSupplier.phone}
                                </a>
                              </Typography>
                            </Box>
                          )}
                          {selectedSupplier.address && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Address</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <LocationOn fontSize="small" sx={{ mt: 0.25 }} /> {selectedSupplier.address}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack spacing={3} sx={{ flex: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Numbers fontSize="small" /> Statistics
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Materials Supplied</Typography>
                            <Typography variant="h6" color="#4285f4">
                              {selectedSupplier.materialsSupplied?.length || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Total Orders</Typography>
                            <Typography variant="h6" color="#34a853">
                              {formatNumber(selectedSupplier.totalOrders)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Total Spent</Typography>
                            <Typography variant="h6" color="#fbbc04">
                              {formatCurrency(selectedSupplier.totalSpent)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Lead Time</Typography>
                            <Typography variant="h6" color="#ea4335">
                              {selectedSupplier.leadTime || 0} days
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Storage fontSize="small" /> Storage Information
                        </Typography>
                        <Stack spacing={2}>
                          {selectedSupplier.storageLocation && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Storage Location</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400 }}>{selectedSupplier.storageLocation}</Typography>
                            </Box>
                          )}
                          {selectedSupplier.shelf && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Shelf</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400 }}>{selectedSupplier.shelf}</Typography>
                            </Box>
                          )}
                          {selectedSupplier.bin && (
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Bin</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 400 }}>{selectedSupplier.bin}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Materials List */}
                  {selectedSupplier.materials && selectedSupplier.materials.length > 0 && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Inventory fontSize="small" /> Materials Supplied
                        </Typography>
                        <TableContainer component={Paper} sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Material Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Total Value</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedSupplier.materials.map((material) => (
                                <TableRow key={material._id} hover>
                                  <TableCell>{material.name}</TableCell>
                                  <TableCell>{material.sku}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography>{formatNumber(material.currentStock)}</Typography>
                                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                        {material.unit}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>{formatCurrency(material.unitCost)}</TableCell>
                                  <TableCell>{formatCurrency(material.totalValue)}</TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={material.status} 
                                      size="small" 
                                      sx={{ 
                                        backgroundColor: material.status === 'in-stock' ? (darkMode ? '#0d652d' : '#d9f0e1') :
                                                       material.status === 'low-stock' ? (darkMode ? '#653c00' : '#fef7e0') :
                                                       (darkMode ? '#3c4043' : '#f5f5f5'),
                                        color: material.status === 'in-stock' ? (darkMode ? '#34a853' : '#0d652d') :
                                               material.status === 'low-stock' ? (darkMode ? '#fbbc04' : '#653c00') :
                                               (darkMode ? '#9aa0a6' : '#5f6368'),
                                        fontWeight: 500,
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </>
                  )}

                  {/* Notes Section */}
                  {selectedSupplier.notes && (
                    <>
                      <Divider />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Description fontSize="small" /> Notes
                        </Typography>
                        <Paper sx={{ 
                          p: 2, 
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                          borderRadius: '8px'
                        }}>
                          <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontStyle: 'italic' }}>
                            {selectedSupplier.notes}
                          </Typography>
                        </Paper>
                      </Box>
                    </>
                  )}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, p: 2 }}>
                <Button 
                  onClick={() => setDetailsDialogOpen(false)} 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368', 
                    fontWeight: 400,
                    "&:hover": {
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa'
                    }
                  }}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditSupplier(selectedSupplier);
                  }} 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#fbbc04', 
                    color: 'white', 
                    fontWeight: 500, 
                    "&:hover": { 
                      backgroundColor: '#e6a900' 
                    }
                  }}
                >
                  Edit Supplier
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: darkMode ? '#303134' : '#ffffff', color: darkMode ? '#e8eaed' : '#202124', borderRadius: '16px', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' } }}>
          <DialogTitle sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }, color: darkMode ? '#e8eaed' : '#202124' }}>
            Delete Supplier
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete supplier &quot;{selectedSupplier?.name}&quot;? This action cannot be undone.
            </Typography>
            {selectedSupplier?.materialsSupplied && selectedSupplier.materialsSupplied.length > 0 && (
              <Alert severity="warning" sx={{ backgroundColor: darkMode ? '#422006' : '#fef7e0', color: darkMode ? '#fbbc04' : '#f57c00', border: darkMode ? '1px solid #653c00' : '1px solid #ffcc80', borderRadius: '8px' }}>
                This supplier supplies {selectedSupplier.materialsSupplied.length} materials. Deleting will remove supplier information from all these materials.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 400 }}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="contained" sx={{ backgroundColor: '#ea4335', color: 'white', fontWeight: 500, "&:hover": { backgroundColor: '#d93025' } }}>
              Delete Supplier
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}