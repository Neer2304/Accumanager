// app/(pages)/team-dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person,
  Assignment,
  CheckCircle,
  TrendingUp,
  Add,
  Refresh,
  Edit,
  Visibility,
  BarChart,
  AssignmentTurnedIn,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface EmployeeTask {
  _id: string;
  title: string;
  description: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  category: string;
  projectName: string;
  assignedAt: string;
  updates: any[];
}

interface EmployeeData {
  _id: string;
  name: string;
  role: string;
  department: string;
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  recentTasks: EmployeeTask[];
}

interface DashboardSummary {
  totalEmployees: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export default function TeamDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  });
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Dialogs
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [selectedTask, setSelectedTask] = useState<EmployeeTask | null>(null);
  
  // Assign task form
  const [assignForm, setAssignForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedHours: 8,
    priority: 'medium' as const,
    category: 'daily' as const,
  });

  // Fetch employee data for dropdown
  const [availableEmployees, setAvailableEmployees] = useState<Array<{
    _id: string;
    name: string;
    role: string;
  }>>([]);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch('/api/attendance');
      if (response.ok) {
        const data = await response.json();
        const employeesList = Array.isArray(data) ? data.map((emp: any) => ({
          _id: emp._id,
          name: emp.name || 'Unknown Employee',
          role: emp.role || 'Employee'
        })) : [];
        setAvailableEmployees(employeesList);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks/manager');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      
      // Set summary from API or use default
      setSummary(data.summary || {
        totalEmployees: 0,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        completionRate: 0
      });
      
      // Process employees data safely
      const employeesData = Array.isArray(data.employees) ? data.employees : [];
      const safeEmployees = employeesData.map((emp: any) => ({
        _id: emp._id || '',
        name: emp.name || 'Unknown Employee',
        role: emp.role || 'Employee',
        department: emp.department || 'General',
        stats: {
          totalTasks: emp.stats?.totalTasks || 0,
          completedTasks: emp.stats?.completedTasks || 0,
          inProgressTasks: emp.stats?.inProgressTasks || 0,
          pendingTasks: emp.stats?.pendingTasks || 0,
          overdueTasks: emp.stats?.overdueTasks || 0,
        },
        recentTasks: Array.isArray(emp.recentTasks) ? emp.recentTasks : []
      }));
      
      setEmployees(safeEmployees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchEmployeeData();
  }, []);

  const handleAssignTask = async () => {
    try {
      if (!assignForm.title.trim() || !assignForm.assignedTo) {
        setError('Please fill in all required fields');
        return;
      }

      const response = await fetch('/api/tasks/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assignForm,
          dueDate: assignForm.dueDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign task');
      }

      setAssignDialogOpen(false);
      setAssignForm({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
        priority: 'medium',
        category: 'daily',
      });
      
      fetchDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign task');
    }
  };

  const getStatusColor = (status: EmployeeTask['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'assigned': return 'warning';
      case 'rejected': return 'error';
      case 'on_hold': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: EmployeeTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getEmployeeTasks = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/tasks/employee/${employeeId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedEmployee({
          _id: employeeId,
          name: data.employee?.name || 'Unknown Employee',
          role: data.employee?.role || 'Employee',
          department: data.employee?.department || 'General',
          stats: {
            totalTasks: data.stats?.totalTasks || 0,
            completedTasks: data.stats?.completedTasks || 0,
            inProgressTasks: data.stats?.inProgressTasks || 0,
            pendingTasks: data.stats?.pendingTasks || 0,
            overdueTasks: data.stats?.overdueTasks || 0,
          },
          recentTasks: Array.isArray(data.tasks) ? data.tasks : []
        });
        setViewDialogOpen(true);
      }
    } catch (err) {
      console.error('Error fetching employee tasks:', err);
    }
  };

  // Calculate overall stats
  const calculateOverallStats = () => {
    if (employees.length === 0) return summary;

    const totalTasks = employees.reduce((sum, emp) => sum + (emp.stats?.totalTasks || 0), 0);
    const completedTasks = employees.reduce((sum, emp) => sum + (emp.stats?.completedTasks || 0), 0);
    const overdueTasks = employees.reduce((sum, emp) => sum + (emp.stats?.overdueTasks || 0), 0);
    
    return {
      totalEmployees: employees.length,
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const currentStats = calculateOverallStats();

  if (loading) {
    return (
      <MainLayout title="Team Dashboard">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Team Dashboard">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
          
          {/* Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                  👥 Team Work Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Assign tasks, track progress, and monitor team performance
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAssignDialogOpen(true)}
                >
                  Assign New Task
                </Button>
                <Tooltip title="Refresh data">
                  <IconButton onClick={fetchDashboardData}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Summary Stats - Using flexbox instead of Grid */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 2,
              '& > *': { 
                flex: '1 1 calc(25% - 16px)',
                minWidth: 200 
              }
            }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">{currentStats.totalEmployees}</Typography>
                      <Typography variant="body2" color="text.secondary">Team Members</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <Assignment />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">{currentStats.totalTasks}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">{currentStats.completedTasks}</Typography>
                      <Typography variant="body2" color="text.secondary">Completed</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="h4">{currentStats.completionRate}%</Typography>
                      <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
              <Tab icon={<Person />} label="Team Overview" />
              <Tab icon={<AssignmentTurnedIn />} label="Task Management" />
              <Tab icon={<BarChart />} label="Performance" />
            </Tabs>
          </Box>

          {/* Team Overview Tab */}
          {selectedTab === 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 3,
              '& > *': { 
                flex: '1 1 calc(50% - 12px)',
                minWidth: 300 
              }
            }}>
              {employees.map((employee) => (
                <Card key={employee._id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                          {employee.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.role} • {employee.department}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              size="small"
                              label={`${employee.stats.completedTasks}/${employee.stats.totalTasks} tasks`}
                              color="success"
                              variant="outlined"
                            />
                            {employee.stats.overdueTasks > 0 && (
                              <Chip
                                size="small"
                                label={`${employee.stats.overdueTasks} overdue`}
                                color="error"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => getEmployeeTasks(employee._id)}
                      >
                        View Tasks
                      </Button>
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {employee.stats.totalTasks > 0 
                            ? Math.round((employee.stats.completedTasks / employee.stats.totalTasks) * 100)
                            : 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={employee.stats.totalTasks > 0 
                          ? (employee.stats.completedTasks / employee.stats.totalTasks) * 100
                          : 0
                        }
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    {/* Recent tasks */}
                    <Typography variant="subtitle2" gutterBottom>
                      Recent Tasks
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {employee.recentTasks.map((task) => (
                        <Box
                          key={task._id}
                          sx={{
                            p: 1,
                            mb: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                              {task.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={task.status.replace('_', ' ')}
                              color={getStatusColor(task.status)}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {task.progress}% complete
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      {employee.recentTasks.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          No tasks assigned
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {employees.length === 0 && (
                <Card sx={{ width: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Employees Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Add employees first to start assigning tasks.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => window.open('/attendance', '_blank')}
                    >
                      Go to Employee Management
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* Task Management Tab */}
          {selectedTab === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  All Tasks Overview
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employees.flatMap(emp => 
                        emp.recentTasks.map(task => (
                          <TableRow key={task._id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {task.title}
                              </Typography>
                              {task.projectName && (
                                <Typography variant="caption" color="text.secondary">
                                  Project: {task.projectName}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={task.status.replace('_', ' ')}
                                color={getStatusColor(task.status)}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: '100%', maxWidth: 100 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={task.progress}
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                </Box>
                                <Typography variant="body2">{task.progress}%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={task.priority}
                                color={getPriorityColor(task.priority)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color={
                                  new Date(task.dueDate) < new Date() && task.status !== 'completed'
                                    ? 'error.main'
                                    : 'text.secondary'
                                }>
                                  {new Date(task.dueDate) < new Date() && task.status !== 'completed'
                                    ? 'Overdue'
                                    : 'Due'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => {
                                  setSelectedTask(task);
                                  // You can add an edit dialog here
                                }}
                              >
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      {employees.every(emp => emp.recentTasks.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No tasks found. Start by assigning tasks to your team.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance Tab */}
          {selectedTab === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Performance Summary
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell align="center">Total Tasks</TableCell>
                        <TableCell align="center">Completed</TableCell>
                        <TableCell align="center">In Progress</TableCell>
                        <TableCell align="center">Overdue</TableCell>
                        <TableCell align="center">Completion Rate</TableCell>
                        <TableCell align="center">Avg. Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employees.map((employee) => {
                        const avgProgress = employee.recentTasks.length > 0
                          ? Math.round(
                              employee.recentTasks.reduce((sum, task) => sum + task.progress, 0) /
                              employee.recentTasks.length
                            )
                          : 0;

                        return (
                          <TableRow key={employee._id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                  {employee.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {employee.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {employee.role}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="bold">
                                {employee.stats.totalTasks}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={employee.stats.completedTasks}
                                color="success"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={employee.stats.inProgressTasks}
                                color="info"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              {employee.stats.overdueTasks > 0 ? (
                                <Chip
                                  size="small"
                                  label={employee.stats.overdueTasks}
                                  color="error"
                                />
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  0
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={employee.stats.totalTasks > 0
                                    ? (employee.stats.completedTasks / employee.stats.totalTasks) * 100
                                    : 0
                                  }
                                  sx={{ width: 80, height: 8, borderRadius: 4 }}
                                />
                                <Typography variant="body2">
                                  {employee.stats.totalTasks > 0
                                    ? Math.round((employee.stats.completedTasks / employee.stats.totalTasks) * 100)
                                    : 0}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="bold" color={
                                avgProgress >= 80 ? 'success.main' :
                                avgProgress >= 50 ? 'warning.main' :
                                'error.main'
                              }>
                                {avgProgress}%
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {employees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No employee data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Assign Task Dialog */}
        <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Task Title *"
                value={assignForm.title}
                onChange={(e) => setAssignForm({...assignForm, title: e.target.value})}
                fullWidth
                required
              />
              
              <TextField
                label="Description"
                value={assignForm.description}
                onChange={(e) => setAssignForm({...assignForm, description: e.target.value})}
                multiline
                rows={3}
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Assign To *</InputLabel>
                <Select
                  value={assignForm.assignedTo}
                  onChange={(e) => setAssignForm({...assignForm, assignedTo: e.target.value})}
                  label="Assign To *"
                  required
                >
                  {availableEmployees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name} ({emp.role})
                    </MenuItem>
                  ))}
                  {availableEmployees.length === 0 && (
                    <MenuItem disabled>
                      No employees available. Add employees first.
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              
              <DatePicker
                label="Due Date *"
                value={assignForm.dueDate}
                onChange={(date) => date && setAssignForm({...assignForm, dueDate: date})}
                slotProps={{ textField: { fullWidth: true } }}
              />
              
              <TextField
                label="Estimated Hours"
                type="number"
                value={assignForm.estimatedHours}
                onChange={(e) => setAssignForm({...assignForm, estimatedHours: Number(e.target.value) || 0})}
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={assignForm.priority}
                  onChange={(e) => setAssignForm({...assignForm, priority: e.target.value as any})}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={assignForm.category}
                  onChange={(e) => setAssignForm({...assignForm, category: e.target.value as any})}
                  label="Category"
                >
                  <MenuItem value="daily">Daily Work</MenuItem>
                  <MenuItem value="project">Project Task</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleAssignTask}
              disabled={!assignForm.title || !assignForm.assignedTo}
            >
              Assign Task
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Employee Tasks Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          {selectedEmployee && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {selectedEmployee.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedEmployee.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEmployee.role} • {selectedEmployee.department}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  {/* Stats cards using flexbox */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 2,
                    '& > *': { 
                      flex: '1 1 calc(25% - 16px)',
                      minWidth: 120 
                    }
                  }}>
                    <Card sx={{ bgcolor: 'action.hover' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary.main">
                          {selectedEmployee.stats.totalTasks}
                        </Typography>
                        <Typography variant="caption">Total Tasks</Typography>
                      </CardContent>
                    </Card>
                    
                    <Card sx={{ bgcolor: 'success.light' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="success.main">
                          {selectedEmployee.stats.completedTasks}
                        </Typography>
                        <Typography variant="caption">Completed</Typography>
                      </CardContent>
                    </Card>
                    
                    <Card sx={{ bgcolor: 'info.light' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="info.main">
                          {selectedEmployee.stats.inProgressTasks}
                        </Typography>
                        <Typography variant="caption">In Progress</Typography>
                      </CardContent>
                    </Card>
                    
                    <Card sx={{ bgcolor: 'warning.light' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="warning.main">
                          {selectedEmployee.stats.overdueTasks}
                        </Typography>
                        <Typography variant="caption">Overdue</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  All Tasks
                </Typography>
                {selectedEmployee.recentTasks.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Task</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Progress</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Hours</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedEmployee.recentTasks.map((task) => (
                          <TableRow key={task._id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {task.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {task.description?.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={task.status}
                                color={getStatusColor(task.status)}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={task.progress}
                                  sx={{ width: 60, height: 6, borderRadius: 3 }}
                                />
                                <Typography variant="body2">{task.progress}%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </Typography>
                              {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                                <Typography variant="caption" color="error">
                                  Overdue
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {task.actualHours}/{task.estimatedHours}h
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No tasks assigned to this employee
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setAssignForm({
                      ...assignForm,
                      assignedTo: selectedEmployee._id
                    });
                    setViewDialogOpen(false);
                    setAssignDialogOpen(true);
                  }}
                >
                  Assign New Task
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </LocalizationProvider>
    </MainLayout>
  );
}