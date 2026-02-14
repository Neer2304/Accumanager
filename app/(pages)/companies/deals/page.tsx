'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
  alpha,
  Divider,
  Breadcrumbs,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip as MuiChip,
  Paper,
  Alert,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  LinearProgress,
  Tooltip,
  Grid
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';

// Google Material Design 3 Colors
const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff'
};

// Pipeline Stages Config
const PIPELINE_STAGES = [
  { value: "qualification", label: "Qualification", color: "#4285f4", probability: 10 },
  { value: "needs_analysis", label: "Needs Analysis", color: "#fbbc04", probability: 20 },
  { value: "proposal", label: "Proposal/Quote", color: "#34a853", probability: 40 },
  { value: "negotiation", label: "Negotiation", color: "#ea4335", probability: 60 },
  { value: "closed_won", label: "Closed Won", color: "#34a853", probability: 100 },
  { value: "closed_lost", label: "Closed Lost", color: "#80868b", probability: 0 }
];

// Deal Status Config
const DEAL_STATUS = [
  { value: "open", label: "Open", color: "#4285f4" },
  { value: "won", label: "Won", color: "#34a853" },
  { value: "lost", label: "Lost", color: "#ea4335" },
  { value: "abandoned", label: "Abandoned", color: "#80868b" }
];

interface Deal {
  _id: string;
  name: string;
  accountId?: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  leadId?: string;
  dealValue: number;
  currency: string;
  probability: number;
  expectedRevenue: number;
  expectedClosingDate: string;
  actualClosingDate?: string;
  pipelineStage: string;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
  description?: string;
  products?: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  teamMembers?: string[];
  activities?: Array<{
    type: string;
    date: Date;
    description: string;
  }>;
  notes?: string;
  tags?: string[];
  stageChangedAt?: string;
  lastActivityAt?: string;
  activityCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  companyId: string;
}

interface Company {
  _id: string;
  name: string;
  email: string;
  industry?: string;
  size?: string;
  userRole: string;
}

interface Member {
  memberId: string;
  userId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  status: string;
}

