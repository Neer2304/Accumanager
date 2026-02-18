// components/googlepipelinestages/components/StagesDialogs/DeleteStageDialog.tsx (FIXED)
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { GOOGLE_COLORS } from '../../constants';

interface DeleteStageDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stage: any;
  submitting: boolean;
  darkMode: boolean;
}

export const DeleteStageDialog: React.FC<DeleteStageDialogProps> = ({
  open,
  onClose,
  onConfirm,
  stage,
  submitting,
  darkMode
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          maxWidth: 400
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
        px: 4,
        py: 2.5,
      }}>
        {/* Removed the nested Typography h6, using variant="body1" instead */}
        <Typography variant="body1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Delete Pipeline Stage
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
          <Avatar sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: alpha(GOOGLE_COLORS.red, 0.1),
            color: GOOGLE_COLORS.red
          }}>
            <WarningIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1, fontWeight: 500 }}>
              Are you sure you want to delete "{stage?.name}"?
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              This action cannot be undone. Any deals in this stage will need to be moved to another stage.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
        justifyContent: 'center',
        gap: 2
      }}>
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            borderRadius: '24px',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : <DeleteIcon />}
          sx={{
            borderRadius: '24px',
            bgcolor: GOOGLE_COLORS.red,
            '&:hover': { bgcolor: '#b71c1c' },
            px: 4
          }}
        >
          {submitting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};