import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Timeline, PieChart as PieChartIcon } from '@mui/icons-material';
import { LineChartComponent } from '@/components/admin/charts/LineChartComponent';
import { PieChartComponent } from '@/components/admin/charts/PieChartComponent';

interface DailyUsage {
  date: string;
  hours: number;
  activeUsers: number;
  sessions: number;
}

interface PlanDistribution {
  name: string;
  users: number;
  value: number;
  revenue: number;
  avgUsageHours: number;
}

interface UsageAnalyticsProps {
  dailyUsage: DailyUsage[];
  planDistribution: PlanDistribution[];
}

export const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({
  dailyUsage,
  planDistribution,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Daily Usage Chart */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Timeline color="primary" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Daily Usage Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Platform engagement metrics
              </Typography>
            </Box>
          </Box>
          
          <LineChartComponent
            data={dailyUsage}
            dataKeys={[
              { key: 'hours', name: 'Usage Hours', color: '#1976d2' },
              { key: 'activeUsers', name: 'Active Users', color: '#2e7d32' },
              { key: 'sessions', name: 'Sessions', color: '#ed6c02' },
            ]}
            height={350}
            xAxisKey="date"
            showLegend
          />
        </CardContent>
      </Card>

      {/* Plan Distribution Chart */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PieChartIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Plan Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User subscription breakdown
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1, height: 300 }}>
              <PieChartComponent
                data={planDistribution}
                dataKey="users"
                nameKey="name"
                colors={['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f']}
                showLabel
                labelType="percent"
              />
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {planDistribution.map((plan, index) => (
                <Box
                  key={plan.name}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 1,
                    bgcolor: index % 2 === 0 ? 'action.hover' : 'transparent',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="medium">
                    {plan.name.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {plan.users} users
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {plan.avgUsageHours.toFixed(1)}h avg
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};