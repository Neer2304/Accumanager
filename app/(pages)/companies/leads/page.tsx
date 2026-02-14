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
  TableSortLabel
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
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
  Group as GroupIcon
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

// Lead Status Config
const LEAD_STATUS = [
  { value: "new", label: "New", color: "#4285f4", emoji: "🆕" },
  { value: "contacted", label: "Contacted", color: "#fbbc04", emoji: "📞" },
  { value: "qualified", label: "Qualified", color: "#34a853", emoji: "✅" },
  { value: "disqualified", label: "Disqualified", color: "#ea4335", emoji: "❌" },
  { value: "converted", label: "Converted", color: "#9334e6", emoji: "🎉" },
  { value: "lost", label: "Lost", color: "#80868b", emoji: "💔" }
];

// Lead Source Config
const LEAD_SOURCES = [
  { value: "website", label: "Website", emoji: "🌐" },
  { value: "referral", label: "Referral", emoji: "🤝" },
  { value: "cold_call", label: "Cold Call", emoji: "📞" },
  { value: "social_media", label: "Social Media", emoji: "📱" },
  { value: "email_campaign", label: "Email Campaign", emoji: "📧" },
  { value: "event", label: "Event", emoji: "🎪" },
  { value: "partner", label: "Partner", emoji: "🤲" },
  { value: "other", label: "Other", emoji: "📌" }
];

// Interest Level Config
const INTEREST_LEVELS = [
  { value: "low", label: "Low", color: "#80868b", emoji: "😐" },
  { value: "medium", label: "Medium", color: "#fbbc04", emoji: "🙂" },
  { value: "high", label: "High", color: "#34a853", emoji: "😊" },
  { value: "very_high", label: "Very High", color: "#ea4335", emoji: "🤩" }
];

interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  score: number;
  assignedTo?: string;
  assignedToName?: string;
  companyId: string;
  companyName?: string;
  budget?: number;
  currency: string;
  interestLevel: string;
  createdAt: string;
  lastContactedAt?: string;
  nextFollowUp?: string;
  tags: string[];
  convertedToContact?: string;
  convertedToDeal?: string;
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

