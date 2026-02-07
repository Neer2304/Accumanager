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
  MenuItem,
  Menu,
  Divider,
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
  DialogActions
} from '@mui/material';
import {
  Refresh,
  Download,
  Home as HomeIcon,
  History,
  Search,
  FilterList,
  CalendarToday,
  Person,
  Inventory,
  AddShoppingCart,
  RemoveShoppingCart,
  MoreVert,
  Visibility,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  CloudDownload as CloudDownloadIcon,
  DateRange,
  Clear,
  Email,
  Phone,
  AttachMoney,
  LocalShipping,
  Receipt
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';

// Define History Record type based on your API
export interface HistoryRecord {
  _id: string;
  type: 'usage' | 'restock';
  date: string;
  materialId: string;
  materialName: string;
  materialSku: string;
  quantity: number;
  unit: string;
  user?: string;
  project?: string;
  note?: string;
  cost?: number;
  total?: number;
  supplier?: string;
  supplierCode?: string;
  purchaseOrder?: string;
  icon: string;
  color: string;
  details?: string;
}

export interface HistoryFilters {
  type: 'all' | 'usage' | 'restock';
  search: string;
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  materialId?: string;
  supplierName?: string;
}

export default function HistoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<HistoryFilters>({
    type: 'all',
    search: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Fetch history from API
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, String(value));
      });
      
      const response = await fetch(`/api/material/suppliers/history?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Ensure each record has a unique ID
        const historyData = data.data.activity || [];
        const uniqueHistory = historyData.map((record: any, index: number) => ({
          ...record,
          // Generate a unique ID if missing or duplicate
          _id: record._id || `history_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
        }));
        
        setHistory(uniqueHistory);
        setPagination({
          page: (data.data.pagination?.page || 1) - 1,
          limit: data.data.pagination?.limit || 20,
          total: data.data.pagination?.total || uniqueHistory.length || 0,
          pages: data.data.pagination?.pages || 1,
        });
      } else {
        setError(data.message || 'Failed to fetch history');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch materials for filter dropdown
  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/material');
      const data = await response.json();
      if (data.success) {
        setMaterials(data.data.materials || []);
      }
    } catch (err) {
      console.error('Fetch materials error:', err);
    }
  };

  // Fetch suppliers for filter dropdown
  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/material/suppliers');
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data.suppliers || []);
      }
    } catch (err) {
      console.error('Fetch suppliers error:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchMaterials();
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

  const handleFilterChange = (key: keyof HistoryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      search: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 20,
    });
  };

  const handleViewDetails = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setDetailsDialogOpen(true);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'usage': return <RemoveShoppingCart />;
      case 'restock': return <AddShoppingCart />;
      default: return <History />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'usage': return '#ea4335';
      case 'restock': return '#34a853';
      default: return '#9aa0a6';
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'usage': return 'Material Usage';
      case 'restock': return 'Stock Restock';
      default: return 'Activity';
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to generate a unique key for each record
  const getRecordKey = (record: HistoryRecord, index: number) => {
    // Use the record's _id if it exists and is not empty
    if (record._id && record._id.trim() !== '') {
      return record._id;
    }
    
    // Otherwise, generate a unique key based on the record's data
    return `history_${record.type}_${record.materialId}_${record.date}_${index}_${Math.random().toString(36).substr(2, 9)}`;
  };

  if (loading && !history.length) {
    return (
      <MainLayout title="Activity History">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#4285f4' }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Activity History">
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
              <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>Activity History</Typography>
            </Breadcrumbs>
          </Fade>

          <Fade in timeout={300}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
              <Box>
                <Typography variant={isMobile ? "h6" : isTablet ? "h5" : "h4"} fontWeight={500} gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Activity History
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 300, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' }, lineHeight: 1.4 }}>
                  Track all inventory transactions and activities
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
                <Button startIcon={<Refresh />} onClick={fetchHistory} variant="outlined" disabled={loading} size={isMobile ? "small" : "medium"} sx={{ borderRadius: '12px', borderColor: darkMode ? '#3c4043' : '#dadce0', color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 0.5, sm: 0.75 }, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }, "&:hover": { borderColor: darkMode ? '#5f6368' : '#202124', backgroundColor: darkMode ? '#3c4043' : '#f8f9fa' } }}>
                  {isMobile ? '' : 'Refresh'}
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

        {/* Filters */}
        <Fade in timeout={400}>
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
                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                  <InputLabel>Activity Type</InputLabel>
                  <Select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} label="Activity Type" input={<OutlinedInput label="Activity Type" />}>
                    <MenuItem value="all">All Activities</MenuItem>
                    <MenuItem value="usage">Usage</MenuItem>
                    <MenuItem value="restock">Restock</MenuItem>
                  </Select>
                </FormControl>

                <TextField 
                  size="small" 
                  placeholder="Search..." 
                  value={filters.search} 
                  onChange={(e) => handleFilterChange('search', e.target.value)} 
                  sx={{ flex: 1 }} 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> 
                  }} 
                />

                <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                  <TextField 
                    size="small" 
                    type="date" 
                    label="From" 
                    value={filters.startDate} 
                    onChange={(e) => handleFilterChange('startDate', e.target.value)} 
                    InputLabelProps={{ shrink: true }} 
                    InputProps={{ 
                      startAdornment: <InputAdornment position="start"><DateRange fontSize="small" /></InputAdornment> 
                    }} 
                    sx={{ flex: 1 }}
                  />
                  <TextField 
                    size="small" 
                    type="date" 
                    label="To" 
                    value={filters.endDate} 
                    onChange={(e) => handleFilterChange('endDate', e.target.value)} 
                    InputLabelProps={{ shrink: true }} 
                    InputProps={{ 
                      startAdornment: <InputAdornment position="start"><DateRange fontSize="small" /></InputAdornment> 
                    }} 
                    sx={{ flex: 1 }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Stats Summary */}
        <Fade in timeout={500}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2, md: 3 }, mb: { xs: 2, sm: 3, md: 4 } }}>
            {[
              { title: 'Total Records', value: pagination.total, icon: <History />, color: '#4285f4', description: 'All activities' },
              { title: 'Usage Records', value: history.filter(h => h.type === 'usage').length, icon: <RemoveShoppingCart />, color: '#ea4335', description: 'Material usage' },
              { title: 'Restock Records', value: history.filter(h => h.type === 'restock').length, icon: <AddShoppingCart />, color: '#34a853', description: 'Stock additions' },
              { title: 'Suppliers Active', value: [...new Set(history.filter(h => h.type === 'restock').map(h => h.supplier).filter(Boolean))].length, icon: <Person />, color: '#fbbc04', description: 'Active suppliers' },
            ].map((stat, index) => (
              <Paper key={`stat-${index}`} sx={{ flex: '1 1 calc(25% - 24px)', minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 24px)' }, p: { xs: 1.5, sm: 2, md: 3 }, borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: `1px solid ${alpha(stat.color, 0.2)}`, background: darkMode ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)` : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}` } }}>
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

        {/* History Table */}
        <Fade in timeout={600}>
          <Paper sx={{ borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Activity</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>User/Supplier</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Cost</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          No activity history found
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mt: 1 }}>
                          Start by using or restocking materials to see activity here
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((record, index) => {
                      // Generate a unique key for each record
                      const recordKey = getRecordKey(record, index);
                      
                      return (
                        <TableRow key={recordKey} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: getActivityColor(record.type), display: 'flex', alignItems: 'center' }}>{getActivityIcon(record.type)}</Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                                {getActivityText(record.type)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>{record.materialName}</Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>SKU: {record.materialSku}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${record.quantity} ${record.unit}`} 
                              size="small" 
                              sx={{ 
                                backgroundColor: record.type === 'usage' 
                                  ? (darkMode ? '#5c1a1a' : '#fce8e6') 
                                  : (darkMode ? '#0d652d' : '#d9f0e1'),
                                color: record.type === 'usage' 
                                  ? (darkMode ? '#ea4335' : '#5c1a1a') 
                                  : (darkMode ? '#34a853' : '#0d652d'),
                                fontWeight: 500, 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' } 
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                              {record.type === 'usage' ? record.user || 'Unknown' : record.supplier || 'Unknown Supplier'}
                            </Typography>
                            {record.project && (
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                {record.project}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                              {formatCurrency(record.type === 'usage' ? record.cost : record.total)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                              {formatDate(record.date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleViewDetails(record)} sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {history.length > 0 && (
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
            )}
          </Paper>
        </Fade>

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { backgroundColor: darkMode ? '#303134' : '#ffffff', color: darkMode ? '#e8eaed' : '#202124', borderRadius: '16px', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' } }}>
          {selectedRecord && (
            <>
              <DialogTitle sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }, color: darkMode ? '#e8eaed' : '#202124' }}>
                Activity Details
              </DialogTitle>
              <DialogContent>
                <Stack spacing={3}>
                  {/* Header */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: alpha(getActivityColor(selectedRecord.type), 0.1) }}>
                      {getActivityIcon(selectedRecord.type)}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize', color: getActivityColor(selectedRecord.type) }}>
                        {getActivityText(selectedRecord.type)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Activity ID: {selectedRecord._id}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  {/* Activity Details */}
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                      <Stack spacing={2} sx={{ flex: 1 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Material Information</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedRecord.materialName}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Inventory fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              SKU: {selectedRecord.materialSku}
                            </Typography>
                          </Stack>
                        </Box>

                        <Box>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Quantity</Typography>
                          <Typography variant="h6" sx={{ color: getActivityColor(selectedRecord.type) }}>
                            {selectedRecord.quantity} {selectedRecord.unit}
                          </Typography>
                        </Box>

                        {selectedRecord.type === 'restock' && (
                          <Box>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Purchase Details</Typography>
                            <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                              {selectedRecord.purchaseOrder && (
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Receipt fontSize="small" /> PO: {selectedRecord.purchaseOrder}
                                </Typography>
                              )}
                              {selectedRecord.supplier && (
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Person fontSize="small" /> {selectedRecord.supplier}
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                        )}
                      </Stack>

                      <Stack spacing={2} sx={{ flex: 1 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Cost Information</Typography>
                          <Typography variant="h6" sx={{ color: '#34a853' }}>
                            {formatCurrency(selectedRecord.type === 'usage' ? selectedRecord.cost : selectedRecord.total)}
                          </Typography>
                          {selectedRecord.type === 'restock' && selectedRecord.cost && (
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
                              Unit Cost: {formatCurrency(selectedRecord.cost)}
                            </Typography>
                          )}
                        </Box>

                        <Box>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Date & Time</Typography>
                          <Typography variant="body1">{formatDate(selectedRecord.date)}</Typography>
                        </Box>

                        {selectedRecord.type === 'usage' && selectedRecord.user && (
                          <Box>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>User Information</Typography>
                            <Typography variant="body1">{selectedRecord.user}</Typography>
                            {selectedRecord.project && (
                              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
                                Project: {selectedRecord.project}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Stack>
                    </Box>

                    {/* Notes */}
                    {selectedRecord.note && (
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Notes</Typography>
                        <Paper sx={{ 
                          p: 2, 
                          mt: 1, 
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                          borderRadius: '8px'
                        }}>
                          <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontStyle: 'italic' }}>
                            {selectedRecord.note}
                          </Typography>
                        </Paper>
                      </Box>
                    )}

                    {/* Additional Details */}
                    {selectedRecord.details && (
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', fontWeight: 500 }}>Additional Details</Typography>
                        <Typography variant="body1">{selectedRecord.details}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialogOpen(false)} sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 400 }}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </MainLayout>
  );
}