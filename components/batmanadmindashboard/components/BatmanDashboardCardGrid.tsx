// components/batmanadmindashboard/components/BatmanDashboardCardGrid.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { BatmanDashboardCard } from './BatmanDashboardCard';
import { AdminCardItem, batmanColors } from './types';

interface BatmanDashboardCardGridProps {
  title: string;
  cards: AdminCardItem[];
  onCardClick: (path: string) => void;
}

export const BatmanDashboardCardGrid: React.FC<BatmanDashboardCardGridProps> = ({ 
  title, 
  cards, 
  onCardClick 
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h5" 
        fontWeight={800} 
        sx={{ 
          color: batmanColors.gold, 
          mb: 3, 
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}
      >
        {title}
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(5, 1fr)'
        },
        gap: 3
      }}>
        {cards.map((card) => (
          <BatmanDashboardCard
            key={card.id}
            {...card}
            onClick={onCardClick}
          />
        ))}
      </Box>
    </Box>
  );
};