import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Slider,
  IconButton,
  useTheme,
} from '@mui/material';
import { ArrowBack, Update, AttachFile } from '@mui/icons-material';
import { EmployeeTask } from './types';

interface UpdateTaskDialogProps {
  open: boolean;
  isMobile: boolean;
  selectedTask: EmployeeTask | null;
  updateForm: {
    progress: number;
    hoursWorked: number;
    description: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  loading?: boolean;
}

export const UpdateTaskDialog: React.FC<UpdateTaskDialogProps> = ({
  open,
  isMobile,
  selectedTask,
  updateForm,
  onClose,
  onSubmit,
  onChange,
  loading = false,
}) => {
  const theme = useTheme();

  if (!selectedTask) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
            Update Task Progress
          </Typography>
          {isMobile && (
            <IconButton onClick={onClose} size="small">
              <ArrowBack />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {selectedTask.title}
        </Typography>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Progress */}
            <Box sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Current Progress: {selectedTask.progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={selectedTask.progress}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>

            {/* New Progress */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Update Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Slider
                  value={updateForm.progress}
                  onChange={(e, value) => onChange('progress', value as number)}
                  min={0}
                  max={100}
                  step={5}
                  sx={{ flex: 1 }}
                  disabled={loading}
                />
                <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ minWidth: 60 }}>
                  {updateForm.progress}%
                </Typography>
              </Box>
            </Box>

            {/* Hours Worked */}
            <TextField
              label="Hours Worked Today"
              type="number"
              value={updateForm.hoursWorked}
              onChange={(e) => onChange('hoursWorked', Number(e.target.value) || 0)}
              helperText="Enter hours spent on this task today"
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              disabled={loading}
              InputProps={{
                endAdornment: <Typography variant="caption">hours</Typography>,
              }}
            />

            {/* Update Description */}
            <TextField
              label="Update Description"
              multiline
              rows={isMobile ? 3 : 4}
              value={updateForm.description}
              onChange={(e) => onChange('description', e.target.value)}
              helperText="Describe what you worked on today"
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              required
              disabled={loading}
            />

            {/* Attachments */}
            <Box>
              <Button
                startIcon={<AttachFile />}
                size={isMobile ? 'small' : 'medium'}
                variant="outlined"
                fullWidth
                disabled={loading}
                onClick={() => {
                  // Handle file attachment
                }}
              >
                Attach Files (Optional)
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          {!isMobile && (
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
            disabled={loading || !updateForm.description.trim()}
            startIcon={<Update />}
          >
            {loading ? 'Updating...' : 'Submit Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};