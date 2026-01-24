// components/team-dashboard/SummaryStats.tsx
import { Card, CardContent, Typography, Box, Avatar, Tooltip, useTheme, alpha } from '@mui/material';
import { Person, Assignment, CheckCircle, TrendingUp, Speed, Groups, Task, Timer } from '@mui/icons-material';
import { DashboardSummary, EmployeeData } from './types';

interface SummaryStatsProps {
  summary: DashboardSummary;
  employees: EmployeeData[];
}

export const SummaryStats = ({ summary, employees }: SummaryStatsProps) => {
  const theme = useTheme();
  
  const currentStats = {
    totalEmployees: employees.length,
    totalTasks: employees.reduce((sum, emp) => sum + (emp.stats?.totalTasks || 0), 0),
    completedTasks: employees.reduce((sum, emp) => sum + (emp.stats?.completedTasks || 0), 0),
    overdueTasks: employees.reduce((sum, emp) => sum + (emp.stats?.overdueTasks || 0), 0),
    completionRate: employees.length > 0 
      ? Math.round(
          (employees.reduce((sum, emp) => sum + (emp.stats?.completedTasks || 0), 0) / 
           Math.max(1, employees.reduce((sum, emp) => sum + (emp.stats?.totalTasks || 0), 0))) * 100
        )
      : 0
  };

  const stats = [
    {
      title: 'Team Members',
      value: currentStats.totalEmployees,
      icon: <Groups />,
      color: theme.palette.primary.main,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Total active team members',
      change: '+2 this month',
      trend: 'up'
    },
    {
      title: 'Total Tasks',
      value: currentStats.totalTasks,
      icon: <Assignment />,
      color: theme.palette.info.main,
      gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      description: 'Tasks across all projects',
      change: currentStats.totalTasks > 0 ? `${Math.round(currentStats.totalTasks / currentStats.totalEmployees)} avg/employee` : 'No tasks',
      trend: 'neutral'
    },
    {
      title: 'Completed',
      value: currentStats.completedTasks,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      description: 'Successfully completed tasks',
      change: `${currentStats.completionRate}% completion rate`,
      trend: 'up'
    },
    {
      title: 'Productivity',
      value: `${currentStats.completionRate}%`,
      icon: <TrendingUp />,
      color: theme.palette.warning.main,
      gradient: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
      description: 'Overall team productivity score',
      change: currentStats.completionRate > 70 ? 'Excellent' : 'Needs improvement',
      trend: currentStats.completionRate > 70 ? 'up' : 'down'
    }
  ];

  // Calculate additional metrics
  const averageProgress = employees.length > 0
    ? Math.round(employees.reduce((sum, emp) => {
        const empProgress = emp.stats.totalTasks > 0
          ? (emp.stats.completedTasks / emp.stats.totalTasks) * 100
          : 0;
        return sum + empProgress;
      }, 0) / employees.length)
    : 0;

  const activeEmployees = employees.filter(emp => 
    emp.recentTasks.some(task => task.status === 'in_progress' || task.status === 'assigned')
  ).length;

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)'
      },
      gap: 3,
      mb: 4
    }}>
      {stats.map((stat, index) => (
        <Tooltip key={index} title={stat.description} arrow>
          <Card sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 24px ${alpha(stat.color, 0.15)}`
            }
          }}>
            {/* Background gradient */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              opacity: 0.05,
              background: stat.gradient
            }} />
            
            {/* Top accent bar */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: stat.gradient
            }} />
            
            <CardContent sx={{ 
              position: 'relative',
              p: 3,
              '&:last-child': { pb: 3 }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: stat.gradient,
                  color: 'white',
                  boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`
                }}>
                  {stat.icon}
                </Box>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: stat.trend === 'up' ? 'success.main' : 
                           stat.trend === 'down' ? 'error.main' : 'text.secondary'
                  }}>
                    {stat.change}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {stat.title}
              </Typography>
              
              {/* Progress indicator for completion rate */}
              {stat.title === 'Productivity' && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ 
                    position: 'relative', 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: alpha(stat.color, 0.1),
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${currentStats.completionRate}%`,
                      background: stat.gradient,
                      borderRadius: 3,
                      transition: 'width 0.8s ease'
                    }} />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Tooltip>
      ))}
      
      {/* Additional Metrics Card */}
      <Card sx={{ 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: 'white',
        gridColumn: { xs: 'span 2', md: 'span 1' }
      }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ 
            width: 56, 
            height: 56, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.2)',
            margin: '0 auto 16px',
            backdropFilter: 'blur(10px)'
          }}>
            <Speed sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
            {averageProgress}%
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            Avg. Progress
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            mt: 2 
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{activeEmployees}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Active</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{currentStats.overdueTasks}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Overdue</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 2 }}>
            <Timer sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
            Updated in real-time
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};