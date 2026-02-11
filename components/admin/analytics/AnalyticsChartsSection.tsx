import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyData {
  month: string;
  revenue: number;
  users: number;
  payments: number;
  activeUsers?: number;
  uniqueUsers?: number;
}

interface PlanDistribution {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsChartsSectionProps {
  monthlyData: MonthlyData[];
  planDistribution?: PlanDistribution[];
  showPlanDistribution?: boolean;
  showUserGrowth?: boolean;
  darkMode?: boolean;
}

export const AnalyticsChartsSection: React.FC<AnalyticsChartsSectionProps> = ({
  monthlyData,
  planDistribution = [],
  showPlanDistribution = false,
  showUserGrowth = false,
  darkMode = false,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            p: 2,
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'} gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: entry.color,
                  }}
                />
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  {entry.name}:
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                {entry.name.toLowerCase().includes('revenue')
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  const DonutChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = planDistribution.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <Box
          sx={{
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            p: 2,
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'} gutterBottom>
            {data.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: data.color,
              }}
            />
            <Box>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Users:
              </Typography>
              <Typography variant="body1" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                {data.value.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ mt: 1, display: 'block' }}>
            {percentage}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (showPlanDistribution) {
    const totalUsers = planDistribution.reduce((sum, item) => sum + item.value, 0);

    return (
      <Card sx={{ 
        height: '100%',
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
      }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
            Plan Distribution
          </Typography>
          <Box sx={{ height: 300, position: 'relative' }}>
            {planDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      labelLine={false}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<DonutChartTooltip />} />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value, entry) => (
                        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                          {value}
                        </Typography>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center total value */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                    {totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Total Users
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  No plan distribution data
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Plan breakdown below chart */}
          {planDistribution.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {planDistribution.map((plan, index) => {
                const percentage = ((plan.value / totalUsers) * 100).toFixed(1);
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '8px',
                      backgroundColor: darkMode ? 
                        `${plan.color}20` : 
                        `${plan.color}15`,
                      border: `1px solid ${darkMode ? 
                        `${plan.color}40` : 
                        `${plan.color}30`}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: plan.color,
                      }}
                    />
                    <Typography variant="caption" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                      {plan.name}: {plan.value} ({percentage}%)
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  if (showUserGrowth) {
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
            User Growth (Last 6 Months)
          </Typography>
          <Box sx={{ height: 300 }}>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#3c4043' : '#f0f0f0'} />
                  <XAxis 
                    dataKey="month" 
                    stroke={darkMode ? '#9aa0a6' : '#666666'} 
                  />
                  <YAxis 
                    stroke={darkMode ? '#9aa0a6' : '#666666'} 
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="users" 
                    fill={darkMode ? '#34a853' : '#34a853'} 
                    name="New Users" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  No user growth data available
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Default: Revenue Trends Chart
  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
          Revenue Trends (Last 6 Months)
        </Typography>
        <Box sx={{ height: 300 }}>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#3c4043' : '#f0f0f0'} />
                <XAxis 
                  dataKey="month" 
                  stroke={darkMode ? '#9aa0a6' : '#666666'} 
                />
                <YAxis 
                  stroke={darkMode ? '#9aa0a6' : '#666666'} 
                  tickFormatter={(value) => `₹${value}`} 
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={darkMode ? '#8ab4f8' : '#1a73e8'} 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
                No revenue data available
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};