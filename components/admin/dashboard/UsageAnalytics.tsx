// components/admin/dashboard/UsageAnalytics.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, alpha, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Daily Usage Chart */}
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
              <Timeline />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
              }}>
                Daily Usage Analytics
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}>
                Platform engagement metrics
              </Typography>
            </Box>
          </Box>
          
          <LineChartComponent
            data={dailyUsage}
            dataKeys={[
              { key: 'hours', name: 'Usage Hours', color: '#1a73e8' },
              { key: 'activeUsers', name: 'Active Users', color: '#34a853' },
              { key: 'sessions', name: 'Sessions', color: '#fbbc04' },
            ]}
            height={300}
            xAxisKey="date"
            showLegend
          />
        </CardContent>
      </Card>

      {/* Plan Distribution Chart */}
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
              <PieChartIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
              }}>
                Plan Distribution
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}>
                User subscription breakdown
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1, height: 280 }}>
              <PieChartComponent
                data={planDistribution}
                dataKey="users"
                nameKey="name"
                colors={['#1a73e8', '#34a853', '#fbbc04', '#8b5cf6', '#ea4335']}
                showLabel
                labelType="percent"
              />
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {planDistribution.map((plan, index) => (
                <Box
                  key={plan.name}
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
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}>
                    {plan.name.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}>
                      {plan.users} users
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 500,
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}>
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