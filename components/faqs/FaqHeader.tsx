// components/faqs/FaqHeader.tsx
import React from 'react';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';
import { HelpIcon, LightbulbIcon } from './icons/FaqIcons';

interface FaqHeaderProps {
  title?: string;
  subtitle?: string;
}

export const FaqHeader: React.FC<FaqHeaderProps> = ({
  title = "Frequently Asked Questions",
  subtitle = "Find quick answers to common questions about our attendance management system",
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        mb: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Icons */}
      <HelpIcon
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: 60,
          opacity: 0.1,
          color: theme.palette.primary.main,
        }}
      />
      <LightbulbIcon
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          fontSize: 60,
          opacity: 0.1,
          color: theme.palette.primary.main,
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <HelpIcon fontSize="small" />
          <Typography variant="overline" fontWeight="bold">
            HELP CENTER
          </Typography>
        </Box>
        
        <Typography
          variant="h1"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            maxWidth: 700,
            margin: '0 auto',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
};