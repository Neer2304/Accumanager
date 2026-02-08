import { Box, Typography, Paper } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  currentColors: any;
  isMobile: boolean;
  alpha: any;
}

export default function MetricCard({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
  currentColors,
  isMobile,
  alpha
}: MetricCardProps) {
  return (
    <Box sx={{ 
      flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 36px)',
      minWidth: isMobile ? '100%' : '250px',
    }}>
      <Paper sx={{ 
        p: 2, 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        height: '100%',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: isMobile ? 36 : 48,
              height: isMobile ? 36 : 48,
              borderRadius: 2,
              background: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${alpha(color, 0.3)}`,
            }}
          >
            <Box sx={{ color: color, fontSize: isMobile ? 20 : 24 }}>
              {icon}
            </Box>
          </Box>
          <Box>
            <Typography 
              variant="caption" 
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.75rem' : '0.875rem'}
            >
              {title}
            </Typography>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold" 
              color={currentColors.textPrimary}
            >
              {value}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: trend ? (trend === 'up' ? '#34A853' : '#EA4335') : currentColors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            {trend && (trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />)}
            {subtitle}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}