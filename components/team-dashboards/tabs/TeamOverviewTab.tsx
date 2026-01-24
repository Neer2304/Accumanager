// components/team-dashboard/tabs/TeamOverviewTab.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import {
  Person,
  Visibility,
  CheckCircle,
  Warning,
  Schedule,
  TrendingUp,
  MoreVert,
  AccessTime,
  Task
} from '@mui/icons-material';
import { EmployeeData } from '../types';
import { getStatusColor, calculateOverallStats } from '../utils';

interface TeamOverviewTabProps {
  employees: EmployeeData[];
  isDemoMode: boolean;
  onViewTasks: (employeeId: string) => void;
  onAssignTask?: (employeeId: string) => void;
}

export const TeamOverviewTab = ({ 
  employees, 
  isDemoMode, 
  onViewTasks,
  onAssignTask 
}: TeamOverviewTabProps) => {
  const theme = useTheme();
  const stats = calculateOverallStats(employees);

  const getProductivityColor = (progress: number) => {
    if (progress > 80) return 'success';
    if (progress > 60) return 'warning';
    return 'error';
  };

  const getTaskStatusSummary = (employee: EmployeeData) => {
    const tasks = employee.recentTasks.slice(0, 3); // Show only 3 recent tasks
    if (tasks.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No tasks assigned
          </Typography>
        </Box>
      );
    }

    return tasks.map((task) => {
      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
      
      return (
        <Box
          key={task._id}
          sx={{
            p: 1.5,
            mb: 1,
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.3),
            background: alpha(theme.palette.background.paper, 0.5),
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderColor: alpha(theme.palette.primary.main, 0.2),
              transform: 'translateX(4px)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {task.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime fontSize="inherit" />
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {isOverdue && (
                <Tooltip title="Overdue">
                  <Warning color="error" fontSize="small" />
                </Tooltip>
              )}
              <Chip
                size="small"
                label={task.status.replace('_', ' ')}
                color={getStatusColor(task.status) as any}
                sx={{ height: 22, fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={task.progress}
                color={getProductivityColor(task.progress)}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
            <Typography variant="caption" fontWeight="bold">
              {task.progress}%
            </Typography>
          </Box>
        </Box>
      );
    });
  };

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)'
      },
      gap: 3
    }}>
      {employees.map((employee) => {
        const progressPercentage = employee.stats.totalTasks > 0
          ? Math.round((employee.stats.completedTasks / employee.stats.totalTasks) * 100)
          : 0;

        return (
          <Card 
            key={employee._id} 
            sx={{ 
              borderRadius: 3,
              overflow: 'visible',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.1)}`
              }
            }}
          >
            {/* Employee status indicator */}
            <Box sx={{
              position: 'absolute',
              top: -8,
              right: 16,
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: progressPercentage > 80 ? theme.palette.success.main :
                       progressPercentage > 50 ? theme.palette.warning.main : theme.palette.error.main,
              border: `2px solid ${theme.palette.background.paper}`,
              animation: progressPercentage > 80 ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 }
              }
            }} />

            <CardContent>
              {/* Employee Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
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
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {employee.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employee.role}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {employee.department}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => onViewTasks(employee._id)}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  View Tasks
                </Button>
              </Box>

              {/* Progress Stats */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {progressPercentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                    }
                  }}
                />
              </Box>

              {/* Task Stats */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: 1,
                mb: 3,
                textAlign: 'center'
              }}>
                <Box>
                  <Typography variant="h6" color="success.main">
                    {employee.stats.completedTasks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Done</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="warning.main">
                    {employee.stats.inProgressTasks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Active</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="error.main">
                    {employee.stats.overdueTasks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Overdue</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    {employee.stats.totalTasks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                </Box>
              </Box>

              {/* Recent Tasks */}
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Recent Tasks
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
                {getTaskStatusSummary(employee)}
              </Box>

              {/* Quick Actions */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 3,
                pt: 2,
                borderTop: `1px dashed ${alpha(theme.palette.divider, 0.5)}`
              }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    icon={<TrendingUp />}
                    label={`${employee.stats.completedTasks}/${employee.stats.totalTasks}`}
                    size="small"
                    variant="outlined"
                  />
                  {employee.stats.overdueTasks > 0 && (
                    <Chip
                      icon={<Warning />}
                      label={`${employee.stats.overdueTasks} overdue`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  )}
                </Box>
                {onAssignTask && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onAssignTask(employee._id)}
                    sx={{ borderRadius: 2 }}
                  >
                    Assign Task
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
      
      {employees.length === 0 && !isDemoMode && (
        <Card sx={{ gridColumn: '1 / -1' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              margin: '0 auto 20px'
            }}>
              <Person sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Team Members Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, margin: '0 auto' }}>
              Add employees to your team to start tracking their tasks and productivity.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.open('/attendance', '_blank')}
              sx={{ borderRadius: 2 }}
            >
              Go to Employee Management
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};