'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  Tooltip,
  LinearProgress,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Timeline as TimelineIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  MeetingRoom as MeetingIcon,
  CloudUpload as UploadIcon,
  Approval as ApprovalIcon,
  Person as PersonIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useRouter } from 'next/navigation';

interface TeamActivity {
  _id: string;
  type: string;
  action: string;
  description: string;
  teamMemberId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  projectId?: string;
  taskId?: string;
  metadata: {
    points: number;
    priority: string;
    tags: string[];
    [key: string]: any;
  };
  isImportant: boolean;
  createdAt: string;
}

interface ActivityStats {
  _id: string;
  count: number;
  totalPoints: number;
}

interface ActiveTeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
}

export default function TeamActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ActivityStats[]>([]);
  const [activeMembers, setActiveMembers] = useState<ActiveTeamMember[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    teamMemberId: 'all',
    startDate: '',
    endDate: '',
    isImportant: 'all',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Activity type options
  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'task_update', label: 'Task Updates' },
    { value: 'project_update', label: 'Project Updates' },
    { value: 'code_commit', label: 'Code Commits' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'file_upload', label: 'File Uploads' },
    { value: 'approval_granted', label: 'Approvals' },
    { value: 'status_change', label: 'Status Changes' },
  ];

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.isImportant !== 'all' && { isImportant: filters.isImportant }),
      });

      const response = await fetch(`/api/team/activities?${params}`);
      const data = await response.json();

      if (data.success) {
        setActivities(data.data.activities);
        setStats(data.data.statistics.activityStats);
        setActiveMembers(data.data.activeTeamMembers);
        setTotalCount(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, rowsPerPage, filters]);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_update':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'project_update':
        return <BusinessIcon fontSize="small" color="primary" />;
      case 'code_commit':
        return <CodeIcon fontSize="small" color="secondary" />;
      case 'meeting':
        return <MeetingIcon fontSize="small" color="warning" />;
      case 'file_upload':
        return <UploadIcon fontSize="small" color="info" />;
      case 'approval_granted':
        return <ApprovalIcon fontSize="small" color="success" />;
      case 'status_change':
        return <TimelineIcon fontSize="small" color="action" />;
      default:
        return <TimelineIcon fontSize="small" color="action" />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const config = {
      high: { color: 'error', label: 'High' },
      medium: { color: 'warning', label: 'Medium' },
      low: { color: 'success', label: 'Low' },
      critical: { color: 'error', label: 'Critical' },
    }[priority] || { color: 'default', label: priority };

    return (
      <Chip
        label={config.label}
        color={config.color as any}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <MainLayout title="Team Activities">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/dashboard')}
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
            <Typography color="text.primary">Team</Typography>
            <Typography color="text.primary">Activities</Typography>
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
                Team Activities
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor all team activities, updates, and performance metrics
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="list">List View</ToggleButton>
                <ToggleButton value="grid">Grid View</ToggleButton>
              </ToggleButtonGroup>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchActivities}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button startIcon={<DownloadIcon />} variant="outlined">
                Export
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Activities
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {totalCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <TimelineIcon />
                </Avatar>
              </Box>
              <LinearProgress variant="determinate" value={100} sx={{ mt: 2 }} />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active Members
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {activeMembers.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <PersonIcon />
                </Avatar>
              </Box>
              <LinearProgress variant="determinate" value={(activeMembers.length / totalCount) * 100 || 0} sx={{ mt: 2 }} />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Points
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.reduce((acc, stat) => acc + stat.totalPoints, 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <StarIcon />
                </Avatar>
              </Box>
              <LinearProgress variant="determinate" value={100} sx={{ mt: 2 }} />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg. Daily Activities
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {Math.round(totalCount / 30)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
              <LinearProgress variant="determinate" value={100} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                placeholder="Search activities..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  {activityTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                sx={{ minWidth: 200 }}
                label="From Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                sx={{ minWidth: 200 }}
                label="To Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Importance</InputLabel>
                <Select
                  value={filters.isImportant}
                  label="Importance"
                  onChange={(e) => setFilters(prev => ({ ...prev, isImportant: e.target.value }))}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="true">Important Only</MenuItem>
                  <MenuItem value="false">Regular Only</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={() => setFilters({
                  type: 'all',
                  teamMemberId: 'all',
                  startDate: '',
                  endDate: '',
                  isImportant: 'all',
                })}
                variant="outlined"
              >
                Clear
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Active Members */}
        {activeMembers.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon />
                Active Team Members
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                {activeMembers.map(member => (
                  <Paper key={member._id} variant="outlined" sx={{ p: 2, textAlign: 'center', flex: 1 }}>
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
                      {member.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {member.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {member.role}
                    </Typography>
                    <Chip
                      label={`Active ${formatDate(member.lastActive)}`}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Activities Table */}
        <Card>
          {loading ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">Loading activities...</Typography>
            </Box>
          ) : activities.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <TimelineIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No activities found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters
              </Typography>
              <Button
                variant="contained"
                onClick={() => setFilters({
                  type: 'all',
                  teamMemberId: 'all',
                  startDate: '',
                  endDate: '',
                  isImportant: 'all',
                })}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Activity</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Team Member</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Date & Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow 
                        key={activity._id} 
                        hover
                        sx={{ 
                          bgcolor: activity.isImportant ? 'action.hover' : 'inherit',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ mt: 0.5 }}>
                              {getActivityIcon(activity.type)}
                            </Box>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>
                                {activity.description}
                              </Typography>
                              {activity.metadata.tags && activity.metadata.tags.length > 0 && (
                                <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                                  {activity.metadata.tags.map((tag, index) => (
                                    <Chip
                                      key={index}
                                      label={tag}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Stack>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={activity.type.replace('_', ' ')}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {activity.teamMemberId ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {activity.teamMemberId.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {activity.teamMemberId.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.teamMemberId.role}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              System
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(activity.metadata.priority)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`+${activity.metadata.points}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDate(activity.createdAt)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(activity.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Typography>
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
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>

        {/* Activity Stats */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TimelineIcon />
              Activity Statistics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {stats.map((stat) => (
                <Paper key={stat._id} variant="outlined" sx={{ p: 2, flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {stat._id.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.count} activities
                      </Typography>
                    </Box>
                    <Chip
                      label={`${stat.totalPoints} points`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stat.count / totalCount) * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}