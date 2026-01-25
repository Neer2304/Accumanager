// components/resources/QuickHelpCards.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { quickHelpData } from './data/moduleGuides';

interface QuickHelpCardsProps {
  module?: string;
}

export const QuickHelpCards: React.FC<QuickHelpCardsProps> = ({ module }) => {
  const theme = useTheme();

  // Filter by module if specified
  const filteredHelp = module 
    ? quickHelpData.filter(item => item.module === module)
    : quickHelpData.slice(0, 8); // Show first 8 for all modules

  if (filteredHelp.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        {module ? `${module} Quick Help` : 'Quick Help for All Modules'}
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: module ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          lg: module ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'
        },
        gap: 3,
      }}>
        {filteredHelp.map((item) => (
          <Paper
            key={item.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(item.color, 0.2)}`,
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: item.color,
                boxShadow: `0 0 0 1px ${alpha(item.color, 0.3)}`,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(item.color, 0.1),
                  color: item.color,
                  fontSize: 20,
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.module}
                </Typography>
              </Box>
            </Box>
            
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              {item.steps.map((step, index) => (
                <Typography
                  key={index}
                  component="li"
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {step}
                </Typography>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};