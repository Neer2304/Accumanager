// components/batmanprofile/components/BatmanProfileSkeleton.tsx
'use client';

import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { batmanColors } from '../types';

export const BatmanProfileSkeleton: React.FC = () => {
  return (
    <MainLayout title="Profile">
      <Box sx={{ minHeight: '100vh', backgroundColor: batmanColors.bg }}>
        <Box sx={{ p: 3, borderBottom: `2px solid ${batmanColors.gold}` }}>
          <Skeleton variant="text" width={200} height={30} sx={{ bgcolor: batmanColors.surface2, mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ bgcolor: batmanColors.surface2 }} />
            <Box sx={{ flex: 1 }}><Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: batmanColors.surface2 }} /><Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: batmanColors.surface2 }} /></Box>
          </Box>
        </Box>
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (<Paper key={i} sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200, p: 2, backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}` }}><Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: batmanColors.surface2 }} /><Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: batmanColors.surface2 }} /><Skeleton variant="text" width="80%" height={16} sx={{ bgcolor: batmanColors.surface2 }} /></Paper>))}
        </Box>
        <Box sx={{ p: 3 }}><Paper sx={{ borderRadius: '20px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}` }}><Skeleton variant="rectangular" height={60} sx={{ bgcolor: batmanColors.surface2 }} /><Box sx={{ p: 3 }}><Skeleton variant="text" width="30%" height={30} sx={{ bgcolor: batmanColors.surface2, mb: 2 }} /><Skeleton variant="rectangular" height={200} sx={{ bgcolor: batmanColors.surface2 }} /></Box></Paper></Box>
      </Box>
    </MainLayout>
  );
};