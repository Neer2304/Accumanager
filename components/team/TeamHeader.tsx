import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Refresh,
  Settings,
  FilterList,
} from '@mui/icons-material';

interface TeamHeaderProps {
  title?: string;
  subtitle?: string;
  memberCount?: number;
  onAddProject?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onFilter?: () => void;
  autoRefresh?: boolean;
  onAutoRefreshChange?: (checked: boolean) => void;
  loading?: boolean;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  title = 'Team Activity',
  subtitle = "Track your team's project progress and recent activities",
  memberCount,
  onAddProject,
  onRefresh,
  onSettings,
  onFilter,
  autoRefresh = false,
  onAutoRefreshChange,
  loading = false,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {title}
            </Typography>
            {memberCount !== undefined && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {memberCount} members
              </Box>
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onAddProject && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddProject}
            >
              Add Project
            </Button>
          )}
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
          {onFilter && (
            <Tooltip title="Filter">
              <IconButton onClick={onFilter}>
                <FilterList />
              </IconButton>
            </Tooltip>
          )}
          {onSettings && (
            <Tooltip title="Settings">
              <IconButton onClick={onSettings}>
                <Settings />
              </IconButton>
            </Tooltip>
          )}
          {onAutoRefreshChange && (
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => onAutoRefreshChange(e.target.checked)}
                  size="small"
                />
              }
              label="Auto Refresh"
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};