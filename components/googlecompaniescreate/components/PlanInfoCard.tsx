// components/googlecompaniescreate/components/PlanInfoCard.tsx
import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import { GOOGLE_COLORS, freePlanFeatures } from '../constants';

interface PlanInfoCardProps {
  darkMode: boolean;
}

export const PlanInfoCard: React.FC<PlanInfoCardProps> = ({ darkMode }) => {
  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
      borderRadius: '16px',
      mb: 4
    }}>
      <Typography variant="subtitle1" fontWeight={500} sx={{ color: GOOGLE_COLORS.blue, mb: 2 }}>
        Free Plan Features
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {freePlanFeatures.map((feature, index) => (
          <Box 
            key={index}
            sx={{ 
              flex: '1 1 calc(50% - 8px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Box sx={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              backgroundColor: GOOGLE_COLORS.blue 
            }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {feature}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};