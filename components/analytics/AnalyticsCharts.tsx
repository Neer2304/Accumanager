"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsChartsProps {
  monthlyData: Array<{
    month: string;
    revenue: number;
    sales: number;
    profit: number;
    invoices: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  darkMode?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  monthlyData,
  categoryData,
  darkMode = false,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        sx={{ 
          mb: 2,
          color: darkMode ? '#e8eaed' : '#202124',
        }}
      >
        Revenue & Sales Trend
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        height: { xs: 'auto', md: 350 }
      }}>
        {/* Revenue Chart */}
        <Card sx={{ 
          height: '100%',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              📈 Monthly Performance
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#3c4043' : '#f0f0f0'} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickMargin={5}
                  stroke={darkMode ? '#9aa0a6' : '#666'}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  stroke={darkMode ? '#9aa0a6' : '#666'}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue' || name === 'profit') {
                      return [`₹${Number(value).toLocaleString()}`, name];
                    }
                    return [value, name];
                  }}
                  contentStyle={{ 
                    fontSize: '0.875rem',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: '0.875rem',
                    paddingTop: 10
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Revenue"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Sales"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Chart */}
        <Card sx={{ 
          height: '100%',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              🥧 Revenue by Category
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                //   label={({ name, percent }) => 
                //     percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                //   }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    fontSize: '0.875rem',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};