import React from 'react';
import {
  Paper,
  Typography,
  List,
  Alert,
  Box,
  alpha,
  useTheme,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { AlertItem, AlertSeverity } from './AlertItem';

export interface SystemAlert {
  id: string;
  serviceId: string;
  serviceName: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface AlertsPanelProps {
  alerts: SystemAlert[];
  title?: string;
  showCount?: boolean;
  onResolveAlert?: (alertId: string) => void;
  maxHeight?: number;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  title = 'Active Alerts',
  showCount = true,
  onResolveAlert,
  maxHeight = 400,
}) => {
  const theme = useTheme();
  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => 
    alert.severity === 'high' || alert.severity === 'critical'
  );

  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 3,
      background: 'background.paper',
      boxShadow: theme.shadows[2],
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    }}>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'text.primary',
        mb: 3
      }}>
        <Warning />
        {title} {showCount && `(${activeAlerts.length})`}
      </Typography>

      {activeAlerts.length === 0 ? (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          No active alerts - all systems operational
        </Alert>
      ) : (
        <>
          {criticalAlerts.length > 0 && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              }}
            >
              <Typography variant="subtitle2">
                {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
              </Typography>
            </Alert>
          )}
          
          <List dense sx={{ maxHeight, overflow: 'auto' }}>
            {activeAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                {...alert}
                onResolve={onResolveAlert}
              />
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};