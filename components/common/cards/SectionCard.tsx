import { Card, CardProps, CardContent, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';

interface SectionCardProps extends CardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'highlighted' | 'gradient';
}

export const SectionCard = ({ 
  title, 
  subtitle, 
  icon, 
  variant = 'default',
  children,
  ...props 
}: SectionCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'highlighted':
        return {
          border: '2px solid',
          borderColor: 'warning.main',
          backgroundColor: 'warning.light'
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          color: 'white'
        };
      default:
        return {};
    }
  };

  return (
    <Card sx={{ mb: 3, ...getVariantStyles() }} {...props}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          {icon && (
            <Box sx={{ color: variant === 'gradient' ? 'white' : 'primary.main', mt: 0.5 }}>
              {icon}
            </Box>
          )}
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" color={variant === 'gradient' ? 'white' : 'text.secondary'}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};