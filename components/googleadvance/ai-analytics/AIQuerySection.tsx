// components/googleadvance/ai-analytics/AIQuerySection.tsx

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  Fade,
  InputAdornment,
  CircularProgress,
  alpha,
} from '@mui/material';
import { Psychology, Info } from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface AIQuerySectionProps {
  currentColors: any;
  buttonColor: string;
  isMobile?: boolean;
}

export const AIQuerySection: React.FC<AIQuerySectionProps> = ({
  currentColors,
  buttonColor,
  isMobile = false,
}) => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIQuery = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const responses = [
        "Based on current trends, focusing on customer retention could improve revenue by 15-20%.",
        "Revenue forecast shows 68% growth potential. Consider marketing investments during peak seasons.",
        "Operational efficiency is below target. Process optimization could save ₹2.5M annually.",
      ];
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsAnalyzing(false);
    }, 1000);
  };

  const suggestions = [
    "Revenue trends",
    "Customer analysis",
    "Sales predictions",
    "Churn risk",
    "Growth opportunities"
  ];

  return (
    <Card sx={{ 
      mb: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            fontSize={isMobile ? '1rem' : '1.125rem'}
          >
            Ask AI Anything
          </Typography>
          <Chip 
            label="Beta" 
            size="small" 
            sx={{
              backgroundColor: alpha(googleColors.yellow, 0.1),
              color: googleColors.yellow,
              border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
              fontWeight: 500,
            }}
          />
        </Box>
        
        <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
          <TextField
            fullWidth
            placeholder="Example: Predict next quarter revenue, analyze customer churn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
            size={isMobile ? "small" : "medium"}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Psychology sx={{ color: googleColors.blue }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: currentColors.textPrimary,
                '& fieldset': {
                  borderColor: currentColors.border,
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAIQuery}
            disabled={true}
            sx={{
              background: buttonColor,
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              minWidth: isMobile ? '100%' : 120,
              '&.Mui-disabled': {
                background: buttonColor,
                color: 'white',
                opacity: 0.5,
              }
            }}
          >
            {isAnalyzing ? <CircularProgress size={24} /> : 'Ask AI'}
          </Button>
        </Box>

        {aiResponse && (
          <Fade in={!!aiResponse}>
            <Alert 
              severity="info" 
              icon={<Info />}
              sx={{ 
                mt: 2, 
                background: alpha(googleColors.blue, 0.1),
                border: `1px solid ${alpha(googleColors.blue, 0.3)}`,
              }}
            >
              <Typography variant="body2" fontSize={isMobile ? '0.875rem' : '1rem'}>
                {aiResponse}
              </Typography>
            </Alert>
          </Fade>
        )}

        <Box display="flex" gap={1} mt={2} flexWrap="wrap">
          {suggestions.map((suggestion) => (
            <Chip
              key={suggestion}
              label={suggestion}
              size="small"
              onClick={() => setQuery(suggestion)}
              disabled
              sx={{
                border: `1px solid ${currentColors.border}`,
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};