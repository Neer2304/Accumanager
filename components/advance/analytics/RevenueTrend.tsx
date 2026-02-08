import { Box, Typography } from '@mui/material';
import { ShowChart } from '@mui/icons-material';

interface RevenueTrendProps {
  monthlyTrend: any[];
  totalRevenue: number;
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

export default function RevenueTrend({
  monthlyTrend,
  totalRevenue,
  currentColors,
  primaryColor,
  isMobile
}: RevenueTrendProps) {
  if (monthlyTrend.length > 0) {
    return (
      <Box sx={{ 
        height: 300, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <ShowChart sx={{ 
            fontSize: isMobile ? 48 : 60, 
            color: primaryColor, 
            mb: 2 
          }} />
          <Typography 
            variant="body1" 
            color={currentColors.textSecondary}
            fontSize={isMobile ? '0.875rem' : '1rem'}
          >
            Revenue trend visualization would appear here
          </Typography>
          <Typography 
            variant="caption" 
            color={currentColors.textSecondary}
            fontSize={isMobile ? '0.75rem' : '0.875rem'}
          >
            Total: ₹{totalRevenue.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: 300, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Typography 
        variant="body1" 
        color={currentColors.textSecondary}
        fontSize={isMobile ? '0.875rem' : '1rem'}
      >
        No revenue data available for the selected period
      </Typography>
    </Box>
  );
}