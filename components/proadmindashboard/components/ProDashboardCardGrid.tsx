// components/proadmindashboard/components/ProDashboardCardGrid.tsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ProDashboardCard } from './ProDashboardCard';
import { AdminCardItem } from './types';

interface DashboardCardGridProps {
  title: string;
  cards: AdminCardItem[];
  onCardClick: (path: string) => void;
}

export const ProDashboardCardGrid: React.FC<DashboardCardGridProps> = ({ title, cards, onCardClick }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 3 }}>{title}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }, gap: 3 }}>
        {cards.map((card) => (<ProDashboardCard key={card.id} {...card} onClick={onCardClick} />))}
      </Box>
    </Box>
  );
};