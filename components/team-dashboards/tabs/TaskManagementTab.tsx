// components/team-dashboard/tabs/TaskManagementTab.tsx
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import {
  Edit,
  Add,
  Assignment,
  Warning,
  CheckCircle,
  Schedule,
  PriorityHigh,
  MoreVert
} from '@mui/icons-material';
import { EmployeeData } from '../types';
import { getStatusColor, getPriorityColor, isTaskOverdue } from '../utils';

interface TaskManagementTabProps {
  employees: EmployeeData[];
  isDemoMode: boolean;
  onAssignTask: () => void;
  onEditTask?: (taskId: string) => void;
}

export const TaskManagementTab = ({ 
  employees, 
  isDemoMode, 
  onAssignTask,
  onEditTask 
}: TaskManagementTabProps) => {
  const theme = useTheme();

  // Flatten all tasks from all employees
  const allTasks = employees.flatMap(emp => 
    emp.recentTasks.map(task => ({
      ...task,
      employeeName: emp.name,
      employeeId: emp._id
    }))
  );

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <PriorityHigh color="error" />;
      case 'high': return <PriorityHigh color="warning" />;
      case 'medium': return <PriorityHigh color="info" />;
      case 'low': return <PriorityHigh color="success" />;
      default: return <PriorityHigh color="disabled" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'in_progress': return <Schedule color="info" />;
      case 'assigned': return <Assignment color="warning" />;
      case 'rejected': return <Warning color="error" />;
      default: return <MoreVert color="disabled" />;
    }
  };

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              All Tasks Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and manage all team tasks in one place
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isDemoMode && (
              <Chip
                label={`${allTasks.length} sample tasks`}
                size="small"
                color="info"
                variant="outlined"
              />
            )}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAssignTask}
              sx={{ borderRadius: 2 }}
            >
              Assign New Task
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', pl: 3 }}>Task Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', pr: 3 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        margin: '0 auto 16px'
                      }}>
                        <Assignment sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Tasks Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, margin: '0 auto' }}>
                        Start by assigning tasks to your team members to track their progress.
                      </Typography>
                      {!isDemoMode && (
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={onAssignTask}
                          sx={{ borderRadius: 2 }}
                        >
                          Assign First Task
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                allTasks.map((task) => {
                  const overdue = isTaskOverdue(task.dueDate, task.status);
                  
                  return (
                    <TableRow 
                      key={task._id} 
                      hover
                      sx={{
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }
                      }}
                    >
                      <TableCell sx={{ pl: 3 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {task.title}
                          </Typography>
                          {task.projectName && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Assignment fontSize="inherit" />
                              Project: {task.projectName}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.employeeName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(task.status)}
                          label={task.status.replace('_', ' ')}
                          size="small"
                          color={getStatusColor(task.status) as any}
                          variant="filled"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 120 }}>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={task.progress}
                              color={
                                task.progress > 80 ? "success" :
                                task.progress > 50 ? "warning" : "primary"
                              }
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">
                            {task.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getPriorityIcon(task.priority)}
                          label={task.priority}
                          size="small"
                          color={getPriorityColor(task.priority) as any}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                          {overdue && (
                            <Chip
                              label="Overdue"
                              size="small"
                              color="error"
                              sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ pr: 3 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => onEditTask?.(task._id)}
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Footer */}
        {allTasks.length > 0 && (
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Tasks: <Typography component="span" fontWeight="bold">{allTasks.length}</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed: <Typography component="span" fontWeight="bold" color="success.main">
                  {allTasks.filter(t => t.status === 'completed').length}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue: <Typography component="span" fontWeight="bold" color="error.main">
                  {allTasks.filter(t => isTaskOverdue(t.dueDate, t.status)).length}
                </Typography>
              </Typography>
            </Box>
            <Button
              size="small"
              variant="text"
              onClick={onAssignTask}
            >
              + Add More Tasks
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};