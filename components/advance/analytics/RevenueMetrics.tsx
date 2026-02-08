import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface RevenueMetricsProps {
  revenueMetrics: any;
  currentColors: any;
  googleColors: any;
}

export default function RevenueMetrics({
  revenueMetrics,
  currentColors,
  googleColors
}: RevenueMetricsProps) {
  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      height: '100%',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
          Revenue Metrics
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Average Order Value
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              ₹{(revenueMetrics?.avgOrderValue || 622).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Monthly Revenue Growth
            </Typography>
            <Chip
              icon={revenueMetrics?.revenueGrowth > 0 ? <ArrowUpward /> : <ArrowDownward />}
              label={`${(revenueMetrics?.revenueGrowth || 12.5) > 0 ? '+' : ''}${revenueMetrics?.revenueGrowth || 12.5}%`}
              size="small"
              sx={{
                background: `rgba(${(revenueMetrics?.revenueGrowth || 12.5) > 0 ? '52, 168, 83' : '234, 67, 53'}, 0.1)`,
                color: (revenueMetrics?.revenueGrowth || 12.5) > 0 ? googleColors.green : googleColors.red,
                fontWeight: 'bold',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Total Orders
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              {revenueMetrics?.totalOrders || 450}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Monthly Revenue
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              ₹{(revenueMetrics?.monthlyRevenue || 280000).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}