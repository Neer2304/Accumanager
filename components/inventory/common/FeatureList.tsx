import React from 'react';
import {
  List,
  ListItem,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { SecurityIcon } from '@/components/security/SecurityIcons';

interface FeatureListProps {
  features: string[];
  icon?: string;
  iconColor?: string;
  dense?: boolean;
}

export const FeatureList = ({ 
  features, 
  icon = 'CheckCircle', 
  iconColor = '#34a853',
  dense = false 
}: FeatureListProps) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <List 
      dense={dense}
      sx={{ 
        p: 0,
        '& .MuiListItem-root': {
          px: 0,
          py: dense ? 0.5 : 1,
        }
      }}
    >
      {features.map((feature, index) => (
        <ListItem 
          key={index}
          sx={{ 
            alignItems: 'flex-start',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: darkMode 
                ? alpha('#4285f4', 0.05) 
                : alpha('#4285f4', 0.02),
              borderRadius: 1,
              px: 1,
              py: dense ? 0.75 : 1.25,
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            mr: 2, 
            mt: 0.5,
            flexShrink: 0,
            color: iconColor,
          }}>
            <SecurityIcon 
              name={icon as any} 
              size={dense ? "small" : "medium"}
              // sx={{ fontSize: dense ? 16 : 20 }}
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: dense ? '0.875rem' : '0.9375rem',
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            {feature}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};