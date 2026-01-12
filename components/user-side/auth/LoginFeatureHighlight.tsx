import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, alpha, useTheme } from '@mui/material';
import {
  Analytics,
  Inventory,
  People,
  Smartphone,
} from '@mui/icons-material';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  { icon: <Analytics />, title: 'Advanced Analytics', description: 'Real-time business insights' },
  { icon: <Inventory />, title: 'Inventory Management', description: 'Track products effortlessly' },
  { icon: <People />, title: 'Customer CRM', description: 'Manage customer relationships' },
  { icon: <Smartphone />, title: 'Mobile App', description: 'Access anywhere, anytime' },
];

interface LoginFeatureHighlightProps {
  interval?: number;
}

const LoginFeatureHighlight: React.FC<LoginFeatureHighlightProps> = ({
  interval = 3000,
}) => {
  const theme = useTheme();
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <Fade in key={featureIndex} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 3,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          width: '100%',
          maxWidth: 400,
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.primary.main,
            fontSize: '1.5rem',
            flexShrink: 0,
          }}
        >
          {features[featureIndex].icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            {features[featureIndex].title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {features[featureIndex].description}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoginFeatureHighlight;