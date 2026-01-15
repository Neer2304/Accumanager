import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  AttachMoney,
  Warning,
  Error,
  CheckCircle,
  Category,
  PieChart,
  Refresh,
  Download,
} from '@mui/icons-material';
import { MaterialStats as StatsType } from '../types/material.types';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface MaterialStatsProps {
  stats: StatsType | null;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export const MaterialStats: React.FC<MaterialStatsProps> = ({
  stats,
  loading = false,
  onRefresh,
  onExport,
}) => {
  const theme = useTheme();

  if (!stats) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No statistics available. Add some materials to see insights.
        </Typography>
      </Paper>
    );
  }

  const { overview, categories, status, mostUsed, recentActivity } = stats;

  // Category distribution chart
  const categoryChartData = {
    labels: categories.map(c => c.category),
    datasets: [
      {
        data: categories.map(c => c.count),
        backgroundColor: [
          '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
          '#6366f1', '#ef4444', '#ec4899', '#6b7280',
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  // Status distribution chart
  const statusChartData = {
    labels: status.map(s => s.status.replace('-', ' ').toUpperCase()),
    datasets: [
      {
        label: 'Materials',
        data: status.map(s => s.count),
        backgroundColor: [
          alpha(theme.palette.success.main, 0.7),
          alpha(theme.palette.warning.main, 0.7),
          alpha(theme.palette.error.main, 0.7),
          alpha(theme.palette.grey[500], 0.7),
        ],
        borderColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
          theme.palette.grey[500],
        ],
        borderWidth: 1,
      },
    ],
  };

  // Recent activity chart
  const activityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Usage',
        data: [12, 19, 8, 15, 12, 10, 7],
        backgroundColor: alpha(theme.palette.error.main, 0.5),
        borderColor: theme.palette.error.main,
        borderWidth: 2,
      },
      {
        label: 'Restock',
        data: [5, 8, 12, 6, 9, 4, 3],
        backgroundColor: alpha(theme.palette.success.main, 0.5),
        borderColor: theme.palette.success.main,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Material Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Insights and trends for your inventory management
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <Tooltip title="Refresh statistics">
                <IconButton
                  onClick={onRefresh}
                  disabled={loading}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    color: theme.palette.primary.main,
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
            
            {onExport && (
              <Tooltip title="Export statistics">
                <IconButton
                  onClick={onExport}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                    color: theme.palette.success.main,
                  }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Materials
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {overview.totalMaterials}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Inventory sx={{ color: theme.palette.primary.main }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Stock Value
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    ${overview.totalStockValue.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AttachMoney sx={{ color: theme.palette.success.main }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Low Stock
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {overview.lowStockCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {((overview.lowStockCount / overview.totalMaterials) * 100).toFixed(1)}% of total
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Warning sx={{ color: theme.palette.warning.main }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Out of Stock
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {overview.outOfStockCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {((overview.outOfStockCount / overview.totalMaterials) * 100).toFixed(1)}% of total
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Error sx={{ color: theme.palette.error.main }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Category Distribution
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <Doughnut data={categoryChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Status Distribution
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <Bar data={statusChartData} options={barChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Most Used Materials */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Most Used Materials
        </Typography>
        <Stack spacing={2}>
          {mostUsed.slice(0, 5).map((material, index) => (
            <Box
              key={material.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backgroundColor: index % 2 === 0 ? alpha(theme.palette.grey[50], 0.5) : 'transparent',
              }}
            >
              <Grid container alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {material.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {material.sku}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2">
                    Total Used: <strong>{material.totalUsed}</strong> {material.unit}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((material.totalUsed / Math.max(...mostUsed.map(m => m.totalUsed))) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.grey[300], 0.5),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Recent Activity
        </Typography>
        <Stack spacing={2}>
          {recentActivity.slice(0, 10).map((activity, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backgroundColor: activity.type === 'usage' 
                  ? alpha(theme.palette.error.main, 0.05)
                  : alpha(theme.palette.success.main, 0.05),
              }}
            >
              <Grid container alignItems="center">
                <Grid item xs={1}>
                  {activity.type === 'usage' ? (
                    <RemoveShoppingCart sx={{ color: theme.palette.error.main }} />
                  ) : (
                    <AddShoppingCart sx={{ color: theme.palette.success.main }} />
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {activity.materialName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.sku}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Chip
                    label={`${activity.quantity} ${activity.unit}`}
                    size="small"
                    color={activity.type === 'usage' ? 'error' : 'success'}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {activity.type === 'usage' 
                      ? `Used by ${activity.user}`
                      : `From ${activity.supplier}`
                    }
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.date).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};