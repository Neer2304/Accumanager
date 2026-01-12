import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface UserLoginHeaderProps {
  title?: string;
  subtitle?: string;
  gradient?: boolean;
}

const UserLoginHeader: React.FC<UserLoginHeaderProps> = ({
  title = 'Sign In',
  subtitle = 'Access your business dashboard',
  gradient = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: gradient 
          ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
          : theme.palette.primary.main,
        color: 'white',
        textAlign: 'center',
        py: 3,
        px: 2,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      }}
    >
      <Typography 
        variant="h4" 
        fontWeight="700"
        gutterBottom
        sx={{
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default UserLoginHeader;