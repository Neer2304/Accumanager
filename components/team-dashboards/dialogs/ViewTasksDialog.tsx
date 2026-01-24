// components/team-dashboard/dialogs/ViewTasksDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  Person,
  Assignment,
  CheckCircle,
  Warning,
  AccessTime,
  TrendingUp,
  Add,
  MoreVert
} from '@mui/icons-material';
import { EmployeeData } from '../types';
import { getStatusColor } from '../utils';

interface ViewTasksDialogProps {
  open: boolean;
  onClose: () => void;
  employee: EmployeeData | null;
  isDemoMode: boolean;
  onAssignTask?: (employeeId: string) => void;
}

export const ViewTasksDialog = ({
  open,
  onClose,
  employee,
  isDemoMode,
  onAssignTask
}: ViewTasksDialogProps) => {
  const theme = useTheme();

  if (!employee) return null;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTaskStatus = (task: any) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
    return { isOverdue };
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: theme.palette.primary.main,
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            {employee.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {employee.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employee.role} • {employee.department}
            </Typography>
          </Box>
          {isDemoMode && (
            <Chip 
              label="Demo Data" 
              size="small" 
              color="info" 
              variant="outlined" 
            />
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Stats Overview */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)'
            },
            gap: 2
          }}>
            <Card sx={{ 
              textAlign: 'center', 
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05)
            }}>
              <Typography variant="h4" color="primary.main">
                {employee.stats.totalTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">Total Tasks</Typography>
            </Card>
            
            <Card sx={{ 
              textAlign: 'center', 
              p: 2,
              bgcolor: alpha(theme.palette.success.main, 0.05)
            }}>
              <Typography variant="h4" color="success.main">
                {employee.stats.completedTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">Completed</Typography>
            </Card>
            
            <Card sx={{ 
              textAlign: 'center', 
              p: 2,
              bgcolor: alpha(theme.palette.info.main, 0.05)
            }}>
              <Typography variant="h4" color="info.main">
                {employee.stats.inProgressTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">In Progress</Typography>
            </Card>
            
            <Card sx={{ 
              textAlign: 'center', 
              p: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.05)
            }}>
              <Typography variant="h4" color="warning.main">
                {employee.stats.overdueTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">Overdue</Typography>
            </Card>
          </Box>
          
          {/* Progress Summary */}
          <Card sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Performance Summary
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={
                    employee.stats.totalTasks > 0
                      ? (employee.stats.completedTasks / employee.stats.totalTasks) * 100
                      : 0
                  }
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }}
                />
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {employee.stats.totalTasks > 0
                  ? Math.round((employee.stats.completedTasks / employee.stats.totalTasks) * 100)
                  : 0}% Complete
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Tasks List */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment />
          All Tasks ({employee.recentTasks.length})
        </Typography>
        
        {employee.recentTasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              No tasks assigned to this employee
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ 
            maxHeight: 400, 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee.recentTasks.map((task) => {
                  const { isOverdue } = getTaskStatus(task);
                  
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
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {task.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {task.description?.substring(0, 60)}...
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={task.status.replace('_', ' ')}
                          color={getStatusColor(task.status) as any}
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                          <Box sx={{ width: 60 }}>
                            <LinearProgress
                              variant="determinate"
                              value={task.progress}
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                              }}
                            />
                          </Box>
                          <Typography variant="body2">{task.progress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatTime(task.dueDate)}
                          </Typography>
                          {isOverdue && (
                            <Chip
                              label="Overdue"
                              size="small"
                              color="error"
                              sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.actualHours}/{task.estimatedHours}h
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
        {onAssignTask && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => onAssignTask(employee._id)}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a6499 100%)'
              }
            }}
          >
            Assign New Task
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};