import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ShowChart, TrendingUp } from '@mui/icons-material';
import { BarChartComponent } from '@/components/admin/charts/BarChartComponent';

interface RevenueTrend {
  month: string;
  revenue: number;
  newUsers: number;
}

interface PlanDistribution {
  name: string;
  users: number;
  revenue: number;
}

interface RevenueInsightsProps {
  revenueTrend: RevenueTrend[];
  planDistribution: PlanDistribution[];
}

export const RevenueInsights: React.FC<RevenueInsightsProps> = ({
  revenueTrend,
  planDistribution,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total revenue
  const totalRevenue = revenueTrend.reduce((sum, month) => sum + month.revenue, 0);
  
  // Calculate revenue by plan
  const revenueByPlan = planDistribution.reduce((acc, plan) => {
    acc[plan.name] = plan.revenue;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Revenue Trend Chart */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <ShowChart color="primary" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Revenue Trend
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 6 months performance
              </Typography>
            </Box>
          </Box>
          
          <BarChartComponent
            data={revenueTrend}
            dataKeys={[
              { key: 'revenue', name: 'Revenue', color: '#1976d2' },
              { key: 'newUsers', name: 'New Users', color: '#2e7d32' },
            ]}
            height={200}
            xAxisKey="month"
            showLegend
            showTooltip
          />
          
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Revenue (6 months)
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatCurrency(totalRevenue)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Revenue by Plan */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TrendingUp color="primary" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Revenue by Plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contribution breakdown
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(revenueByPlan).map(([plan, revenue]) => (
              <Box
                key={plan}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography variant="body2">{plan.toUpperCase()}</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(revenue)}
                </Typography>
              </Box>
            ))}
            
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                TOTAL
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {formatCurrency(Object.values(revenueByPlan).reduce((a, b) => a + b, 0))}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};