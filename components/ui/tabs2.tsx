"use client";

import React from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, TabsProps as MuiTabsProps, TabProps as MuiTabProps } from '@mui/material';

interface Tabs2Props extends MuiTabsProps {
  tabs: Array<{
    label: string;
    icon?: React.ReactNode;
    count?: number;
    disabled?: boolean;
  }>;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
}

export const Tabs2: React.FC<Tabs2Props> = ({
  tabs,
  value,
  onChange,
  variant = 'scrollable',
  sx = {},
  ...props
}) => {
  return (
    <MuiTabs
      value={value}
      onChange={onChange}
      variant={variant}
      sx={{
        minHeight: 48,
        '& .MuiTab-root': {
          minHeight: 48,
          textTransform: 'none',
          fontSize: '0.875rem',
          minWidth: 'auto',
          px: 2,
        },
        ...sx,
      }}
      {...props}
    >
      {tabs.map((tab, index) => (
        <MuiTab
          key={index}
          label={tab.label}
        //   icon={tab.icon}
          iconPosition="start"
          disabled={tab.disabled}
        />
      ))}
    </MuiTabs>
  );
};

export const Tab2: React.FC<MuiTabProps> = (props) => (
  <MuiTab {...props} sx={{ textTransform: 'none', ...props.sx }} />
);