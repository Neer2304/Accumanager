import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface RegisterFeatureListProps {
  features?: string[];
  interval?: number;
}

const RegisterFeatureList: React.FC<RegisterFeatureListProps> = ({
  features = [
    'Unlimited products during trial',
    'Advanced analytics dashboard',
    '24/7 customer support',
    'Secure cloud storage',
    'Mobile app access',
  ],
  interval = 3000,
}) => {
  const theme = useTheme();
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightedIndex((prev) => (prev + 1) % features.length);
    }, interval);
    return () => clearInterval(timer);
  }, [features.length, interval]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 4,
        width: '100%',
      }}
    >
      {features.map((feature, index) => (
        <Box
          key={feature}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: index === highlightedIndex 
              ? 'primary.lighter'
              : 'transparent',
            transition: 'all 0.3s ease',
            border: index === highlightedIndex 
              ? `1px solid ${theme.palette.primary.light}`
              : '1px solid transparent',
          }}
        >
          <CheckCircle 
            sx={{ 
              color: 'success.main',
              fontSize: 20,
            }} 
          />
          <Typography 
            variant="body2" 
            fontWeight="500"
            sx={{ fontSize: '0.95rem' }}
          >
            {feature}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RegisterFeatureList;