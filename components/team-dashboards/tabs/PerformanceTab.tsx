// components/team-dashboard/tabs/PerformanceTab.tsx
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
  Avatar,
  LinearProgress,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Speed,
  Star,
  Timeline,
  Analytics,
  Person
} from '@mui/icons-material';
import { EmployeeData } from '../types';

interface PerformanceTabProps {
  employees: EmployeeData[];
  isDemoMode: boolean;
  onLoadDemo?: () => void;
}

export const PerformanceTab = ({ 
  employees, 
  isDemoMode, 
  onLoadDemo 
}: PerformanceTabProps) => {
  const theme = useTheme();

  const calculateMetrics = (employee: EmployeeData) => {
    const completedTasks = employee.stats.completedTasks || 0;
    const totalTasks = employee.stats.totalTasks || 0;
    
    // Completion rate
    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    // Average progress from recent tasks
    const avgProgress = employee.recentTasks.length > 0
      ? Math.round(
          employee.recentTasks.reduce((sum, task) => sum + task.progress, 0) /
          employee.recentTasks.length
        )
      : 0;

    // Productivity score (weighted average)
    const productivityScore = Math.round(
      (completionRate * 0.6) + (avgProgress * 0.4)
    );

    // Trend calculation (simplified)
    let trend: 'up' | 'down' | 'flat' = 'flat';
    if (productivityScore > 80) trend = 'up';
    else if (productivityScore < 50) trend = 'down';

    return {
      completionRate,
      avgProgress,
      productivityScore,
      trend
    };
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      case 'flat': return <TrendingFlat color="warning" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
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
              Team Performance Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed insights into individual and team productivity
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isDemoMode && (
              <Chip
                label="Based on sample data"
                size="small"
                color="info"
                variant="outlined"
              />
            )}
            <Button
              variant="outlined"
              startIcon={<Analytics />}
              onClick={() => window.print()}
              sx={{ borderRadius: 2 }}
            >
              Export Report
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', pl: 3 }}>Employee</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total Tasks</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Completed</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>In Progress</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Overdue</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Completion Rate</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg. Progress</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', pr: 3 }}>Performance Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length === 0 && !isDemoMode ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
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
                        <Person sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Performance Data
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, margin: '0 auto' }}>
                        Add team members and assign tasks to track their performance.
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={onLoadDemo}
                        sx={{ borderRadius: 2 }}
                      >
                        Load Demo Data
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => {
                  const metrics = calculateMetrics(employee);
                  
                  return (
                    <TableRow 
                      key={employee._id} 
                      hover
                      sx={{
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }
                      }}
                    >
                      <TableCell sx={{ pl: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: theme.palette.primary.main,
                              fontWeight: 'bold'
                            }}
                          >
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
                          label={employee.stats.completedTasks}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={employee.stats.inProgressTasks}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {employee.stats.overdueTasks > 0 ? (
                          <Chip
                            label={employee.stats.overdueTasks}
                            size="small"
                            color="error"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            0
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 140 }}>
                          <Box sx={{ width: 80 }}>
                            <LinearProgress
                              variant="determinate"
                              value={metrics.completionRate}
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                              }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">
                            {metrics.completionRate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          {getTrendIcon(metrics.trend)}
                          <Typography variant="body2" fontWeight="bold">
                            {metrics.avgProgress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ pr: 3 }}>
                        <Box sx={{ 
                          display: 'inline-flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          <Chip
                            icon={<Star />}
                            label={`${metrics.productivityScore}/100`}
                            size="small"
                            color={getPerformanceColor(metrics.productivityScore) as any}
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {getPerformanceLabel(metrics.productivityScore)}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Stats */}
        {employees.length > 0 && (
          <Box sx={{ 
            p: 3, 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {Math.round(employees.reduce((sum, emp) => {
                  const metrics = calculateMetrics(emp);
                  return sum + metrics.completionRate;
                }, 0) / employees.length)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">Avg. Completion</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {employees.filter(emp => emp.stats.overdueTasks === 0).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">On Schedule</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {employees.filter(emp => {
                  const metrics = calculateMetrics(emp);
                  return metrics.productivityScore >= 80;
                }).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">High Performers</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {Math.round(employees.reduce((sum, emp) => {
                  const metrics = calculateMetrics(emp);
                  return sum + metrics.avgProgress;
                }, 0) / employees.length)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">Avg. Progress</Typography>
            </Box>
          </Box>
        )}

        {/* Legend */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3,
          flexWrap: 'wrap',
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
            <Typography variant="caption">Excellent (90-100)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
            <Typography variant="caption">Good (70-89)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
            <Typography variant="caption">Needs Improvement (0-69)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Speed fontSize="small" color="action" />
            <Typography variant="caption">Performance Score = Completion Rate (60%) + Avg Progress (40%)</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};