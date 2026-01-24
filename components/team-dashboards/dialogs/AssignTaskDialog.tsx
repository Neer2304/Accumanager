// components/team-dashboard/dialogs/AssignTaskDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Chip,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { Construction, PriorityHigh, Schedule, Category } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AssignFormData } from '../types';

interface AssignTaskDialogProps {
  open: boolean;
  onClose: () => void;
  assignForm: AssignFormData;
  onAssignFormChange: (data: AssignFormData) => void;
  availableEmployees: Array<{ _id: string; name: string; role: string }>;
  isDemoMode: boolean;
  onAssignTask: () => void;
}

export const AssignTaskDialog = ({
  open,
  onClose,
  assignForm,
  onAssignFormChange,
  availableEmployees,
  isDemoMode,
  onAssignTask
}: AssignTaskDialogProps) => {
  const theme = useTheme();

  const handleInputChange = (field: keyof AssignFormData, value: any) => {
    onAssignFormChange({ ...assignForm, [field]: value });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isDemoMode && <Construction color="warning" />}
          <Typography variant="h6" fontWeight="bold">
            Assign New Task
          </Typography>
          {isDemoMode && (
            <Chip
              label="Demo Mode"
              size="small"
              color="warning"
              icon={<Construction fontSize="small" />}
            />
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {isDemoMode && (
          <Alert 
            severity="info" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<Construction />}
          >
            In demo mode, tasks are temporarily added to the current view only.
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Task Title */}
          <TextField
            label="Task Title *"
            value={assignForm.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            fullWidth
            required
            autoFocus
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          {/* Description */}
          <TextField
            label="Description"
            value={assignForm.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Provide detailed instructions for this task..."
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          {/* Assign To */}
          <FormControl fullWidth>
            <InputLabel>Assign To *</InputLabel>
            <Select
              value={assignForm.assignedTo}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              label="Assign To *"
              required
              sx={{ borderRadius: 2 }}
            >
              {availableEmployees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{emp.name}</Typography>
                    <Chip 
                      label={emp.role} 
                      size="small" 
                      variant="outlined" 
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))}
              {availableEmployees.length === 0 && !isDemoMode && (
                <MenuItem disabled>
                  No employees available. Add employees first.
                </MenuItem>
              )}
            </Select>
          </FormControl>
          
          {/* Due Date */}
          <DatePicker
            label="Due Date *"
            value={assignForm.dueDate}
            onChange={(date) => date && handleInputChange('dueDate', date)}
            slotProps={{ 
              textField: { 
                fullWidth: true,
                sx: { borderRadius: 2 }
              } 
            }}
          />
          
          {/* Estimated Hours */}
          <TextField
            label="Estimated Hours"
            type="number"
            value={assignForm.estimatedHours}
            onChange={(e) => handleInputChange('estimatedHours', Number(e.target.value) || 0)}
            fullWidth
            InputProps={{ 
              inputProps: { min: 1, max: 100 },
              sx: { borderRadius: 2 }
            }}
          />
          
          {/* Priority and Category Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={assignForm.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as any)}
                label="Priority"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="low">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PriorityHigh color="success" />
                    Low Priority
                  </Box>
                </MenuItem>
                <MenuItem value="medium">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PriorityHigh color="info" />
                    Medium Priority
                  </Box>
                </MenuItem>
                <MenuItem value="high">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PriorityHigh color="warning" />
                    High Priority
                  </Box>
                </MenuItem>
                <MenuItem value="urgent">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PriorityHigh color="error" />
                    Urgent Priority
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={assignForm.category}
                onChange={(e) => handleInputChange('category', e.target.value as any)}
                label="Category"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="daily">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule />
                    Daily Work
                  </Box>
                </MenuItem>
                <MenuItem value="project">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Category />
                    Project Task
                  </Box>
                </MenuItem>
                <MenuItem value="urgent">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PriorityHigh color="error" />
                    Urgent
                  </Box>
                </MenuItem>
                <MenuItem value="training">
                  Training & Development
                </MenuItem>
                <MenuItem value="maintenance">
                  Maintenance
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {/* Preview Info */}
          {assignForm.title && assignForm.assignedTo && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Task Preview:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={assignForm.title} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Due: ${assignForm.dueDate.toLocaleDateString()}`} 
                  size="small" 
                  variant="outlined" 
                  color="primary"
                />
                <Chip 
                  label={`Priority: ${assignForm.priority}`} 
                  size="small" 
                  variant="outlined" 
                  color={
                    assignForm.priority === 'urgent' ? 'error' :
                    assignForm.priority === 'high' ? 'warning' : 'info'
                  }
                />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onAssignTask}
          disabled={!assignForm.title || !assignForm.assignedTo}
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a6499 100%)'
            }
          }}
        >
          {isDemoMode ? 'Assign (Demo Mode)' : 'Assign Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};