export default function LeadsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  const { companies, loading: companiesLoading } = useCompany();

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Lead>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [stats, setStats] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "website",
    status: "new",
    companyId: "",
    companyName: "",
    position: "",
    budget: "",
    currency: "USD",
    interestLevel: "medium",
    assignedTo: "",
    assignedToName: "",
    notes: "",
    tags: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  // Fetch members when company changes
  useEffect(() => {
    if (selectedCompanyId) {
      fetchMembers(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  // Fetch members of selected company using companyService
  const fetchMembers = async (companyId: string) => {
    if (!companyId) return;
    
    try {
      const res = await companyService.getMembers(companyId);
      if (res.success) {
        // Filter only active members
        const activeMembers = res.members?.filter((m: Member) => m.status === 'active') || [];
        setMembers(activeMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // Fetch leads with proper error handling
  const fetchLeads = async () => {
    if (!selectedCompanyId) return;

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('companyId', selectedCompanyId);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '100');
      
      const response = await fetch(`/api/leads?${params.toString()}`, {
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
        throw new Error(errorData.error || "Failed to fetch leads");
      }

      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || []);
      
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (selectedCompanyId) {
      fetchLeads();
    }
  }, [selectedCompanyId]);

  // Filter leads when filters change
  useEffect(() => {
    if (selectedCompanyId) {
      fetchLeads();
    }
  }, [statusFilter, sourceFilter]);

  // Search debounce
  useEffect(() => {
    if (!selectedCompanyId) return;
    
    const timer = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
  };

  const handleSourceFilterChange = (event: SelectChangeEvent) => {
    setSourceFilter(event.target.value);
  };

  const handleFormCompanyChange = (event: SelectChangeEvent) => {
    const companyId = event.target.value;
    const selectedCompany = companies.find(c => c._id === companyId);
    setFormData({ 
      ...formData, 
      companyId,
      companyName: selectedCompany?.name || '',
      assignedTo: '', // Reset assignment when company changes
      assignedToName: ''
    });
    
    // Fetch members for the selected company
    fetchMembers(companyId);
  };

  const handleFormSourceChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, source: event.target.value });
  };

  const handleFormStatusChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, status: event.target.value });
  };

  const handleFormCurrencyChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, currency: event.target.value });
  };

  const handleFormInterestChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, interestLevel: event.target.value });
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
    
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Enter a valid 10-digit phone number";
    }
    
    if (!formData.source) {
      errors.source = "Source is required";
    }
    
    if (!formData.companyId) {
      errors.companyId = "Company is required";
    }
    
    if (formData.budget && parseFloat(formData.budget) < 0) {
      errors.budget = "Budget cannot be negative";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add lead
  const addLead = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const leadData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        fullName: `${formData.firstName} ${formData.lastName}`.trim()
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add lead");
      }

      const newLead = await response.json();
      setLeads(prev => [newLead.lead, ...prev]);
      setSuccess("Lead added successfully");
      
      // Reset form
      setAddDialogOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        source: "website",
        status: "new",
        companyId: selectedCompanyId,
        companyName: companies.find(c => c._id === selectedCompanyId)?.name || "",
        position: "",
        budget: "",
        currency: "USD",
        interestLevel: "medium",
        assignedTo: "",
        assignedToName: "",
        notes: "",
        tags: ""
      });
      setValidationErrors({});
      
    } catch (err: any) {
      console.error('Error adding lead:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update lead status
  const updateStatus = async (leadId: string, newStatus: string) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status");

      await response.json();
      
      setLeads(prev => prev.map(lead => 
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      if (selectedLead?._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
      
      setSuccess("Status updated successfully");
      
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete lead
  const deleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete lead");

      setLeads(prev => prev.filter(lead => lead._id !== leadId));
      setDetailDialogOpen(false);
      setSuccess("Lead deleted successfully");
      
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Convert lead
  const convertLead = async (leadId: string) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to convert lead");

      const result = await response.json();
      
      setLeads(prev => prev.map(lead => 
        lead._id === leadId 
          ? { ...lead, status: 'converted', convertedToContact: result.contact._id, convertedToDeal: result.deal._id } 
          : lead
      ));
      
      setDetailDialogOpen(false);
      setSuccess("Lead converted successfully! Contact and deal created.");
      
    } catch (err: any) {
      console.error('Error converting lead:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Sorting
  const handleSort = (property: keyof Lead) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLeads = React.useMemo(() => {
    return [...leads].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (orderBy === 'createdAt' || orderBy === 'lastContactedAt' || orderBy === 'nextFollowUp') {
        return order === 'asc' 
          ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
      }
      
      if (orderBy === 'budget' || orderBy === 'score') {
        return order === 'asc' 
          ? (aVal as number || 0) - (bVal as number || 0)
          : (bVal as number || 0) - (aVal as number || 0);
      }
      
      if (orderBy === 'fullName') {
        const aName = a.fullName || `${a.firstName} ${a.lastName}`;
        const bName = b.fullName || `${b.firstName} ${b.lastName}`;
        return order === 'asc' 
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      }
      
      return order === 'asc'
        ? String(aVal || '').localeCompare(String(bVal || ''))
        : String(bVal || '').localeCompare(String(aVal || ''));
    });
  }, [leads, orderBy, order]);

  // Pagination
  const paginatedLeads = sortedLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get status color
  const getStatusColor = (status: string) => {
    const statusConfig = LEAD_STATUS.find(s => s.value === status);
    return statusConfig?.color || '#80868b';
  };

  // Get status emoji
  const getStatusEmoji = (status: string) => {
    const statusConfig = LEAD_STATUS.find(s => s.value === status);
    return statusConfig?.emoji || '📌';
  };

  // Get source emoji
  const getSourceEmoji = (source: string) => {
    const sourceConfig = LEAD_SOURCES.find(s => s.value === source);
    return sourceConfig?.emoji || '📌';
  };

  // Get interest color
  const getInterestColor = (level: string) => {
    const config = INTEREST_LEVELS.find(l => l.value === level);
    return config?.color || '#80868b';
  };

  // Get interest emoji
  const getInterestEmoji = (level: string) => {
    const config = INTEREST_LEVELS.find(l => l.value === level);
    return config?.emoji || '😐';
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
            Leads
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
              Lead Management
            </Typography>
            <Typography sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: '0.875rem'
            }}>
              Track, qualify, and convert your sales leads into customers
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

        {/* Stats Cards */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4
        }}>
          {[
            { label: 'Total Leads', value: leads.length, color: GOOGLE_COLORS.blue, icon: <PersonIcon /> },
            { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: GOOGLE_COLORS.green, icon: <CheckCircleIcon /> },
            { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: GOOGLE_COLORS.yellow, icon: <PhoneIcon /> },
            { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, color: GOOGLE_COLORS.purple, icon: <TrendingUpIcon /> },
            { label: 'Conversion Rate', value: leads.length > 0 ? `${Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100)}%` : '0%', color: GOOGLE_COLORS.red, icon: <AnalyticsIcon /> }
          ].map((stat, index) => (
            <Paper
              key={index}
              sx={{
                flex: '1 1 calc(20% - 16px)',
                minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 14px)', md: 'calc(20% - 16px)' },
                p: 2,
                bgcolor: darkMode ? '#2d2e30' : '#fff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '16px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                  borderColor: stat.color
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ color: stat.color, fontWeight: 500, mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{
                  p: 1,
                  borderRadius: '12px',
                  bgcolor: alpha(stat.color, 0.1),
                  color: stat.color
                }}>
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          ))}
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
                placeholder="Search leads by name, email, company..."
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
                onClick={fetchLeads}
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
                  {LEAD_STATUS.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{status.emoji}</span>
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Source Filter */}
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
                  Source
                </InputLabel>
                <Select
                  value={sourceFilter}
                  label="Source"
                  onChange={handleSourceFilterChange}
                >
                  <MenuItem value="all">All Sources</MenuItem>
                  {LEAD_SOURCES.map(source => (
                    <MenuItem key={source.value} value={source.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{source.emoji}</span>
                        {source.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    companyId: selectedCompanyId,
                    companyName: companies.find(c => c._id === selectedCompanyId)?.name || ''
                  }));
                  setAddDialogOpen(true);
                }}
                sx={{
                  borderRadius: '24px',
                  bgcolor: GOOGLE_COLORS.green,
                  '&:hover': { bgcolor: '#2d9248' },
                  px: 3,
                  whiteSpace: 'nowrap'
                }}
              >
                Add Lead
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Leads Table */}
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
              Loading leads...
            </Typography>
          </Paper>
        ) : leads.length === 0 ? (
          <Paper sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px'
          }}>
            <PersonIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No Leads Found
            </Typography>
            <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all'
                ? "No leads match your current filters. Try adjusting your search criteria."
                : "Start building your pipeline by adding your first lead."}
            </Typography>
            {!searchQuery && statusFilter === 'all' && sourceFilter === 'all' && (
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
                Add Your First Lead
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
                        active={orderBy === 'fullName'}
                        direction={orderBy === 'fullName' ? order : 'asc'}
                        onClick={() => handleSort('fullName')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Lead
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'source'}
                        direction={orderBy === 'source' ? order : 'asc'}
                        onClick={() => handleSort('source')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Source
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'status'}
                        direction={orderBy === 'status' ? order : 'asc'}
                        onClick={() => handleSort('status')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'budget'}
                        direction={orderBy === 'budget' ? order : 'asc'}
                        onClick={() => handleSort('budget')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Budget
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'score'}
                        direction={orderBy === 'score' ? order : 'asc'}
                        onClick={() => handleSort('score')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Score
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'createdAt'}
                        direction={orderBy === 'createdAt' ? order : 'asc'}
                        onClick={() => handleSort('createdAt')}
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Created
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLeads.map((lead) => (
                    <TableRow
                      key={lead._id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
                        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}
                      onClick={() => {
                        setSelectedLead(lead);
                        setDetailDialogOpen(true);
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(getStatusColor(lead.status), 0.1),
                              color: getStatusColor(lead.status),
                              width: 32,
                              height: 32
                            }}
                          >
                            {getStatusEmoji(lead.status)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {lead.fullName || `${lead.firstName} ${lead.lastName}`}
                            </Typography>
                            {lead.position && (
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {lead.position}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {lead.email && (
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              {lead.email}
                            </Typography>
                          )}
                          {lead.phone && (
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              {lead.phone}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <MuiChip
                          label={`${getSourceEmoji(lead.source)} ${lead.source.replace('_', ' ')}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <MuiChip
                          label={LEAD_STATUS.find(s => s.value === lead.status)?.label || lead.status}
                          size="small"
                          sx={{
                            bgcolor: alpha(getStatusColor(lead.status), 0.1),
                            color: getStatusColor(lead.status),
                            borderColor: alpha(getStatusColor(lead.status), 0.3),
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {lead.assignedToName ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Avatar sx={{ width: 20, height: 20, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                              <PersonIcon sx={{ fontSize: 12, color: GOOGLE_COLORS.blue }} />
                            </Avatar>
                            <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {lead.assignedToName}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Unassigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.budget ? (
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {lead.currency} {lead.budget.toLocaleString()}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Not set
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#fbbc04' }} />
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {lead.score || 0}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(lead);
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
                              setSelectedLead(lead);
                            }}
                            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                          >
                            <MoreIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={sortedLeads.length}
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

      {/* Add Lead Dialog */}
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
                Add New Lead
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Fill in the lead information below
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
            {/* Company Selection */}
            <Box>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                Company <span style={{ color: GOOGLE_COLORS.red }}>*</span>
              </Typography>
              <FormControl
                fullWidth
                size="small"
                error={!!validationErrors.companyId}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Select Company *</InputLabel>
                <Select
                  value={formData.companyId}
                  label="Select Company *"
                  onChange={handleFormCompanyChange}
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
                {validationErrors.companyId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {validationErrors.companyId}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Assignment - Show members of selected company */}
            {formData.companyId && members.length > 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                  Assign To
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
                  <InputLabel>Assign to team member</InputLabel>
                  <Select
                    value={formData.assignedTo}
                    label="Assign to team member"
                    onChange={handleFormAssignedToChange}
                    renderValue={(selected) => {
                      const member = members.find(m => m.userId === selected);
                      return member?.user?.name || 'Unassigned';
                    }}
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
              </Box>
            )}

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
            
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Personal Information
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={!!validationErrors.firstName}
                helperText={validationErrors.firstName}
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
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={!!validationErrors.lastName}
                helperText={validationErrors.lastName}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
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
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!validationErrors.phone}
                helperText={validationErrors.phone}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Lead Details
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl
                fullWidth
                size="small"
                error={!!validationErrors.source}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Source *</InputLabel>
                <Select
                  value={formData.source}
                  label="Source *"
                  onChange={handleFormSourceChange}
                >
                  {LEAD_SOURCES.map(source => (
                    <MenuItem key={source.value} value={source.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{source.emoji}</span>
                        {source.label}
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
                  {LEAD_STATUS.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{status.emoji}</span>
                        {status.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                error={!!validationErrors.budget}
                helperText={validationErrors.budget}
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
              <InputLabel>Interest Level</InputLabel>
              <Select
                value={formData.interestLevel}
                label="Interest Level"
                onChange={handleFormInterestChange}
              >
                {INTEREST_LEVELS.map(level => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{level.emoji}</span>
                      {level.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Additional Information
            </Typography>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
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
              label="Tags (comma separated)"
              placeholder="hot, follow-up, vip"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              size="small"
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
          gap: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
        }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={submitting}
            sx={{
              borderRadius: '24px',
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              px: 4
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={addLead}
            disabled={submitting}
            variant="contained"
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.green,
              '&:hover': { bgcolor: '#2d9248' },
              px: 4,
              minWidth: 120
            }}
          >
            {submitting ? <CircularProgress size={24} /> : "Add Lead"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lead Detail Dialog */}
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
        {selectedLead && (
          <>
            <DialogTitle sx={{
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              px: 4,
              py: 2.5,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(getStatusColor(selectedLead.status), 0.1),
                      color: getStatusColor(selectedLead.status),
                      width: 48,
                      height: 48
                    }}
                  >
                    {getStatusEmoji(selectedLead.status)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {selectedLead.fullName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <MuiChip
                        label={selectedLead.companyName || getCompanyName(selectedLead.companyId)}
                        size="small"
                        icon={<BusinessIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                          color: GOOGLE_COLORS.blue,
                          height: 24
                        }}
                      />
                      {selectedLead.position && (
                        <MuiChip
                          label={selectedLead.position}
                          size="small"
                          sx={{
                            bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                            color: darkMode ? '#e8eaed' : '#202124',
                            height: 24
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={() => setDetailDialogOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Status Badges */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <MuiChip
                    label={LEAD_STATUS.find(s => s.value === selectedLead.status)?.label || selectedLead.status}
                    sx={{
                      bgcolor: alpha(getStatusColor(selectedLead.status), 0.1),
                      color: getStatusColor(selectedLead.status),
                      border: `1px solid ${alpha(getStatusColor(selectedLead.status), 0.2)}`,
                      fontWeight: 500,
                    }}
                  />
                  <MuiChip
                    label={`${getSourceEmoji(selectedLead.source)} ${selectedLead.source.replace('_', ' ')}`}
                    variant="outlined"
                    sx={{
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                  <MuiChip
                    label={`${getInterestEmoji(selectedLead.interestLevel)} ${selectedLead.interestLevel}`}
                    sx={{
                      bgcolor: alpha(getInterestColor(selectedLead.interestLevel), 0.1),
                      color: getInterestColor(selectedLead.interestLevel),
                    }}
                  />
                  {selectedLead.score > 0 && (
                    <MuiChip
                      label={`Score: ${selectedLead.score}`}
                      icon={<StarIcon sx={{ fontSize: 14, color: '#fbbc04' }} />}
                      sx={{
                        bgcolor: alpha('#fbbc04', 0.1),
                        color: '#fbbc04',
                      }}
                    />
                  )}
                </Box>

                {/* Contact Information */}
                <Paper sx={{
                  p: 3,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '16px',
                }}>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedLead.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EmailIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedLead.email}
                        </Typography>
                      </Box>
                    )}
                    {selectedLead.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PhoneIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedLead.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* Assignment */}
                {selectedLead.assignedToName && (
                  <Paper sx={{
                    p: 3,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px',
                  }}>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                      Assigned To
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                        <PersonIcon sx={{ color: GOOGLE_COLORS.blue }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedLead.assignedToName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Lead Owner
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                )}

                {/* Deal Information */}
                {selectedLead.budget && (
                  <Paper sx={{
                    p: 3,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px',
                  }}>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                      Deal Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: alpha(GOOGLE_COLORS.green, 0.1),
                        color: GOOGLE_COLORS.green
                      }}>
                        <AttachMoneyIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Budget
                        </Typography>
                        <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedLead.currency} {selectedLead.budget.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                )}

                {/* Timeline */}
                <Paper sx={{
                  p: 3,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '16px',
                }}>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                    Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CalendarIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Created: {new Date(selectedLead.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {selectedLead.lastContactedAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ScheduleIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          Last Contacted: {new Date(selectedLead.lastContactedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    {selectedLead.nextFollowUp && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FlagIcon sx={{ fontSize: 20, color: '#fbbc04' }} />
                        <Typography variant="body2" sx={{ color: '#fbbc04', fontWeight: 500 }}>
                          Follow-up: {new Date(selectedLead.nextFollowUp).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* Tags */}
                {selectedLead.tags && selectedLead.tags.length > 0 && (
                  <Paper sx={{
                    p: 3,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px',
                  }}>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedLead.tags.map((tag, index) => (
                        <MuiChip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{
              p: 3,
              gap: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
            }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => deleteLead(selectedLead._id)}
                disabled={submitting}
                sx={{
                  borderRadius: '24px',
                  borderColor: GOOGLE_COLORS.red,
                  color: GOOGLE_COLORS.red,
                  px: 3,
                  '&:hover': {
                    borderColor: '#d93025',
                    bgcolor: alpha(GOOGLE_COLORS.red, 0.1),
                  }
                }}
              >
                Delete
              </Button>
              <Box sx={{ flex: 1 }} />
              {selectedLead.status !== 'converted' && selectedLead.status !== 'lost' && (
                <Button
                  variant="contained"
                  startIcon={<TrendingUpIcon />}
                  onClick={() => convertLead(selectedLead._id)}
                  disabled={submitting}
                  sx={{
                    borderRadius: '24px',
                    bgcolor: GOOGLE_COLORS.purple,
                    '&:hover': { bgcolor: '#6b3fcc' },
                    px: 3
                  }}
                >
                  Convert
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => setDetailDialogOpen(false)}
                sx={{
                  borderRadius: '24px',
                  bgcolor: GOOGLE_COLORS.blue,
                  '&:hover': { bgcolor: '#1557b0' },
                  px: 3
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            minWidth: 200,
            boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
          }
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setDetailDialogOpen(true);
          }}
          sx={{ gap: 1.5, py: 1.5 }}
        >
          <ViewIcon fontSize="small" />
          View Details
        </MenuItem>
        {selectedLead && selectedLead.status !== 'converted' && selectedLead.status !== 'lost' && (
          <MenuItem
            onClick={() => {
              convertLead(selectedLead._id);
              setAnchorEl(null);
            }}
            sx={{ gap: 1.5, py: 1.5 }}
          >
            <TrendingUpIcon fontSize="small" />
            Convert to Customer
          </MenuItem>
        )}
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
        {LEAD_STATUS.map(status => (
          <MenuItem
            key={status.value}
            onClick={() => {
              if (selectedLead) {
                updateStatus(selectedLead._id, status.value);
              }
              setAnchorEl(null);
            }}
            sx={{
              gap: 1.5,
              py: 1.5,
              color: status.color,
            }}
          >
            <Box component="span" sx={{ mr: 1 }}>{status.emoji}</Box>
            Mark as {status.label}
          </MenuItem>
        ))}
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
        <MenuItem
          onClick={() => {
            deleteLead(selectedLead?._id || '');
            setAnchorEl(null);
          }}
          sx={{ gap: 1.5, py: 1.5, color: GOOGLE_COLORS.red }}
        >
          <DeleteIcon fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}