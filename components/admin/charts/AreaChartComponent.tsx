import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme, alpha } from '@mui/material';

interface AreaChartComponentProps {
  data: any[];
  dataKeys: { key: string; name: string; color: string; strokeWidth?: number }[];
  height?: number;
  xAxisKey: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  gradient?: boolean;
  stackId?: string;
  stroke?: boolean;
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  dataKeys,
  height = 300,
  xAxisKey,
  showLegend = false,
  showGrid = true,
  showTooltip = true,
  gradient = true,
  stackId,
  stroke = true,
}) => {
  const theme = useTheme();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

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
                {entry.value.toLocaleString()}
                {stackId && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({((entry.value / total) * 100).toFixed(1)}%)
                  </Typography>
                )}
              </Typography>
            </Box>
          ))}
          {stackId && (
            <>
              <Box sx={{ height: 1, bgcolor: 'divider', my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Total:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {total.toLocaleString()}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          <Area
            key={dataKey.key}
            type="monotone"
            dataKey={dataKey.key}
            name={dataKey.name}
            stroke={stroke ? dataKey.color : 'transparent'}
            strokeWidth={dataKey.strokeWidth || 2}
            fill={gradient ? `url(#color${index})` : alpha(dataKey.color, 0.3)}
            fillOpacity={gradient ? 1 : 0.6}
            stackId={stackId}
            isAnimationActive={false}
          />
        ))}
        
        {gradient && (
          <defs>
            {dataKeys.map((dataKey, index) => (
              <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dataKey.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={dataKey.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};