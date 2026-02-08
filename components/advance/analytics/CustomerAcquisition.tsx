import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

interface CustomerAcquisitionProps {
  customerMetrics: any;
  currentColors: any;
  googleColors: any;
  primaryColor: string;
  isMobile: boolean;
}

export default function CustomerAcquisition({
  customerMetrics,
  currentColors,
  googleColors,
  primaryColor,
  isMobile
}: CustomerAcquisitionProps) {
  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color={currentColors.textPrimary}>
            Customer Acquisition
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
            sx={{
              borderColor: currentColors.border,
              color: currentColors.textPrimary,
              textTransform: 'none',
            }}
          >
            View Details
          </Button>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          justifyContent: 'center' 
        }}>
          <Box sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 16px)',
            minWidth: isMobile ? '100%' : '200px'
          }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              background: currentColors.surface,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography variant="body2" color={currentColors.textSecondary}>
                New Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={googleColors.green} sx={{ mt: 1 }}>
                {customerMetrics.newCustomers || 120}
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                This month
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 16px)',
            minWidth: isMobile ? '100%' : '200px'
          }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              background: currentColors.surface,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography variant="body2" color={currentColors.textSecondary}>
                Active Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={primaryColor} sx={{ mt: 1 }}>
                {customerMetrics.activeCustomers || 720}
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                Currently active
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 16px)',
            minWidth: isMobile ? '100%' : '200px'
          }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center',
              background: currentColors.surface,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography variant="body2" color={currentColors.textSecondary}>
                Total Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={currentColors.textPrimary} sx={{ mt: 1 }}>
                {customerMetrics.totalCustomers || 800}
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                All time
              </Typography>
            </Paper>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}