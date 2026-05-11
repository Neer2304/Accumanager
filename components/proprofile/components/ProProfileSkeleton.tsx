// components/proprofile/components/ProProfileSkeleton.tsx
'use client';

import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';

export const ProProfileSkeleton: React.FC = () => {
  return (
    <MainLayout title="Profile">
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #dadce0' }}>
          <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1 }}><Skeleton variant="text" width="60%" height={40} /><Skeleton variant="text" width="40%" height={24} /></Box>
          </Box>
        </Box>
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (<Paper key={i} sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200, p: 2 }}><Skeleton variant="text" width="40%" height={20} /><Skeleton variant="text" width="60%" height={32} /><Skeleton variant="text" width="80%" height={16} /></Paper>))}
        </Box>
        <Box sx={{ p: 3 }}><Paper sx={{ borderRadius: '16px' }}><Skeleton variant="rectangular" height={60} /><Box sx={{ p: 3 }}><Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} /><Skeleton variant="rectangular" height={200} /></Box></Paper></Box>
      </Box>
    </MainLayout>
  );
};