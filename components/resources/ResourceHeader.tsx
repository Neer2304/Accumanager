// components/resources/ResourceHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';

interface ResourceHeaderProps {
  title?: string;
  subtitle?: string;
  module?: string;
}

export const ResourceHeader: React.FC<ResourceHeaderProps> = ({
  title = "Help & Resources Center",
  subtitle = "Everything you need to manage your business effectively",
  module
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        mb: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.primary.main,
          fontSize: 40,
          mb: 3,
          mx: 'auto',
        }}>
          <HelpIcon fontSize="inherit" />
        </Box>
        
        <Typography
          variant="h1"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            color: theme.palette.primary.main,
          }}
        >
          {module ? `${module} Resources` : title}
        </Typography>
        
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            maxWidth: 700,
            margin: '0 auto',
            fontWeight: 400,
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {subtitle}
        </Typography>

        {module && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mt: 2,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Module: {module}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};