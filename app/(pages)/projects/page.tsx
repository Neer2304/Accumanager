"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  Pagination,
} from '@mui/material';
import { 
  Home as HomeIcon,
  Add,
  Search,
  FilterList,
  Dashboard,
  TrendingUp,
  People,
  AttachMoney,
  Category,
  Lock,
  Upgrade,
  Sync,
  CloudOff,
  CloudQueue,
  CalendarToday,
  Flag,
  Description,
  Group,
  LocalOffer,
  Timeline,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  PlayArrow,
  Warning,
} from '@mui/icons-material';
import Link from 'next/link';

// Import Google-themed components
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { Dialog } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tab';
import { Avatar } from '@/components/ui/Avatar';
import { AvatarGroup } from '@/components/ui/AvatarGroup';

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

// Simple offline storage fallback
const simpleOfflineStorage = {
  getItem: async <T,>(key: string): Promise<T | null> => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setItem: async <T,>(key: string, data: T): Promise<{ success: boolean }> => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return { success: false };
    }
  },

  addItem: async <T,>(key: string, data: T): Promise<{ success: boolean }> => {
    try {
      const existing = await simpleOfflineStorage.getItem<any[]>(key) || [];
      existing.push(data);
      localStorage.setItem(key, JSON.stringify(existing));
      return { success: true };
    } catch (error) {
      console.error('Error adding to localStorage:', error);
      return { success: false };
    }
  },

  updateItem: async <T extends { id: string }>(key: string, data: T): Promise<{ success: boolean }> => {
    try {
      const existing = await simpleOfflineStorage.getItem<T[]>(key) || [];
      const index = existing.findIndex(item => item.id === data.id || (item as any)._id === data.id);
      if (index !== -1) {
        existing[index] = { ...existing[index], ...data };
        localStorage.setItem(key, JSON.stringify(existing));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error updating localStorage:', error);
      return { success: false };
    }
  },

  deleteItem: async (key: string, id: string): Promise<{ success: boolean }> => {
    try {
      const existing = await simpleOfflineStorage.getItem<any[]>(key) || [];
      const filtered = existing.filter(item => (item.id !== id && item._id !== id));
      localStorage.setItem(key, JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return { success: false };
    }
  },
};

// Custom fade component for SSR
const SafeFade = ({ children, ...props }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{children}</>;
  }
  
  return (
    <div style={{ opacity: 1, transition: 'opacity 300ms' }}>
      {children}
    </div>
  );
};

