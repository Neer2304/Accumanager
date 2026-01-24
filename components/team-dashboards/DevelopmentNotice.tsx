// components/team-dashboard/DevelopmentNotice.tsx
import { Alert, AlertTitle, Button, Box, Chip, Typography } from '@mui/material';
import { Construction, Rocket, BugReport, Feedback } from '@mui/icons-material';

interface DevelopmentNoticeProps {
  onClose: () => void;
  isDemoMode?: boolean;
  onReportIssue?: () => void;
  onGiveFeedback?: () => void;
}

export const DevelopmentNotice = ({ 
  onClose, 
  isDemoMode = true,
  onReportIssue,
  onGiveFeedback 
}: DevelopmentNoticeProps) => {
  return (
    <Alert 
      severity="warning" 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'warning.light',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
      icon={<Construction />}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onReportIssue && (
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<BugReport />}
              onClick={onReportIssue}
            >
              Report Issue
            </Button>
          )}
          {onGiveFeedback && (
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Feedback />}
              onClick={onGiveFeedback}
            >
              Feedback
            </Button>
          )}
          <Button 
            color="inherit" 
            size="small"
            onClick={onClose}
          >
            Dismiss
          </Button>
        </Box>
      }
    >
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Construction fontSize="small" />
        Team Dashboard - Preview Release
        <Chip 
          label="Beta v1.0" 
          size="small" 
          color="warning"
          sx={{ ml: 1, fontWeight: 'bold' }}
        />
      </AlertTitle>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        Welcome to the preview version of our Team Dashboard. This feature is actively being developed 
        and may contain bugs or incomplete functionality.
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
        <Chip 
          icon={<Rocket />} 
          label="Active Development" 
          size="small" 
          color="warning" 
          variant="outlined" 
        />
        {isDemoMode && (
          <Chip 
            label="Demo Mode Active" 
            size="small" 
            color="info" 
            variant="outlined" 
          />
        )}
        <Chip 
          label="Preview Features" 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label="Data May Reset" 
          size="small" 
          color="error" 
          variant="outlined" 
        />
      </Box>
    </Alert>
  );
};