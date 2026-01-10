// app/admin/dashboard/page.tsx - UPDATED WITH FILTERING AND SEARCH
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import {
  AdminPanelSettings,
  Description,
  People,
  Add,
  Logout,
  Edit,
  Refresh,
  TrendingUp,
  AccountBalance,
  Search,
  FilterList,
  ShoppingBag,
} from '@mui/icons-material';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  totalProducts: number;
  revenue: number;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
    features: string[];
  };
  isActive: boolean;
  createdAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    checkAdminAuth();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [allUsers, tabValue, searchQuery, planFilter, roleFilter]);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (err) {
      router.push('/admin/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data.stats);
      setAllUsers(data.recentUsers || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...allUsers];

    // Filter by tab (status)
    if (tabValue === 1) { // Active users tab
      filtered = filtered.filter(user => user.subscription.status === 'active');
    } else if (tabValue === 2) { // Trial users tab
      filtered = filtered.filter(user => user.subscription.status === 'trial');
    } else if (tabValue === 3) { // Inactive users tab
      filtered = filtered.filter(user => user.subscription.status === 'inactive' || !user.isActive);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }

    // Filter by plan
    if (planFilter !== 'all') {
      filtered = filtered.filter(user => user.subscription.plan === planFilter);
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchDashboardData();
    setRefreshLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setRoleFilter('all');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'yearly': return 'secondary';
      case 'quarterly': return 'primary';
      case 'monthly': return 'warning';
      case 'trial': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            <AdminPanelSettings sx={{ mr: 2, verticalAlign: 'middle' }} />
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage users, subscriptions, and payments
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={refreshLoading}
          >
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        '& > *': {
          flex: '1 1 calc(25% - 24px)',
          minWidth: 250
        }
      }}>
        {/* Total Revenue Card */}
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {stats ? formatCurrency(stats.revenue) : '₹0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </Box>
            <AccountBalance sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
          </CardContent>
        </Card>
        
        {/* Total Users Card - Clickable */}
        <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(0)}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {stats?.totalUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </Box>
            <People sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.7 }} />
          </CardContent>
        </Card>
        
        {/* Active Users Card - Clickable */}
        <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(1)}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats?.activeUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </Box>
            <TrendingUp sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
          </CardContent>
        </Card>
        
        {/* Trial Users Card - Clickable */}
        <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => setTabValue(2)}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats?.trialUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trial Users
              </Typography>
            </Box>
            <Description sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
          </CardContent>
        </Card>
      </Box>

      {/* Products Count Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ShoppingBag sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {stats?.totalProducts || 0} Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total products across all users
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* User Management Section */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Header with Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 0 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="user tabs">
                <Tab label={`All Users (${allUsers.length})`} />
                <Tab label={`Active (${stats?.activeUsers || 0})`} />
                <Tab label={`Trial (${stats?.trialUsers || 0})`} />
                <Tab label="Inactive" />
              </Tabs>
              <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/admin/users')}>
                View All Users
              </Button>
            </Box>
          </Box>

          {/* Search and Filter Bar */}
          <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search users by name, email or role..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Plan</InputLabel>
              <Select
                value={planFilter}
                label="Plan"
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <MenuItem value="all">All Plans</MenuItem>
                <MenuItem value="trial">Trial</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">Super Admin</MenuItem>
              </Select>
            </FormControl>

            {(searchQuery || planFilter !== 'all' || roleFilter !== 'all') && (
              <Button 
                size="small" 
                onClick={clearFilters}
                sx={{ ml: 'auto' }}
              >
                Clear Filters
              </Button>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              Showing {filteredUsers.length} of {allUsers.length} users
            </Typography>
          </Box>

          {/* Users Table */}
          <TabPanel value={tabValue} index={0}>
            <UsersTable 
              users={filteredUsers} 
              onEditUser={handleEditUser} 
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getPlanColor={getPlanColor}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <UsersTable 
              users={filteredUsers} 
              onEditUser={handleEditUser} 
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getPlanColor={getPlanColor}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <UsersTable 
              users={filteredUsers} 
              onEditUser={handleEditUser} 
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getPlanColor={getPlanColor}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <UsersTable 
              users={filteredUsers} 
              onEditUser={handleEditUser} 
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getPlanColor={getPlanColor}
            />
          </TabPanel>

          {filteredUsers.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <FilterList sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No users found matching your criteria
              </Typography>
              <Button 
                variant="outlined" 
                onClick={clearFilters}
                sx={{ mt: 1 }}
              >
                Clear filters
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <EditUserDialog
        open={editDialogOpen}
        user={selectedUser}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedUser(null);
        }}
        onUpdate={fetchDashboardData}
      />
    </Box>
  );
}

// Users Table Component
interface UsersTableProps {
  users: AdminUser[];
  onEditUser: (user: AdminUser) => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  getPlanColor: (plan: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

function UsersTable({ users, onEditUser, formatDate, getStatusColor, getPlanColor }: UsersTableProps) {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  {user.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={user.subscription.plan.toUpperCase()} 
                  size="small" 
                  color={getPlanColor(user.subscription.plan) as any}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={user.subscription.status.toUpperCase()}
                  color={getStatusColor(user.subscription.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={user.role} 
                  size="small"
                  color={user.role === 'superadmin' ? 'secondary' : 'default'}
                />
              </TableCell>
              <TableCell>
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <Tooltip title="Edit User">
                  <IconButton 
                    size="small" 
                    onClick={() => onEditUser(user)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Details">
                  <IconButton 
                    size="small" 
                    onClick={() => window.open(`/admin/users/${user._id}`, '_blank')}
                    color="info"
                  >
                    <People />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Edit User Dialog Component
interface EditUserDialogProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onUpdate: () => void;
}

function EditUserDialog({ open, user, onClose, onUpdate }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    plan: '',
    status: '',
    features: [] as string[]
  });

  useEffect(() => {
    if (user) {
      setFormData({
        plan: user.subscription.plan,
        status: user.subscription.status,
        features: user.subscription.features || []
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: formData
        }),
      });

      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit User - {user.name}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={user.name}
              disabled
              variant="filled"
            />
            
            <TextField
              fullWidth
              label="Email"
              value={user.email}
              disabled
              variant="filled"
            />
            
            <FormControl fullWidth>
              <InputLabel>Plan</InputLabel>
              <Select
                value={formData.plan}
                label="Plan"
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              >
                <MenuItem value="trial">Trial</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="trial">Trial</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Features (comma separated)"
              value={formData.features.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
              })}
              placeholder="Feature 1, Feature 2, Feature 3"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Update User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}