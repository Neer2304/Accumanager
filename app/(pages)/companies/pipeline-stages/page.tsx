// app/pipeline-stages/page.tsx
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
  Grid,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Stack,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  DragHandle as DragHandleIcon,
  DragIndicator as DragIndicatorIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  VisibilityOff as VisibilityOffIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  ColorLens as ColorLensIcon,
  Percent as PercentIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  AutoAwesome as AutoAwesomeIcon,
  Timeline as TimelineIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';
import { ChromePicker } from 'react-color';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';


const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff',
  orange: '#fa903e',
  teal: '#00acc1'
};

// Pipeline Stage Categories
const STAGE_CATEGORIES = [
  { value: 'open', label: 'Open', color: GOOGLE_COLORS.blue, icon: PlayArrowIcon },
  { value: 'won', label: 'Closed Won', color: GOOGLE_COLORS.green, icon: CheckCircleIcon },
  { value: 'lost', label: 'Closed Lost', color: GOOGLE_COLORS.red, icon: StopIcon }
];

interface PipelineStage {
  _id: string;
  companyId: string;
  companyName?: string;
  name: string;
  order: number;
  probability: number;
  color: string;
  category: 'open' | 'won' | 'lost';
  isActive: boolean;
  isDefault: boolean;
  dealCount?: number;
  totalValue?: number;
  requiredFields?: string[];
  allowedStages?: string[];
  autoAdvance: boolean;
  autoAdvanceDays?: number;
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
  notifyUsers?: string[];
  customFields?: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    required: boolean;
    options?: string[];
  }>;
  createdBy: string;
  createdByName: string;
  updatedBy?: string;
  updatedByName?: string;
  createdAt: string;
  updatedAt: string;
}

interface Company {
  _id: string;
  name: string;
  email: string;
  industry?: string;
  size?: string;
  userRole: string;
  plan: string;
}

interface Member {
  userId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
}

