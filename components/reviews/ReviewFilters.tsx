"use client";

import React from 'react';
import { Box, FormControl, InputLabel, MenuItem } from '@mui/material';
import { Input2 } from '../ui/input2';
import { Button2 } from '../ui/button2';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';

interface ReviewFiltersProps {
  searchTerm: string;
  filterRating: string;
  filterSort: string;
  onSearchChange: (value: string) => void;
  onFilterRatingChange: (value: string) => void;
  onFilterSortChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onWriteReview: () => void;
  isAuthenticated: boolean;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  searchTerm,
  filterRating,
  filterSort,
  onSearchChange,
  onFilterRatingChange,
  onFilterSortChange,
  onSearchSubmit,
  onWriteReview,
  isAuthenticated,
}) => {
  return (
    <Card2 sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' }
      }}>
        <form onSubmit={onSearchSubmit} style={{ flex: 1 }}>
          <Input2
            fullWidth
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            startIcon={<CombinedIcon name="Search" size={16} />}
          />
        </form>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Input2
              select
              value={filterRating}
              label="Rating"
              onChange={(e) => onFilterRatingChange(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Ratings</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </Input2>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Input2
              select
              value={filterSort}
              label="Sort By"
              onChange={(e) => onFilterSortChange(e.target.value)}
              size="small"
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="rating">Highest Rating</MenuItem>
              <MenuItem value="helpful">Most Helpful</MenuItem>
            </Input2>
          </FormControl>

          <Button2
            variant="contained"
            onClick={onWriteReview}
            iconLeft={<CombinedIcon name="Add" size={16} />}
            size="small"
          >
            Write Review
          </Button2>
        </Box>
      </Box>
    </Card2>
  );
};