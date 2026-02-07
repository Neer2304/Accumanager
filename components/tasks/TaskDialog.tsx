// components/tasks/TaskDialog.tsx
"use client";

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Chip } from '@/components/ui/Chip';

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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={selectedTask ? 'Edit Task' : 'Create New Task'}
      subtitle={selectedTask ? 'Update task details' : 'Fill in task information'}
      actions={
        <>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: '12px',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#202124',
                backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
              },
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
              borderRadius: '12px',
              backgroundColor: '#4285f4',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#3367d6',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
              },
            }}
          >
            {selectedTask ? 'Update Task' : 'Create Task'}
          </Button>
        </>
      }
      sx={{
        maxWidth: 'md',
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: '800px',
        }
      }}
    >
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status Indicator */}
          {!isOnline && (
            <Chip
              label="Offline Mode"
              color="warning"
              size="small"
              variant="filled"
              sx={{
                alignSelf: 'flex-start',
                fontWeight: 500,
              }}
            />
          )}

          {/* Task Title */}
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
          />

          {/* Description */}
          <Input
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
          />

          {/* Status and Priority */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'todo', label: 'To Do' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'in_review', label: 'In Review' },
                { value: 'completed', label: 'Completed' },
                { value: 'blocked', label: 'Blocked' },
              ]}
              fullWidth
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
              fullWidth
            />
          </Stack>

          {/* Project and Due Date */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Select
              label="Project"
              value={formData.projectId}
              onChange={(e: any) => setFormData({ ...formData, projectId: e.target.value })}
              options={projects.length > 0 ? 
                projects.map(project => ({ value: project._id, label: project.name })) : 
                [{ value: '', label: 'No projects available', disabled: true }]
              }
              required
              fullWidth
            />

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          {/* Assigned To and Estimated Hours */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Input
              label="Assigned To"
              value={formData.assignedToName}
              onChange={(e) => setFormData({ ...formData, assignedToName: e.target.value })}
              placeholder="Team member name"
              fullWidth
            />

            <Input
              label="Estimated Hours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};