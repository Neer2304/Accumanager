import React from 'react';
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
  Stack,
  Chip,
  Typography,
  alpha,
} from '@mui/material';

interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  projectId: string;
  projectName: string;
  assignedToName: string;
  estimatedHours: number;
}

interface Project {
  _id: string;
  name: string;
}

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    title: string;
    description: string;
    status: Task['status'];
    priority: Task['priority'];
    dueDate: string;
    projectId: string;
    assignedToName: string;
    estimatedHours: number;
  };
  setFormData: (data: any) => void;
  selectedTask: Task | null;
  isOnline: boolean;
  projects: Project[];
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  selectedTask,
  isOnline,
  projects,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* FIXED: DialogTitle with proper styling */}
      <DialogTitle
        component="div"
        sx={{
          background: 'linear-gradient(135deg, #0d9488 0%, #2563eb 100%)',
          color: 'white',
          py: 2.5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        />
        
        {/* Main title - FIXED: variant="h6" with component="div" */}
        <Typography 
          variant="h6" 
          component="div" 
          fontWeight="bold" 
          sx={{ 
            position: 'relative', 
            zIndex: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </Typography>
        
        {/* Subtitle and status chips */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ 
            position: 'relative', 
            zIndex: 1, 
            mt: 1 
          }}
        >
          {!isOnline && (
            <Chip 
              label="Offline Mode" 
              color="warning" 
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.9,
              color: 'rgba(255,255,255,0.9)'
            }}
          >
            {selectedTask ? 'Update task details' : 'Fill in task information'}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 3 }}>
            {/* Task Title */}
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              variant="outlined"
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
            />

            {/* Status and Priority */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="in_review">In Review</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Project and Due Date */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth required>
                <InputLabel>Project *</InputLabel>
                <Select
                  value={formData.projectId}
                  label="Project *"
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  required
                >
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      No projects available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Stack>

            {/* Assigned To and Estimated Hours */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Assigned To"
                value={formData.assignedToName}
                onChange={(e) => setFormData({ ...formData, assignedToName: e.target.value })}
                placeholder="Team member name"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 0 }}
                variant="outlined"
              />
            </Stack>
          </Box>
        </form>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!formData.projectId || !formData.title}
          onClick={onSubmit}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(135deg, #0d9488 0%, #2563eb 100%)',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #115e59 0%, #1e40af 100%)',
            },
          }}
        >
          {selectedTask ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};