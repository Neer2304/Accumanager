"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  CloudDownload as CloudDownloadIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/Layout/MainLayout';
import { EmployeeGrid } from '@/components/employees/EmployeeGrid';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee, EmployeeFilters as FiltersType, defaultEmployeeFilters } from '@/types/employee.types';

export default function EmployeesPage() {
  const router = useRouter();
  const theme = useTheme();
  
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

  const [filters, setFilters] = useState<FiltersType>(defaultEmployeeFilters);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [deleting, setDeleting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees(filters);
  }, [filters, fetchEmployees]);

  const handleFiltersChange = (newFilters: Partial<FiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCreateEmployee = () => {
    router.push('/employees/create');
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
      await Promise.all(
        employeesToDelete.map(id => deleteEmployee(id))
      );
      
      setSuccessMessage(`${employeesToDelete.length} employee(s) deleted successfully`);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      clearSelection();
      fetchEmployees(filters); // Refresh list
    } catch (err) {
      console.error('Error deleting employee:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchEmployees(filters);
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleDownloadCSV = () => {
    console.log('Downloading CSV...');
    handleDownloadMenuClose();
  };

  const handleDownloadExcel = () => {
    console.log('Downloading Excel...');
    handleDownloadMenuClose();
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF...');
    handleDownloadMenuClose();
  };

  const handleExportAll = () => {
    console.log('Exporting all data...');
    handleDownloadMenuClose();
  };

  const handleBack = () => {
    window.history.back();
  };

  // Stats calculation - SAFE VERSION
  const totalEmployees = Array.isArray(employees) ? employees.length : 0;
  const activeEmployees = Array.isArray(employees) 
    ? employees.filter((e: Employee) => e.isActive).length 
    : 0;
  const inactiveEmployees = totalEmployees - activeEmployees;
  
  const avgSalary = Array.isArray(employees) && employees.length > 0 
    ? employees.reduce((sum: number, emp: Employee) => sum + (emp.salary || 0), 0) / employees.length 
    : 0;

  if (loading && !employees.length) {
    return (
      <MainLayout title="Employee Management">
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '60vh' 
          }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Employee Management">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Dashboard
          </Button>

          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Employee Management</Typography>
          </Breadcrumbs>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Employee Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your team, track attendance, and process payroll
              </Typography>
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {!isOnline && (
                <Chip 
                  label="Offline Mode" 
                  size="small" 
                  color="warning" 
                  variant="outlined"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              )}
              
              <Chip 
                label={`${totalEmployees} Total`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
              
              <Chip 
                label={`${activeEmployees} Active`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
              
              <Chip 
                label={`${inactiveEmployees} Inactive`}
                size="small"
                color="default"
                variant="outlined"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />

              {/* Download Button with Menu */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadClick}
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    alignSelf: { xs: 'flex-start', sm: 'center' }
                  }}
                >
                  Download
                </Button>
                
                <IconButton
                  size="small"
                  onClick={handleDownloadClick}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    alignSelf: 'center'
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                startIcon={<PersonAddIcon />}
                onClick={handleCreateEmployee}
                variant="contained"
                color="success"
                size="small"
                sx={{ 
                  borderRadius: 2,
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}
              >
                Add Employee
              </Button>
            </Stack>
          </Box>

          {/* Download Menu */}
          <Menu
            anchorEl={downloadMenuAnchor}
            open={Boolean(downloadMenuAnchor)}
            onClose={handleDownloadMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleDownloadCSV}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileDownloadIcon fontSize="small" />
                <Typography variant="body2">Download CSV</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleDownloadExcel}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ExcelIcon fontSize="small" />
                <Typography variant="body2">Download Excel</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleDownloadPDF}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PdfIcon fontSize="small" />
                <Typography variant="body2">Download PDF</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleExportAll}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CloudDownloadIcon fontSize="small" />
                <Typography variant="body2">Export All Data</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>

        {/* Stats Card */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Total Employees
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {totalEmployees}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Active
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {activeEmployees}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Avg. Salary
                </Typography>
                <Typography variant="h5" fontWeight={700} color="secondary">
                  ₹{avgSalary.toFixed(2)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Selected
                </Typography>
                <Typography variant="h5" fontWeight={700} color="info.main">
                  {selectedEmployees.length}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                variant="outlined"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Page {pagination.page} of {pagination.pages} • Showing {employees.length} employees
          </Typography>
        </Paper>

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body1" fontWeight={600}>
                {selectedEmployees.length} employee(s) selected
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setEmployeeToDelete(null);
                    setDeleteDialogOpen(true);
                  }}
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Delete Selected
                </Button>
                <Button
                  onClick={clearSelection}
                  variant="text"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Clear Selection
                </Button>
              </Stack>
            </Box>
          </Paper>
        )}

        {/* Filters */}
        <EmployeeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Employee Grid - FIXED: Pass employees as array */}
        {Array.isArray(employees) && (
          <EmployeeGrid
            employees={employees}
            loading={loading}
            selectedEmployees={selectedEmployees}
            onEmployeeSelect={(employee) => toggleEmployeeSelection(employee._id)}
            onEmployeeEdit={handleEditEmployee}
            onEmployeeDelete={handleDeleteEmployee}
            onMarkAttendance={handleMarkAttendance}
            onViewDetails={handleViewDetails}
            onCreateEmployee={handleCreateEmployee}
            emptyMessage="No employees found. Add your first employee to get started."
          />
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Paper
            sx={{
              p: 2,
              mt: 3,
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              onClick={() => handleFiltersChange({ page: pagination.page - 1 })}
              disabled={pagination.page === 1 || loading}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Previous
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              Page {pagination.page} of {pagination.pages}
            </Typography>
            
            <Button
              onClick={() => handleFiltersChange({ page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages || loading}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Next
            </Button>
          </Paper>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Delete {employeeToDelete ? employeeToDelete.name : 'Selected Employees'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {employeeToDelete 
                ? `"${employeeToDelete.name}"` 
                : selectedEmployees.length > 1 
                  ? `${selectedEmployees.length} employees` 
                  : 'this employee'}? This action cannot be undone.
            </Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>
              This will also delete all attendance records and salary history for the employee.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteEmployee}
              variant="contained"
              color="error"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {deleting ? 'Deleting...' : `Delete${!employeeToDelete && selectedEmployees.length > 1 ? ` (${selectedEmployees.length})` : ''}`}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </MainLayout>
  );
}