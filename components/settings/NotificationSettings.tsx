"use client";

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Switch,
  Chip,
} from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Button2 } from '../ui/button2';
import { Card2 } from '../ui/card2';
import { NotificationSettings as NotificationSettingsType } from '@/types/settings';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onSettingChange: (key: string, value: boolean) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const notificationOptions = [
    { key: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
    { key: 'push', label: 'Push Notifications', description: 'Get instant notifications on your device' },
    { key: 'salesAlerts', label: 'Sales Alerts', description: 'Get notified about new sales' },
    { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Alert when products are running low' },
    { key: 'newCustomerAlerts', label: 'New Customer Alerts', description: 'Notify when new customers register' },
    { key: 'billingReminders', label: 'Billing Reminders', description: 'Reminders for upcoming payments' },
    { key: 'monthlyReports', label: 'Monthly Reports', description: 'Receive monthly business reports' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      {/* Notification Types */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Notification Preferences
        </Typography>
        <Card2 sx={{ p: 2, borderRadius: 2, mb: 3 }}>
          <List>
            {notificationOptions.map((option) => (
              <ListItem key={option.key} sx={{ px: 0 }}>
                <ListItemText
                  primary={option.label}
                  secondary={option.description}
                  primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings[option.key as keyof NotificationSettingsType] as boolean}
                    onChange={() => onSettingChange(option.key, !settings[option.key as keyof NotificationSettingsType])}
                    color="primary"
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Card2>
      </Box>

      {/* Notification Channels */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Notification Channels
        </Typography>
        <Card2 sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Configure how you receive notifications
          </Typography>
          
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CombinedIcon name="Email" size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Email Notifications" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              />
              <Chip 
                label={settings.email ? "Active" : "Inactive"} 
                color={settings.email ? "success" : "default"} 
                size="small" 
                variant="outlined"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CombinedIcon name="WhatsApp" size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="WhatsApp Notifications" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              />
              <Button2 size="small" variant="outlined" sx={{ minWidth: 80 }}>
                Connect
              </Button2>
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CombinedIcon name="Telegram" size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Telegram Notifications" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              />
              <Button2 size="small" variant="outlined" sx={{ minWidth: 80 }}>
                Connect
              </Button2>
            </ListItem>
          </List>
        </Card2>
      </Box>
    </Box>
  );
};