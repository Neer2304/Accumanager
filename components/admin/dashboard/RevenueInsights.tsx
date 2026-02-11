// components/admin/dashboard/RevenueInsights.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, alpha, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

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
      <Card sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: 'none',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: alpha('#1a73e8', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a73e8',
            }}>
              <ShowChart />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
              }}>
                Revenue Trend
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}>
                Last 6 months performance
              </Typography>
            </Box>
          </Box>
          
          <BarChartComponent
            data={revenueTrend}
            dataKeys={[
              { key: 'revenue', name: 'Revenue', color: '#1a73e8' },
              { key: 'newUsers', name: 'New Users', color: '#34a853' },
            ]}
            height={220}
            xAxisKey="month"
            showLegend
            showTooltip
          />
          
          <Box sx={{ 
            mt: 3, 
            pt: 2, 
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Box>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mb: 0.5,
              }}>
                Total Revenue (6 months)
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
              }}>
                {formatCurrency(totalRevenue)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Revenue by Plan */}
      <Card sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: 'none',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: alpha('#34a853', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34a853',
            }}>
              <TrendingUp />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
              }}>
                Revenue by Plan
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}>
                Contribution breakdown
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(revenueByPlan).map(([plan, revenue], index) => (
              <Box
                key={plan}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '10px',
                  backgroundColor: index % 2 === 0 
                    ? (darkMode ? alpha('#ffffff', 0.03) : alpha('#000000', 0.02)) 
                    : 'transparent',
                }}
              >
                <Typography variant="body2" sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                }}>
                  {plan.toUpperCase()}
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 500,
                  color: darkMode ? '#e8eaed' : '#202124',
                }}>
                  {formatCurrency(revenue)}
                </Typography>
              </Box>
            ))}
            
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 600,
                color: darkMode ? '#e8eaed' : '#202124',
              }}>
                TOTAL
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 600,
                color: '#1a73e8',
              }}>
                {formatCurrency(Object.values(revenueByPlan).reduce((a, b) => a + b, 0))}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};