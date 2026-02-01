"use client";

import React from 'react';
import { Box, Chip } from '@mui/material';
import { Input2 } from '../ui/input2';
import { Button2 } from '../ui/button2';
import { Tabs2 } from '../ui/tabs2';
import { CombinedIcon } from '../ui/icons2';

interface TabInfo {
  label: string;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

interface MessageToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: number;
  onTabChange: (value: number) => void;
  tabs: TabInfo[];
  onRefresh: () => void;
  onCompose: () => void;
  loading?: boolean;
}

export const MessageToolbar: React.FC<MessageToolbarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  tabs,
  onRefresh,
  onCompose,
  loading = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Input2
          fullWidth
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          startIcon={<CombinedIcon name="Search" size={16} />}
        />
        <Button2
          variant="outlined"
          onClick={onRefresh}
          loading={loading}
          iconLeft={<CombinedIcon name="Refresh" size={16} />}
          sx={{ minWidth: 40, height: 40 }}
        />
        <Button2
          variant="contained"
          onClick={onCompose}
          iconLeft={<CombinedIcon name="Add" size={16} />}
          sx={{ minWidth: 40, height: 40 }}
        >
          Compose
        </Button2>
      </Box>

      <Tabs2
        tabs={tabs.map(tab => ({
          ...tab,
          icon: tab.icon || (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span>{tab.label}</span>
              {tab.count && tab.count > 0 && (
                <Chip
                  label={tab.count}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem', ml: 0.5 }}
                />
              )}
            </Box>
          )
        }))}
        value={activeTab}
        onChange={(e, newValue) => onTabChange(newValue)}
      />
    </Box>
  );
};