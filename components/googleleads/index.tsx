'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  CircularProgress,
  SelectChangeEvent,
  Typography,
  Paper,
  Button
} from "@mui/material";
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Business as BusinessIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCompany } from '@/lib/companyContext';

// Import types and constants
import { Lead, LeadFormData } from './types';
import { GOOGLE_COLORS, DEFAULT_FORM_DATA } from './constants';

// Import hooks
import { useLeads } from './hooks/useLeads';
import { useMembers } from './hooks/useMembers';
import { useLeadMutations } from './hooks/useLeadMutations';

// Import components
import { LeadHeader } from './components/LeadHeader';
import { LeadStats } from './components/LeadStats';
import { LeadFilters } from './components/LeadFilters';
import { LeadTable } from './components/LeadTable';
import { AddLeadDialog } from './components/LeadDialogs/AddLeadDialog';
import { LeadDetailDialog } from './components/LeadDialogs/LeadDetailDialog';
import { LeadMenu } from './components/LeadMenu';

// Import utils
import { sortLeads } from './utils/helpers';

export default function LeadsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  const { companies, loading: companiesLoading } = useCompany();

  // State
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Lead>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formData, setFormData] = useState<LeadFormData>(DEFAULT_FORM_DATA);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks
  const { 
    leads, 
    setLeads, 
    loading, 
    error: leadsError, 
    stats,
    fetchLeads,
    getStatusCount,
    getConversionRate,
    setError: setLeadsError
  } = useLeads({
    companyId: selectedCompanyId,
    statusFilter,
    sourceFilter,
    searchQuery
  });

  const { members } = useMembers(selectedCompanyId);

  const {
    submitting,
    addLead,
    updateStatus,
    deleteLead,
    convertLead
  } = useLeadMutations({
    onSuccess: (message) => {
      setSuccess(message);
      fetchLeads();
    },
    onError: (error) => setError(error)
  });

  // Set first company as default when companies load
  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompanyId) {
      const firstCompany = companies[0];
      setSelectedCompanyId(firstCompany._id);
      setFormData(prev => ({
        ...prev,
        companyId: firstCompany._id,
        companyName: firstCompany.name
      }));
    }
  }, [companies, selectedCompanyId]);

  // Handle Select Changes
  const handleCompanyChange = (event: SelectChangeEvent) => {
    const companyId = event.target.value;
    const selectedCompany = companies.find(c => c._id === companyId);
    setSelectedCompanyId(companyId);
    setFormData(prev => ({ 
      ...prev, 
      companyId,
      companyName: selectedCompany?.name || ''
    }));
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset page when filter changes
  };

  const handleSourceFilterChange = (event: SelectChangeEvent) => {
    setSourceFilter(event.target.value);
    setPage(0); // Reset page when filter changes
  };

  const handleFormChange = (field: keyof LeadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Add lead handler
  const handleAddLead = async () => {
    const newLead = await addLead(formData);
    if (newLead) {
      setLeads(prev => [newLead, ...prev]);
      setAddDialogOpen(false);
      setFormData({
        ...DEFAULT_FORM_DATA,
        companyId: selectedCompanyId,
        companyName: companies.find(c => c._id === selectedCompanyId)?.name || ""
      });
      setValidationErrors({});
    }
  };

  // Update status handler
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    const success = await updateStatus(leadId, newStatus);
    if (success) {
      setLeads(prev => prev.map(lead => 
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      ));
      if (selectedLead?._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    }
  };

  // Delete handler
  const handleDeleteLead = async (leadId: string) => {
    const success = await deleteLead(leadId);
    if (success) {
      setLeads(prev => prev.filter(lead => lead._id !== leadId));
      setDetailDialogOpen(false);
    }
  };

  // Convert handler
  const handleConvertLead = async (leadId: string) => {
    const result = await convertLead(leadId);
    if (result) {
      setLeads(prev => prev.map(lead => 
        lead._id === leadId 
          ? { 
              ...lead, 
              status: 'converted', 
              convertedToContact: result.contact._id, 
              convertedToDeal: result.deal._id 
            } 
          : lead
      ));
      setDetailDialogOpen(false);
    }
  };

  // Sorting
  const handleSort = (property: keyof Lead) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLeads = React.useMemo(() => {
    return sortLeads(leads, orderBy, order);
  }, [leads, orderBy, order]);

  // Pagination
  const paginatedLeads = sortedLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get company name by ID
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c._id === companyId);
    return company?.name || 'Unknown Company';
  };

  // Stats for display - FIXED
