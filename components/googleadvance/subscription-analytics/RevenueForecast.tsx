// components/googleadvance/subscription-analytics/RevenueForecast.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
} from '@mui/material';
import { ForecastItem } from '../types';
import { googleColors } from '../common/GoogleColors';

interface RevenueForecastProps {
  forecast: ForecastItem[];
  currentColors: any;
  googleColors: any;
}

export const RevenueForecast: React.FC<RevenueForecastProps> = ({
  forecast,
  currentColors,
  googleColors,
}) => {
  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Revenue Forecast
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Month</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Revenue</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Customers</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Growth</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forecast.map((item, index) => {
                const isPositive = item.growth > 0;
                
                return (
                  <TableRow key={`${item.month}-${item.year}`} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {item.month} {item.year}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="500">
                        ₹{item.revenue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {item.customers.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${isPositive ? '+' : ''}${item.growth.toFixed(1)}%`}
                        size="small"
                        sx={{
                          backgroundColor: isPositive 
                            ? alpha(googleColors.green, 0.1)
                            : alpha(googleColors.red, 0.1),
                          color: isPositive ? googleColors.green : googleColors.red,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Forecast Insights
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" color={currentColors.textSecondary}>
              • Projected revenue growth of {forecast.reduce((avg, item) => avg + item.growth, 0) / forecast.length}% over next {forecast.length} months
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              • Expected customer acquisition: {forecast[forecast.length - 1].customers - forecast[0].customers} new customers
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary}>
              • Estimated subscription value: ₹{forecast.reduce((sum, item) => sum + item.subscriptionValue, 0).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};