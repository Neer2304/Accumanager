// components/admin/LegalDocumentEditor.tsx
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material';

interface LegalDocumentEditorProps {
  document: any;
  open: boolean;
  onClose: () => void;
  onSave: (document: any) => void;
}

export default function LegalDocumentEditor({ 
  document, 
  open, 
  onClose, 
  onSave 
}: LegalDocumentEditorProps) {
  const [editedDoc, setEditedDoc] = useState(document);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setEditedDoc((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Basic validation
      if (!editedDoc.title.trim()) {
        throw new Error('Title is required');
      }
      if (!editedDoc.content.trim()) {
        throw new Error('Content is required');
      }
      if (!editedDoc.version.trim()) {
        throw new Error('Version is required');
      }

      await onSave(editedDoc);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit {document.title}
        <Typography variant="caption" display="block" color="text.secondary">
          Type: {document.type.replace('_', ' ').toUpperCase()}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Title"
            value={editedDoc.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
            required
          />
          
          <TextField
            label="Version"
            value={editedDoc.version}
            onChange={(e) => handleChange('version', e.target.value)}
            fullWidth
            required
            placeholder="1.0.0"
            helperText="Format: X.X.X"
          />
          
          <TextField
            label="Content"
            value={editedDoc.content}
            onChange={(e) => handleChange('content', e.target.value)}
            multiline
            rows={15}
            fullWidth
            required
            helperText="Supports Markdown formatting"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Document'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}