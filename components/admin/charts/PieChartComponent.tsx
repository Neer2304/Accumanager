import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

interface PieChartComponentProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
  labelType?: 'value' | 'percent' | 'name';
  showTooltip?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  dataKey,
  nameKey,
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'],
  height = 300,
  innerRadius = 60,
  outerRadius = 80,
  showLabel = false,
  labelType = 'percent',
  showTooltip = true,
  showLegend = true,
  legendPosition = 'bottom',
}) => {
  const theme = useTheme();

  const renderLabel = (entry: any) => {
    switch (labelType) {
      case 'value':
        return entry[dataKey];
      case 'percent':
        const total = data.reduce((sum, item) => sum + item[dataKey], 0);
        const percent = ((entry[dataKey] / total) * 100).toFixed(1);
        return `${percent}%`;
      case 'name':
        return entry[nameKey];
      default:
        return null;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const total = data.reduce((sum, item) => sum + item[dataKey], 0);
      const percent = ((entry[dataKey] / total) * 100).toFixed(1);

      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[2],
            maxWidth: 200,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>
            {entry[nameKey]}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Value:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {entry[dataKey].toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Percentage:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {percent}%
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  const total = data.reduce((sum, item) => sum + item[dataKey], 0);

  return (
    <Box sx={{ position: 'relative', width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
            label={showLabel ? renderLabel : false}
            labelLine={showLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke={theme.palette.background.paper}
                strokeWidth={2}
              />
            ))}
          </Pie>
          
          {showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
          
          {showLegend && (
            <Legend
              layout="vertical"
              verticalAlign={legendPosition === 'top' ? 'top' : 
                           legendPosition === 'bottom' ? 'bottom' : 
                           legendPosition === 'left' ? 'middle' : 'middle'}
              align={legendPosition === 'left' ? 'left' : 
                     legendPosition === 'right' ? 'right' : 'center'}
              iconType="circle"
              iconSize={8}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
      
      {/* Center total value */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {total.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total
        </Typography>
      </Box>
    </Box>
  );
};