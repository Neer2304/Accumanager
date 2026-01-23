// components/live-projects/HeaderSection.tsx
import { Paper, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Refresh, Rocket, BarChart } from '@mui/icons-material';

interface HeaderSectionProps {
  onRefresh: () => void;
  loading: boolean;
}

export const HeaderSection = ({ onRefresh, loading }: HeaderSectionProps) => {
  return (
    <Paper sx={{ 
      p: 4, 
      mb: 4, 
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        opacity: 0.3,
      }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            🚀 Live Project Tracker
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.1)',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}>
              <Rocket fontSize="small" sx={{ mr: 0.5 }} />
              PREVIEW
            </Box>
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChart fontSize="small" />
            Real-time monitoring of project progress and team performance
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton 
            onClick={onRefresh} 
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'rotate(90deg)',
                transition: 'transform 0.3s ease'
              }
            }} 
            disabled={loading}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};