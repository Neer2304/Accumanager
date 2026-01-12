import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface BarChartComponentProps {
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  height?: number;
  xAxisKey: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  stacked?: boolean;
  borderRadius?: number;
  barSize?: number;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  dataKeys,
  height = 300,
  xAxisKey,
  showLegend = false,
  showGrid = true,
  showTooltip = true,
  stacked = false,
  borderRadius = 4,
  barSize = 30,
}) => {
  const theme = useTheme();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[2],
            maxWidth: 250,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>
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
                <Typography variant="body2" color="text.secondary">
                  {entry.name}:
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {typeof entry.value === 'number'
                  ? entry.value.toLocaleString()
                  : entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.divider}
            vertical={false}
          />
        )}
        
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          tickMargin={10}
        />
        
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        
        {showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
        
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
          />
        )}
        
        {dataKeys.map((dataKey, index) => (
          <Bar
            key={dataKey.key}
            dataKey={dataKey.key}
            name={dataKey.name}
            fill={dataKey.color}
            stackId={stacked ? 'stack' : undefined}
            radius={[borderRadius, borderRadius, 0, 0]}
            barSize={barSize}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};