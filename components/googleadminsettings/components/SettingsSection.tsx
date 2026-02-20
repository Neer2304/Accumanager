// components/googleadminsettings/components/SettingsSection.tsx
import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  CardProps,
  useTheme,
  alpha
} from '@mui/material';

interface SettingsSectionProps extends CardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  children: ReactNode;
  iconColor?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  iconColor = 'primary.main',
  sx,
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getIconColor = () => {
    if (iconColor.includes('primary')) return darkMode ? '#8ab4f8' : '#1a73e8';
    if (iconColor.includes('warning')) return '#fbbc04';
    if (iconColor.includes('error')) return '#ea4335';
    if (iconColor.includes('success')) return '#34a853';
    return darkMode ? '#8ab4f8' : '#1a73e8';
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 3,
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        overflow: 'hidden',
        ...sx 
      }} 
      {...props}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{ 
            color: getIconColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '8px',
            backgroundColor: alpha(getIconColor(), 0.1),
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Divider sx={{ 
          mb: 3,
          borderColor: darkMode ? '#3c4043' : '#dadce0'
        }} />
        {children}
      </CardContent>
    </Card>
  );
};