"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  Badge,
  Divider,
  CardActions,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  Container,
  alpha,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  TrendingUp,
  People,
  AttachMoney,
  Category,
  Lock,
  Upgrade,
  Dashboard,
  Sync,
  CloudOff,
  CloudQueue,
  Search,
  FilterList,
  Sort,
  CalendarToday,
  Flag,
  Description,
  Group,
  LocalOffer,
  Timeline,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { offlineStorage } from '@/utils/offlineStorage';
import { SearchIcon } from '@/components/common';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: string;
  deadline: string;
  budget: number;
  clientName: string;
  category: 'sales' | 'marketing' | 'development' | 'internal' | 'client' | 'other';
  teamMembers: string[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  createdAt: string;
  tags: string[];
  isLocal?: boolean;
  isSynced?: boolean;
}

interface SubscriptionStatus {
  isActive: boolean;
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  status: string;
  limits: {
    projects: number;
    teamMembers: number;
    storageMB: number;
  };
}

const PRICING_PLANS = {
  monthly: { name: 'Monthly Pro', price: 999, period: 'per month' },
  quarterly: { name: 'Quarterly Business', price: 2599, period: 'per quarter' },
  yearly: { name: 'Yearly Enterprise', price: 8999, period: 'per year' },
};

const PLAN_FEATURES = {
  monthly: ['Up to 50 projects', 'Unlimited team members', 'Advanced analytics', 'Gantt charts', 'Priority support'],
  quarterly: ['Up to 200 projects', 'Custom templates', 'Time tracking', 'Advanced reporting', 'Custom workflows'],
  yearly: ['Unlimited projects', 'AI insights', 'Custom integrations', 'Dedicated manager', 'White-label'],
};

