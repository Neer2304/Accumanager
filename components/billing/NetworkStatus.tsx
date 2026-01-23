import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Badge,
  Paper,
} from "@mui/material";
import {
  CloudQueueIcon,
  CloudOffIcon,
  SyncIcon,
} from "@/assets/icons/BillingIcons";

interface NetworkStatusProps {
  isOnline: boolean;
  offlineBillsCount: number;
  onSyncClick: () => void;
  subscription?: {
    plan?: string;
    limits?: {
      invoices?: number;
    };
  };
  usage?: {
    invoices?: number;
  };
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isOnline,
  offlineBillsCount,
  onSyncClick,
  subscription,
  usage,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isOnline ? (
            <>
              <CloudQueueIcon color="success" />
              <Typography variant="body2" color="success.main">
                Online - Real-time billing
              </Typography>
            </>
          ) : (
            <>
              <CloudOffIcon color="warning" />
              <Typography variant="body2" color="warning.main">
                Offline - Bills saved locally
              </Typography>
            </>
          )}
          
          {offlineBillsCount > 0 && (
            <Tooltip title={`${offlineBillsCount} bills waiting to sync`}>
              <Badge badgeContent={offlineBillsCount} color="warning">
                <IconButton 
                  size="small" 
                  onClick={onSyncClick}
                  disabled={!isOnline}
                >
                  <SyncIcon />
                </IconButton>
              </Badge>
            </Tooltip>
          )}
        </Box>
        
        {subscription?.plan && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              component="span" 
              sx={{ 
                padding: '4px 8px',
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {subscription.plan.toUpperCase()}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {usage?.invoices || 0} / {subscription.limits?.invoices || 0} invoices
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};