// components/googleadminlegal/components/LegalDocumentEditor.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  useTheme,
  CircularProgress,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { LegalDocument } from './types';

interface LegalDocumentEditorProps {
  document: LegalDocument;
  open: boolean;
  onClose: () => void;
  onSave: (doc: LegalDocument) => Promise<void>;
}

export const LegalDocumentEditor: React.FC<LegalDocumentEditorProps> = ({
  document,
  open,
  onClose,
  onSave
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [editedDoc, setEditedDoc] = useState<LegalDocument>(document);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (open) {
      setEditedDoc(document);
      setPreviewMode(false);
    }
  }, [open, document]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editedDoc);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof LegalDocument, value: string) => {
    setEditedDoc(prev => ({ ...prev, [field]: value }));
  };

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
          maxHeight: '90vh',
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
            {editedDoc._id ? 'Edit' : 'Create'} {editedDoc.title}
          </Typography>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Version: {editedDoc.version}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={previewMode}
                onChange={(e) => setPreviewMode(e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#1a73e8',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#1a73e8',
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Preview
                </Typography>
              </Box>
            }
          />
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {previewMode ? (
          <Box
            sx={{
              p: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              minHeight: 400,
              maxHeight: 500,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            {editedDoc.content}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Document Title"
              value={editedDoc.title}
              onChange={(e) => handleChange('title', e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />

            <TextField
              fullWidth
              label="Version"
              value={editedDoc.version}
              onChange={(e) => handleChange('version', e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Document Content
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={editedDoc.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Write your document content here..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          onClick={onClose}
          disabled={saving}
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
            },
          }}
        >
          Cancel
        </Button>
        {!previewMode && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{
              backgroundColor: '#1a73e8',
              '&:hover': { backgroundColor: '#1669c1' },
              borderRadius: '8px',
              px: 3,
            }}
          >
            {saving ? 'Saving...' : 'Save Document'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};