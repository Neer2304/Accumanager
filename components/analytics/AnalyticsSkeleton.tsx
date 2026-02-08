"use client";

import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Skeleton,
  useTheme,
} from '@mui/material';

interface AnalyticsSkeletonProps {
  darkMode?: boolean;
}

export const AnalyticsSkeleton: React.FC<AnalyticsSkeletonProps> = ({ darkMode = false }) => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={250} height={25} />
      </Box>

      {/* Stats Cards Skeleton */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 4
      }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card 
            key={item}
            sx={{ 
              p: 2,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <CardContent sx={{ p: '16px !important' }}>
              <Skeleton variant="text" width="60%" height={25} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={20} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Section Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={250} height={35} sx={{ mb: 3 }} />
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          height: { xs: 'auto', md: 350 }
        }}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
          <Card sx={{ 
            height: '100%',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Lists Section Skeleton */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mb: 3
      }}>
        {[1, 2].map((item) => (
          <Card 
            key={item}
            sx={{ 
              height: '100%', 
              minHeight: 300,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <CardContent>
              <Skeleton variant="text" width={200} height={35} sx={{ mb: 2 }} />
              {[1, 2, 3, 4, 5].map((listItem) => (
                <Box key={listItem} sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="90%" height={25} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};