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
  SwapHoriz,
  TrendingFlat,
  MoreVert,
  Visibility,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  CloudDownload as CloudDownloadIcon,
  DateRange,
  Clear
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { HistoryFilters, HistoryRecord } from '@/types/material.types';

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
    materialId: '',
    userId: '',
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

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      
      const response = await fetch(`/api/material/history?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.data.records || []);
        setPagination({
          page: data.data.pagination?.page - 1 || 0,
          limit: data.data.pagination?.limit || 20,
          total: data.data.pagination?.total || 0,
          pages: data.data.pagination?.pages || 1,
        });
      } else {
        setError(data.message || 'Failed to fetch history');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
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
      materialId: '',
      userId: '',
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
      case 'transfer': return <SwapHoriz />;
      case 'adjustment': return <TrendingFlat />;
      default: return <History />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'usage': return '#ea4335';
      case 'restock': return '#34a853';
      case 'transfer': return '#4285f4';
      case 'adjustment': return '#fbbc04';
      default: return '#9aa0a6';
    }
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
                    <MenuItem value="transfer">Transfer</MenuItem>
                    <MenuItem value="adjustment">Adjustment</MenuItem>
                  </Select>
                </FormControl>

                <TextField size="small" placeholder="Search material..." value={filters.materialId} onChange={(e) => handleFilterChange('materialId', e.target.value)} sx={{ flex: 1 }} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />

                <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                  <TextField size="small" type="date" label="From" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><DateRange fontSize="small" /></InputAdornment> }} />
                  <TextField size="small" type="date" label="To" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><DateRange fontSize="small" /></InputAdornment> }} />
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
              { title: 'Transfer Records', value: history.filter(h => h.type === 'transfer').length, icon: <SwapHoriz />, color: '#4285f4', description: 'Warehouse transfers' },
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
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ color: getActivityColor(record.type), display: 'flex', alignItems: 'center' }}>{getActivityIcon(record.type)}</Box>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>{record.type}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>{record.materialName}</Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{record.sku}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={`${record.quantity} ${record.unit}`} size="small" sx={{ backgroundColor: getActivityColor(record.type) === '#ea4335' ? (darkMode ? '#5c1a1a' : '#fce8e6') : getActivityColor(record.type) === '#34a853' ? (darkMode ? '#0d652d' : '#d9f0e1') : (darkMode ? '#1c3f91' : '#e8f0fe'), color: getActivityColor(record.type) === '#ea4335' ? (darkMode ? '#ea4335' : '#5c1a1a') : getActivityColor(record.type) === '#34a853' ? (darkMode ? '#34a853' : '#0d652d') : (darkMode ? '#8ab4f8' : '#1a73e8'), fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                          {record.type === 'usage' ? record.user : record.type === 'restock' ? record.supplier : 'System'}
                        </Typography>
                        {record.project && <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{record.project}</Typography>}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                          {new Date(record.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          {new Date(record.date).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleViewDetails(record)} sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: darkMode ? '#303134' : '#ffffff', color: darkMode ? '#e8eaed' : '#202124', borderRadius: '16px', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' } }}>
          {selectedRecord && (
            <>
              <DialogTitle sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }, color: darkMode ? '#e8eaed' : '#202124' }}>
                Activity Details
              </DialogTitle>
              <DialogContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ p: 1, borderRadius: '8px', backgroundColor: alpha(getActivityColor(selectedRecord.type), 0.1) }}>
                      {getActivityIcon(selectedRecord.type)}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize', color: getActivityColor(selectedRecord.type) }}>{selectedRecord.type}</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Activity Type</Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Material</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedRecord.materialName} ({selectedRecord.sku})</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Quantity</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: getActivityColor(selectedRecord.type) }}>{selectedRecord.quantity} {selectedRecord.unit}</Typography>
                    </Box>

                    {selectedRecord.user && (
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>User</Typography>
                        <Typography variant="body1">{selectedRecord.user}</Typography>
                      </Box>
                    )}

                    {selectedRecord.supplier && (
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Supplier</Typography>
                        <Typography variant="body1">{selectedRecord.supplier}</Typography>
                      </Box>
                    )}

                    {selectedRecord.project && (
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Project</Typography>
                        <Typography variant="body1">{selectedRecord.project}</Typography>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Date & Time</Typography>
                      <Typography variant="body1">{new Date(selectedRecord.date).toLocaleString()}</Typography>
                    </Box>

                    {selectedRecord.note && (
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>Notes</Typography>
                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{selectedRecord.note}</Typography>
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