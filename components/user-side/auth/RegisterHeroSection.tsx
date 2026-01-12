import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { RocketLaunch } from '@mui/icons-material';

interface RegisterHeroSectionProps {
  appName?: string;
  tagline?: string;
  children?: React.ReactNode;
}

const RegisterHeroSection: React.FC<RegisterHeroSectionProps> = ({
  appName = 'AccuManage',
  tagline = 'Get started with AccumaManage and transform your business operations. No credit card required for the 14-day free trial.',
  children,
}) => {
  const theme = useTheme();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'flex-start' },
        textAlign: { xs: 'center', md: 'left' },
        color: 'primary.main',
        maxWidth: { xs: '100%', md: '50%' },
        mb: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          bgcolor: 'primary.lighter',
          p: 1.5,
          borderRadius: 3,
        }}
      >
        <RocketLaunch sx={{ fontSize: 32 }} />
        <Typography 
          variant="h5" 
          fontWeight="bold"
          sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Start Your Journey
        </Typography>
      </Box>

      <Typography 
        variant="h3" 
        fontWeight="800"
        gutterBottom
        sx={{
          fontSize: {
            xs: '2rem',
            sm: '2.5rem',
            md: '3rem',
          },
          lineHeight: 1.2,
        }}
      >
        Join Thousands of Successful{' '}
        <Box
          component="span"
          sx={{
            color: 'secondary.main',
            display: 'inline-block',
            animation: animationStep === 0 ? 'pulse 1.5s ease-in-out' : 'none',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.8 },
            },
          }}
        >
          Businesses
        </Box>
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ 
          mb: 4,
          fontSize: {
            xs: '0.95rem',
            sm: '1rem',
            md: '1.1rem',
          },
          lineHeight: 1.6,
        }}
      >
        {tagline}
      </Typography>

      {children}
    </Box>
  );
};

export default RegisterHeroSection;