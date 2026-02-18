// components/googleadvance/ai-analytics/InsightCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  alpha,
} from '@mui/material';
import { Lightbulb } from '@mui/icons-material';
import { Insight } from '../types';
import { googleColors } from '../common/GoogleColors';

interface InsightCardProps {
  insight: Insight;
  currentColors: any;
  buttonColor: string;
  isMobile?: boolean;
  onImplement?: (id: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  currentColors,
  buttonColor,
  isMobile = false,
  onImplement,
}) => {
  return (
    <Card 
      sx={{ 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        mb: 2,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box sx={{ 
            color: googleColors.blue, 
            mt: 0.5,
            fontSize: isMobile ? 20 : 24 
          }}>
            <Lightbulb fontSize={isMobile ? "small" : "medium"} />
          </Box>
          <Box flex={1}>
            <Typography 
              variant="h6" 
              fontWeight="medium" 
              gutterBottom
              fontSize={isMobile ? '1rem' : '1.125rem'}
            >
              {insight.title}
            </Typography>
            <Typography 
              variant="body2" 
              color={currentColors.textSecondary} 
              gutterBottom
              fontSize={isMobile ? '0.875rem' : '1rem'}
            >
              {insight.description}
            </Typography>
            
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip 
                label={insight.category} 
                size="small" 
                disabled
                sx={{
                  backgroundColor: alpha(googleColors.blue, 0.1),
                  color: googleColors.blue,
                  border: `1px solid ${alpha(googleColors.blue, 0.3)}`,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                }}
              />
              <Chip 
                label={`${insight.confidence}% confidence`} 
                size="small" 
                variant="outlined"
                disabled
                sx={{
                  border: `1px solid ${currentColors.border}`,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                }}
              />
            </Box>

            <Typography 
              variant="subtitle2" 
              gutterBottom
              fontSize={isMobile ? '0.875rem' : '1rem'}
              fontWeight="medium"
            >
              Recommended Actions:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {insight.actionItems.map((action, idx) => (
                <Box 
                  component="li" 
                  key={idx} 
                  sx={{ 
                    typography: 'body2', 
                    mb: 0.5,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  {action}
                </Box>
              ))}
            </Box>

            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              mt={2}
              flexDirection={isMobile ? "column" : "row"}
              gap={isMobile ? 1 : 0}
            >
              <Typography 
                variant="caption" 
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                {new Date(insight.timestamp).toLocaleDateString()}
              </Typography>
              <Button 
                size="small" 
                variant="outlined"
                disabled
                onClick={() => onImplement?.(insight.id)}
                sx={{
                  border: `1px solid ${currentColors.border}`,
                  color: buttonColor,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  '&:hover': {
                    borderColor: buttonColor,
                    backgroundColor: alpha(buttonColor, 0.04),
                  }
                }}
              >
                Implement
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};