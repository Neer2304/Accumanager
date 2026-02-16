// components/google/DataTable.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  SxProps,
  Theme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  onRowClick?: (item: T) => void;
  onMenuClick?: (item: T, event: React.MouseEvent<HTMLElement>) => void;
  renderAvatar?: (item: T) => { name: string; color?: string };
  getItemId: (item: T) => string;
  sx?: SxProps<Theme>;
}

export function DataTable<T>({
  title,
  subtitle,
  data,
  columns,
  loading = false,
  emptyMessage = 'No data found',
  emptyAction,
  onRowClick,
  onMenuClick,
  renderAvatar,
  getItemId,
  sx,
}: DataTableProps<T>) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getAvatarColor = (name: string) => {
    const colors = [
      '#4285f4', '#34a853', '#ea4335', '#fbbc04', '#8ab4f8',
      '#81c995', '#f28b82', '#fdd663', '#5f6368', '#9aa0a6',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Card
        title={title}
        subtitle={subtitle}
        hover
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          ...sx,
        }}
      >
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Loading...
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      title={title}
      subtitle={subtitle ? `${data.length} items • ${subtitle}` : `${data.length} items`}
      action={
        emptyAction && (
          <Button
            variant="contained"
            onClick={emptyAction.onClick}
            startIcon={<AddIcon />}
            disabled={emptyAction.disabled}
            sx={{
              backgroundColor: '#34a853',
              '&:hover': { backgroundColor: '#2d9248' },
            }}
          >
            {emptyAction.label}
          </Button>
        )
      }
      hover
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                margin: '0 auto 16px',
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
              {renderAvatar ? (
                <Avatar sx={{ bgcolor: getAvatarColor('Empty') }}>?</Avatar>
              ) : null}
            </Avatar>
            <Typography
              variant="h6"
              fontWeight={500}
              gutterBottom
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              {emptyMessage}
            </Typography>
            {emptyAction && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={emptyAction.onClick}
                disabled={emptyAction.disabled}
                sx={{
                  borderRadius: '28px',
                  px: 3,
                  py: 1,
                  mt: 2,
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  color: darkMode ? '#202124' : '#ffffff',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                  },
                }}
              >
                {emptyAction.label}
              </Button>
            )}
          </Box>
        ) : (
          data.map((item, index) => (
            <Paper
              key={getItemId(item)}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                transition: 'all 0.3s ease',
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
                '&:hover': onRowClick
                  ? {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode
                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                    }
                  : {},
              }}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {renderAvatar && (
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: renderAvatar(item).color || getAvatarColor(renderAvatar(item).name),
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    {renderAvatar(item).name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                )}

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      {columns.map((column) => {
                        if (column.render) {
                          return (
                            <Box key={String(column.id)}>
                              {column.render(item)}
                            </Box>
                          );
                        }
                        return null;
                      })}
                    </Box>

                    {onMenuClick && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Tooltip title="More actions">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMenuClick(item, e);
                            }}
                            sx={{
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              '&:hover': {
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                              },
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Card>
  );
}