export default function ProjectsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const projectsPerPage = 9;

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
        const saved = await simpleOfflineStorage.getItem<SubscriptionStatus>('subscription_status');
        if (saved) setSubscriptionStatus(saved);
      }
    }
  };

  // Fetch projects with offline fallback
  const fetchProjects = async () => {
    try {
      setError(null);
      if (!navigator.onLine) {
        const local = (await simpleOfflineStorage.getItem<Project[]>('projects')) || [];
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
      await simpleOfflineStorage.setItem('projects', data);
      setProjects(data);
    } catch (err) {
      const local = (await simpleOfflineStorage.getItem<Project[]>('projects')) || [];
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
    setSelectedProject(null);
    setOpenDialog(true);
  };

  // Edit project
  const handleEditProject = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate.split('T')[0],
      deadline: project.deadline.split('T')[0],
      budget: project.budget.toString(),
      clientName: project.clientName,
      category: project.category,
      teamMembers: project.teamMembers,
      tags: project.tags,
    });
    setSelectedProject(project);
    setOpenDialog(true);
  };

  // Delete project
  const handleDeleteProject = async (project: Project) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      if (isOnline) {
        await fetch(`/api/projects?id=${project._id}`, { method: 'DELETE' });
      } else {
        await simpleOfflineStorage.deleteItem('projects', project._id);
      }
      await fetchProjects();
      showSnackbar('Project deleted', 'success');
    } catch {
      showSnackbar('Failed to delete project', 'error');
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      id: selectedProject?._id || Math.random().toString(36).substring(2, 9),
      budget: parseFloat(formData.budget) || 0,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      blockedTasks: 0,
      createdAt: new Date().toISOString(),
      teamMembers: formData.teamMembers || [],
      tags: formData.tags || [],
    };

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
          await simpleOfflineStorage.updateItem('projects', { 
            ...projectData, 
            id: selectedProject._id,
          });
        } else {
          await simpleOfflineStorage.addItem('projects', projectData);
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
      active: 'success', 
      paused: 'warning', 
      completed: 'primary',
      delayed: 'error', 
      cancelled: 'default', 
      planning: 'info',
    };
    return map[status];
  };

  const getPriorityColor = (priority: Project['priority']) => {
    const map: Record<Project['priority'], any> = {
      urgent: 'error', 
      high: 'warning', 
      medium: 'info', 
      low: 'success',
    };
    return map[priority];
  };

  const getCategoryIcon = (category: Project['category']) => {
    const map: Record<Project['category'], React.ReactNode> = {
      sales: <TrendingUp />, 
      marketing: <Dashboard />, 
      development: <Category />,
      internal: <People />, 
      client: <AttachMoney />, 
      other: <Category />,
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

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  // Calculate stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    delayed: projects.filter(p => p.status === 'delayed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Premium lock screen
  if (accessDenied && isOnline && subscriptionStatus && !subscriptionStatus.isActive) {
    return (
      <MainLayout title="Projects">
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          minHeight: '100vh',
        }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card 
              hover
              sx={{ 
                p: { xs: 3, md: 6 }, 
                textAlign: 'center',
                border: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}
            >
              <Lock sx={{ 
                fontSize: 60, 
                mb: 3,
                color: '#ea4335',
              }} />
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="#ea4335" 
                gutterBottom
                sx={{ mb: 2 }}
              >
                Upgrade Required
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                Project management is a premium feature. Unlock team collaboration, analytics, and unlimited projects.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setUpgradeDialogOpen(true)}
                iconLeft={<Upgrade />}
                size="medium"
                sx={{ 
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' }
                }}
              >
                Upgrade Now
              </Button>
            </Card>
            <UpgradeDialog 
              open={upgradeDialogOpen} 
              onClose={() => setUpgradeDialogOpen(false)} 
              onUpgrade={handleUpgradePlan} 
              darkMode={darkMode}
            />
          </Container>
        </Box>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout title="Projects">
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          minHeight: '100vh',
        }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <SafeFade>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh' 
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124', 
                    mb: 2 
                  }}>
                    Loading projects...
                  </Typography>
                  <CircularProgress sx={{ color: '#4285f4' }} />
                </Box>
              </Box>
            </SafeFade>
          </Container>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Projects">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <SafeFade>
            <Breadcrumbs sx={{ 
              mb: { xs: 1, sm: 2 }, 
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
            }}>
              <MuiLink 
                component={Link} 
                href="/dashboard" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none', 
                  color: darkMode ? '#9aa0a6' : '#5f6368', 
                  fontWeight: 300, 
                  "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
                Dashboard
              </MuiLink>
              <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
                Project Management
              </Typography>
            </Breadcrumbs>
          </SafeFade>

          <SafeFade>
            <Box sx={{ 
              textAlign: 'center', 
              mb: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1, sm: 2, md: 3 },
            }}>
              <Typography 
                variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
                fontWeight={500} 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Project Management
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
                Track, manage, and deliver projects efficiently
              </Typography>
            </Box>
          </SafeFade>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <SafeFade>
              <Alert 
                severity="error"
                title="Error"
                message={error}
                dismissible
                onDismiss={() => setError(null)}
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              />
            </SafeFade>
          )}

          {/* Snackbar */}
          {snackbar.open && (
            <SafeFade>
              <Alert
                severity={snackbar.severity}
                title=""
                message={snackbar.message}
                dismissible
                onDismiss={() => setSnackbar({ ...snackbar, open: false })}
                sx={{ 
                  mb: { xs: 2, sm: 3, md: 4 },
                }}
              />
            </SafeFade>
          )}

          {/* Header with Search and Stats */}
          <SafeFade>
            <Card
              title="Project Management"
              subtitle={`${projects.length} total projects • ${filteredProjects.length} filtered`}
              action={
                <Button
                  variant="contained"
                  onClick={handleCreateProject}
                  iconLeft={<Add />}
                  size="medium"
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  New Project
                </Button>
              }
              hover
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'center' },
                mt: 2,
              }}>
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search />}
                  size="small"
                  sx={{ flex: 1 }}
                />
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Select
                    size="small"
                    label="Status"
                    value={filterStatus}
                    onChange={(e: any) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'planning', label: 'Planning' },
                      { value: 'active', label: 'Active' },
                      { value: 'paused', label: 'Paused' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'delayed', label: 'Delayed' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                    sx={{ minWidth: 140 }}
                  />

                  <Select
                    size="small"
                    label="Category"
                    value={filterCategory}
                    onChange={(e: any) => setFilterCategory(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Categories' },
                      { value: 'sales', label: 'Sales' },
                      { value: 'marketing', label: 'Marketing' },
                      { value: 'development', label: 'Development' },
                      { value: 'internal', label: 'Internal' },
                      { value: 'client', label: 'Client' },
                      { value: 'other', label: 'Other' },
                    ]}
                    sx={{ minWidth: 140 }}
                  />

                  <Button
                    variant="outlined"
                    size="medium"
                    iconLeft={<FilterList />}
                  >
                    Filter
                  </Button>
                </Box>
              </Box>
            </Card>
          </SafeFade>

          {/* Stats Cards */}
          <SafeFade>
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2, md: 3 },
              mb: { xs: 2, sm: 3, md: 4 },
            }}>
              {[
                { 
                  title: 'Total Projects', 
                  value: stats.total, 
                  icon: <Dashboard />, 
                  color: '#4285f4', 
                  progress: 100,
                  description: 'All projects in system' 
                },
                { 
                  title: 'Active', 
                  value: stats.active, 
                  icon: <PlayArrow />, 
                  color: '#34a853', 
                  progress: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0,
                  description: 'Projects in progress' 
                },
                { 
                  title: 'Completed', 
                  value: stats.completed, 
                  icon: <CheckCircle />, 
                  color: '#0f9d58', 
                  progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
                  description: 'Finished projects' 
                },
                { 
                  title: 'Delayed', 
                  value: stats.delayed, 
                  icon: <Warning />, 
                  color: '#fbbc04', 
                  progress: stats.total > 0 ? Math.round((stats.delayed / stats.total) * 100) : 0,
                  description: 'Past deadline' 
                },
                { 
                  title: 'Total Budget', 
                  value: `$${stats.totalBudget.toLocaleString()}`, 
                  icon: <AttachMoney />, 
                  color: '#8ab4f8', 
                  progress: 100,
                  description: 'Combined budget' 
                },
                { 
                  title: 'Avg Progress', 
                  value: `${stats.avgProgress}%`, 
                  icon: <Timeline />, 
                  color: '#9aa0a6', 
                  progress: stats.avgProgress,
                  description: 'Average completion' 
                },
              ].map((stat, index) => (
                <Card 
                  key={`stat-${index}`}
                  hover
                  sx={{ 
                    flex: '1 1 calc(33.333% - 16px)', 
                    minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
                    p: { xs: 1.5, sm: 2, md: 3 }, 
                    borderRadius: '16px', 
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    background: darkMode 
                      ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                      : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368', 
                            fontWeight: 400,
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            display: 'block',
                          }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography 
                          variant={isMobile ? "h5" : "h4"}
                          sx={{ 
                            color: stat.color, 
                            fontWeight: 600,
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        p: { xs: 0.75, sm: 1 }, 
                        borderRadius: '10px', 
                        backgroundColor: alpha(stat.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {React.cloneElement(stat.icon, { 
                          sx: { 
                            fontSize: { xs: 20, sm: 24, md: 28 }, 
                            color: stat.color,
                          } 
                        })}
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                        display: 'block',
                      }}
                    >
                      {stat.description}
                    </Typography>
                    
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                          }}
                        >
                          Progress
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: stat.color,
                            fontWeight: 500,
                            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                          }}
                        >
                          {stat.progress}%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        position: 'relative', 
                        height: 6, 
                        backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${stat.progress}%`,
                            backgroundColor: stat.color,
                            borderRadius: 3,
                          }} 
                        />
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </SafeFade>

          {/* Tabs */}
          <SafeFade>
            <Card hover sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
              <Tabs
                tabs={[
                  { label: `All Projects (${filteredProjects.length})`, icon: <Dashboard />, count: filteredProjects.length },
                  { label: `Active (${stats.active})`, icon: <PlayArrow />, count: stats.active },
                  { label: `Completed (${stats.completed})`, icon: <CheckCircle />, count: stats.completed },
                  { label: `Delayed (${stats.delayed})`, icon: <Warning />, count: stats.delayed, badgeColor: 'error' },
                  { label: 'Categories', icon: <Category /> },
                ]}
                value={activeTab}
                onChange={(newValue: number) => setActiveTab(newValue)}
                variant="scrollable"
              />
            </Card>
          </SafeFade>

          {/* Projects Grid */}
          <SafeFade>
            <Box>
              {paginatedProjects.length === 0 ? (
                <Card 
                  hover
                  sx={{ 
                    p: { xs: 4, sm: 6 }, 
                    textAlign: 'center',
                    border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  }}
                >
                  <Dashboard sx={{ 
                    fontSize: 60, 
                    mb: 2,
                    color: darkMode ? '#5f6368' : '#9aa0a6',
                  }} />
                  <Typography 
                    variant="h5" 
                    fontWeight={500}
                    gutterBottom
                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  >
                    No Projects Found
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3,
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Create your first project to get started'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleCreateProject}
                    iconLeft={<Add />}
                    size="medium"
                    sx={{ 
                      backgroundColor: '#4285f4',
                      '&:hover': { backgroundColor: '#3367d6' }
                    }}
                  >
                    Create Project
                  </Button>
                </Card>
              ) : (
                <>
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    mb: 4,
                  }}>
                    {paginatedProjects.map((project, index) => (
                      <Box 
                        key={`project-${project._id}-${index}`}
                        sx={{
                          flex: '1 1 100%',
                          '@media (min-width: 600px)': {
                            flex: '1 1 calc(50% - 12px)',
                          },
                          '@media (min-width: 900px)': {
                            flex: '1 1 calc(33.333% - 16px)',
                          },
                        }}
                      >
                        <ProjectCard
                          project={project}
                          darkMode={darkMode}
                          onEdit={() => handleEditProject(project)}
                          onDelete={() => handleDeleteProject(project)}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                          formatDate={formatDate}
                          getDaysRemaining={getDaysRemaining}
                          isOnline={isOnline}
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mt: 4,
                      pt: 3,
                      borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: darkMode ? '#e8eaed' : '#202124',
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            '&.Mui-selected': {
                              backgroundColor: '#4285f4',
                              color: '#ffffff',
                              '&:hover': {
                                backgroundColor: '#3367d6',
                              },
                            },
                            '&:hover': {
                              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </SafeFade>

          {/* Offline Indicator */}
          {!isOnline && (
            <SafeFade>
              <Box sx={{ 
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000,
              }}>
                <Alert
                  severity="warning"
                  title="Offline Mode"
                  message="You are currently offline. Changes will sync when you reconnect."
                  dismissible={false}
                  sx={{
                    maxWidth: 300,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(251, 188, 4, 0.4)' },
                      '70%': { boxShadow: '0 0 0 10px rgba(251, 188, 4, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(251, 188, 4, 0)' },
                    },
                  }}
                />
              </Box>
            </SafeFade>
          )}
        </Container>

        {/* Project Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title={selectedProject ? "Edit Project" : "Create New Project"}
          maxWidth="md"
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              <Input
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
                sx={{ mb: 2 }}
              />

              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                    options={[
                      { value: 'planning', label: 'Planning' },
                      { value: 'active', label: 'Active' },
                      { value: 'paused', label: 'Paused' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'delayed', label: 'Delayed' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                    fullWidth
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                  <Select
                    label="Priority"
                    value={formData.priority}
                    onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                      { value: 'urgent', label: 'Urgent' },
                    ]}
                    fullWidth
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    fullWidth
                  />
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                  <Input
                    label="Deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    fullWidth
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                  <Input
                    label="Budget ($)"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    fullWidth
                  />
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    options={[
                      { value: 'sales', label: 'Sales' },
                      { value: 'marketing', label: 'Marketing' },
                      { value: 'development', label: 'Development' },
                      { value: 'internal', label: 'Internal' },
                      { value: 'client', label: 'Client' },
                      { value: 'other', label: 'Other' },
                    ]}
                    fullWidth
                  />
                </Box>
              </Box>

              <Input
                label="Client Name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              
              <Input
                label="Team Members (comma-separated)"
                value={formData.teamMembers.join(', ')}
                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                placeholder="John Doe, Jane Smith"
                fullWidth
                sx={{ mb: 2 }}
              />
              
              <Input
                label="Tags (comma-separated)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                placeholder="urgent, web, redesign"
                fullWidth
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenDialog(false)}
                  size="medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  {selectedProject ? (isOnline ? 'Update Project' : 'Save Locally') : (isOnline ? 'Create Project' : 'Create Locally')}
                </Button>
              </Box>
            </Box>
          </form>
        </Dialog>

        {/* Upgrade Dialog */}
        <UpgradeDialog 
          open={upgradeDialogOpen} 
          onClose={() => setUpgradeDialogOpen(false)} 
          onUpgrade={handleUpgradePlan} 
          darkMode={darkMode}
        />
      </Box>
    </MainLayout>
  );
}

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  darkMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (s: Project['status']) => any;
  getPriorityColor: (p: Project['priority']) => any;
  formatDate: (d: string) => string;
  getDaysRemaining: (d: string) => number;
  isOnline: boolean;
}> = ({ project, darkMode, onEdit, onDelete, getStatusColor, getPriorityColor, formatDate, getDaysRemaining, isOnline }) => {
  const daysLeft = getDaysRemaining(project.deadline);
  const isOverdue = daysLeft < 0;
  const isSoon = daysLeft <= 7 && daysLeft >= 0;

  return (
    <Card 
      hover
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: '0.3s',
        '&:hover': { transform: 'translateY(-4px)' },
        border: project.isLocal && !project.isSynced ? '2px dashed #ff9800' : 'none',
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>{project.name}</Typography>
            <Typography variant="body2" sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {project.description || 'No description'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="text"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip 
            label={project.status} 
            color={getStatusColor(project.status)} 
            size="small" 
            variant="filled"
          />
          <Chip 
            label={project.priority} 
            color={getPriorityColor(project.priority)} 
            variant="outlined" 
            size="small" 
          />
          <Chip 
            label={project.category} 
            size="small" 
            variant="outlined"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="bold">{project.progress}%</Typography>
          </Box>
          <Box sx={{ 
            height: 8, 
            backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <Box 
              sx={{ 
                height: '100%',
                width: `${project.progress}%`,
                backgroundColor: project.progress === 100 ? '#34a853' : '#4285f4',
                borderRadius: 4,
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Deadline
            </Typography>
            <Typography variant="body2" fontWeight="medium">{formatDate(project.deadline)}</Typography>
            <Chip 
              label={isOverdue ? 'Overdue' : `${daysLeft} days left`} 
              size="small" 
              color={isOverdue ? 'error' : isSoon ? 'warning' : 'default'} 
              variant="outlined"
              sx={{ mt: 0.5 }} 
            />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Budget
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#4285f4">
              ${project.budget.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, 
          pt: 2, 
          mt: 2 
        }} />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2,
        }}>
          <Box>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Client
            </Typography>
            <Typography variant="body2">{project.clientName || 'No client'}</Typography>
          </Box>
          
          {project.teamMembers.length > 0 && (
            <Box>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mr: 1 }}>
                Team
              </Typography>
              <AvatarGroup max={3}>
                {project.teamMembers.slice(0, 3).map((member, i) => (
                  <Avatar
                    key={i}
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      fontSize: 12,
                      backgroundColor: '#4285f4',
                    }}
                  >
                    {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

// Upgrade Dialog Component
const UpgradeDialog: React.FC<{ 
  open: boolean; 
  onClose: () => void; 
  onUpgrade: (plan: string) => void;
  darkMode: boolean;
}> = ({ open, onClose, onUpgrade, darkMode }) => (
  <Dialog
    open={open}
    onClose={onClose}
    title="Upgrade Your Plan"
    subtitle="Choose the perfect plan for your team"
    maxWidth="lg"
    fullWidth
  >
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        mt: 4,
      }}>
        {Object.entries(PRICING_PLANS).map(([key, plan]) => (
          <Box 
            key={key}
            sx={{
              flex: '1 1 100%',
              '@media (min-width: 900px)': {
                flex: '1 1 calc(33.333% - 16px)',
              },
            }}
          >
            <Card 
              hover
              sx={{ 
                p: 4, 
                textAlign: 'center',
                height: '100%',
                border: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                '&:hover': { 
                  borderColor: '#4285f4',
                  transform: 'translateY(-8px)',
                  transition: '0.3s',
                },
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {plan.name}
              </Typography>
              <Typography variant="h3" color="#4285f4" sx={{ my: 2 }}>
                ₹{plan.price}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mb: 3,
              }}>
                {plan.period}
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {PLAN_FEATURES[key as keyof typeof PLAN_FEATURES].map((feature, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 1,
                      textAlign: 'left',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 16, color: '#34a853' }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Button
                variant="contained"
                onClick={() => onUpgrade(key)}
                fullWidth
                size="large"
                sx={{ 
                  backgroundColor: '#4285f4',
                  '&:hover': { backgroundColor: '#3367d6' }
                }}
              >
                Choose {plan.name}
              </Button>
            </Card>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4,
        pt: 3,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Button
          variant="outlined"
          onClick={onClose}
          size="medium"
        >
          Cancel
        </Button>
      </Box>
    </Box>
  </Dialog>
);