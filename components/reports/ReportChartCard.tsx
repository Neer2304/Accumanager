import React, { ReactNode } from 'react';
import { Card, CardContent, Typography, Box, CardProps, CircularProgress } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

interface ReportChartCardProps extends CardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  chart: ReactNode;
  chartHeight?: number;
  actions?: ReactNode;
  loading?: boolean;
}

const ReportChartCard: React.FC<ReportChartCardProps> = ({
  title,
  subtitle,
  icon,
  chart,
  chartHeight = 300,
  actions,
  loading = false,
  sx,
  ...props
}) => {
  return (
    <Card sx={{ height: '100%', ...sx }} {...props}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {icon && <Box component="span" sx={{ mr: 1, verticalAlign: 'middle' }}>{icon}</Box>}
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions}
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: chartHeight }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              {chart}
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportChartCard;