import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Box,
  Typography,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscription: {
    plan: string;
    status: string;
  };
  isActive: boolean;
}

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  editForm: {
    role: string;
    isActive: boolean;
    plan: string;
    status: string;
  };
  onEditFormChange: (form: any) => void;
  onUpdate: () => void;
  loading?: boolean;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onClose,
  user,
  editForm,
  onEditFormChange,
  onUpdate,
  loading = false,
}) => {
  const handleRoleChange = (e: SelectChangeEvent) => {
    onEditFormChange({ ...editForm, role: e.target.value });
  };

  const handlePlanChange = (e: SelectChangeEvent) => {
    onEditFormChange({ ...editForm, plan: e.target.value });
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    onEditFormChange({ ...editForm, status: e.target.value });
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEditFormChange({ ...editForm, isActive: e.target.checked });
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit User: {user.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={editForm.role}
              label="Role"
              onChange={handleRoleChange}
              disabled={loading}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Subscription Plan</InputLabel>
            <Select
              value={editForm.plan}
              label="Subscription Plan"
              onChange={handlePlanChange}
              disabled={loading}
            >
              <MenuItem value="trial">Trial</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Subscription Status</InputLabel>
            <Select
              value={editForm.status}
              label="Subscription Status"
              onChange={handleStatusChange}
              disabled={loading}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="trial">Trial</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Switch
              checked={editForm.isActive}
              onChange={handleActiveChange}
              disabled={loading}
            />
            <Typography>Account Active</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={onUpdate} 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};