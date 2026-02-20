// components/googleadminanalytics/components/AdminChartsSection.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { MonthlyData, PlanDistribution } from './types';

interface AdminChartsSectionProps {
  monthlyData: MonthlyData[];
  planDistribution?: PlanDistribution[];
  showPlanDistribution?: boolean;
  showUserGrowth?: boolean;
  darkMode: boolean;
}

export const AdminChartsSection: React.FC<AdminChartsSectionProps> = ({
  monthlyData,
  planDistribution = [],
  showPlanDistribution = false,
  showUserGrowth = false,
  darkMode
}) => {
  const theme = useTheme();
  
  const chartColors = {
    revenue: '#34a853',
    users: '#1a73e8',
    payments: '#fbbc04',
    activeUsers: '#8ab4f8',
    uniqueUsers: '#ea4335'
  };

  const pieColors = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#8ab4f8', '#5f6368'];

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '8px',
          p: 1.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: entry.color }} />
              <Typography variant="caption" color="text.secondary">
                {entry.name}: 
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {entry.name === 'Revenue' || entry.name === 'Total Revenue'
                  ? `₹${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (showPlanDistribution && planDistribution.length > 0) {
    return (
      <Card elevation={0} sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        height: '100%',
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Plan Distribution
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: darkMode ? '#9aa0a6' : '#5f6368', strokeWidth: 1 }}
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: darkMode ? '#e8eaed' : '#202124' }}
                  formatter={(value) => <span style={{ color: darkMode ? '#e8eaed' : '#202124' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (showUserGrowth) {
    return (
      <Card elevation={0} sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            User Growth
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.users} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColors.users} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#3c4043' : '#dadce0'} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  stroke={darkMode ? '#9aa0a6' : '#5f6368'}
                  tick={{ fill: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 12 }}
                />
                <YAxis 
                  stroke={darkMode ? '#9aa0a6' : '#5f6368'}
                  tick={{ fill: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 12 }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke={chartColors.users} 
                  fill="url(#userGradient)"
                  name="New Users"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke={chartColors.activeUsers} 
                  fill="none"
                  name="Active Users"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Default: Revenue Chart
  return (
    <Card elevation={0} sx={{
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      height: '100%',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Revenue & Payments
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={darkMode ? '#3c4043' : '#dadce0'} 
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke={darkMode ? '#9aa0a6' : '#5f6368'}
                tick={{ fill: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                stroke={darkMode ? '#9aa0a6' : '#5f6368'}
                tick={{ fill: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 12 }}
                tickFormatter={formatYAxis}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke={darkMode ? '#9aa0a6' : '#5f6368'}
                tick={{ fill: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 12 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: darkMode ? '#e8eaed' : '#202124' }}
                formatter={(value) => <span style={{ color: darkMode ? '#e8eaed' : '#202124' }}>{value}</span>}
              />
              <Bar 
                yAxisId="left"
                dataKey="revenue" 
                fill={chartColors.revenue} 
                name="Revenue"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar 
                yAxisId="right"
                dataKey="payments" 
                fill={chartColors.payments} 
                name="Payments"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};