"use client";

import React, { useEffect, useState } from "react";
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
  Tooltip,
  Avatar,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  ListSubheader,
  Autocomplete,
  Chip as MuiChip
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
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
  Call as CallIcon,
  WhatsApp as WhatsAppIcon,
  FileCopy as FileCopyIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Import Layout
import { MainLayout } from "@/components/Layout/MainLayout";

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Alert as GoogleAlert } from '@/components/ui/Alert';

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
  legalName?: string;
  email: string;
  industry?: string;
  size?: string;
}

interface Member {
  userId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  isCurrentUser?: boolean;
}

export default function LeadsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
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

  // ✅ Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setCompanies(data.companies || []);
        
        // Set default company as first one
        if (data.companies && data.companies.length > 0 && !formData.companyId) {
          setFormData(prev => ({ 
            ...prev, 
            companyId: data.companies[0]._id,
            companyName: data.companies[0].name
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // ✅ Fetch members of selected company
  const fetchMembers = async (companyId: string) => {
    if (!companyId) return;
    
    try {
      const response = await fetch(`/api/companies/${companyId}/members`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        
        // Find current user to auto-assign
        const currentUser = data.members?.find((m: any) => m.isCurrentUser);
        if (currentUser && !formData.assignedTo) {
          setFormData(prev => ({
            ...prev,
            assignedTo: currentUser.userId,
            assignedToName: currentUser.user?.name
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // ✅ Fetch leads with proper error handling
  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📡 Fetching leads from /api/leads...");
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);
      if (companyFilter !== 'all') params.append('companyId', companyFilter);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '100');
      
      const response = await fetch(`/api/leads?${params.toString()}`, {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      // Handle 403 No Active Company - Redirect to setup
      if (response.status === 403) {
        const data = await response.json();
        if (data.error === 'No active company found') {
          console.log("🚫 No active company found, redirecting to setup...");
          router.push("/company/redirect");
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch leads");
      }

      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || []);
      
      console.log(`✅ Loaded ${data.leads?.length || 0} leads`);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      await fetchCompanies();
      await fetchLeads();
    };
    init();
  }, []);

  // Fetch members when company changes in form
  useEffect(() => {
    if (formData.companyId) {
      fetchMembers(formData.companyId);
    }
  }, [formData.companyId]);

  // Filter leads when filters change
  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter, companyFilter]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Select Changes
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleSourceFilterChange = (event: SelectChangeEvent) => {
    setSourceFilter(event.target.value);
  };

  const handleCompanyFilterChange = (event: SelectChangeEvent) => {
    setCompanyFilter(event.target.value);
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
      
      // Reset form
      setAddDialogOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        source: "website",
        status: "new",
        companyId: companies[0]?._id || "",
        companyName: companies[0]?.name || "",
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
      
      console.log("✅ Lead added successfully");
    } catch (err: any) {
      console.error('❌ Error:', err);
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

      const updated = await response.json();
      
      setLeads(prev => prev.map(lead => 
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      if (selectedLead?._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
      
      console.log("✅ Status updated");
    } catch (err: any) {
      console.error('❌ Error:', err);
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
      
      console.log("✅ Lead deleted");
    } catch (err: any) {
      console.error('❌ Error:', err);
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
      
      alert(`Lead converted successfully! Contact and deal created.`);
      console.log("✅ Lead converted");
    } catch (err: any) {
      console.error('❌ Error:', err);
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
  if (loading && leads.length === 0) {
    return (
      <MainLayout title="Lead Management">
        <Box sx={{ 
          p: 3, 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: 400,
          gap: 3 
        }}>
          <CircularProgress size={60} thickness={4} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="500" gutterBottom>
              Loading Leads
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fetching your lead database...
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Lead Management">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '& a': { color: darkMode ? '#9aa0a6' : '#5f6368' }
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit',
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Leads
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              Lead Management
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Track, qualify, and convert your sales leads into customers
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mt: 3,
          }}>
            <Card 
              sx={{ 
                flex: '1 1 calc(20% - 15px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 14px)', md: 'calc(20% - 15px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#4285f4', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Total Leads
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4285f4', fontWeight: 600 }}>
                    {leads.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#4285f4', 0.1) }}>
                  <PersonIcon sx={{ color: '#4285f4' }} />
                </Box>
              </Box>
            </Card>

            <Card 
              sx={{ 
                flex: '1 1 calc(20% - 15px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 14px)', md: 'calc(20% - 15px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#34a853', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Qualified
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#34a853', fontWeight: 600 }}>
                    {leads.filter(l => l.status === 'qualified').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#34a853', 0.1) }}>
                  <CheckCircleIcon sx={{ color: '#34a853' }} />
                </Box>
              </Box>
            </Card>

            <Card 
              sx={{ 
                flex: '1 1 calc(20% - 15px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 14px)', md: 'calc(20% - 15px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#fbbc04', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Contacted
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fbbc04', fontWeight: 600 }}>
                    {leads.filter(l => l.status === 'contacted').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#fbbc04', 0.1) }}>
                  <PhoneIcon sx={{ color: '#fbbc04' }} />
                </Box>
              </Box>
            </Card>

            <Card 
              sx={{ 
                flex: '1 1 calc(20% - 15px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 14px)', md: 'calc(20% - 15px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#9334e6', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Converted
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#9334e6', fontWeight: 600 }}>
                    {leads.filter(l => l.status === 'converted').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#9334e6', 0.1) }}>
                  <TrendingUpIcon sx={{ color: '#9334e6' }} />
                </Box>
              </Box>
            </Card>

            <Card 
              sx={{ 
                flex: '1 1 calc(20% - 15px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 14px)', md: 'calc(20% - 15px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#ea4335', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ea4335', fontWeight: 600 }}>
                    {leads.length > 0 
                      ? Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) 
                      : 0}%
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#ea4335', 0.1) }}>
                  <AnalyticsIcon sx={{ color: '#ea4335' }} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <GoogleAlert
              severity="error"
              title="Error"
              message={error}
              action={
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={fetchLeads}
                >
                  Retry
                </Button>
              }
              sx={{ mb: 3 }}
            />
          )}

          {/* Filters and Actions */}
          <Card
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
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
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        },
                      },
                    }}
                  />
                  <IconButton 
                    onClick={fetchLeads}
                    sx={{ 
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      '&:hover': { bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }
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
                  {/* Company Filter */}
                  <FormControl 
                    size="small" 
                    sx={{ 
                      minWidth: 160,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                      }
                    }}
                  >
                    <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Company
                    </InputLabel>
                    <Select
                      value={companyFilter}
                      label="Company"
                      onChange={handleCompanyFilterChange}
                    >
                      <MenuItem value="all">All Companies</MenuItem>
                      {companies.map(company => (
                        <MenuItem key={company._id} value={company._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon sx={{ fontSize: 16 }} />
                            {company.name}
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
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
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
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
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
                      // Set default company
                      if (companies.length > 0 && !formData.companyId) {
                        setFormData(prev => ({ 
                          ...prev, 
                          companyId: companies[0]._id,
                          companyName: companies[0].name 
                        }));
                      }
                      setAddDialogOpen(true);
                    }}
                    sx={{ 
                      borderRadius: '8px',
                      backgroundColor: '#34a853',
                      '&:hover': { backgroundColor: '#2d9248' },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Add Lead
                  </Button>
                </Box>
              </Box>

              {/* Quick Stats Chips */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mt: 2, 
                flexWrap: 'wrap',
                pt: 2,
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
              }}>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mr: 1, alignSelf: 'center' }}>
                  Quick filters:
                </Typography>
                {LEAD_STATUS.map(status => {
                  const count = leads.filter(l => l.status === status.value).length;
                  if (count === 0) return null;
                  return (
                    <Chip
                      key={status.value}
                      label={`${status.emoji} ${status.label} (${count})`}
                      size="small"
                      onClick={() => setStatusFilter(status.value === statusFilter ? 'all' : status.value)}
                      sx={{
                        backgroundColor: statusFilter === status.value 
                          ? alpha(status.color, 0.2)
                          : darkMode ? '#303134' : '#f8f9fa',
                        color: statusFilter === status.value ? status.color : darkMode ? '#e8eaed' : '#202124',
                        borderColor: statusFilter === status.value ? status.color : darkMode ? '#3c4043' : '#dadce0',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: alpha(status.color, 0.1),
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Card>

          {/* Leads Table */}
          {!isMobile && (
            <Card sx={{ 
              overflow: 'hidden',
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'fullName'}
                          direction={orderBy === 'fullName' ? order : 'asc'}
                          onClick={() => handleSort('fullName')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
                        >
                          Lead
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'source'}
                          direction={orderBy === 'source' ? order : 'asc'}
                          onClick={() => handleSort('source')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
                        >
                          Source
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'status'}
                          direction={orderBy === 'status' ? order : 'asc'}
                          onClick={() => handleSort('status')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
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
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
                        >
                          Budget
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'score'}
                          direction={orderBy === 'score' ? order : 'asc'}
                          onClick={() => handleSort('score')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
                        >
                          Score
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'createdAt'}
                          direction={orderBy === 'createdAt' ? order : 'asc'}
                          onClick={() => handleSort('createdAt')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
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
                          '&:hover': { backgroundColor: darkMode ? '#303134' : '#f8f9fa' },
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BusinessIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {lead.companyName || getCompanyName(lead.companyId)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {lead.email && (
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: darkMode ? '#e8eaed' : '#202124' }}>
                                <EmailIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                {lead.email}
                              </Typography>
                            )}
                            {lead.phone && (
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: darkMode ? '#e8eaed' : '#202124' }}>
                                <PhoneIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                {lead.phone}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
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
                          <Chip
                            label={LEAD_STATUS.find(s => s.value === lead.status)?.label || lead.status}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                              color: getStatusColor(lead.status),
                              borderColor: alpha(getStatusColor(lead.status), 0.3),
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {lead.assignedToName ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Avatar sx={{ width: 20, height: 20, bgcolor: alpha('#4285f4', 0.1) }}>
                                <PersonIcon sx={{ fontSize: 12, color: '#4285f4' }} />
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
            </Card>
          )}

          {/* Mobile Card View */}
          {isMobile && (
            <Box>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => (
                  <Card
                    key={lead._id}
                    hover
                    onClick={() => {
                      setSelectedLead(lead);
                      setDetailDialogOpen(true);
                    }}
                    sx={{ 
                      mb: 2,
                      cursor: 'pointer',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(getStatusColor(lead.status), 0.1),
                              color: getStatusColor(lead.status),
                              width: 36,
                              height: 36
                            }}
                          >
                            {getStatusEmoji(lead.status)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {lead.fullName || `${lead.firstName} ${lead.lastName}`}
                            </Typography>
                            {lead.companyName && (
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {lead.companyName}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                        {lead.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {lead.email}
                            </Typography>
                          </Box>
                        )}
                        {lead.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {lead.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={LEAD_STATUS.find(s => s.value === lead.status)?.label || lead.status}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                            color: getStatusColor(lead.status),
                          }}
                        />
                        <Chip
                          label={`${getSourceEmoji(lead.source)} ${lead.source.replace('_', ' ')}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {lead.budget ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AttachMoneyIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {lead.currency} {lead.budget.toLocaleString()}
                            </Typography>
                          </Box>
                        ) : (
                          <Box />
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#fbbc04' }} />
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {lead.score || 0}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 1.5,
                        pt: 1.5,
                        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {lead.companyName || getCompanyName(lead.companyId)}
                          </Typography>
                        </Box>
                        {lead.assignedToName && (
                          <Chip
                            label={lead.assignedToName}
                            size="small"
                            avatar={<Avatar sx={{ width: 20, height: 20, bgcolor: alpha('#4285f4', 0.1) }}><PersonIcon sx={{ fontSize: 12, color: '#4285f4' }} /></Avatar>}
                            sx={{ 
                              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                              color: darkMode ? '#e8eaed' : '#202124',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Card>
                ))
              ) : (
                <Card sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  px: 3,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <PersonIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    No Leads Found
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all' || companyFilter !== 'all'
                      ? "No leads match your current filters. Try adjusting your search criteria."
                      : "Start building your pipeline by adding your first lead."}
                  </Typography>
                  {!searchQuery && statusFilter === 'all' && sourceFilter === 'all' && companyFilter === 'all' && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        if (companies.length > 0) {
                          setFormData(prev => ({ 
                            ...prev, 
                            companyId: companies[0]._id,
                            companyName: companies[0].name 
                          }));
                        }
                        setAddDialogOpen(true);
                      }}
                      sx={{ 
                        backgroundColor: '#34a853',
                        '&:hover': { backgroundColor: '#2d9248' }
                      }}
                    >
                      Add Your First Lead
                    </Button>
                  )}
                </Card>
              )}
            </Box>
          )}

          {/* Mobile Pagination */}
          {isMobile && paginatedLeads.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
            }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Page {page + 1} of {Math.ceil(sortedLeads.length / rowsPerPage) || 1}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(sortedLeads.length / rowsPerPage) - 1}
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Lead Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !submitting && setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '16px',
            maxHeight: '90vh',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Add New Lead
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Select company and enter lead information
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
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Company Selection - REQUIRED */}
            <Box>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                Company <span style={{ color: '#ea4335' }}>*</span>
              </Typography>
              <FormControl 
                fullWidth 
                size="small"
                error={!!validationErrors.companyId}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: validationErrors.companyId ? '#ea4335' : (darkMode ? '#3c4043' : '#dadce0'),
                  },
                }}
              >
                <InputLabel>Select Company *</InputLabel>
                <Select
                  value={formData.companyId}
                  label="Select Company *"
                  onChange={handleFormCompanyChange}
                  renderValue={(selected) => {
                    const company = companies.find(c => c._id === selected);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        {company?.name || 'Select Company'}
                      </Box>
                    );
                  }}
                >
                  {companies.map(company => (
                    <MenuItem key={company._id} value={company._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Box>
                          <Typography variant="body2">{company.name}</Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {company.industry || 'No industry'} • {company.size || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.companyId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {validationErrors.companyId}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Assignment */}
            {formData.companyId && (
              <Box>
                <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                  Assign To
                </Typography>
                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: alpha('#4285f4', 0.1) }}>
                            <PersonIcon sx={{ fontSize: 14, color: '#4285f4' }} />
                          </Avatar>
                          {member?.user?.name || 'Unassigned'}
                        </Box>
                      );
                    }}
                  >
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        Unassigned
                      </Box>
                    </MenuItem>
                    {members.map(member => (
                      <MenuItem key={member.userId} value={member.userId}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: alpha('#4285f4', 0.1) }}>
                            {member.user?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2">{member.user?.name}</Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {member.role}
                            </Typography>
                          </Box>
                          {member.isCurrentUser && (
                            <Chip label="You" size="small" sx={{ height: 20 }} />
                          )}
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
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={!!validationErrors.firstName}
                helperText={validationErrors.firstName}
                required
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                required
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Lead Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <FormControl 
                fullWidth 
                size="small"
                error={!!validationErrors.source}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                {validationErrors.source && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {validationErrors.source}
                  </Typography>
                )}
              </FormControl>

              <FormControl 
                fullWidth 
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
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

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              />

              <FormControl 
                fullWidth 
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                  <MenuItem value="JPY">JPY ¥</MenuItem>
                  <MenuItem value="INR">INR ₹</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl 
              fullWidth 
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
              }}
            />

            <TextField
              fullWidth
              label="Tags (comma separated)"
              placeholder="hot, follow-up, vip, etc."
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          gap: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={submitting}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={addLead}
            disabled={submitting}
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              minWidth: 120,
              backgroundColor: '#34a853',
              '&:hover': { backgroundColor: '#2d9248' }
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Lead"
            )}
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
            borderRadius: '16px',
            maxHeight: '90vh',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        {selectedLead && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
                    <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {selectedLead.fullName || `${selectedLead.firstName} ${selectedLead.lastName}`}
                    </Typography>
                    {selectedLead.position && (
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {selectedLead.position}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={LEAD_STATUS.find(s => s.value === selectedLead.status)?.label || selectedLead.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(selectedLead.status), 0.1),
                      color: getStatusColor(selectedLead.status),
                    }}
                  />
                  <Chip
                    label={`${getSourceEmoji(selectedLead.source)} ${selectedLead.source.replace('_', ' ')}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                  <Chip
                    label={`${getInterestEmoji(selectedLead.interestLevel)} ${selectedLead.interestLevel}`}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getInterestColor(selectedLead.interestLevel), 0.1),
                      color: getInterestColor(selectedLead.interestLevel),
                    }}
                  />
                  {selectedLead.score > 0 && (
                    <Chip
                      label={`Score: ${selectedLead.score}`}
                      size="small"
                      icon={<StarIcon sx={{ fontSize: 14, color: '#fbbc04' }} />}
                      sx={{
                        backgroundColor: alpha('#fbbc04', 0.1),
                        color: '#fbbc04',
                      }}
                    />
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => setDetailDialogOpen(false)} size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Company Info */}
                <Card sx={{ 
                  p: 2, 
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                    Company Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: alpha('#4285f4', 0.1), color: '#4285f4' }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedLead.companyName || getCompanyName(selectedLead.companyId)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {companies.find(c => c._id === selectedLead.companyId)?.industry || 'No industry'} • 
                        {companies.find(c => c._id === selectedLead.companyId)?.size || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Contact Info */}
                <Card sx={{ 
                  p: 2, 
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {selectedLead.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedLead.email}
                        </Typography>
                        <IconButton size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    {selectedLead.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedLead.phone}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            <CallIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Card>

                {/* Assignment */}
                {selectedLead.assignedToName && (
                  <Card sx={{ 
                    p: 2, 
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                      Assigned To
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: alpha('#4285f4', 0.1), color: '#4285f4' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedLead.assignedToName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Owner
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                )}

                {/* Deal Info */}
                {selectedLead.budget && (
                  <Card sx={{ 
                    p: 2, 
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                      Deal Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: alpha('#34a853', 0.1) }}>
                        <AttachMoneyIcon sx={{ color: '#34a853' }} />
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
                  </Card>
                )}

                {/* Timeline */}
                <Card sx={{ 
                  p: 2, 
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                    Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Created: {new Date(selectedLead.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {selectedLead.lastContactedAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          Last Contacted: {new Date(selectedLead.lastContactedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    {selectedLead.nextFollowUp && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlagIcon sx={{ fontSize: 18, color: '#fbbc04' }} />
                        <Typography variant="body2" sx={{ color: '#fbbc04', fontWeight: 500 }}>
                          Follow-up: {new Date(selectedLead.nextFollowUp).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>

                {/* Tags */}
                {selectedLead.tags && selectedLead.tags.length > 0 && (
                  <Card sx={{ 
                    p: 2, 
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedLead.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}
                        />
                      ))}
                    </Box>
                  </Card>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ 
              p: 3, 
              gap: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => deleteLead(selectedLead._id)}
                  disabled={submitting}
                  sx={{ 
                    borderRadius: '8px',
                    borderColor: '#ea4335',
                    color: '#ea4335',
                    '&:hover': {
                      borderColor: '#d93025',
                      backgroundColor: alpha('#ea4335', 0.1),
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedLead.status !== 'converted' && selectedLead.status !== 'lost' && (
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => convertLead(selectedLead._id)}
                    disabled={submitting}
                    sx={{ 
                      borderRadius: '8px',
                      backgroundColor: '#9334e6',
                      '&:hover': { backgroundColor: '#7b2bc4' }
                    }}
                  >
                    Convert
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => setDetailDialogOpen(false)}
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: '#4285f4',
                    '&:hover': { backgroundColor: '#3367d6' }
                  }}
                >
                  Close
                </Button>
              </Box>
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
            borderRadius: '8px',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            setAnchorEl(null);
            setDetailDialogOpen(true);
          }}
          sx={{ gap: 1, py: 1.5, color: darkMode ? '#e8eaed' : '#202124' }}
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
            sx={{ gap: 1, py: 1.5, color: darkMode ? '#e8eaed' : '#202124' }}
          >
            <TrendingUpIcon fontSize="small" />
            Convert to Customer
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => {
            // Edit lead
            setAnchorEl(null);
          }}
          sx={{ gap: 1, py: 1.5, color: darkMode ? '#e8eaed' : '#202124' }}
        >
          <EditIcon fontSize="small" />
          Edit
        </MenuItem>
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
              gap: 1, 
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
          sx={{ gap: 1, py: 1.5, color: '#ea4335' }}
        >
          <DeleteIcon fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </MainLayout>
  );
}