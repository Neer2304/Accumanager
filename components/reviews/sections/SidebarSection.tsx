import React from 'react';
import { Box, Typography } from '@mui/material';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Divider } from '@/components/ui/Divider';

interface SidebarSectionProps {
  totalReviews: number;
  darkMode?: boolean;
}

export const SidebarSection = ({ totalReviews, darkMode = false }: SidebarSectionProps) => {
  const guidelines = [
    "Be honest and specific about your experience",
    "Focus on features that mattered most to you",
    "Mention how the product helped solve your problems",
    "Keep it professional and constructive",
    "Avoid personal attacks or offensive language"
  ];

  const features = [
    "User Interface",
    "Performance",
    "Customer Support",
    "Ease of Use",
    "Value for Money",
    "Features",
    "Reliability",
    "Integration"
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Reviews Summary */}
      <Card
        title="Reviews Summary"
        hover
        sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          p: 3,
          bgcolor: darkMode ? '#303134' : '#f8f9fa',
          borderRadius: 1,
          border: darkMode ? '1px solid #3c4043' : '1px solid #e0e0e0'
        }}>
          <Typography 
            variant="h2" 
            fontWeight={700} 
            color="#1a73e8"
            sx={{ 
              mb: 1,
              fontSize: { xs: '2.5rem', sm: '3rem' }
            }}
          >
            {totalReviews}
          </Typography>
          <Typography 
            variant="subtitle2" 
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Total Reviews
          </Typography>
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: darkMode ? '1px solid #3c4043' : '1px solid #e0e0e0' 
          }}>
            <Typography 
              variant="caption" 
              color={darkMode ? "#9aa0a6" : "#5f6368"}
              sx={{ display: 'block' }}
            >
              Join {totalReviews}+ customers who shared their experience
            </Typography>
          </Box>
        </Box>
      </Card>

      <Divider />

      {/* Review Guidelines */}
      <Card
        title="Review Guidelines"
        hover
        sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {guidelines.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                bgcolor: '#1a73e8',
                mt: 0.75,
                flexShrink: 0
              }} />
              <Typography 
                variant="body2" 
                color={darkMode ? "#9aa0a6" : "#5f6368"}
                sx={{ lineHeight: 1.5 }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <Divider />

      {/* Why Reviews Matter */}
      <Card
        title="Why Your Review Matters"
        hover
        sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}
      >
        <Typography 
          variant="body2" 
          color={darkMode ? "#9aa0a6" : "#5f6368"} 
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          Your honest feedback helps us improve our services and assists other users in making informed decisions about our platform.
        </Typography>
        <Box sx={{ 
          p: 2, 
          borderRadius: 1, 
          bgcolor: darkMode ? '#0d3064' : '#e8f0fe',
          textAlign: 'center',
          border: '1px solid',
          borderColor: darkMode ? '#1a73e8' : '#8ab4f8'
        }}>
          <Typography 
            variant="caption" 
            fontWeight={600} 
            color="#1a73e8"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            Trusted by businesses worldwide
          </Typography>
        </Box>
      </Card>

      <Divider />

      {/* Features to Mention */}
      <Card
        title="Features to Mention"
        hover
        sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}
      >
        <Typography 
          variant="body2" 
          color={darkMode ? "#9aa0a6" : "#5f6368"} 
          sx={{ mb: 2 }}
        >
          Consider mentioning these aspects in your review:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {features.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                bgcolor: darkMode ? '#303134' : '#f8f9fa',
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                color: darkMode ? "#e8eaed" : "#202124",
                '&:hover': {
                  borderColor: '#1a73e8',
                  bgcolor: darkMode ? 'rgba(26, 115, 232, 0.08)' : 'rgba(26, 115, 232, 0.04)',
                }
              }}
            />
          ))}
        </Box>
      </Card>
    </Box>
  );
};