// components/googleadvance/ai-analytics/PredictionCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import { Prediction } from '../types';
import { googleColors, getImpactColor } from '../common/GoogleColors';

interface PredictionCardProps {
  prediction: Prediction;
  currentColors: any;
  isMobile?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  currentColors,
  isMobile = false,
}) => {
  const impactColor = getImpactColor(prediction.impact);

  return (
    <Card 
      sx={{ 
        flex: isMobile ? '1 1 100%' : '1 1 calc(50% - 12px)',
        minWidth: isMobile ? '100%' : '300px',
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2,
            background: alpha(impactColor, 0.1),
            color: impactColor
          }}>
            {prediction.icon}
          </Box>
          <Box>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              fontSize={isMobile ? '0.875rem' : '1rem'}
            >
              {prediction.metric}
            </Typography>
            <Typography 
              variant="caption" 
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.75rem' : '0.875rem'}
            >
              {prediction.description}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography 
            variant="h5" 
            fontWeight="bold"
            fontSize={isMobile ? '1.25rem' : '1.5rem'}
          >
            {prediction.value}%
          </Typography>
          <Box sx={{ 
            color: prediction.trend === 'up' 
              ? googleColors.green 
              : prediction.trend === 'down'
              ? googleColors.red
              : googleColors.yellow
          }}>
            {prediction.trend === 'up' ? <TrendingUp /> : 
             prediction.trend === 'down' ? <TrendingDown /> : 
             <TrendingFlat />}
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={prediction.confidence}
          sx={{
            height: 6,
            borderRadius: 3,
            mb: 1,
            backgroundColor: currentColors.chipBackground,
            '& .MuiLinearProgress-bar': {
              backgroundColor: googleColors.blue,
              borderRadius: 3,
            },
          }}
        />

        <Typography 
          variant="caption" 
          color={currentColors.textSecondary}
          fontSize={isMobile ? '0.75rem' : '0.875rem'}
        >
          AI Confidence: {prediction.confidence}%
        </Typography>
      </CardContent>
    </Card>
  );
};