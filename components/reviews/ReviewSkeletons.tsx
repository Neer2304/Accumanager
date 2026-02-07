// components/reviews/ReviewSkeletons.tsx
"use client";

import React from 'react';
import { Box, Skeleton, Card, useTheme } from '@mui/material';

export const ReviewItemSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton 
              variant="circular" 
              width={56} 
              height={56} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5' }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton 
                variant="text" 
                width="60%" 
                height={24} 
                sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5', mb: 1 }}
              />
              <Skeleton 
                variant="text" 
                width="40%" 
                height={16} 
                sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5', mb: 1 }}
              />
              <Skeleton 
                variant="text" 
                width="30%" 
                height={12} 
                sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5' }}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Skeleton 
              variant="text" 
              width="80%" 
              height={20} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5', mb: 1 }}
            />
            <Skeleton 
              variant="text" 
              width="100%" 
              height={16} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5', mb: 0.5 }}
            />
            <Skeleton 
              variant="text" 
              width="90%" 
              height={16} 
              sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5' }}
            />
          </Box>
        </Card>
      ))}
    </>
  );
};

export const ReviewStatsSkeleton: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
      {[1, 2].map((i) => (
        <Card key={i} sx={{ p: 3, minWidth: 140, textAlign: 'center' }}>
          <Skeleton 
            variant="text" 
            width="80%" 
            height={40} 
            sx={{ 
              bgcolor: darkMode ? '#3c4043' : '#f5f5f5', 
              mb: 1,
              mx: 'auto' 
            }}
          />
          <Skeleton 
            variant="text" 
            width="60%" 
            height={24} 
            sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5', mb: 1 }}
          />
          <Skeleton 
            variant="text" 
            width="100%" 
            height={16} 
            sx={{ bgcolor: darkMode ? '#3c4043' : '#f5f5f5' }}
          />
        </Card>
      ))}
    </Box>
  );
};