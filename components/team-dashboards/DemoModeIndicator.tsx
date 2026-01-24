// components/team-dashboard/DemoModeIndicator.tsx
import { Alert, AlertTitle, Button, Box, Chip, Typography } from '@mui/material';
import { Info, DataObject, Refresh, ExitToApp } from '@mui/icons-material';

interface DemoModeIndicatorProps {
  onExitDemo?: () => void;
  onRefreshDemo?: () => void;
  showDataInfo?: boolean;
}

export const DemoModeIndicator = ({ 
  onExitDemo, 
  onRefreshDemo,
  showDataInfo = true 
}: DemoModeIndicatorProps) => {
  return (
    <Alert 
      severity="info" 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.1) 100%)',
        border: '1px solid',
        borderColor: 'info.light'
      }}
      icon={<Info />}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onRefreshDemo && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<Refresh />}
              onClick={onRefreshDemo}
              sx={{ 
                borderColor: 'info.main',
                color: 'info.main',
                '&:hover': { borderColor: 'info.dark' }
              }}
            >
              Reload Demo
            </Button>
          )}
          {onExitDemo && (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<ExitToApp />}
              onClick={onExitDemo}
              sx={{ 
                bgcolor: 'info.main',
                '&:hover': { bgcolor: 'info.dark' }
              }}
            >
              Exit Demo
            </Button>
          )}
        </Box>
      }
    >
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <DataObject fontSize="small" />
        Demo Mode Active
        <Chip 
          label="SAMPLE DATA" 
          size="small" 
          color="info"
          sx={{ ml: 1, fontWeight: 'bold', fontSize: '0.7rem' }}
        />
      </AlertTitle>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        You are currently viewing sample data. All changes are temporary and will be reset on refresh.
      </Typography>
      
      {showDataInfo && (
        <Box sx={{ 
          mt: 1.5, 
          p: 1.5, 
          bgcolor: 'rgba(255,255,255,0.5)', 
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'info.light'
        }}>
          <Typography variant="caption" component="div" color="text.secondary" sx={{ mb: 0.5 }}>
            Demo includes:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip label="3 Sample Employees" size="small" variant="outlined" />
            <Chip label="12 Sample Tasks" size="small" variant="outlined" />
            <Chip label="Real-time Updates" size="small" variant="outlined" />
            <Chip label="Task Assignment" size="small" variant="outlined" />
          </Box>
        </Box>
      )}
    </Alert>
  );
};