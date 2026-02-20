// components/googleadminlegal/components/LegalPreviewDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Typography,
  IconButton,
  Box,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { LegalDocument } from './types';

interface LegalPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  document: LegalDocument | null;
  onEdit: () => void;
}

export const LegalPreviewDialog: React.FC<LegalPreviewDialogProps> = ({
  open,
  onClose,
  document,
  onEdit
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  if (!document) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
        px: 3,
        py: 2,
      }}>
        <Box>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Preview: {document.title}
          </Typography>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Version: {document.version}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            maxHeight: "60vh",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            color: darkMode ? '#e8eaed' : '#202124',
          }}
        >
          {document.content || "No content"}
        </Paper>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          onClick={onClose}
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
            },
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            onEdit();
          }}
          startIcon={<EditIcon />}
          sx={{
            backgroundColor: '#1a73e8',
            '&:hover': { backgroundColor: '#1669c1' },
            borderRadius: '8px',
            px: 3,
          }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};