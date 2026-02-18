// components/googleadvance/subscription-analytics/HealthAnalysis.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Lightbulb,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface HealthAnalysisProps {
  healthMetrics: any;
  currentColors: any;
  isMobile?: boolean;
}

export const HealthAnalysis: React.FC<HealthAnalysisProps> = ({
  healthMetrics,
  currentColors,
  isMobile = false,
}) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return googleColors.green;
    if (score >= 60) return googleColors.yellow;
    return googleColors.red;
  };

  const healthColor = getHealthColor(healthMetrics?.score || 85);

  return (
    <Card sx={{ 
      flex: 1, 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          mb={3} 
          color={currentColors.textPrimary}
          fontSize={isMobile ? '1rem' : '1.125rem'}
        >
          Business Health Score
        </Typography>
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Typography 
              variant="h2" 
              fontWeight="bold"
              sx={{ color: healthColor }}
            >
              {healthMetrics?.score || 85}
            </Typography>
            <Typography 
              variant="body2" 
              color={currentColors.textSecondary}
              sx={{ position: 'absolute', bottom: 0, right: -20 }}
            >
              /100
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: healthColor, mt: 1 }}>
            {healthMetrics?.status || 'Healthy'}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={healthMetrics?.score || 85}
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 3,
            backgroundColor: alpha(healthColor, 0.2),
            '& .MuiLinearProgress-bar': {
              backgroundColor: healthColor,
              borderRadius: 5,
            },
          }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Recommendations
        </Typography>
        <List dense>
          {(healthMetrics?.recommendations || [
            'Consider upselling to premium customers',
            'Improve customer engagement',
            'Expand payment options'
          ]).map((rec: string, index: number) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Lightbulb sx={{ color: googleColors.yellow, fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary={rec}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  color: currentColors.textPrimary
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};