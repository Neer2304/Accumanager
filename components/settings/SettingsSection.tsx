import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  CardProps,
} from '@mui/material';

interface SettingsSectionProps extends CardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  children: ReactNode;
  iconColor?: string;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  iconColor = 'primary.main',
  sx,
  ...props
}) => {
  return (
    <Card sx={{ mb: 3, ...sx }} {...props}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ color: iconColor, mr: 1 }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {children}
      </CardContent>
    </Card>
  );
};

export default SettingsSection;