// Helper function to fix the createdAt type issue
const prepareProjectForStorage = (projectData: any) => {
  return {
    ...projectData,
    createdAt: new Date(projectData.createdAt || Date.now()), // Convert to Date object
  };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as Project['status'],
    priority: 'medium' as Project['priority'],
    startDate: '',
    deadline: '',
    budget: '',
    clientName: '',
    category: 'other' as Project['category'],
    teamMembers: [] as string[],
    tags: [] as string[],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleBack = () => {
    window.history.back();
  };

  // Online/Offline Detection
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      showSnackbar('You are back online — syncing changes...', 'success');
      offlineStorage.processSyncQueue();
    };
    const goOffline = () => {
      setIsOnline(false);
      showSnackbar('Offline mode — changes will sync when online', 'warning');
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription/status', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSubscriptionStatus(data.data);
        if (data.data.limits?.projects && projects.length >= data.data.limits.projects) {
          setAccessDenied(true);
        }
      }
    } catch (err) {
      if (!navigator.onLine) {
        const saved = await offlineStorage.getItem<SubscriptionStatus>('subscription_status');
        if (saved) setSubscriptionStatus(saved);
      }
    }
  };

  // Fetch projects with offline fallback
  const fetchProjects = async () => {
    try {
      setError(null);
      if (!navigator.onLine) {
        const local = (await offlineStorage.getItem<Project[]>('projects')) || [];
        setProjects(local);
        showSnackbar(`Loaded ${local.length} projects (offline mode)`, 'info');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/projects');
      if (!res.ok) {
        if (res.status === 402) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch projects');
      }

      const { projects: data = [] } = await res.json();
      await offlineStorage.setItem('projects', data);
      setProjects(data);
    } catch (err) {
      const local = (await offlineStorage.getItem<Project[]>('projects')) || [];
      setProjects(local);
      showSnackbar('Using locally saved projects', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSubscriptionStatus();
      await fetchProjects();
    };
    init();
  }, []);

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProject(null);
  };

  // Create project
  const handleCreateProject = () => {
    if (subscriptionStatus && projects.length >= subscriptionStatus.limits.projects && isOnline) {
      setUpgradeDialogOpen(true);
      return;
    }

    setFormData({
      name: '', description: '', status: 'planning', priority: 'medium',
      startDate: '', deadline: '', budget: '', clientName: '',
      category: 'other', teamMembers: [], tags: [],
    });
    setOpenDialog(true);
  };

  // Edit project
  const handleEditProject = () => {
    if (!selectedProject) return;
    setFormData({
      name: selectedProject.name,
      description: selectedProject.description,
      status: selectedProject.status,
      priority: selectedProject.priority,
      startDate: selectedProject.startDate.split('T')[0],
      deadline: selectedProject.deadline.split('T')[0],
      budget: selectedProject.budget.toString(),
      clientName: selectedProject.clientName,
      category: selectedProject.category,
      teamMembers: selectedProject.teamMembers,
      tags: selectedProject.tags,
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  // Delete project
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
      if (isOnline) {
        await fetch(`/api/projects?id=${selectedProject._id}`, { method: 'DELETE' });
      } else {
        await offlineStorage.deleteItem('projects', selectedProject._id);
      }
      await fetchProjects();
      showSnackbar('Project deleted', 'success');
    } catch {
      showSnackbar('Failed to delete project', 'error');
    }
    handleMenuClose();
  };

  // Submit form - FIXED VERSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = prepareProjectForStorage({
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      blockedTasks: 0,
      createdAt: new Date().toISOString(),
    });

    try {
      if (isOnline && !selectedProject?.isLocal) {
        const method = selectedProject ? 'PUT' : 'POST';
        const payload = selectedProject
          ? { projectId: selectedProject._id, ...projectData }
          : projectData;

        const res = await fetch('/api/projects', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
      } else {
        if (selectedProject) {
          // FIX: Properly format the data for offline storage
          await offlineStorage.updateItem('projects', { 
            ...projectData, 
            id: selectedProject._id,
            createdAt: new Date(projectData.createdAt) // Ensure it's a Date object
          });
        } else {
          await offlineStorage.addItem('projects', projectData);
        }
      }

      setOpenDialog(false);
      await fetchProjects();
      showSnackbar(`Project ${selectedProject ? 'updated' : 'created'}`, 'success');
    } catch {
      showSnackbar('Failed to save project', 'error');
    }
  };

  const handleUpgradePlan = async (plan: string) => {
    console.log('Initiating upgrade to:', plan);
    // Your payment logic here
  };

  // Helpers
  const getStatusColor = (status: Project['status']) => {
    const map: Record<Project['status'], any> = {
      active: 'success', paused: 'warning', completed: 'primary',
      delayed: 'error', cancelled: 'default', planning: 'info',
    };
    return map[status];
  };

  const getPriorityColor = (priority: Project['priority']) => {
    const map: Record<Project['priority'], any> = {
      urgent: 'error', high: 'warning', medium: 'info', low: 'success',
    };
    return map[priority];
  };

  const getCategoryIcon = (category: Project['category']) => {
    const map: Record<Project['category'], React.ReactNode> = {
      sales: <TrendingUp />, marketing: <Dashboard />, development: <Category />,
      internal: <People />, client: <AttachMoney />, other: <Category />,
    };
    return map[category];
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const getDaysRemaining = (deadline: string) => Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(searchLower) ||
             p.description.toLowerCase().includes(searchLower) ||
             p.clientName.toLowerCase().includes(searchLower) ||
             p.tags.some(tag => tag.toLowerCase().includes(searchLower));
    }
    return (filterStatus === 'all' || p.status === filterStatus) &&
           (filterCategory === 'all' || p.category === filterCategory);
  });

  // Calculate stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    delayed: projects.filter(p => p.status === 'delayed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
  };

  // Premium lock screen
  if (accessDenied && isOnline && subscriptionStatus && !subscriptionStatus.isActive) {
    return (
      <MainLayout title="Projects">
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <Paper sx={{ p: 8, borderRadius: 4, boxShadow: 6 }}>
              <Lock sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
              <Typography variant="h4" fontWeight="bold" color="error" gutterBottom>Upgrade Required</Typography>
              <Typography variant="h6" color="text.secondary" paragraph>Project management is a premium feature</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
                Unlock team collaboration, analytics, and unlimited projects.
              </Typography>
              <Button variant="contained" size="large" startIcon={<Upgrade />} onClick={() => setUpgradeDialogOpen(true)}>
                Upgrade Now
              </Button>
            </Paper>
          </Box>
          <UpgradeDialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} onUpgrade={handleUpgradePlan} />
        </Container>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout title="Projects">
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Projects">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header - Same style as other pages */}
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
            <Typography color="text.primary">Projects</Typography>
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
                Project Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track, manage, and deliver projects efficiently
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
              {subscriptionStatus?.status === 'trial' && (
                <Chip 
                  label={`Trial Plan`}
                  size="small" 
                  color="info" 
                  variant="outlined"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Search and Action Bar */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <TextField
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon/>
                    ),
                  }}
                  sx={{ flex: 1, minWidth: { xs: '100%', sm: '300px' } }}
                  size="small"
                />

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="all">All Status</MenuItem>
                    {['planning', 'active', 'paused', 'completed', 'delayed', 'cancelled'].map((s) => (
                      <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Category</InputLabel>
                  <Select value={filterCategory} label="Category" onChange={(e) => setFilterCategory(e.target.value)}>
                    <MenuItem value="all">All Categories</MenuItem>
                    {['sales', 'marketing', 'development', 'internal', 'client', 'other'].map((c) => (
                      <MenuItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => {}}
                    size="small"
                  >
                    Filter
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateProject}
                    sx={{
                      borderRadius: '8px',
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                    size="small"
                  >
                    New Project
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
              "& > *": {
                flex: "1 1 200px",
                minWidth: { xs: "100%", sm: "200px" },
              },
            }}
          >
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Projects</Typography>
            </Card>
            
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">Active</Typography>
            </Card>
            
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </Card>
            
            <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="warning.main" gutterBottom>
                ${stats.totalBudget.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Budget</Typography>
            </Card>
          </Box>

          {/* Tabs */}
          <Paper sx={{ borderRadius: "12px", mb: 3, overflow: "hidden" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  minHeight: 48,
                },
                bgcolor: "background.paper",
              }}
            >
              <Tab
                label={`All Projects (${filteredProjects.length})`}
                icon={<Dashboard fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`Active (${stats.active})`}
                icon={<Timeline fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label="Categories"
                icon={<Category fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label={`Delayed (${stats.delayed})`}
                icon={<Flag fontSize="small" color="error" />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <Dashboard sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Projects Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first project to get started'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </Paper>
          ) : (
            <Box sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: viewMode === 'grid'
                ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }
                : '1fr',
            }}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onMenuOpen={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, project)}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  getCategoryIcon={getCategoryIcon}
                  formatDate={formatDate}
                  getDaysRemaining={getDaysRemaining}
                  isOnline={isOnline}
                />
              ))}
            </Box>
          )}

          {/* Dialogs & Menus */}
          <ProjectDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            selectedProject={selectedProject}
            isOnline={isOnline}
          />

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={handleEditProject}><Edit sx={{ mr: 1 }} fontSize="small" /> Edit</MenuItem>
            <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}><Delete sx={{ mr: 1 }} fontSize="small" /> Delete</MenuItem>
          </Menu>

          <UpgradeDialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} onUpgrade={handleUpgradePlan} />

          <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
          </Snackbar>
        </Box>
      </Container>
    </MainLayout>
  );
}

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
  getStatusColor: (s: Project['status']) => any;
  getPriorityColor: (p: Project['priority']) => any;
  getCategoryIcon: (c: Project['category']) => React.ReactNode;
  formatDate: (d: string) => string;
  getDaysRemaining: (d: string) => number;
  isOnline: boolean;
}> = ({ project, onMenuOpen, getStatusColor, getPriorityColor, getCategoryIcon, formatDate, getDaysRemaining }) => {
  const daysLeft = getDaysRemaining(project.deadline);
  const isOverdue = daysLeft < 0;
  const isSoon = daysLeft <= 7 && daysLeft >= 0;

  return (
    <Card sx={{
      borderRadius: 3,
      boxShadow: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: '0.3s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
      border: project.isLocal && !project.isSynced ? '2px dashed #ff9800' : 'none',
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>{project.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {project.description || 'No description'}
            </Typography>
          </Box>
          <IconButton onClick={onMenuOpen} size="small"><MoreVert /></IconButton>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
          <Chip label={project.priority} color={getPriorityColor(project.priority)} variant="outlined" size="small" />
          <Chip label={project.category} size="small" />
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" fontWeight="bold">{project.progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">Deadline</Typography>
            <Typography variant="body2" fontWeight="medium">{formatDate(project.deadline)}</Typography>
            <Chip 
              label={isOverdue ? 'Overdue' : `${daysLeft} days left`} 
              size="small" 
              color={isOverdue ? 'error' : isSoon ? 'warning' : 'default'} 
              sx={{ mt: 0.5 }} 
            />
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">Budget</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">${project.budget.toLocaleString()}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">Client</Typography>
            <Typography variant="body2">{project.clientName || 'No client'}</Typography>
          </Box>
          
          {project.teamMembers.length > 0 && (
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
              {project.teamMembers.slice(0, 3).map((member, i) => (
                <Tooltip key={i} title={member}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Project Form Dialog - FIXED VERSION
const ProjectDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  selectedProject: Project | null;
  isOnline: boolean;
}> = ({ open, onClose, onSubmit, formData, setFormData, selectedProject, isOnline }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {selectedProject ? 'Edit Project' : 'Create New Project'}
        </Typography>
        {!isOnline && <Chip label="Offline Mode" color="warning" size="small" />}
      </Box>
    </DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField 
            label="Project Name" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            required 
            fullWidth 
          />
          
          <TextField 
            label="Description" 
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })} 
            multiline 
            rows={3} 
            fullWidth 
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} label="Status" onChange={e => setFormData({ ...formData, status: e.target.value })}>
                {['planning', 'active', 'paused', 'completed', 'cancelled', 'delayed'].map(s => (
                  <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={formData.priority} label="Priority" onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                {['low', 'medium', 'high', 'urgent'].map(p => (
                  <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField 
              label="Start Date" 
              type="date" 
              value={formData.startDate} 
              onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
              InputLabelProps={{ shrink: true }} 
              fullWidth 
            />
            
            <TextField 
              label="Deadline" 
              type="date" 
              value={formData.deadline} 
              onChange={e => setFormData({ ...formData, deadline: e.target.value })} 
              InputLabelProps={{ shrink: true }} 
              fullWidth 
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField 
              label="Budget ($)" 
              type="number" 
              value={formData.budget} 
              onChange={e => setFormData({ ...formData, budget: e.target.value })} 
              fullWidth 
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={formData.category} label="Category" onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {['sales', 'marketing', 'development', 'internal', 'client', 'other'].map(c => (
                  <MenuItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TextField 
            label="Client Name" 
            value={formData.clientName} 
            onChange={e => setFormData({ ...formData, clientName: e.target.value })} 
            fullWidth 
          />
          
          <TextField 
            label="Team Members (comma-separated)" 
            value={formData.teamMembers.join(', ')} 
            onChange={e => setFormData({ ...formData, teamMembers: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} 
            placeholder="John Doe, Jane Smith" 
            fullWidth 
          />
          
          <TextField 
            label="Tags (comma-separated)" 
            value={formData.tags.join(', ')} 
            onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} 
            placeholder="urgent, web, redesign" 
            fullWidth 
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" size="large">
          {selectedProject ? (isOnline ? 'Update Project' : 'Save Locally') : (isOnline ? 'Create Project' : 'Create Locally')}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);

// Upgrade Plan Dialog
const UpgradeDialog: React.FC<{ open: boolean; onClose: () => void; onUpgrade: (plan: string) => void }> = ({ open, onClose, onUpgrade }) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle textAlign="center">
      <Typography variant="h4" fontWeight="bold">Upgrade Your Plan</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>Choose the perfect plan for your team</Typography>
    </DialogTitle>
    <DialogContent>
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, my: 4 }}>
        {Object.entries(PRICING_PLANS).map(([key, plan]) => (
          <Card key={key} sx={{ p: 4, borderRadius: 4, boxShadow: 6, textAlign: 'center', '&:hover': { transform: 'translateY(-8px)', transition: '0.3s' } }}>
            <Typography variant="h5" fontWeight="bold">{plan.name}</Typography>
            <Typography variant="h3" color="primary.main" sx={{ my: 2 }}>₹{plan.price}</Typography>
            <Typography color="text.secondary" gutterBottom>{plan.period}</Typography>
            <List sx={{ mb: 4 }}>
              {PLAN_FEATURES[key as keyof typeof PLAN_FEATURES].map((f) => (
                <ListItem key={f} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary={f} />
                </ListItem>
              ))}
            </List>
            <Button variant="contained" size="large" fullWidth onClick={() => onUpgrade(key)}>
              Choose {plan.name}
            </Button>
          </Card>
        ))}
      </Box>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);