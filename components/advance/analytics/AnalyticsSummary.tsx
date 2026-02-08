import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import { TrendingUp, AccountCircle, AccessTime, Warning as WarningIcon } from '@mui/icons-material';

interface AnalyticsSummaryProps {
  revenueMetrics: any;
  customerMetrics: any;
  retentionMetrics: any;
  currentColors: any;
  primaryColor: string;
  googleColors: any;
  alpha: any;
}

export default function AnalyticsSummary({
  revenueMetrics,
  customerMetrics,
  retentionMetrics,
  currentColors,
  primaryColor,
  googleColors,
  alpha
}: AnalyticsSummaryProps) {
  const metrics = [
    {
      title: 'Growth Rate',
      value: `${revenueMetrics?.revenueGrowth || 12.5}%`,
      icon: <TrendingUp sx={{ color: primaryColor }} />,
      color: primaryColor,
    },
    {
      title: 'CLV',
      value: `₹${customerMetrics?.avgCustomerValue || 350}`,
      icon: <AccountCircle sx={{ color: googleColors.green }} />,
      color: googleColors.green,
    },
    {
      title: 'Retention',
      value: retentionMetrics?.retentionRate || '85%',
      icon: <AccessTime sx={{ color: googleColors.yellow }} />,
      color: googleColors.yellow,
    },
    {
      title: 'Churn Risk',
      value: `${retentionMetrics?.churnProbability || 15}%`,
      icon: <WarningIcon sx={{ color: googleColors.red }} />,
      color: googleColors.red,
    },
  ];

  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
          Analytics Summary
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          justifyContent: 'center' 
        }}>
          {metrics.map((metric, index) => (
            <Box key={index} sx={{ 
              flex: '1 1 calc(25% - 16px)',
              minWidth: { xs: '100%', sm: '200px' }
            }}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
                height: '100%',
              }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  background: alpha(metric.color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 1,
                }}>
                  {metric.icon}
                </Box>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  {metric.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={currentColors.textPrimary} sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}