export default function DealsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  const { companies, loading: companiesLoading } = useCompany();

  // State
  const [deals, setDeals] = useState<Deal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pipelineStageFilter, setPipelineStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Deal>('expectedClosingDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pipelineStats, setPipelineStats] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [totalPipelineValue, setTotalPipelineValue] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    accountId: "",
    accountName: "",
    contactId: "",
    contactName: "",
    leadId: "",
    dealValue: "",
    currency: "USD",
    probability: "10",
    expectedClosingDate: "",
    pipelineStage: "qualification",
    status: "open",
    assignedTo: "",
    assignedToName: "",
    description: "",
    notes: "",
    tags: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Set first company as default when companies load
  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompanyId) {
      const firstCompany = companies[0];
      setSelectedCompanyId(firstCompany._id);
    }
  }, [companies, selectedCompanyId]);

  // Fetch members when company changes
  useEffect(() => {
    if (selectedCompanyId) {
      fetchMembers(selectedCompanyId);
      fetchAccounts(selectedCompanyId);
      fetchContacts(selectedCompanyId);
      fetchLeads(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  // Fetch members of selected company
  const fetchMembers = async (companyId: string) => {
    if (!companyId) return;
    
    try {
      const res = await companyService.getMembers(companyId);
      if (res.success) {
        const activeMembers = res.members?.filter((m: Member) => m.status === 'active') || [];
        setMembers(activeMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // Fetch accounts
  const fetchAccounts = async (companyId: string) => {
    try {
      const response = await fetch(`/api/accounts?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  // Fetch contacts
  const fetchContacts = async (companyId: string) => {
    try {
      const response = await fetch(`/api/contacts?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch leads
  const fetchLeads = async (companyId: string) => {
    try {
      const response = await fetch(`/api/leads?companyId=${companyId}&limit=100`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  // Fetch deals
  const fetchDeals = async () => {
    if (!selectedCompanyId) return;

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (pipelineStageFilter !== 'all') params.append('pipelineStage', pipelineStageFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '100');
      
      const response = await fetch(`/api/deals?${params.toString()}`, {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch deals");
      }

      const data = await response.json();
      setDeals(data.deals || []);
      setPipelineStats(data.pipelineStats || []);
      setForecast(data.forecast || []);
      
      // Calculate total pipeline value
      const total = (data.deals || [])
        .filter((d: Deal) => d.status === 'open')
        .reduce((sum: number, d: Deal) => sum + (d.dealValue || 0), 0);
      setTotalPipelineValue(total);
      
    } catch (err: any) {
      console.error('Error fetching deals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (selectedCompanyId) {
      fetchDeals();
    }
  }, [selectedCompanyId]);

  // Filter when filters change
  useEffect(() => {
    if (selectedCompanyId) {
      fetchDeals();
    }
  }, [pipelineStageFilter, statusFilter]);

  // Search debounce
  useEffect(() => {
    if (!selectedCompanyId) return;
    
    const timer = setTimeout(() => {
      fetchDeals();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Select Changes
  const handleCompanyChange = (event: SelectChangeEvent) => {
    setSelectedCompanyId(event.target.value);
  };

  const handlePipelineStageFilterChange = (event: SelectChangeEvent) => {
    setPipelineStageFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleFormAccountChange = (event: SelectChangeEvent) => {
    const accountId = event.target.value;
    const selectedAccount = accounts.find(a => a._id === accountId);
    setFormData({ 
      ...formData, 
      accountId,
      accountName: selectedAccount?.name || ''
    });
  };

  const handleFormContactChange = (event: SelectChangeEvent) => {
    const contactId = event.target.value;
    const selectedContact = contacts.find(c => c._id === contactId);
    setFormData({ 
      ...formData, 
      contactId,
      contactName: selectedContact?.fullName || selectedContact?.name || ''
    });
  };

  const handleFormLeadChange = (event: SelectChangeEvent) => {
    const leadId = event.target.value;
    const selectedLead = leads.find(l => l._id === leadId);
    setFormData({ 
      ...formData, 
      leadId,
      accountId: selectedLead?.companyId || '',
      accountName: selectedLead?.companyName || '',
      contactId: selectedLead?.contactId || '',
      contactName: selectedLead?.fullName || `${selectedLead?.firstName || ''} ${selectedLead?.lastName || ''}`.trim(),
      dealValue: selectedLead?.budget?.toString() || formData.dealValue,
      currency: selectedLead?.currency || formData.currency
    });
  };

  const handleFormPipelineStageChange = (event: SelectChangeEvent) => {
    const stage = event.target.value;
    const stageConfig = PIPELINE_STAGES.find(s => s.value === stage);
    setFormData({ 
      ...formData, 
      pipelineStage: stage,
      probability: stageConfig?.probability.toString() || "10"
    });
  };

  const handleFormStatusChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, status: event.target.value });
  };

  const handleFormCurrencyChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, currency: event.target.value });
  };

  const handleFormAssignedToChange = (event: SelectChangeEvent) => {
    const userId = event.target.value;
    const selectedMember = members.find(m => m.userId === userId);
    setFormData({ 
      ...formData, 
      assignedTo: userId,
      assignedToName: selectedMember?.user?.name || ''
    });
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Deal name is required";
    }
    
    if (!formData.dealValue) {
      errors.dealValue = "Deal value is required";
    } else if (parseFloat(formData.dealValue) < 0) {
      errors.dealValue = "Deal value cannot be negative";
    }
    
    if (!formData.expectedClosingDate) {
      errors.expectedClosingDate = "Expected closing date is required";
    }
    
    if (!formData.pipelineStage) {
      errors.pipelineStage = "Pipeline stage is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add deal
  const addDeal = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const dealData = {
        ...formData,
        dealValue: parseFloat(formData.dealValue),
        probability: parseInt(formData.probability),
        expectedRevenue: (parseFloat(formData.dealValue) * parseInt(formData.probability)) / 100,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(dealData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add deal");
      }

      const newDeal = await response.json();
      setDeals(prev => [newDeal.deal, ...prev]);
      setSuccess("Deal added successfully");
      
      // Reset form
      setAddDialogOpen(false);
      setFormData({
        name: "",
        accountId: "",
        accountName: "",
        contactId: "",
        contactName: "",
        leadId: "",
        dealValue: "",
        currency: "USD",
        probability: "10",
        expectedClosingDate: "",
        pipelineStage: "qualification",
        status: "open",
        assignedTo: "",
        assignedToName: "",
        description: "",
        notes: "",
        tags: ""
      });
      setValidationErrors({});
      
    } catch (err: any) {
      console.error('Error adding deal:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update deal stage
  const updateStage = async (dealId: string, newStage: string) => {
    try {
      setSubmitting(true);
      
      const stageConfig = PIPELINE_STAGES.find(s => s.value === newStage);
      const probability = stageConfig?.probability || 10;
      
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          pipelineStage: newStage,
          probability,
          expectedRevenue: (selectedDeal?.dealValue || 0) * probability / 100
        })
      });

      if (!response.ok) throw new Error("Failed to update stage");

      await response.json();
      
      setDeals(prev => prev.map(deal => 
        deal._id === dealId ? { ...deal, pipelineStage: newStage, probability } : deal
      ));
      
      if (selectedDeal?._id === dealId) {
        setSelectedDeal({ ...selectedDeal, pipelineStage: newStage, probability });
      }
      
      setSuccess("Stage updated successfully");
      
    } catch (err: any) {
      console.error('Error updating stage:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update deal status
  const updateStatus = async (dealId: string, newStatus: string) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          status: newStatus,
          actualClosingDate: newStatus === 'won' || newStatus === 'lost' ? new Date() : undefined
        })
      });

      if (!response.ok) throw new Error("Failed to update status");

      await response.json();
      
      setDeals(prev => prev.map(deal => 
        deal._id === dealId ? { ...deal, status: newStatus } : deal
      ));
      
      if (selectedDeal?._id === dealId) {
        setSelectedDeal({ ...selectedDeal, status: newStatus });
      }
      
      setSuccess("Status updated successfully");
      
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete deal
  const deleteDeal = async (dealId: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete deal");

      setDeals(prev => prev.filter(deal => deal._id !== dealId));
      setDetailDialogOpen(false);
      setSuccess("Deal deleted successfully");
      
    } catch (err: any) {
      console.error('Error deleting deal:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Sorting
  const handleSort = (property: keyof Deal) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedDeals = React.useMemo(() => {
    return [...deals].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (orderBy === 'expectedClosingDate' || orderBy === 'actualClosingDate' || orderBy === 'createdAt') {
        return order === 'asc' 
          ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
      }
      
      if (orderBy === 'dealValue' || orderBy === 'probability' || orderBy === 'expectedRevenue') {
        return order === 'asc' 
          ? (aVal as number || 0) - (bVal as number || 0)
          : (bVal as number || 0) - (aVal as number || 0);
      }
      
      return order === 'asc'
        ? String(aVal || '').localeCompare(String(bVal || ''))
        : String(bVal || '').localeCompare(String(aVal || ''));
    });
  }, [deals, orderBy, order]);

  // Pagination
  const paginatedDeals = sortedDeals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get stage color
  const getStageColor = (stage: string) => {
    const stageConfig = PIPELINE_STAGES.find(s => s.value === stage);
    return stageConfig?.color || '#80868b';
  };

  // Get stage label
  const getStageLabel = (stage: string) => {
    const stageConfig = PIPELINE_STAGES.find(s => s.value === stage);
    return stageConfig?.label || stage;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusConfig = DEAL_STATUS.find(s => s.value === status);
    return statusConfig?.color || '#80868b';
  };

  // Get days until closing
  const getDaysUntilClosing = (date: string) => {
    const today = new Date();
    const closingDate = new Date(date);
    const diffTime = closingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get company name by ID
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c._id === companyId);
    return company?.name || 'Unknown Company';
  };

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
            You need to create a company before managing deals.
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
      {/* Header */}
      <Box sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        background: darkMode
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
      }}>
        <Breadcrumbs sx={{
          mb: 2,
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '& a': {
            color: 'inherit',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            '&:hover': { textDecoration: 'underline' }
          }
        }}>
          <Link href="/dashboard">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Dashboard
          </Link>
          <Typography color={darkMode ? '#e8eaed' : '#202124'}>
            Deals
          </Typography>
        </Breadcrumbs>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 400,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: darkMode ? '#e8eaed' : '#202124',
              letterSpacing: '-0.5px',
              mb: 1
            }}>
              Deal Management
            </Typography>
            <Typography sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: '0.875rem'
            }}>
              Track and manage your sales pipeline and deals
            </Typography>
          </Box>

          {/* Company Selector */}
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: darkMode ? '#303134' : '#fff',
              }
            }}
          >
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Select Company
            </InputLabel>
            <Select
              value={selectedCompanyId}
              label="Select Company"
              onChange={handleCompanyChange}
              startAdornment={
                <InputAdornment position="start">
                  <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              }
            >
              {companies.map(company => (
                <MenuItem key={company._id} value={company._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: 18 }} />
                    <Box>
                      <Typography variant="body2">{company.name}</Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {company.industry || 'No industry'} • {company.userRole}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Content */}
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

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 4,
              borderRadius: '8px',
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
              color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
              border: `1px solid ${alpha(GOOGLE_COLORS.red, 0.2)}`,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Pipeline Stats */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4
        }}>
          <Paper sx={{
            flex: '1 1 calc(25% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Total Pipeline Value
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.blue, fontWeight: 500, mt: 0.5 }}>
              ${totalPipelineValue.toLocaleString()}
            </Typography>
          </Paper>

          <Paper sx={{
            flex: '1 1 calc(25% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Open Deals
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.green, fontWeight: 500, mt: 0.5 }}>
              {deals.filter(d => d.status === 'open').length}
            </Typography>
          </Paper>

          <Paper sx={{
            flex: '1 1 calc(25% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Won Deals
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.purple, fontWeight: 500, mt: 0.5 }}>
              {deals.filter(d => d.status === 'won').length}
            </Typography>
          </Paper>

          <Paper sx={{
            flex: '1 1 calc(25% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Average Deal Size
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.yellow, fontWeight: 500, mt: 0.5 }}>
              ${deals.length > 0 ? (deals.reduce((sum, d) => sum + (d.dealValue || 0), 0) / deals.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
            </Typography>
          </Paper>
        </Box>

        {/* Pipeline Stages */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 4,
          p: 2,
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '16px',
        }}>
          {PIPELINE_STAGES.filter(s => s.value !== 'closed_won' && s.value !== 'closed_lost').map(stage => {
            const stageDeals = deals.filter(d => d.pipelineStage === stage.value && d.status === 'open');
            const stageValue = stageDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
            const percentage = totalPipelineValue > 0 ? (stageValue / totalPipelineValue) * 100 : 0;
            
            return (
              <Box key={stage.value} sx={{ flex: 1, minWidth: 120 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {stage.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: stage.color }}>
                    ${stageValue.toLocaleString()}
                  </Typography>
                </Box>
                <Tooltip title={`${stageDeals.length} deals • ${percentage.toFixed(1)}% of pipeline`}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(stage.color, 0.2),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stage.color,
                        borderRadius: 4
                      }
                    }}
                  />
                </Tooltip>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  {stageDeals.length} deals
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Filters and Actions */}
        <Paper
          sx={{
            mb: 4,
            p: 2.5,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { md: 'center' },
            gap: 2
          }}>
            {/* Search */}
            <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search deals by name, account, contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  },
                }}
              />
              <IconButton
                onClick={fetchDeals}
                sx={{
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  borderRadius: '50%',
                  width: 40,
                  height: 40
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>

            {/* Filters */}
            <Box sx={{
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap'
            }}>
              {/* Pipeline Stage Filter */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 160,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  }
                }}
              >
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Pipeline Stage
                </InputLabel>
                <Select
                  value={pipelineStageFilter}
                  label="Pipeline Stage"
                  onChange={handlePipelineStageFilterChange}
                >
                  <MenuItem value="all">All Stages</MenuItem>
                  {PIPELINE_STAGES.map(stage => (
                    <MenuItem key={stage.value} value={stage.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stage.color }} />
                        {stage.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Filter */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  }
                }}
              >
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Status
                </InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {DEAL_STATUS.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: status.color }} />
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  borderRadius: '24px',
                  bgcolor: GOOGLE_COLORS.green,
                  '&:hover': { bgcolor: '#2d9248' },
                  px: 3,
                  whiteSpace: 'nowrap'
                }}
              >
                Add Deal
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Deals Table */}
        {loading ? (
          <Paper sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px'
          }}>
            <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
            <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Loading deals...
            </Typography>
          </Paper>
        ) : deals.length === 0 ? (
          <Paper sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px'
          }}>
            <AccountBalanceIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No Deals Found
            </Typography>
            <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {searchQuery || pipelineStageFilter !== 'all' || statusFilter !== 'all'
                ? "No deals match your current filters. Try adjusting your search criteria."
                : "Start building your pipeline by adding your first deal."}
            </Typography>
            {!searchQuery && pipelineStageFilter === 'all' && statusFilter === 'all' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  borderRadius: '24px',
                  bgcolor: GOOGLE_COLORS.green,
                  '&:hover': { bgcolor: '#2d9248' },
                  px: 4
                }}
              >
                Add Your First Deal
              </Button>
            )}
          </Paper>
        ) : (
          <Paper sx={{
            overflow: 'hidden',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px'
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={() => handleSort('name')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Deal Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Account/Contact</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'dealValue'}
                        direction={orderBy === 'dealValue' ? order : 'asc'}
                        onClick={() => handleSort('dealValue')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Value
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'probability'}
                        direction={orderBy === 'probability' ? order : 'asc'}
                        onClick={() => handleSort('probability')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Probability
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Expected Revenue</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'expectedClosingDate'}
                        direction={orderBy === 'expectedClosingDate' ? order : 'asc'}
                        onClick={() => handleSort('expectedClosingDate')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Closing Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDeals.map((deal) => {
                    const daysUntil = getDaysUntilClosing(deal.expectedClosingDate);
                    const isOverdue = daysUntil < 0 && deal.status === 'open';
                    
                    return (
                      <TableRow
                        key={deal._id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}
                        onClick={() => {
                          setSelectedDeal(deal);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {deal.name}
                            </Typography>
                            {deal.tags && deal.tags.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                {deal.tags.slice(0, 2).map((tag, i) => (
                                  <MuiChip
                                    key={i}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.6rem',
                                      bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {deal.accountName && (
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <BusinessIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                {deal.accountName}
                              </Typography>
                            )}
                            {deal.contactName && (
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                {deal.contactName}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {deal.currency} {deal.dealValue?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <MuiChip
                            label={getStageLabel(deal.pipelineStage)}
                            size="small"
                            sx={{
                              bgcolor: alpha(getStageColor(deal.pipelineStage), 0.1),
                              color: getStageColor(deal.pipelineStage),
                              borderColor: alpha(getStageColor(deal.pipelineStage), 0.3),
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {deal.probability}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={deal.probability}
                              sx={{
                                width: 50,
                                height: 4,
                                borderRadius: 2,
                                bgcolor: darkMode ? '#3c4043' : '#dadce0',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getStageColor(deal.pipelineStage)
                                }
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {deal.currency} {deal.expectedRevenue?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 14, color: isOverdue ? GOOGLE_COLORS.red : darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: isOverdue ? GOOGLE_COLORS.red : darkMode ? '#e8eaed' : '#202124',
                                fontWeight: isOverdue ? 500 : 400
                              }}
                            >
                              {new Date(deal.expectedClosingDate).toLocaleDateString()}
                              {daysUntil > 0 && ` (${daysUntil}d)`}
                              {isOverdue && ' (Overdue)'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {deal.assignedToName ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                                <PersonIcon sx={{ fontSize: 14, color: GOOGLE_COLORS.blue }} />
                              </Avatar>
                              <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {deal.assignedToName}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              Unassigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDeal(deal);
                                setDetailDialogOpen(true);
                              }}
                              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                                setSelectedDeal(deal);
                              }}
                              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                            >
                              <MoreIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={sortedDeals.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            />
          </Paper>
        )}
      </Box>

      {/* Add Deal Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !submitting && setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
          px: 4,
          py: 2.5,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Add New Deal
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Create a new deal in your pipeline
              </Typography>
            </Box>
            <IconButton
              onClick={() => !submitting && setAddDialogOpen(false)}
              disabled={submitting}
              size="small"
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Deal Name */}
            <TextField
              fullWidth
              label="Deal Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />

            {/* Link to Lead */}
            <FormControl
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Convert from Lead</InputLabel>
              <Select
                value={formData.leadId}
                label="Convert from Lead"
                onChange={handleFormLeadChange}
              >
                <MenuItem value="">Select Lead (Optional)</MenuItem>
                {leads.filter(l => l.status === 'qualified' || l.status === 'contacted').map(lead => (
                  <MenuItem key={lead._id} value={lead._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18 }} />
                      <Box>
                        <Typography variant="body2">{lead.fullName || `${lead.firstName} ${lead.lastName}`}</Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {lead.companyName} • {lead.currency} {lead.budget?.toLocaleString() || 'No budget'}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Account and Contact */}
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Account & Contact
            </Typography>

            <FormControl
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Account</InputLabel>
              <Select
                value={formData.accountId}
                label="Account"
                onChange={handleFormAccountChange}
              >
                <MenuItem value="">Select Account (Optional)</MenuItem>
                {accounts.map(account => (
                  <MenuItem key={account._id} value={account._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 18 }} />
                      <Box>
                        <Typography variant="body2">{account.name}</Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {account.industry || 'No industry'}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Contact</InputLabel>
              <Select
                value={formData.contactId}
                label="Contact"
                onChange={handleFormContactChange}
              >
                <MenuItem value="">Select Contact (Optional)</MenuItem>
                {contacts.map(contact => (
                  <MenuItem key={contact._id} value={contact._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18 }} />
                      <Box>
                        <Typography variant="body2">{contact.fullName || contact.name}</Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {contact.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Deal Details */}
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Deal Details
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Deal Value *"
                type="number"
                value={formData.dealValue}
                onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                error={!!validationErrors.dealValue}
                helperText={validationErrors.dealValue}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={handleFormCurrencyChange}
                >
                  <MenuItem value="USD">USD $</MenuItem>
                  <MenuItem value="EUR">EUR €</MenuItem>
                  <MenuItem value="GBP">GBP £</MenuItem>
                  <MenuItem value="INR">INR ₹</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl
                fullWidth
                size="small"
                error={!!validationErrors.pipelineStage}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Pipeline Stage *</InputLabel>
                <Select
                  value={formData.pipelineStage}
                  label="Pipeline Stage *"
                  onChange={handleFormPipelineStageChange}
                >
                  {PIPELINE_STAGES.filter(s => s.value !== 'closed_won' && s.value !== 'closed_lost').map(stage => (
                    <MenuItem key={stage.value} value={stage.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stage.color }} />
                        {stage.label} ({stage.probability}%)
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={handleFormStatusChange}
                >
                  {DEAL_STATUS.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: status.color }} />
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Expected Closing Date *"
              type="date"
              value={formData.expectedClosingDate}
              onChange={(e) => setFormData({ ...formData, expectedClosingDate: e.target.value })}
              error={!!validationErrors.expectedClosingDate}
              helperText={validationErrors.expectedClosingDate}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />

            {/* Assignment */}
            <FormControl
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Assign To</InputLabel>
              <Select
                value={formData.assignedTo}
                label="Assign To"
                onChange={handleFormAssignedToChange}
              >
                <MenuItem value="">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 18 }} />
                    Unassigned
                  </Box>
                </MenuItem>
                {members.map(member => (
                  <MenuItem key={member.userId} value={member.userId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                        {member.user?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{member.user?.name}</Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {member.role}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Additional Information */}
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Additional Information
            </Typography>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              size="small"
              sx={{
                                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />

            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="high-priority, enterprise, q1-target"
              size="small"
              helperText="Enter tags separated by commas"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
        }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={submitting}
            sx={{
              borderRadius: '24px',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addDeal}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <AddIcon />}
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.green,
              '&:hover': { bgcolor: '#2d9248' },
              px: 4
            }}
          >
            {submitting ? 'Creating...' : 'Create Deal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deal Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        {selectedDeal && (
          <>
            <DialogTitle sx={{
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              px: 4,
              py: 2.5,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {selectedDeal.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <MuiChip
                      label={getStageLabel(selectedDeal.pipelineStage)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStageColor(selectedDeal.pipelineStage), 0.1),
                        color: getStageColor(selectedDeal.pipelineStage),
                        borderColor: alpha(getStageColor(selectedDeal.pipelineStage), 0.3),
                      }}
                    />
                    <MuiChip
                      label={DEAL_STATUS.find(s => s.value === selectedDeal.status)?.label || selectedDeal.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(selectedDeal.status), 0.1),
                        color: getStatusColor(selectedDeal.status),
                      }}
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setDetailDialogOpen(false)}
                  size="small"
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Deal Value and Dates */}
                <Paper sx={{
                  p: 2,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  borderRadius: '16px',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Deal Value
                      </Typography>
                      <Typography variant="h6" sx={{ color: GOOGLE_COLORS.blue, fontWeight: 500 }}>
                        {selectedDeal.currency} {selectedDeal.dealValue?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Probability
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ color: getStageColor(selectedDeal.pipelineStage), fontWeight: 500 }}>
                          {selectedDeal.probability}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={selectedDeal.probability}
                          sx={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: darkMode ? '#3c4043' : '#dadce0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getStageColor(selectedDeal.pipelineStage)
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Expected Revenue
                      </Typography>
                      <Typography variant="h6" sx={{ color: GOOGLE_COLORS.green, fontWeight: 500 }}>
                        {selectedDeal.currency} {selectedDeal.expectedRevenue?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Closing Date
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {new Date(selectedDeal.expectedClosingDate).toLocaleDateString()}
                        {getDaysUntilClosing(selectedDeal.expectedClosingDate) > 0 && (
                          <Typography variant="caption" component="span" sx={{ ml: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            ({getDaysUntilClosing(selectedDeal.expectedClosingDate)} days)
                          </Typography>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Account and Contact */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {selectedDeal.accountName && (
                    <Paper sx={{
                      flex: 1,
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BusinessIcon sx={{ fontSize: 16 }} /> Account
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500, mt: 0.5 }}>
                        {selectedDeal.accountName}
                      </Typography>
                    </Paper>
                  )}

                  {selectedDeal.contactName && (
                    <Paper sx={{
                      flex: 1,
                      p: 2,
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      borderRadius: '16px',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon sx={{ fontSize: 16 }} /> Contact
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500, mt: 0.5 }}>
                        {selectedDeal.contactName}
                      </Typography>
                    </Paper>
                  )}
                </Box>

                {/* Assignment */}
                <Paper sx={{
                  p: 2,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  borderRadius: '16px',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                    Assigned To
                  </Typography>
                  {selectedDeal.assignedToName ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                        <PersonIcon sx={{ fontSize: 18, color: GOOGLE_COLORS.blue }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedDeal.assignedToName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {members.find(m => m.userId === selectedDeal.assignedTo)?.role || 'Team Member'}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Unassigned
                    </Typography>
                  )}
                </Paper>

                {/* Description */}
                {selectedDeal.description && (
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'pre-wrap' }}>
                      {selectedDeal.description}
                    </Typography>
                  </Paper>
                )}

                {/* Notes */}
                {selectedDeal.notes && (
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'pre-wrap' }}>
                      {selectedDeal.notes}
                    </Typography>
                  </Paper>
                )}

                {/* Tags */}
                {selectedDeal.tags && selectedDeal.tags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selectedDeal.tags.map((tag, i) => (
                      <MuiChip
                        key={i}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                          color: darkMode ? '#e8eaed' : '#202124',
                          borderRadius: '16px',
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Products */}
                {selectedDeal.products && selectedDeal.products.length > 0 && (
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                      Products
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedDeal.products.map((product, i) => (
                            <TableRow key={i}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell align="right">{product.quantity}</TableCell>
                              <TableCell align="right">{selectedDeal.currency} {product.unitPrice.toLocaleString()}</TableCell>
                              <TableCell align="right">{selectedDeal.currency} {product.totalPrice.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}

                {/* Timeline */}
                <Paper sx={{
                  p: 2,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  borderRadius: '16px',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                    Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Created
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {new Date(selectedDeal.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Last Updated
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {new Date(selectedDeal.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {selectedDeal.stageChangedAt && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Stage Changed
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {new Date(selectedDeal.stageChangedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    {selectedDeal.lastActivityAt && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Last Activity
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {new Date(selectedDeal.lastActivityAt).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* Activity Stats */}
                {selectedDeal.activityCount > 0 && (
                  <Paper sx={{
                    p: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 1 }}>
                      Activity Count
                    </Typography>
                    <Typography variant="h6" sx={{ color: GOOGLE_COLORS.blue, fontWeight: 500 }}>
                      {selectedDeal.activityCount} activities
                    </Typography>
                  </Paper>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{
              p: 3,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Button
                  color="error"
                  onClick={() => deleteDeal(selectedDeal._id)}
                  disabled={submitting}
                  startIcon={<DeleteIcon />}
                  sx={{
                    borderRadius: '24px',
                    color: GOOGLE_COLORS.red,
                    borderColor: alpha(GOOGLE_COLORS.red, 0.5),
                  }}
                >
                  Delete
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => setDetailDialogOpen(false)}
                  sx={{
                    borderRadius: '24px',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    // TODO: Implement edit functionality
                    setDetailDialogOpen(false);
                  }}
                  sx={{
                    borderRadius: '24px',
                    bgcolor: GOOGLE_COLORS.blue,
                    '&:hover': { bgcolor: '#1557b0' },
                  }}
                >
                  Edit Deal
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Stage Update Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '12px',
            minWidth: 200,
          }
        }}
      >
        <MenuItem disabled sx={{ opacity: 1, fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
          Move to Stage
        </MenuItem>
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
        {PIPELINE_STAGES.filter(s => s.value !== 'closed_won' && s.value !== 'closed_lost').map(stage => (
          <MenuItem
            key={stage.value}
            onClick={() => {
              if (selectedDeal) {
                updateStage(selectedDeal._id, stage.value);
                setAnchorEl(null);
              }
            }}
            disabled={selectedDeal?.pipelineStage === stage.value || submitting}
            sx={{
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stage.color }} />
              <Typography variant="body2">{stage.label}</Typography>
              {selectedDeal?.pipelineStage === stage.value && (
                <CheckCircleIcon sx={{ fontSize: 16, color: GOOGLE_COLORS.green, ml: 'auto' }} />
              )}
            </Box>
          </MenuItem>
        ))}
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
        <MenuItem disabled sx={{ opacity: 1, fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
          Update Status
        </MenuItem>
        {DEAL_STATUS.map(status => (
          <MenuItem
            key={status.value}
            onClick={() => {
              if (selectedDeal) {
                updateStatus(selectedDeal._id, status.value);
                setAnchorEl(null);
              }
            }}
            disabled={selectedDeal?.status === status.value || submitting}
            sx={{
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: status.color }} />
              <Typography variant="body2">{status.label}</Typography>
              {selectedDeal?.status === status.value && (
                <CheckCircleIcon sx={{ fontSize: 16, color: GOOGLE_COLORS.green, ml: 'auto' }} />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}