import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
} from '@mui/material';

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  selectedProject: any;
  isOnline: boolean;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  selectedProject,
  isOnline,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle>
      <Stack direction="row" alignItems="center" spacing={2}>
        <span style={{ flex: 1 }}>{selectedProject ? 'Edit Project' : 'Create New Project'}</span>
        {!isOnline && <Chip label="Offline Mode" color="warning" size="small" />}
      </Stack>
    </DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField 
            label="Project Name" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            required 
            fullWidth 
          />
          
          <TextField 
            label="Description" 
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })} 
            multiline 
            rows={3} 
            fullWidth 
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} label="Status" onChange={e => setFormData({ ...formData, status: e.target.value })}>
                {['planning', 'active', 'paused', 'completed', 'cancelled', 'delayed'].map(s => (
                  <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={formData.priority} label="Priority" onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                {['low', 'medium', 'high', 'urgent'].map(p => (
                  <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField 
              label="Start Date" 
              type="date" 
              value={formData.startDate} 
              onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
              InputLabelProps={{ shrink: true }} 
              fullWidth 
            />
            
            <TextField 
              label="Deadline" 
              type="date" 
              value={formData.deadline} 
              onChange={e => setFormData({ ...formData, deadline: e.target.value })} 
              InputLabelProps={{ shrink: true }} 
              fullWidth 
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField 
              label="Budget ($)" 
              type="number" 
              value={formData.budget} 
              onChange={e => setFormData({ ...formData, budget: e.target.value })} 
              fullWidth 
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={formData.category} label="Category" onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {['sales', 'marketing', 'development', 'internal', 'client', 'other'].map(c => (
                  <MenuItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TextField 
            label="Client Name" 
            value={formData.clientName} 
            onChange={e => setFormData({ ...formData, clientName: e.target.value })} 
            fullWidth 
          />
          
          <TextField 
            label="Team Members (comma-separated)" 
            value={formData.teamMembers.join(', ')} 
            onChange={e => setFormData({ ...formData, teamMembers: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} 
            placeholder="John Doe, Jane Smith" 
            fullWidth 
          />
          
          <TextField 
            label="Tags (comma-separated)" 
            value={formData.tags.join(', ')} 
            onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} 
            placeholder="urgent, web, redesign" 
            fullWidth 
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" size="large">
          {selectedProject ? (isOnline ? 'Update Project' : 'Save Locally') : (isOnline ? 'Create Project' : 'Create Locally')}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);