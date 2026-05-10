// components/dpadmindashboard/components/DpDashboardCardGrid.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { DpDashboardCard } from './DpDashboardCard';
import { AdminCardItem, dpColors } from './types';

export const DpDashboardCardGrid: React.FC<{ title: string; cards: AdminCardItem[]; onCardClick: (path: string) => void }> = ({ title, cards, onCardClick }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={800} sx={{ color: dpColors.ink, mb: 3 }}>{title}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }, gap: 3 }}>
        {cards.map((card) => (<DpDashboardCard key={card.id} {...card} onClick={onCardClick} />))}
      </Box>
    </Box>
  );
};