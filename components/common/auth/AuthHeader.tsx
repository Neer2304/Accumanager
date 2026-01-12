import React, { ReactNode } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { AdminPanelSettings, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  onBackClick?: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  icon,
  showBackButton = false,
  backHref = '/',
  onBackClick,
}) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
      {/* Back Button */}
      {showBackButton && (
        <IconButton
          component={onBackClick ? 'button' : Link}
          href={!onBackClick ? backHref : undefined}
          onClick={onBackClick}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            color: '#94a3b8',
            '&:hover': {
              color: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
      )}

      {/* Icon */}
      <Box
        sx={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          position: 'relative',
          boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.08) rotate(5deg)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '-3px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
            zIndex: -1,
            filter: 'blur(10px)',
            opacity: 0.7,
            pointerEvents: 'none',
          },
        }}
      >
        {icon || <AdminPanelSettings sx={{ fontSize: 44, color: 'white' }} />}
      </Box>

      {/* Title */}
      <Typography 
        variant="h3" 
        component="h1" 
        fontWeight="800" 
        gutterBottom
        sx={{
          background: 'linear-gradient(135deg, #667eea 30%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#94a3b8',
            fontWeight: 400,
            mb: 1,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default AuthHeader;