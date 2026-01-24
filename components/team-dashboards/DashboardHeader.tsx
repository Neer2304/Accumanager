// components/team-dashboard/DashboardHeader.tsx
import { Paper, Box, Typography, Chip, Button, IconButton, Tooltip } from '@mui/material';
import { 
  Construction, 
  Refresh, 
  Add, 
  Download, 
  FilterList, 
  Settings,
  Groups,
  Analytics
} from '@mui/icons-material';

interface DashboardHeaderProps {
  isDemoMode?: boolean;
  onAssignTask: () => void;
  onRefresh: () => void;
  onLoadDemo?: () => void;
  onExport?: () => void;
  onFilter?: () => void;
  onSettings?: () => void;
}

export const DashboardHeader = ({
  isDemoMode = false,
  onAssignTask,
  onRefresh,
  onLoadDemo,
  onExport,
  onFilter,
  onSettings
}: DashboardHeaderProps) => {
  return (
    <Paper sx={{ 
      p: { xs: 2, md: 3 }, 
      mb: 3, 
      position: 'relative',
      borderRadius: 3,
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      border: '1px solid',
      borderColor: 'divider',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40%',
        height: '100%',
        background: 'radial-gradient(circle at 80% 50%, rgba(102, 126, 234, 0.03) 0%, transparent 70%)',
        zIndex: 0
      }} />
      
      {/* Status Badges */}
      <Box sx={{ 
        position: 'absolute', 
        top: 12, 
        right: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        zIndex: 1
      }}>
        {isDemoMode && (
          <Chip
            size="small"
            label="DEMO MODE"
            color="warning"
            icon={<Construction fontSize="small" />}
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        )}
        <Chip
          size="small"
          label="PREVIEW"
          color="info"
          icon={<Analytics fontSize="small" />}
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <Groups fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  👥 Team Work Dashboard
                  <Chip 
                    label="Beta" 
                    size="small" 
                    color="primary" 
                    sx={{ fontSize: '0.7rem', height: 20 }} 
                  />
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Assign tasks, track progress, and monitor team performance
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 6.5 }}>
              <Construction fontSize="inherit" />
              Preview feature - Data may not persist
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {onLoadDemo && (
              <Tooltip title="Load demo data">
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={onLoadDemo}
                  sx={{ display: isDemoMode ? 'flex' : 'none' }}
                >
                  Reload Demo
                </Button>
              </Tooltip>
            )}
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onFilter && (
                <Tooltip title="Filter view">
                  <IconButton onClick={onFilter}>
                    <FilterList />
                  </IconButton>
                </Tooltip>
              )}
              
              {onExport && (
                <Tooltip title="Export data">
                  <IconButton onClick={onExport}>
                    <Download />
                  </IconButton>
                </Tooltip>
              )}
              
              {onSettings && (
                <Tooltip title="Settings">
                  <IconButton onClick={onSettings}>
                    <Settings />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Refresh data">
                <IconButton onClick={onRefresh}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAssignTask}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a6499 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              Assign Task
            </Button>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
          pt: 2,
          borderTop: '1px dashed',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="Task Management" size="small" color="success" variant="outlined" />
            <Typography variant="caption" color="text.secondary">✓ Ready</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="Progress Tracking" size="small" color="success" variant="outlined" />
            <Typography variant="caption" color="text.secondary">✓ Ready</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="Real-time Updates" size="small" color="warning" variant="outlined" />
            <Typography variant="caption" color="text.secondary">⏳ Coming Soon</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="AI Insights" size="small" color="warning" variant="outlined" />
            <Typography variant="caption" color="text.secondary">⏳ In Progress</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};