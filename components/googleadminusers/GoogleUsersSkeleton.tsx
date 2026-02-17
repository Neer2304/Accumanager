// components/googleadminusers/GoogleUsersSkeleton.tsx

import React from 'react';
import {
  Box,
  Skeleton,
  Card,
} from '@mui/material';

export const GoogleUsersSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={20} />
        </Box>
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>

      {/* Stats Cards Skeleton */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
        gap: 3,
        mb: 3,
      }}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
              <Skeleton variant="text" width={100} />
            </Box>
            <Skeleton variant="text" width={80} height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={120} />
          </Card>
        ))}
      </Box>

      {/* Filters Skeleton */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '2fr repeat(3, 1fr) 0.5fr' }, gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={40} />
          ))}
        </Box>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width={150} height={32} />
        </Box>
        
        {[...Array(5)].map((_, i) => (
          <Box key={i} sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr 1fr 0.5fr', gap: 2 }}>
              <Box>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
              </Box>
              <Skeleton variant="rectangular" width={60} height={24} />
              <Skeleton variant="rectangular" width={70} height={24} />
              <Skeleton variant="rectangular" width={70} height={24} />
              <Skeleton variant="rectangular" width={60} height={24} />
              <Box>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Box>
              <Skeleton variant="text" />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </Box>
          </Box>
        ))}
      </Card>
    </Box>
  );
};