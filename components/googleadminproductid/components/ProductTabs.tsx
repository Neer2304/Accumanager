// components/googleadminproductid/components/ProductTabs.tsx
import React from 'react';
import {
  Paper,
  Stack,
  Button,
  Chip,
  useTheme
} from '@mui/material';
import {
  Visibility,
  LocalOffer,
  Inventory,
  Receipt
} from '@mui/icons-material';
import { Product } from './types';

interface ProductTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  activeTab,
  onTabChange,
  product
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <Visibility /> },
    { key: 'variations', label: 'Variations', icon: <LocalOffer />, count: product.variations?.length },
    { key: 'batches', label: 'Batches', icon: <Inventory />, count: product.batches?.length },
    { key: 'gst', label: 'GST & Tax', icon: <Receipt /> },
  ];

  return (
    <Paper sx={{ 
      mb: 3, 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      overflow: 'hidden',
    }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0}>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            startIcon={tab.icon}
            onClick={() => onTabChange(tab.key)}
            sx={{
              flex: 1,
              py: 2,
              borderRadius: 0,
              color: activeTab === tab.key 
                ? (darkMode ? '#8ab4f8' : '#1a73e8')
                : (darkMode ? '#9aa0a6' : '#5f6368'),
              borderBottom: activeTab === tab.key 
                ? `3px solid ${darkMode ? '#8ab4f8' : '#1a73e8'}` 
                : '3px solid transparent',
              backgroundColor: activeTab === tab.key
                ? (darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)')
                : 'transparent',
              '&:hover': {
                backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
              }
            }}
          >
            {tab.label}
            {tab.count && tab.count > 0 && (
              <Chip 
                label={tab.count}
                size="small"
                sx={{ 
                  ml: 1,
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            )}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
};