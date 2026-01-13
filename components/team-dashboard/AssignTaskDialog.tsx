"use client";

import React, { useState } from 'react';
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
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add,
  Close,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
  Checklist,
} from '@mui/icons-material';

interface Employee {
  _id: string;
  name: string;
  role: string;
}

interface ChecklistItem {
  id: string;
  description: string;
  isCompleted: boolean;
}

interface AssignTaskDialogProps {
  open: boolean;
  onClose: () => void;
  employees: Employee[];
  onSubmit: (taskData: TaskFormData) => Promise<void>;
}

export interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  requirements: string;
  acceptanceCriteria: string;
  checklistItems: ChecklistItem[];
}

const categories = [
  'Development',
  'Design',
  'Testing',
  'Documentation',
  'Meeting',
  'Research',
  'Bug Fix',
  'Feature',
  'Maintenance',
  'Deployment',
];

const steps = ['Basic Info', 'Details', 'Checklist'];

export const AssignTaskDialog: React.FC<AssignTaskDialogProps> = ({
  open,
  onClose,
  employees,
  onSubmit,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedHours: 8,
    priority: 'medium',
    category: 'Development',
    requirements: '',
    acceptanceCriteria: '',
    checklistItems: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.assignedTo) newErrors.assignedTo = 'Please assign to an employee';
    }

    if (step === 1) {
      if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
      if (formData.estimatedHours <= 0) newErrors.estimatedHours = 'Hours must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        description: newChecklistItem.trim(),
        isCompleted: false,
      };
      setChecklistItems([...checklistItems, newItem]);
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    const finalData = {
      ...formData,
      checklistItems: checklistItems,
    };
    await onSubmit(finalData);
    setChecklistItems([]);
    setNewChecklistItem('');
    setActiveStep(0);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Task Title *"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              fullWidth
              error={!!errors.title}
              helperText={errors.title}
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              multiline
              rows={3}
              fullWidth
            />
            
            <FormControl fullWidth error={!!errors.assignedTo}>
              <InputLabel>Assign To *</InputLabel>
              <Select
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                label="Assign To *"
              >
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.name} ({emp.role})
                  </MenuItem>
                ))}
              </Select>
              {errors.assignedTo && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.assignedTo}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3 
            }}>
              <TextField
                label="Due Date"
                type="date"
                value={formData.dueDate.toISOString().split('T')[0]}
                onChange={(e) => setFormData({...formData, dueDate: new Date(e.target.value)})}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
              />
              
              <TextField
                label="Estimated Hours *"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({...formData, estimatedHours: Number(e.target.value)})}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                }}
                error={!!errors.estimatedHours}
                helperText={errors.estimatedHours}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3 
            }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              multiline
              rows={2}
              fullWidth
              placeholder="What needs to be done?"
            />
            
            <TextField
              label="Acceptance Criteria"
              value={formData.acceptanceCriteria}
              onChange={(e) => setFormData({...formData, acceptanceCriteria: e.target.value})}
              multiline
              rows={2}
              fullWidth
              placeholder="How will we know it's done?"
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checklist /> Task Checklist
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add specific items that need to be completed for this task. Employees can mark each item as done.
            </Typography>

            {/* Add new checklist item */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Add a checklist item (e.g., 'Design the homepage', 'Write unit tests', 'Deploy to staging')"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddChecklistItem}
                  disabled={!newChecklistItem.trim()}
                  startIcon={<Add />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Add
                </Button>
              </Box>
            </Paper>

            {/* Checklist items list */}
            {checklistItems.length > 0 ? (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {checklistItems.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Checkbox
                      checked={item.isCompleted}
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<CheckCircle color="success" />}
                      disabled
                    />
                    <ListItemText
                      primary={item.description}
                      sx={{
                        textDecoration: item.isCompleted ? 'line-through' : 'none',
                        color: item.isCompleted ? 'text.secondary' : 'text.primary',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover' }}>
                <Checklist sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No checklist items added yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add specific items that need to be completed
                </Typography>
              </Paper>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${checklistItems.length} items`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label="Optional"
                color="default"
                variant="outlined"
              />
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Assign New Task
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            onClick={activeStep === 0 ? onClose : handleBack}
            disabled={activeStep === 0}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={checklistItems.length === 0}
              >
                Assign Task
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};