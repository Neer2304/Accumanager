// components/googleadminusers/EditUserDialog.tsx

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
import { User } from './types';

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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #e0e0e0',
        color: '#202124',
        fontWeight: 500,
        pb: 2,
      }}>
        Edit User: {user.name}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#5f6368' }}>Role</InputLabel>
            <Select
              value={editForm.role}
              label="Role"
              onChange={handleRoleChange}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1a73e8',
                },
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#5f6368' }}>Subscription Plan</InputLabel>
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
              <MenuItem value="none">No Plan</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#5f6368' }}>Subscription Status</InputLabel>
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
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#0b8043',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#0b8043',
                },
              }}
            />
            <Typography sx={{ color: '#202124' }}>Account Active</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ 
            color: '#5f6368',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#f1f3f4',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onUpdate} 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            backgroundColor: '#1a73e8',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#1557b0',
            },
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};