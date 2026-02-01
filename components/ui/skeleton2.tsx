"use client";

import React from 'react';
import { Box, Skeleton as MuiSkeleton, Card, CardContent } from '@mui/material';
import { Card2 } from './card2';

// Common Skeleton Text Component
export const SkeletonText = ({ 
  width = '100%', 
  height = 20, 
  variant = 'text' as 'text' | 'rounded' | 'rectangular',
  sx = {}
}: { 
  width?: string | number; 
  height?: number; 
  variant?: 'text' | 'rounded' | 'rectangular';
  sx?: any;
}) => (
  <MuiSkeleton 
    variant={variant} 
    width={width} 
    height={height} 
    sx={{ borderRadius: variant === 'text' ? 1 : 2, ...sx }} 
  />
);

// Common Skeleton Button Component
export const SkeletonButton = ({ 
  width = 120, 
  height = 40,
  sx = {}
}: { 
  width?: number; 
  height?: number;
  sx?: any;
}) => (
  <MuiSkeleton 
    variant="rectangular" 
    width={width} 
    height={height} 
    sx={{ borderRadius: 2, ...sx }} 
  />
);

// Common Skeleton Card Component
export const SkeletonCard = ({ 
  height = 200,
  showBadge = false,
  children
}: { 
  height?: number;
  showBadge?: boolean;
  children?: React.ReactNode;
}) => (
  <Card sx={{ height: '100%', position: 'relative', borderRadius: 3 }}>
    <CardContent sx={{ p: 3 }}>
      {showBadge && (
        <MuiSkeleton 
          variant="rectangular" 
          width={100} 
          height={24} 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            borderRadius: 12 
          }} 
        />
      )}
      
      {children || (
        <>
          <Box sx={{ mb: 3 }}>
            <SkeletonText width="60%" height={30} sx={{ mb: 1 }} />
            <SkeletonText width="80%" height={40} sx={{ mb: 1 }} />
            <SkeletonText width="50%" height={20} />
          </Box>

          <Box sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((feature) => (
              <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MuiSkeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                <SkeletonText width="80%" height={20} />
              </Box>
            ))}
          </Box>

          <SkeletonButton/>
        </>
      )}
    </CardContent>
  </Card>
);

// Common Navigation Skeleton
export const NavigationSkeleton = () => (
  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <SkeletonText width={120} height={40} />
    <Box sx={{ display: 'flex', gap: 2 }}>
      <SkeletonButton width={100} height={40} />
      <SkeletonButton width={100} height={40} />
    </Box>
  </Box>
);

// Common Header Skeleton
export const HeaderSkeleton = ({ 
  titleWidth = "60%",
  descriptionWidth = "80%"
}: { 
  titleWidth?: string;
  descriptionWidth?: string;
}) => (
  <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
    <SkeletonText width={titleWidth} height={60} sx={{ mx: 'auto', mb: 2 }} />
    <SkeletonText width={descriptionWidth} height={30} sx={{ mx: 'auto', mb: 4 }} />
    <SkeletonButton width={200} height={50} sx={{ mx: 'auto' }} />
  </Box>
);

// Common Grid Layout Skeleton
export const GridSkeleton = ({ 
  items = 4,
  cols = { xs: 12, sm: 6, md: 3 }
}: { 
  items?: number;
  cols?: { xs: number; sm: number; md: number };
}) => (
  <Box sx={{ 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: 3,
    justifyContent: 'center'
  }}>
    {Array.from({ length: items }).map((_, index) => (
      <Box key={index} sx={{ 
        width: { 
          xs: '100%', 
          sm: `calc(${100 / (cols.sm || 2)}% - 12px)`, 
          md: `calc(${100 / (cols.md || 4)}% - 12px)` 
        },
        minWidth: { xs: '100%', sm: '300px', md: '250px' }
      }}>
        <SkeletonCard />
      </Box>
    ))}
  </Box>
);

// Message List Skeleton
export const MessageListSkeleton = ({ count = 5 }: { count?: number }) => (
  <Box sx={{ p: 0 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <MuiSkeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <SkeletonText width="60%" height={20} sx={{ mb: 0.5 }} />
            <SkeletonText width="80%" height={16} />
          </Box>
          <SkeletonText width={60} height={16} />
        </Box>
        <SkeletonText width="90%" height={16} sx={{ mb: 0.5 }} />
        <SkeletonText width="70%" height={14} />
      </Box>
    ))}
  </Box>
);

// Message Detail Skeleton
export const MessageDetailSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ mb: 3 }}>
      <SkeletonText width="80%" height={32} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <MuiSkeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <SkeletonText width="40%" height={24} sx={{ mb: 0.5 }} />
          <SkeletonText width="60%" height={16} />
        </Box>
      </Box>
    </Box>
    
    <Box sx={{ mb: 3 }}>
      <SkeletonText width="100%" height={120} sx={{ mb: 2 }} />
      <SkeletonText width="100%" height={120} />
    </Box>
    
    <Box sx={{ mb: 3 }}>
      <SkeletonText width="30%" height={24} sx={{ mb: 2 }} />
      {[1, 2, 3].map((item) => (
        <Box key={item} sx={{ mb: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <SkeletonText width="60%" height={20} sx={{ mb: 0.5 }} />
              <SkeletonText width="40%" height={14} />
            </Box>
            <SkeletonButton width={100} height={32} />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

// Review Item Skeleton
export const ReviewItemSkeleton = ({ count = 3 }: { count?: number }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Card2 key={index} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, minWidth: 200 }}>
            <MuiSkeleton variant="circular" width={56} height={56} />
            <Box sx={{ flex: 1 }}>
              <MuiSkeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
              <MuiSkeleton variant="text" width={100} height={16} />
              <MuiSkeleton variant="text" width={80} height={14} />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MuiSkeleton variant="rectangular" width={120} height={24} />
              <MuiSkeleton variant="text" width={180} height={28} />
            </Box>
            <MuiSkeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
            <MuiSkeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
            <MuiSkeleton variant="text" width="80%" height={20} />
          </Box>
        </Box>
      </Card2>
    ))}
  </Box>
);

// Review Stats Skeleton
export const ReviewStatsSkeleton = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center',
    gap: 3,
    mb: 4,
    justifyContent: 'center'
  }}>
    <MuiSkeleton variant="rectangular" width={120} height={100} sx={{ borderRadius: 2 }} />
    <MuiSkeleton variant="rectangular" width={120} height={100} sx={{ borderRadius: 2 }} />
  </Box>
);