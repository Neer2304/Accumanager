"use client";

import React from 'react';
import { Box } from '@mui/material';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import SearchIcon from '@mui/icons-material/Search';

interface MessageSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Input
        placeholder="Search messages..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        startIcon={<SearchIcon />}
        sx={{ flex: 1 }}
      />
    </Box>
  );
};