export default function PipelineStagesPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  const { companies, loading: companiesLoading } = useCompany();

  // State
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [filteredStages, setFilteredStages] = useState<PipelineStage[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerFor, setColorPickerFor] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Pipeline stats
  const [pipelineStats, setPipelineStats] = useState({
    totalStages: 0,
    activeStages: 0,
    totalDeals: 0,
    totalValue: 0,
    avgProbability: 0
  });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    probability: "10",
    color: "#4285f4",
    category: "open" as 'open' | 'won' | 'lost',
    isActive: true,
    autoAdvance: false,
    autoAdvanceDays: "",
    notifyOnEnter: false,
    notifyOnExit: false,
    notifyUsers: [] as string[],
    requiredFields: [] as string[],
    allowedStages: [] as string[],
    customFields: [] as Array<{
      name: string;
      type: 'text' | 'number' | 'date' | 'boolean' | 'select';
      required: boolean;
      options?: string[];
    }>
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
      fetchStages();
    }
  }, [selectedCompanyId]);

  // Filter stages when filters change
  useEffect(() => {
    filterStages();
  }, [stages, searchQuery, categoryFilter, statusFilter]);

  // Fetch members
  const fetchMembers = async (companyId: string) => {
    try {
      const res = await companyService.getMembers(companyId);
      if (res.success) {
        setMembers(res.members || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // Fetch stages
  const fetchStages = async () => {
    if (!selectedCompanyId) return;

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('companyId', selectedCompanyId);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('isActive', statusFilter === 'active' ? 'true' : 'false');
      
      const response = await fetch(`/api/pipeline-stages?${params.toString()}`, {
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
        throw new Error(errorData.error || "Failed to fetch pipeline stages");
      }

      const data = await response.json();
      setStages(data.stages || []);
      
      // Calculate stats
      if (data.stages) {
        const activeStages = data.stages.filter((s: PipelineStage) => s.isActive);
        const totalDeals = data.stages.reduce((sum: number, s: PipelineStage) => sum + (s.dealCount || 0), 0);
        const totalValue = data.stages.reduce((sum: number, s: PipelineStage) => sum + (s.totalValue || 0), 0);
        const avgProbability = data.stages.length > 0 
          ? data.stages.reduce((sum: number, s: PipelineStage) => sum + s.probability, 0) / data.stages.length 
          : 0;

        setPipelineStats({
          totalStages: data.stages.length,
          activeStages: activeStages.length,
          totalDeals,
          totalValue,
          avgProbability
        });
      }
      
    } catch (err: any) {
      console.error('Error fetching stages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter stages
  const filterStages = () => {
    let filtered = [...stages];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(stage => 
        stage.name.toLowerCase().includes(query) ||
        stage.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(stage => stage.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(stage => stage.isActive === isActive);
    }

    // Sort by order
    filtered.sort((a, b) => a.order - b.order);

    setFilteredStages(filtered);
  };

  // Handle drag and drop reorder
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const reorderedStages = items.map((item, index) => ({
      id: item._id,
      order: index
    }));

    // Optimistically update UI
    setFilteredStages(items);

    try {
      const response = await fetch(`/api/pipeline-stages/reorder?companyId=${selectedCompanyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ stages: reorderedStages })
      });

      if (!response.ok) {
        throw new Error("Failed to reorder stages");
      }

      setSuccess("Stages reordered successfully");
      fetchStages(); // Refresh to ensure consistency
    } catch (err: any) {
      console.error('Error reordering stages:', err);
      setError(err.message);
      fetchStages(); // Revert by fetching
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Stage name is required";
    }
    
    if (!formData.probability) {
      errors.probability = "Probability is required";
    } else {
      const prob = parseInt(formData.probability);
      if (isNaN(prob) || prob < 0 || prob > 100) {
        errors.probability = "Probability must be between 0 and 100";
      }
    }
    
    if (formData.autoAdvance && (!formData.autoAdvanceDays || parseInt(formData.autoAdvanceDays) <= 0)) {
      errors.autoAdvanceDays = "Auto advance days must be greater than 0";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add stage
  const addStage = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const stageData = {
        ...formData,
        probability: parseInt(formData.probability),
        autoAdvanceDays: formData.autoAdvance ? parseInt(formData.autoAdvanceDays) : undefined
      };

      const response = await fetch(`/api/pipeline-stages?companyId=${selectedCompanyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(stageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add stage");
      }

      const newStage = await response.json();
      setStages(prev => [...prev, newStage.stage].sort((a, b) => a.order - b.order));
      setSuccess("Pipeline stage added successfully");
      
      // Reset form
      setAddDialogOpen(false);
      setFormData({
        name: "",
        probability: "10",
        color: "#4285f4",
        category: "open",
        isActive: true,
        autoAdvance: false,
        autoAdvanceDays: "",
        notifyOnEnter: false,
        notifyOnExit: false,
        notifyUsers: [],
        requiredFields: [],
        allowedStages: [],
        customFields: []
      });
      setValidationErrors({});
      
    } catch (err: any) {
      console.error('Error adding stage:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update stage
  const updateStage = async () => {
    if (!selectedStage || !validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      const stageData = {
        ...formData,
        probability: parseInt(formData.probability),
        autoAdvanceDays: formData.autoAdvance ? parseInt(formData.autoAdvanceDays) : undefined
      };

      const response = await fetch(`/api/pipeline-stages/${selectedStage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(stageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update stage");
      }

      const updatedStage = await response.json();
      setStages(prev => prev.map(s => 
        s._id === selectedStage._id ? updatedStage.stage : s
      ));
      setSuccess("Pipeline stage updated successfully");
      
      setEditDialogOpen(false);
      
    } catch (err: any) {
      console.error('Error updating stage:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete stage
  const deleteStage = async () => {
    if (!selectedStage) return;

    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/pipeline-stages/${selectedStage._id}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete stage");
      }

      setStages(prev => prev.filter(s => s._id !== selectedStage._id));
      setDeleteDialogOpen(false);
      setSuccess("Pipeline stage deleted successfully");
      
    } catch (err: any) {
      console.error('Error deleting stage:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle stage active status
  const toggleStageStatus = async (stage: PipelineStage) => {
    try {
      const response = await fetch(`/api/pipeline-stages/${stage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ isActive: !stage.isActive })
      });

      if (!response.ok) {
        throw new Error("Failed to update stage status");
      }

      const updatedStage = await response.json();
      setStages(prev => prev.map(s => 
        s._id === stage._id ? updatedStage.stage : s
      ));
      
      setSuccess(`Stage ${updatedStage.stage.isActive ? 'activated' : 'deactivated'} successfully`);
      
    } catch (err: any) {
      console.error('Error toggling stage status:', err);
      setError(err.message);
    }
  };

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleColorChange = (color: any) => {
    setFormData(prev => ({ ...prev, color: color.hex }));
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const cat = STAGE_CATEGORIES.find(c => c.value === category);
    return cat?.icon || PlayArrowIcon;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const cat = STAGE_CATEGORIES.find(c => c.value === category);
    return cat?.color || GOOGLE_COLORS.grey;
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
            You need to create a company before managing pipeline stages.
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
          <Link href="/deals">
            <AssignmentIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Deals
          </Link>
          <Typography color={darkMode ? '#e8eaed' : '#202124'}>
            Pipeline Stages
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
              Pipeline Stages
            </Typography>
            <Typography sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: '0.875rem'
            }}>
              Configure and manage your sales pipeline stages
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
              onChange={(e) => setSelectedCompanyId(e.target.value)}
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
          <Paper sx={{
            flex: '1 1 calc(20% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Total Stages
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.blue, fontWeight: 500, mt: 0.5 }}>
              {pipelineStats.totalStages}
            </Typography>
          </Paper>

          <Paper sx={{
            flex: '1 1 calc(20% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Active Stages
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.green, fontWeight: 500, mt: 0.5 }}>
              {pipelineStats.activeStages}
            </Typography>
          </Paper>

          <Paper sx={{
            flex: '1 1 calc(20% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Total Deals
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.purple, fontWeight: 500, mt: 0.5 }}>
              {pipelineStats.totalDeals}
            </Typography>
          </Paper>

          <Paper sx={{
            flex: '1 1 calc(20% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Pipeline Value
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.orange, fontWeight: 500, mt: 0.5 }}>
              ${pipelineStats.totalValue.toLocaleString()}
            </Typography>
          </Paper>

          <Paper sx={{
            flex: '1 1 calc(20% - 16px)',
            minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 12px)', md: 'calc(20% - 13px)' },
            p: 2,
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Avg Probability
            </Typography>
            <Typography variant="h5" sx={{ color: GOOGLE_COLORS.teal, fontWeight: 500, mt: 0.5 }}>
              {pipelineStats.avgProbability.toFixed(1)}%
            </Typography>
          </Paper>
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
                placeholder="Search stages by name..."
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
                onClick={fetchStages}
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
              {/* Category Filter */}
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
                  Category
                </InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {STAGE_CATEGORIES.map(cat => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color }} />
                        {cat.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Filter */}
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
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
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
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
                Add Stage
              </Button>
            </Box>
          </Box>

          {/* Active Filters */}
          {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {searchQuery && (
                <MuiChip
                  label={`Search: ${searchQuery}`}
                  onDelete={() => setSearchQuery('')}
                  size="small"
                />
              )}
              {categoryFilter !== 'all' && (
                <MuiChip
                  label={`Category: ${STAGE_CATEGORIES.find(c => c.value === categoryFilter)?.label}`}
                  onDelete={() => setCategoryFilter('all')}
                  size="small"
                />
              )}
              {statusFilter !== 'all' && (
                <MuiChip
                  label={`Status: ${statusFilter === 'active' ? 'Active' : 'Inactive'}`}
                  onDelete={() => setStatusFilter('all')}
                  size="small"
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Pipeline Stages */}
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
              Loading pipeline stages...
            </Typography>
          </Paper>
        ) : filteredStages.length === 0 ? (
          <Paper sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px'
          }}>
            <TimelineIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No Pipeline Stages Found
            </Typography>
            <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? "No stages match your current filters. Try adjusting your search criteria."
                : "Start configuring your sales pipeline by adding your first stage."}
            </Typography>
            {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
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
                Add Your First Stage
              </Button>
            )}
          </Paper>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stages">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  {filteredStages.map((stage, index) => {
                    const CategoryIcon = getCategoryIcon(stage.category);
                    
                    return (
                      <Draggable 
                        key={stage._id} 
                        draggableId={stage._id} 
                        index={index}
                        isDragDisabled={stage.isDefault}
                      >
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              bgcolor: darkMode ? '#2d2e30' : '#fff',
                              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                              borderRadius: '16px',
                              opacity: stage.isActive ? 1 : 0.6,
                              transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
                              transition: 'all 0.2s',
                              '&:hover': {
                                boxShadow: 3,
                                borderColor: stage.color
                              }
                            }}
                          >
                            <Box sx={{ p: 2.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* Drag Handle */}
                                {!stage.isDefault && (
                                  <Box {...provided.dragHandleProps} sx={{ cursor: 'grab' }}>
                                    <DragIndicatorIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                  </Box>
                                )}

                                {/* Color Indicator */}
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 40,
                                    bgcolor: stage.color,
                                    borderRadius: '4px'
                                  }}
                                />

                                {/* Stage Info */}
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                      {stage.name}
                                    </Typography>
                                    <MuiChip
                                      icon={<CategoryIcon />}
                                      label={STAGE_CATEGORIES.find(c => c.value === stage.category)?.label}
                                      size="small"
                                      sx={{
                                        bgcolor: alpha(getCategoryColor(stage.category), 0.1),
                                        color: getCategoryColor(stage.category),
                                      }}
                                    />
                                    {stage.isDefault && (
                                      <MuiChip
                                        label="Default"
                                        size="small"
                                        sx={{
                                          bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                                          color: GOOGLE_COLORS.blue,
                                        }}
                                      />
                                    )}
                                    {!stage.isActive && (
                                      <MuiChip
                                        label="Inactive"
                                        size="small"
                                        sx={{
                                          bgcolor: alpha(GOOGLE_COLORS.grey, 0.1),
                                          color: darkMode ? '#9aa0a6' : '#5f6368',
                                        }}
                                      />
                                    )}
                                  </Box>

                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    {/* Probability */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <PercentIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                        {stage.probability}% Probability
                                      </Typography>
                                    </Box>

                                    {/* Deal Count */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <AssignmentIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                        {stage.dealCount || 0} Deals
                                      </Typography>
                                    </Box>

                                    {/* Deal Value */}
                                    {stage.totalValue ? (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoneyIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                          ${stage.totalValue.toLocaleString()}
                                        </Typography>
                                      </Box>
                                    ) : null}

                                    {/* Auto Advance */}
                                    {stage.autoAdvance && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AutoAwesomeIcon sx={{ fontSize: 16, color: GOOGLE_COLORS.purple }} />
                                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                          Auto-advance in {stage.autoAdvanceDays} days
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>

                                {/* Actions */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {!stage.isDefault && (
                                    <Tooltip title={stage.isActive ? 'Deactivate' : 'Activate'}>
                                      <IconButton
                                        size="small"
                                        onClick={() => toggleStageStatus(stage)}
                                        sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                      >
                                        {stage.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedStage(stage);
                                      setDetailDialogOpen(true);
                                    }}
                                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                  >
                                    <ViewIcon />
                                  </IconButton>
                                  {!stage.isDefault && (
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedStage(stage);
                                        setFormData({
                                          name: stage.name,
                                          probability: stage.probability.toString(),
                                          color: stage.color,
                                          category: stage.category,
                                          isActive: stage.isActive,
                                          autoAdvance: stage.autoAdvance || false,
                                          autoAdvanceDays: stage.autoAdvanceDays?.toString() || "",
                                          notifyOnEnter: stage.notifyOnEnter || false,
                                          notifyOnExit: stage.notifyOnExit || false,
                                          notifyUsers: stage.notifyUsers || [],
                                          requiredFields: stage.requiredFields || [],
                                          allowedStages: stage.allowedStages || [],
                                          customFields: stage.customFields || []
                                        });
                                        setEditDialogOpen(true);
                                      }}
                                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      setAnchorEl(e.currentTarget);
                                      setSelectedStage(stage);
                                    }}
                                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                  >
                                    <MoreIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Box>

      {/* Add Stage Dialog */}
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
                Add Pipeline Stage
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Create a new stage in your sales pipeline
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
            {/* Stage Name */}
            <TextField
              fullWidth
              label="Stage Name *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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

            {/* Category */}
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
              <InputLabel>Category *</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category *"
                onChange={handleSelectChange}
              >
                {STAGE_CATEGORIES.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color }} />
                      {cat.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Probability & Color */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Probability (%) *"
                name="probability"
                type="number"
                value={formData.probability}
                onChange={handleInputChange}
                error={!!validationErrors.probability}
                helperText={validationErrors.probability}
                size="small"
                InputProps={{
                  inputProps: { min: 0, max: 100 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              <Box sx={{ position: 'relative' }}>
                <Button
                  variant="outlined"
                  startIcon={<ColorLensIcon />}
                  onClick={() => setColorPickerOpen(!colorPickerOpen)}
                  sx={{
                    height: 40,
                    borderRadius: '12px',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: formData.color,
                    bgcolor: alpha(formData.color, 0.1),
                    '&:hover': {
                      bgcolor: alpha(formData.color, 0.2),
                    }
                  }}
                >
                  Color
                </Button>
                {colorPickerOpen && (
                  <Box sx={{ position: 'absolute', top: 50, right: 0, zIndex: 10 }}>
                    <Box
                      sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9
                      }}
                      onClick={() => setColorPickerOpen(false)}
                    />
                    <ChromePicker
                      color={formData.color}
                      onChange={handleColorChange}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Auto Advance */}
            <FormControlLabel
              control={
                <Switch
                  name="autoAdvance"
                  checked={formData.autoAdvance}
                  onChange={handleSwitchChange}
                />
              }
              label="Automatically advance deals after X days"
            />

            {formData.autoAdvance && (
              <TextField
                fullWidth
                label="Days to auto-advance *"
                name="autoAdvanceDays"
                type="number"
                value={formData.autoAdvanceDays}
                onChange={handleInputChange}
                error={!!validationErrors.autoAdvanceDays}
                helperText={validationErrors.autoAdvanceDays}
                size="small"
                InputProps={{
                  inputProps: { min: 1 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />
            )}

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Notifications */}
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Notifications
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  name="notifyOnEnter"
                  checked={formData.notifyOnEnter}
                  onChange={handleSwitchChange}
                />
              }
              label="Notify when deals enter this stage"
            />

            <FormControlLabel
              control={
                <Switch
                  name="notifyOnExit"
                  checked={formData.notifyOnExit}
                  onChange={handleSwitchChange}
                />
              }
              label="Notify when deals exit this stage"
            />

            {/* Notify Users */}
            {(formData.notifyOnEnter || formData.notifyOnExit) && (
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
                <InputLabel>Notify Users</InputLabel>
                <Select
                  multiple
                  name="notifyUsers"
                  value={formData.notifyUsers}
                  onChange={handleSelectChange}
                  label="Notify Users"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const member = members.find(m => m.userId === value);
                        return (
                          <MuiChip
                            key={value}
                            label={member?.user?.name || value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {members.map(member => (
                    <MenuItem key={member.userId} value={member.userId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                          {member.user?.name?.charAt(0)}
                        </Avatar>
                        {member.user?.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Required Fields */}
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Required Fields
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
              <InputLabel>Required Fields</InputLabel>
              <Select
                multiple
                name="requiredFields"
                value={formData.requiredFields}
                onChange={handleSelectChange}
                label="Required Fields"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <MuiChip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="account">Account</MenuItem>
                <MenuItem value="contact">Contact</MenuItem>
                <MenuItem value="value">Deal Value</MenuItem>
                <MenuItem value="date">Close Date</MenuItem>
                <MenuItem value="products">Products</MenuItem>
                <MenuItem value="description">Description</MenuItem>
              </Select>
            </FormControl>

            {/* Allowed Next Stages */}
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Allowed Next Stages
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
              <InputLabel>Allowed Stages</InputLabel>
              <Select
                multiple
                name="allowedStages"
                value={formData.allowedStages}
                onChange={handleSelectChange}
                label="Allowed Stages"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <MuiChip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {stages
                  .filter(s => s._id !== selectedStage?._id)
                  .map(stage => (
                    <MenuItem key={stage._id} value={stage.name}>
                      {stage.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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
            onClick={addStage}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <AddIcon />}
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.green,
              '&:hover': { bgcolor: '#2d9248' },
              px: 4
            }}
          >
            {submitting ? 'Creating...' : 'Create Stage'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Stage Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !submitting && setEditDialogOpen(false)}
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
                Edit Pipeline Stage
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Update stage configuration
              </Typography>
            </Box>
            <IconButton
              onClick={() => !submitting && setEditDialogOpen(false)}
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
            {/* Same fields as Add Dialog */}
            <TextField
              fullWidth
              label="Stage Name *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              <InputLabel>Category *</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category *"
                onChange={handleSelectChange}
              >
                {STAGE_CATEGORIES.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color }} />
                      {cat.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Probability (%) *"
                name="probability"
                type="number"
                value={formData.probability}
                onChange={handleInputChange}
                error={!!validationErrors.probability}
                helperText={validationErrors.probability}
                size="small"
                InputProps={{
                  inputProps: { min: 0, max: 100 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />

              <Box sx={{ position: 'relative' }}>
                <Button
                  variant="outlined"
                  startIcon={<ColorLensIcon />}
                  onClick={() => setColorPickerOpen(!colorPickerOpen)}
                  sx={{
                    height: 40,
                    borderRadius: '12px',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: formData.color,
                    bgcolor: alpha(formData.color, 0.1),
                  }}
                >
                  Color
                </Button>
                {colorPickerOpen && (
                  <Box sx={{ position: 'absolute', top: 50, right: 0, zIndex: 10 }}>
                    <Box
                      sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9
                      }}
                      onClick={() => setColorPickerOpen(false)}
                    />
                    <ChromePicker
                      color={formData.color}
                      onChange={handleColorChange}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleSwitchChange}
                />
              }
              label="Active"
            />

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <FormControlLabel
              control={
                <Switch
                  name="autoAdvance"
                  checked={formData.autoAdvance}
                  onChange={handleSwitchChange}
                />
              }
              label="Automatically advance deals after X days"
            />

            {formData.autoAdvance && (
              <TextField
                fullWidth
                label="Days to auto-advance *"
                name="autoAdvanceDays"
                type="number"
                value={formData.autoAdvanceDays}
                onChange={handleInputChange}
                error={!!validationErrors.autoAdvanceDays}
                helperText={validationErrors.autoAdvanceDays}
                size="small"
                InputProps={{
                  inputProps: { min: 1 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              />
            )}

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Notifications
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  name="notifyOnEnter"
                  checked={formData.notifyOnEnter}
                  onChange={handleSwitchChange}
                />
              }
              label="Notify when deals enter this stage"
            />

            <FormControlLabel
              control={
                <Switch
                  name="notifyOnExit"
                  checked={formData.notifyOnExit}
                  onChange={handleSwitchChange}
                />
              }
              label="Notify when deals exit this stage"
            />

            {(formData.notifyOnEnter || formData.notifyOnExit) && (
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
                <InputLabel>Notify Users</InputLabel>
                <Select
                  multiple
                  name="notifyUsers"
                  value={formData.notifyUsers}
                  onChange={handleSelectChange}
                  label="Notify Users"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const member = members.find(m => m.userId === value);
                        return (
                          <MuiChip
                            key={value}
                            label={member?.user?.name || value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {members.map(member => (
                    <MenuItem key={member.userId} value={member.userId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                          {member.user?.name?.charAt(0)}
                        </Avatar>
                        {member.user?.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Required Fields
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
              <InputLabel>Required Fields</InputLabel>
              <Select
                multiple
                name="requiredFields"
                value={formData.requiredFields}
                onChange={handleSelectChange}
                label="Required Fields"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <MuiChip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="account">Account</MenuItem>
                <MenuItem value="contact">Contact</MenuItem>
                <MenuItem value="value">Deal Value</MenuItem>
                <MenuItem value="date">Close Date</MenuItem>
                <MenuItem value="products">Products</MenuItem>
                <MenuItem value="description">Description</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Allowed Next Stages
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
              <InputLabel>Allowed Stages</InputLabel>
              <Select
                multiple
                name="allowedStages"
                value={formData.allowedStages}
                onChange={handleSelectChange}
                label="Allowed Stages"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <MuiChip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {stages
                  .filter(s => s._id !== selectedStage?._id)
                  .map(stage => (
                    <MenuItem key={stage._id} value={stage.name}>
                      {stage.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
        }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
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
            onClick={updateStage}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <EditIcon />}
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.blue,
              '&:hover': { bgcolor: '#1557b0' },
              px: 4
            }}
          >
            {submitting ? 'Updating...' : 'Update Stage'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !submitting && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
          px: 4,
          py: 2.5,
        }}>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Delete Pipeline Stage
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
            Are you sure you want to delete "{selectedStage?.name}"?
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            This action cannot be undone. Any deals in this stage will need to be moved to another stage.
          </Typography>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
        }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={submitting}
            sx={{
              borderRadius: '24px',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteStage}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.red,
              '&:hover': { bgcolor: '#b71c1c' },
              px: 4
            }}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '12px',
            minWidth: 180,
          }
        }}
      >
        {/* View Details - always shown */}
        <MenuItem 
          onClick={() => {
            if (selectedStage) {
              setDetailDialogOpen(true);
              setAnchorEl(null);
            }
          }}
          sx={{ py: 1.5 }}
        >
          <ViewIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          <Typography variant="body2">View Details</Typography>
        </MenuItem>

        {/* Edit - only for non-default stages */}
        {!selectedStage?.isDefault ? (
          <MenuItem 
            onClick={() => {
              if (selectedStage) {
                setFormData({
                  name: selectedStage.name,
                  probability: selectedStage.probability.toString(),
                  color: selectedStage.color,
                  category: selectedStage.category,
                  isActive: selectedStage.isActive,
                  autoAdvance: selectedStage.autoAdvance || false,
                  autoAdvanceDays: selectedStage.autoAdvanceDays?.toString() || "",
                  notifyOnEnter: selectedStage.notifyOnEnter || false,
                  notifyOnExit: selectedStage.notifyOnExit || false,
                  notifyUsers: selectedStage.notifyUsers || [],
                  requiredFields: selectedStage.requiredFields || [],
                  allowedStages: selectedStage.allowedStages || [],
                  customFields: selectedStage.customFields || []
                });
                setEditDialogOpen(true);
                setAnchorEl(null);
              }
            }}
            sx={{ py: 1.5 }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="body2">Edit</Typography>
          </MenuItem>
        ) : null}

        {/* Toggle Active Status - only for non-default stages */}
        {!selectedStage?.isDefault ? (
          <MenuItem 
            onClick={() => {
              if (selectedStage) {
                toggleStageStatus(selectedStage);
                setAnchorEl(null);
              }
            }}
            sx={{ py: 1.5 }}
          >
            {selectedStage?.isActive ? (
              <>
                <VisibilityOffIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body2">Deactivate</Typography>
              </>
            ) : (
              <>
                <VisibilityOffIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body2">Activate</Typography>
              </>
            )}
          </MenuItem>
        ) : null}

        {/* Divider and Delete - only for non-default stages */}
        {!selectedStage?.isDefault ? [
          <Divider key="divider" sx={{ my: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />,
          <MenuItem 
            key="delete"
            onClick={() => {
              setDeleteDialogOpen(true);
              setAnchorEl(null);
            }}
            sx={{ py: 1.5, color: GOOGLE_COLORS.red }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: GOOGLE_COLORS.red }} />
            <Typography variant="body2">Delete</Typography>
          </MenuItem>
        ] : null}
      </Menu>
    </Box>
  );
}

// Helper component for ListItemIcon/Text
// function ListItemIcon({ children, sx }: any) {
//   return <Box sx={{ minWidth: 36, ...sx }}>{children}</Box>;
// }

// function ListItemText({ primary, secondary, children }: any) {
//   return (
//     <Box>
//       {primary && <Typography variant="body2">{primary}</Typography>}
//       {secondary && <Typography variant="caption" color="text.secondary">{secondary}</Typography>}
//       {children}
//     </Box>
//   );
// }