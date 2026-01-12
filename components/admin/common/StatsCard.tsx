import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  InfoOutlined,
  MoreVert,
} from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  trendLabel?: string;
  info?: string;
  onMenuClick?: () => void;
  onClick?: () => void;
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  trendLabel,
  info,
  onMenuClick,
  onClick,
  isLoading = false,
}) => {

  const TrendIndicator = () => {
    if (trend === undefined) return null;
    
    const trendColor = trend > 0 ? '#2e7d32' : trend < 0 ? '#d32f2f' : '#666666';
    
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mt: 0.5,
        }}
      >
        {trend > 0 ? (
          <TrendingUp sx={{ fontSize: 14, color: '#2e7d32' }} />
        ) : trend < 0 ? (
          <TrendingDown sx={{ fontSize: 14, color: '#d32f2f' }} />
        ) : null}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 'medium',
            color: trendColor,
          }}
        >
          {trend > 0 ? '+' : ''}{trend}%
        </Typography>
      </Box>
    );
  };

  const CardContentComponent = () => (
    <CardContent sx={{ p: 3, position: 'relative' }}>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#ffffff', opacity: 0.8, fontSize: '0.7rem' }}>
            {title}
          </Typography>
          {info && (
            <Tooltip title={info}>
              <InfoOutlined sx={{ fontSize: 14, ml: 0.5, opacity: 0.7, color: '#ffffff' }} />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onMenuClick && (
            <IconButton
              size="small"
              sx={{ color: '#ffffff', opacity: 0.7, '&:hover': { opacity: 1 } }}
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick();
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Main value */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
        <Typography
          variant="h3"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: '#ffffff',
            fontSize: { xs: '2rem', sm: '2.5rem' },
            lineHeight: 1.2,
          }}
        >
          {isLoading ? '...' : value}
        </Typography>
      </Box>

      {/* Subtitle and trend */}
      {(subtitle || trendLabel) && (
        <Box sx={{ mt: 1 }}>
          {subtitle && (
            <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.9, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
          {trend !== undefined && <TrendIndicator />}
          {trendLabel && !trend && (
            <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.8, mt: 0.5, display: 'block' }}>
              {trendLabel}
            </Typography>
          )}
        </Box>
      )}

      {/* Decorative icon */}
      <Box
        sx={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          opacity: 0.1,
          transform: 'scale(2)',
          transition: 'all 0.3s ease',
          color: '#ffffff',
          '&:hover': {
            opacity: 0.15,
            transform: 'scale(2.1)',
          },
        }}
      >
        {icon}
      </Box>
    </CardContent>
  );

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? '0px 8px 10px rgba(0, 0, 0, 0.2), 0px 4px 15px rgba(0, 0, 0, 0.14), 0px 2px 4px rgba(0, 0, 0, 0.12)' : 'none',
          '& .card-icon': {
            opacity: 0.15,
            transform: 'scale(2.1)',
          },
        },
        height: '100%',
      }}
      onClick={onClick}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: '#ffffff',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box>
      )}

      <CardContentComponent />
    </Card>
  );
};