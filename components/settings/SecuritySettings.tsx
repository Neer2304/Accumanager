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
  Slider,
  LinearProgress,
  Divider,
} from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';
import { SecuritySettings as SecuritySettingsType } from '@/types/settings';

interface SecuritySettingsProps {
  settings: SecuritySettingsType;
  onSettingChange: (key: string, value: any) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const securityFeatures = [
    { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account', icon: 'VpnKey' },
    { key: 'passwordChangeRequired', label: 'Password Change Required', description: 'Require regular password changes', icon: 'Lock' },
    { key: 'loginAlerts', label: 'Login Alerts', description: 'Get notified of new sign-ins', icon: 'Notifications' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      {/* Security Features */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Security Features
        </Typography>
        <Card2 sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <List>
            {securityFeatures.map((feature) => (
              <div key={feature.key}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CombinedIcon name={feature.icon as any} size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.label}
                    secondary={feature.description}
                    primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings[feature.key as keyof SecuritySettingsType] as boolean}
                      onChange={() => onSettingChange(feature.key, !settings[feature.key as keyof SecuritySettingsType])}
                      color="primary"
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Card2>
      </Box>

      {/* Session Settings */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Session Settings
        </Typography>
        
        <Card2 sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography gutterBottom variant="subtitle1" fontWeight={500}>
            Session Timeout
          </Typography>
          <Box sx={{ px: 2, py: 2 }}>
            <Slider
              value={settings.sessionTimeout}
              onChange={(_, value) => onSettingChange('sessionTimeout', value as number)}
              step={15}
              marks
              min={15}
              max={120}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} min`}
              sx={{
                '& .MuiSlider-markLabel': {
                  fontSize: '0.75rem',
                }
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Automatically log out after {settings.sessionTimeout} minutes of inactivity
          </Typography>
        </Card2>

        {/* Security Score */}
        <Card2 sx={{ 
          p: 3, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white' 
        }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Security Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h2">92</Typography>
            <Typography variant="h6">/ 100</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={92} 
            sx={{ 
              height: 8, 
              borderRadius: 4, 
              mb: 1,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
              }
            }} 
          />
          <Typography variant="caption">
            Excellent! Your security settings are well configured.
          </Typography>
        </Card2>
      </Box>
    </Box>
  );
};