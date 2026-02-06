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
  Divider
} from '@mui/material';
import {
  Refresh,
  Download,
  Home as HomeIcon,
  Warning,
  Inventory,
  LocalShipping,
  AddShoppingCart,
  Search,
  FilterList,
  MoreVert,
  Visibility,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  CloudDownload as CloudDownloadIcon,
  TrendingDown,
  PriorityHigh,
  ShoppingCart
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Material, MaterialFilters } from '@/types/material.types';

interface HistoryRecord {
  _id: string;
  type: 'usage' | 'restock' | 'transfer' | 'adjustment';
  materialName: string;
  sku: string;
  quantity: number;
  unit: string;
  user?: string;
  supplier?: string;
  project?: string;
  fromWarehouse?: string;
  toWarehouse?: string;
  date: string;
  color: 'error' | 'success' | 'warning' | 'info';
  note?: string;
}

export default function LowStocksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<MaterialFilters>({
    search: '',
    category: '',
    status: 'low-stock',
    supplier: '',
    warehouse: '',
    sortBy: 'currentStock',
    sortOrder: 'asc',
    page: 1,
    limit: 20,
    lowStockOnly: true,
    outOfStockOnly: false,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [bulkRestockDialogOpen, setBulkRestockDialogOpen] = useState(false);

  const fetchLowStocks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      
      const response = await fetch(`/api/material?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setMaterials(data.data.materials || []);
        setPagination({
          page: data.data.pagination?.page - 1 || 0,
          limit: data.data.pagination?.limit || 20,
          total: data.data.pagination?.total || 0,
          pages: data.data.pagination?.pages || 1,
        });
      } else {
        setError(data.message || 'Failed to fetch low stock materials');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching low stock materials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStocks();
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

  const handleFilterChange = (key: keyof MaterialFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMaterials.length === materials.length && materials.length > 0) {
      setSelectedMaterials([]);
    } else {
      setSelectedMaterials(materials.map(m => m._id));
    }
  };

  const handleRestockMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setRestockDialogOpen(true);
  };

  const handleBulkRestock = () => {
    if (selectedMaterials.length > 0) {
      setBulkRestockDialogOpen(true);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const getStockLevelPercentage = (material: Material) => {
    if (material.minimumStock === 0) return 0;
    return (material.currentStock / material.minimumStock) * 100;
  };

  const getStockLevelColor = (percentage: number) => {
    if (percentage <= 25) return '#ea4335';
    if (percentage <= 50) return '#fbbc04';
    return '#4285f4';
  };

  if (loading && !materials.length) {
    return (
      <MainLayout title="Low Stock Alerts">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#4285f4' }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Low Stock Alerts">
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
              <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>Low Stock Alerts</Typography>
            </Breadcrumbs>
          </Fade>

          <Fade in timeout={300}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
              <Box>
                <Typography variant={isMobile ? "h6" : isTablet ? "h5" : "h4"} fontWeight={500} gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Low Stock Alerts
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 300, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' }, lineHeight: 1.4 }}>
                  Materials requiring immediate attention and reordering
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
                <Button startIcon={<Refresh />} onClick={fetchLowStocks} variant="outlined" disabled={loading} size={isMobile ? "small" : "medium"} sx={{ borderRadius: '12px', borderColor: darkMode ? '#3c4043' : '#dadce0', color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 0.5, sm: 0.75 }, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }, "&:hover": { borderColor: darkMode ? '#5f6368' : '#202124', backgroundColor: darkMode ? '#3c4043' : '#f8f9fa' } }}>
                  {isMobile ? '' : 'Refresh'}
                </Button>

                {selectedMaterials.length > 0 && (
                  <Button startIcon={<ShoppingCart />} onClick={handleBulkRestock} variant="contained" size={isMobile ? "small" : "medium"} sx={{ borderRadius: '12px', backgroundColor: '#34a853', color: 'white', fontWeight: 500, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 0.5, sm: 0.75 }, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }, "&:hover": { backgroundColor: '#2d9248', boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)' } }}>
                    Bulk Restock ({selectedMaterials.length})
                  </Button>
                )}

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

        {/* Critical Alerts */}
        {materials.filter(m => getStockLevelPercentage(m) <= 25).length > 0 && (
          <Fade in timeout={400}>
            <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 }, borderRadius: '16px', backgroundColor: darkMode ? '#5c1a1a' : '#fce8e6', border: darkMode ? '1px solid #ea4335' : '1px solid #ea4335' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <PriorityHigh sx={{ color: '#ea4335', fontSize: 24 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#ea4335' }}>
                      Critical Stock Alert!
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#f28b82' : '#5c1a1a' }}>
                      {materials.filter(m => getStockLevelPercentage(m) <= 25).length} materials are critically low (≤25% of minimum)
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ flex: 1 }} />
                <Button startIcon={<LocalShipping />} variant="contained" size="small" sx={{ backgroundColor: '#ea4335', color: 'white', fontWeight: 500, "&:hover": { backgroundColor: '#d93025' } }}>
                  Order All Critical Items
                </Button>
              </Stack>
            </Paper>
          </Fade>
        )}

        {/* Stats Summary */}
        <Fade in timeout={500}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2, md: 3 }, mb: { xs: 2, sm: 3, md: 4 } }}>
            {[
              { title: 'Total Low Stock', value: materials.length, icon: <Warning />, color: '#fbbc04', description: 'Require attention' },
              { title: 'Critical Items', value: materials.filter(m => getStockLevelPercentage(m) <= 25).length, icon: <PriorityHigh />, color: '#ea4335', description: '≤25% of minimum' },
              { title: 'Warning Items', value: materials.filter(m => getStockLevelPercentage(m) > 25 && getStockLevelPercentage(m) <= 50).length, icon: <TrendingDown />, color: '#fbbc04', description: '25-50% of minimum' },
              { title: 'Monitor Items', value: materials.filter(m => getStockLevelPercentage(m) > 50).length, icon: <Inventory />, color: '#4285f4', description: '>50% of minimum' },
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
        <Fade in timeout={600}>
          <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 }, borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FilterList sx={{ color: '#fbbc04' }} />
                <Typography variant="subtitle2" fontWeight={500}>Filters</Typography>
                <Box sx={{ flex: 1 }} />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap>
                <TextField size="small" placeholder="Search materials..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} sx={{ flex: 1 }} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />

                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                  <InputLabel>Category</InputLabel>
                  <Select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} label="Category" input={<OutlinedInput label="Category" />}>
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="raw-materials">Raw Materials</MenuItem>
                    <MenuItem value="components">Components</MenuItem>
                    <MenuItem value="finished-goods">Finished Goods</MenuItem>
                    <MenuItem value="packaging">Packaging</MenuItem>
                    <MenuItem value="consumables">Consumables</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)} label="Sort By" input={<OutlinedInput label="Sort By" />}>
                    <MenuItem value="currentStock">Stock Level</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="lastUsed">Last Used</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Bulk Selection */}
        {selectedMaterials.length > 0 && (
          <Fade in timeout={700}>
            <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 }, borderRadius: '16px', backgroundColor: darkMode ? '#1c3f91' : '#e8f0fe', border: darkMode ? '1px solid #8ab4f8' : '1px solid #1a73e8' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <ShoppingCart sx={{ color: '#1a73e8' }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1a73e8' }}>
                      {selectedMaterials.length} materials selected
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                      Total estimated restock cost: ${
                        materials
                          .filter(m => selectedMaterials.includes(m._id))
                          .reduce((sum, m) => sum + Math.max(0, (m.minimumStock - m.currentStock) * m.unitCost), 0)
                          .toFixed(2)
                      }
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ flex: 1 }} />
                <Stack direction="row" spacing={1}>
                  <Button startIcon={<AddShoppingCart />} onClick={handleBulkRestock} variant="contained" size="small" sx={{ backgroundColor: '#34a853', color: 'white', fontWeight: 500, "&:hover": { backgroundColor: '#2d9248' } }}>
                    Restock Selected
                  </Button>
                  <Button onClick={() => setSelectedMaterials([])} variant="outlined" size="small" sx={{ borderColor: darkMode ? '#8ab4f8' : '#1a73e8', color: darkMode ? '#8ab4f8' : '#1a73e8', fontWeight: 500 }}>
                    Clear Selection
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Fade>
        )}

        {/* Low Stock Table */}
        <Fade in timeout={800}>
          <Paper sx={{ borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.length === materials.length && materials.length > 0}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Current Stock</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Minimum Required</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Stock Level</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Last Used</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materials.map((material) => {
                    const percentage = getStockLevelPercentage(material);
                    return (
                      <TableRow key={material._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell padding="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material._id)}
                            onChange={() => handleMaterialSelect(material._id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>{material.name}</Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{material.sku} • {material.category}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                            {material.currentStock} {material.unit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                            {material.minimumStock} {material.unit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={1} alignItems="flex-start">
                            <Box sx={{ width: '100%', height: 6, backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
                              <Box sx={{ width: `${Math.min(percentage, 100)}%`, height: '100%', backgroundColor: getStockLevelColor(percentage), borderRadius: 3 }} />
                            </Box>
                            <Chip label={`${percentage.toFixed(0)}%`} size="small" sx={{ backgroundColor: getStockLevelColor(percentage) === '#ea4335' ? (darkMode ? '#5c1a1a' : '#fce8e6') : getStockLevelColor(percentage) === '#fbbc04' ? (darkMode ? '#653c00' : '#fef7e0') : (darkMode ? '#1c3f91' : '#e8f0fe'), color: getStockLevelColor(percentage) === '#ea4335' ? (darkMode ? '#ea4335' : '#5c1a1a') : getStockLevelColor(percentage) === '#fbbc04' ? (darkMode ? '#fbbc04' : '#653c00') : (darkMode ? '#8ab4f8' : '#1a73e8'), fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }} />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                            {material.lastUsed ? new Date(material.lastUsed).toLocaleDateString() : 'Never'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => handleRestockMaterial(material)} sx={{ color: '#34a853' }}>
                              <AddShoppingCart fontSize="small" />
                            </IconButton>
                            <IconButton size="small" component={Link} href={`/materials/${material._id}`} sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
      </Box>
    </MainLayout>
  );
}