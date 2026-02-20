// components/googleapidocs/components/ApiExplorer.tsx
import React from 'react';
import {
  Box,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Category } from './types';

interface ApiExplorerProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  darkMode: boolean;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  darkMode
}) => {
  return (
    <Card
      title="🔍 API Explorer"
      subtitle="Browse and test all available endpoints"
      hover
      sx={{ 
        mb: { xs: 2, sm: 3, md: 4 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Input
            fullWidth
            placeholder="Search APIs by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            startIcon={<SearchIcon />}
          />
          
          <Input
            select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
            startIcon={<FilterListIcon />}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Input>
        </Box>
      </Box>
    </Card>
  );
};