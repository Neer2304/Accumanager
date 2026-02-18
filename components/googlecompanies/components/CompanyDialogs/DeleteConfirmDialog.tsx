// components/googlecompanies/components/CompanyDialogs/DeleteConfirmDialog.tsx
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
  alpha
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const GOOGLE_COLORS = {
  red: '#d93025'
};

interface Company {
  _id: string;
  name: string;
}

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  company: Company | null;
  deleting: boolean;
  darkMode: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  company,
  deleting,
  darkMode
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ 
        sx: { 
          borderRadius: '24px',
          maxWidth: 450,
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
        px: 4,
        py: 2.5,
      }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Delete Company
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
            <DeleteIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1, fontWeight: 500 }}>
              Are you sure you want to delete <strong>{company?.name}</strong>?
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              This action cannot be undone. All team members will be removed and you'll lose access to this company's data.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 3, 
        gap: 1.5,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          onClick={onClose}
          sx={{ 
            borderRadius: '24px',
            color: darkMode ? '#e8eaed' : '#202124',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={deleting}
          variant="contained"
          sx={{ 
            borderRadius: '24px',
            backgroundColor: GOOGLE_COLORS.red,
            '&:hover': { backgroundColor: '#b3141c' },
            px: 4,
            boxShadow: 'none'
          }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};