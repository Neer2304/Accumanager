// components/Loading/SkeletonLoader.tsx
'use client'

import React from 'react';
import { Box, Grid, Card, CardContent } from '@mui/material';

export const SkeletonLoader: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            width: '200px',
            height: '40px',
            backgroundColor: 'grey.200',
            borderRadius: 1,
            mb: 2,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            width: '300px',
            height: '20px',
            backgroundColor: 'grey.100',
            borderRadius: 1,
            animation: 'pulse 1.5s ease-in-out infinite 0.2s',
          }}
        />
      </Box>

      {/* Cards Skeleton */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card sx={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: '80%',
                    height: '24px',
                    backgroundColor: 'grey.200',
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <Box
                  sx={{
                    width: '100%',
                    height: '16px',
                    backgroundColor: 'grey.100',
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
                <Box
                  sx={{
                    width: '60%',
                    height: '16px',
                    backgroundColor: 'grey.100',
                    borderRadius: 1,
                    mb: 3,
                  }}
                />
                <Box
                  sx={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'grey.100',
                    borderRadius: 4,
                    mb: 1,
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box
                    sx={{
                      width: '40px',
                      height: '20px',
                      backgroundColor: 'grey.200',
                      borderRadius: 1,
                    }}
                  />
                  <Box
                    sx={{
                      width: '60px',
                      height: '20px',
                      backgroundColor: 'grey.200',
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};