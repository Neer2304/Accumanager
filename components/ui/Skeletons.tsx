// components/ui/Skeletons.tsx
import { Box, Skeleton, Card, CardContent } from '@mui/material';

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
  <Skeleton 
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
  <Skeleton 
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
  <Card sx={{ height: '100%', position: 'relative' }}>
    <CardContent sx={{ p: 3 }}>
      {showBadge && (
        <Skeleton 
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
                <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
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