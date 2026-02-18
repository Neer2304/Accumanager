// components/googleadvance/ai-analytics/ConfidenceSlider.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Slider,
  Alert,
  alpha,
} from '@mui/material';
import { googleColors } from '../common/GoogleColors';

interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  currentColors: any;
  isMobile?: boolean;
}

export const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({
  value,
  onChange,
  currentColors,
  isMobile = false,
}) => {
  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom
          fontSize={isMobile ? '1rem' : '1.125rem'}
        >
          🎯 AI Confidence Settings
        </Typography>
        <Box sx={{ p: 2 }}>
          <Typography 
            variant="body2" 
            gutterBottom
            fontSize={isMobile ? '0.875rem' : '1rem'}
          >
            Adjust AI confidence threshold
          </Typography>
          <Slider
            value={value}
            onChange={(_, newValue) => onChange(newValue as number)}
            min={50}
            max={95}
            marks={[
              { value: 50, label: '50%' },
              { value: 75, label: '75%' },
              { value: 95, label: '95%' },
            ]}
            disabled
            sx={{
              color: googleColors.blue,
            }}
          />
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2, 
              background: alpha(googleColors.blue, 0.1),
              border: `1px solid ${alpha(googleColors.blue, 0.3)}`,
            }}
          >
            <Typography variant="body2" fontSize={isMobile ? '0.875rem' : '1rem'}>
              Higher confidence = More accurate but fewer predictions
            </Typography>
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};