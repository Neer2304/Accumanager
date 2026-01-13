import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Divider,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import { Close, Person, TrendingUp, Info } from '@mui/icons-material';

interface MobileFiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  totalCustomers: number;
  activeCustomers: number;
  usage: number;
  limit: number;
}

export const MobileFiltersDrawer: React.FC<MobileFiltersDrawerProps> = ({
  open,
  onClose,
  totalCustomers,
  activeCustomers,
  usage,
  limit,
}) => {
  const usagePercentage = limit > 0 ? Math.round((usage / limit) * 100) : 0;
  const remaining = limit - usage;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 320,
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Filters & Statistics
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <List sx={{ pt: 2 }}>
        {/* Total Customers */}
        <ListItem>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Person sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Total Customers
                </Typography>
              </Box>
            }
            secondary={
              <Typography variant="h5" fontWeight="bold" color="primary">
                {totalCustomers}
              </Typography>
            }
          />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Active Customers */}
        <ListItem>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Active Customers
                </Typography>
              </Box>
            }
            secondary={
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {activeCustomers}
              </Typography>
            }
          />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Customer Usage */}
        <ListItem>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Info sx={{ fontSize: 16, color: 'info.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Customer Usage
                </Typography>
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    {usage} / {limit}
                  </Typography>
                  <Chip
                    label={`${usagePercentage}%`}
                    size="small"
                    color={
                      usagePercentage > 90
                        ? 'error'
                        : usagePercentage > 75
                        ? 'warning'
                        : 'primary'
                    }
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={usagePercentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    mb: 1,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {remaining} customers remaining
                </Typography>
              </Box>
            }
          />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Quick Stats Chips */}
        <ListItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Quick Stats
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                label={`${totalCustomers} Total`}
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip
                label={`${activeCustomers} Active`}
                size="small"
                variant="outlined"
                color="success"
              />
              <Chip
                label={`${remaining} Available`}
                size="small"
                variant="outlined"
                color="info"
              />
            </Stack>
          </Box>
        </ListItem>
      </List>

      {/* Help Text */}
      <Box
        sx={{
          p: 2,
          mt: 'auto',
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <strong>Note:</strong> Active customers are those who have placed at least one order.
        </Typography>
      </Box>
    </Drawer>
  );
};