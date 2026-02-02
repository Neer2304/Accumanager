'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useRouter } from 'next/navigation';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'away' | 'offline' | 'on_leave';
  performance: number;
  tasksCompleted: number;
  joinDate: string;
  lastActive: string;
  assignedProjects: Array<{
    _id: string;
    name: string;
    status: string;
    progress: number;
  }>;
  assignedTasksCount: number;
  assignedProjectsCount: number;
}

export default function TeamMembersPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedDepartment !== 'all' && { department: selectedDepartment }),
        ...(selectedStatus !== 'all' && { status: selectedStatus })
      });

      const response = await fetch(`/api/team/members?${params}`);
      const data = await response.json();

      if (data.success) {
        setTeamMembers(data.data.teamMembers);
        setTotalCount(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [page, rowsPerPage, searchQuery, selectedDepartment, selectedStatus]);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Delete team member
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const response = await fetch(`/api/team/members?id=${memberToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTeamMembers(); // Refresh list
        setDeleteDialogOpen(false);
        setMemberToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      active: { color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
      away: { color: 'warning', icon: <CalendarIcon fontSize="small" /> },
      offline: { color: 'default', icon: <PeopleIcon fontSize="small" /> },
      on_leave: { color: 'info', icon: <CalendarIcon fontSize="small" /> },
    }[status] || { color: 'default', icon: null };

    return (
      <Chip
        // icon={config.icon}
        label={status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        color={config.color as any}
        size="small"
        variant="outlined"
      />
    );
  };

  // Performance indicator
  const PerformanceIndicator = ({ performance }: { performance: number }) => {
    const getColor = () => {
      if (performance >= 90) return 'success';
      if (performance >= 80) return 'warning';
      if (performance >= 70) return 'info';
      return 'error';
    };

    const getGrade = (score: number) => {
      if (score >= 90) return 'A';
      if (score >= 80) return 'B';
      if (score >= 70) return 'C';
      if (score >= 60) return 'D';
      return 'F';
    };

    return (
      <Box sx={{ minWidth: 120 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <LinearProgress 
            variant="determinate" 
            value={performance} 
            color={getColor()}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {performance}%
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Grade: {getGrade(performance)}
        </Typography>
      </Box>
    );
  };

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'Human Resources' },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'away', label: 'Away' },
    { value: 'offline', label: 'Offline' },
    { value: 'on_leave', label: 'On Leave' },
  ];

  return (
    <MainLayout title="Team Members">
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
            <Typography color="text.primary">Members</Typography>
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
                Team Members
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your team members and their project assignments
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              component={Link}
              href="/team/members/add"
            >
              Add Team Member
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Members
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {teamMembers.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
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
                    {teamMembers.filter(m => m.status === 'active').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg. Performance
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {teamMembers.length > 0 
                      ? Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length)
                      : 0}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <StarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Tasks
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <AssignmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Filters and Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  label="Department"
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card>
          {loading ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">Loading team members...</Typography>
            </Box>
          ) : teamMembers.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No team members found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Add your first team member to get started
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/team/members/add"
              >
                Add Team Member
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Role & Department</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Performance</TableCell>
                      <TableCell>Assigned Projects</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {member.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>
                                {member.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <EmailIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {member.email}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <CalendarIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                  Joined {new Date(member.joinDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <WorkIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={500}>
                              {member.role}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {member.department}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.tasksCompleted} tasks completed
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={member.status} />
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                            Last active: {new Date(member.lastActive).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <PerformanceIndicator performance={member.performance} />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={1}>
                            <Typography variant="body2">
                              <strong>{member.assignedProjectsCount}</strong> projects •{' '}
                              <strong>{member.assignedTasksCount}</strong> tasks
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {member.assignedProjects.slice(0, 3).map((project) => (
                                <Chip
                                  key={project._id}
                                  label={project.name.length > 15 
                                    ? `${project.name.substring(0, 15)}...` 
                                    : project.name}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                              {member.assignedProjects.length > 3 && (
                                <Typography variant="caption" color="text.secondary">
                                  +{member.assignedProjects.length - 3} more
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton
                                component={Link}
                                href={`/team/members/${member._id}`}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setMemberToDelete(member._id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Assign to Projects">
                              <IconButton
                                component={Link}
                                href={`/team/members/${member._id}/assign`}
                                size="small"
                              >
                                <AssignmentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
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
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Remove Team Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this team member? They will be unassigned from all projects and tasks.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteMember} 
            color="error"
            variant="contained"
          >
            Remove Member
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}