const displayStats = [
  { 
    label: 'Total Leads', 
    value: leads.length, 
    color: GOOGLE_COLORS.blue, 
    icon: <PersonIcon /> 
  },
  { 
    label: 'New', 
    value: getStatusCount('new'), 
    color: GOOGLE_COLORS.blue, 
    icon: <PersonIcon /> 
  },
  { 
    label: 'Qualified', 
    value: getStatusCount('qualified'), 
    color: GOOGLE_COLORS.green, 
    icon: <CheckCircleIcon /> 
  },
  { 
    label: 'Contacted', 
    value: getStatusCount('contacted'), 
    color: GOOGLE_COLORS.yellow, 
    icon: <PhoneIcon /> 
  },
  { 
    label: 'Converted', 
    value: getStatusCount('converted'), 
    color: GOOGLE_COLORS.purple, 
    icon: <TrendingUpIcon /> 
  },
  { 
    label: 'Conversion Rate', 
    value: `${getConversionRate()}%`, 
    color: GOOGLE_COLORS.red, 
    icon: <AnalyticsIcon /> 
  }
];

  // Loading state
  if (companiesLoading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        bgcolor: darkMode ? '#202124' : '#f8f9fa'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
          <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Loading companies...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!selectedCompanyId && companies.length === 0) {
    return (
      <Box sx={{
        minHeight: '60vh',
        bgcolor: darkMode ? '#202124' : '#f8f9fa',
        p: 3
      }}>
        <Paper sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '24px'
        }}>
          <BusinessIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            No Companies Found
          </Typography>
          <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            You need to create a company before adding leads.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/companies/create')}
            sx={{
              bgcolor: GOOGLE_COLORS.blue,
              '&:hover': { bgcolor: '#1557b0' },
              borderRadius: '24px',
              px: 4
            }}
          >
            Create Company
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: darkMode ? '#202124' : '#f8f9fa',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      <LeadHeader
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={handleCompanyChange}
        darkMode={darkMode}
      />

      <Box sx={{
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: 4
      }}>
        {/* Alerts */}
        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            onClose={() => setSuccess(null)}
            sx={{
              borderRadius: '8px',
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.green, 0.1) : alpha(GOOGLE_COLORS.green, 0.05),
              color: darkMode ? '#81c995' : GOOGLE_COLORS.green,
              border: `1px solid ${alpha(GOOGLE_COLORS.green, 0.2)}`,
            }}
          >
            {success}
          </Alert>
        </Snackbar>

        {(error || leadsError) && (
          <Alert
            severity="error"
            onClose={() => {
              setError(null);
              setLeadsError(null);
            }}
            sx={{
              mb: 4,
              borderRadius: '8px',
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
              color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
              border: `1px solid ${alpha(GOOGLE_COLORS.red, 0.2)}`,
            }}
          >
            {error || leadsError}
          </Alert>
        )}

        <LeadStats stats={displayStats} darkMode={darkMode} />

        <LeadFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery("")}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          sourceFilter={sourceFilter}
          onSourceFilterChange={handleSourceFilterChange}
          onRefresh={fetchLeads}
          onAddClick={() => {
            setFormData(prev => ({
              ...prev,
              companyId: selectedCompanyId,
              companyName: companies.find(c => c._id === selectedCompanyId)?.name || ''
            }));
            setAddDialogOpen(true);
          }}
          darkMode={darkMode}
        />

        <LeadTable
          leads={leads}
          loading={loading}
          paginatedLeads={paginatedLeads}
          orderBy={orderBy}
          order={order}
          onSort={handleSort}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={sortedLeads.length}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          onLeadClick={(lead) => {
            setSelectedLead(lead);
            setDetailDialogOpen(true);
          }}
          onViewClick={(lead, e) => {
            e.stopPropagation();
            setSelectedLead(lead);
            setDetailDialogOpen(true);
          }}
          onMenuClick={(lead, e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
            setSelectedLead(lead);
          }}
          darkMode={darkMode}
          getCompanyName={getCompanyName}
        />
      </Box>

      <AddLeadDialog
        open={addDialogOpen}
        onClose={() => !submitting && setAddDialogOpen(false)}
        onSubmit={handleAddLead}
        formData={formData}
        onFormChange={handleFormChange}
        companies={companies}
        members={members || []}
        validationErrors={validationErrors}
        submitting={submitting}
        darkMode={darkMode}
      />

      <LeadDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        lead={selectedLead}
        onDelete={handleDeleteLead}
        onConvert={handleConvertLead}
        submitting={submitting}
        darkMode={darkMode}
        getCompanyName={getCompanyName}
      />

      <LeadMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        selectedLead={selectedLead}
        onViewDetails={() => {
          setAnchorEl(null);
          setDetailDialogOpen(true);
        }}
        onConvert={handleConvertLead}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteLead}
        darkMode={darkMode}
      />
    </Box>
  );
}