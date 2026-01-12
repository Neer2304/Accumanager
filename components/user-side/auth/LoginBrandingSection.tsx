import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface LoginBrandingSectionProps {
  appName?: string;
  tagline?: string;
  children?: React.ReactNode;
}

const LoginBrandingSection: React.FC<LoginBrandingSectionProps> = ({
  appName = 'AccuManage',
  tagline = 'Sign in to access your business dashboard and continue growing with our powerful management tools.',
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'flex-start' },
        textAlign: { xs: 'center', md: 'left' },
        color: 'primary.main',
      }}
    >
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h3" 
          fontWeight="800"
          gutterBottom
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: {
              xs: '2rem',
              sm: '2.5rem',
              md: '3rem',
            },
            lineHeight: 1.2,
          }}
        >
          Welcome Back to {appName}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: {
              xs: '1rem',
              md: '1.1rem',
            },
            lineHeight: 1.6,
            maxWidth: { xs: '100%', md: '90%' },
          }}
        >
          {tagline}
        </Typography>
      </Box>

      {children}
    </Box>
  );
};

export default LoginBrandingSection;