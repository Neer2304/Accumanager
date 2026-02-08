import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
} from '@mui/material';

interface RetentionMetricsProps {
  retentionMetrics: any;
  currentColors: any;
  googleColors: any;
  alpha: any;
}

export default function RetentionMetrics({
  retentionMetrics,
  currentColors,
  googleColors,
  alpha
}: RetentionMetricsProps) {
  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      height: '100%',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
          Customer Retention Metrics
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Repeat Purchase Rate
            </Typography>
            <Chip
              label={retentionMetrics.repeatPurchaseRate || '72%'}
              size="small"
              sx={{
                background: alpha(googleColors.green, 0.1),
                color: googleColors.green,
                fontWeight: 'bold',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Avg Days Between Orders
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              {retentionMetrics.avgDaysBetweenOrders || 45} days
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Customer Lifetime
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              {retentionMetrics.customerLifetime || 18} months
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Total Purchases
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              {retentionMetrics.totalPurchases || 1200}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}