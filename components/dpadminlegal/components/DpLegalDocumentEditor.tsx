// components/dpadminlegal/components/DpLegalDocumentEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton, Divider, FormControlLabel, Switch, CircularProgress, alpha } from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { LegalDocument, dpColors } from './types';

export const DpLegalDocumentEditor: React.FC<{ document: LegalDocument; open: boolean; onClose: () => void; onSave: (doc: LegalDocument) => Promise<void>; }> = ({ document, open, onClose, onSave }) => {
  const [editedDoc, setEditedDoc] = useState<LegalDocument>(document);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => { if (open) { setEditedDoc(document); setPreviewMode(false); } }, [open, document]);
  const handleSave = async () => { try { setSaving(true); await onSave(editedDoc); onClose(); } finally { setSaving(false); } };
  const handleChange = (field: keyof LegalDocument, value: string) => { setEditedDoc(prev => ({ ...prev, [field]: value })); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, maxHeight: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${dpColors.border}`, backgroundColor: dpColors.surface2, px: 3, py: 2 }}>
        <Box><Typography variant="h6" fontWeight={800} sx={{ color: dpColors.red, letterSpacing: '-0.02em' }}>{editedDoc._id ? 'Edit' : 'Create'} {editedDoc.title}</Typography><Typography variant="caption" sx={{ color: dpColors.inkSub }}>Version: {editedDoc.version}</Typography></Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControlLabel control={<Switch checked={previewMode} onChange={(e) => setPreviewMode(e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: dpColors.red }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: dpColors.red } }} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><VisibilityIcon sx={{ fontSize: 16, color: dpColors.red }} /><Typography variant="body2" sx={{ color: dpColors.ink }}>Preview</Typography></Box>} />
          <IconButton onClick={onClose} size="small" sx={{ color: dpColors.inkMuted }}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {previewMode ? (
          <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: dpColors.surface2, border: `2px solid ${dpColors.border}`, minHeight: 400, maxHeight: 500, overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem', color: dpColors.ink }}>{editedDoc.content}</Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField fullWidth label="Document Title" value={editedDoc.title} onChange={(e) => handleChange('title', e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border }, '&:hover fieldset': { borderColor: dpColors.red } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
            <TextField fullWidth label="Version" value={editedDoc.version} onChange={(e) => handleChange('version', e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} InputLabelProps={{ sx: { color: dpColors.inkSub } }} />
            <Divider sx={{ borderColor: dpColors.border }} />
            <Box><Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: dpColors.ink }}>Document Content</Typography>
              <TextField fullWidth multiline rows={12} value={editedDoc.content} onChange={(e) => handleChange('content', e.target.value)} placeholder="Write your document content here..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: dpColors.surface2, fontFamily: 'monospace', fontSize: '0.875rem', '& fieldset': { borderColor: dpColors.border } } }} />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `2px solid ${dpColors.border}`, backgroundColor: dpColors.surface2 }}>
        <Button onClick={onClose} disabled={saving} sx={{ color: dpColors.inkSub }}>Cancel</Button>
        {!previewMode && <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon />} sx={{ backgroundColor: dpColors.red, '&:hover': { backgroundColor: dpColors.redHov }, borderRadius: '12px', px: 3, fontWeight: 700 }}>{saving ? 'Saving...' : 'Save Document'}</Button>}
      </DialogActions>
    </Dialog>
  );
};