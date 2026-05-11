// components/batmanadminlegal/components/BatmanLegalDocumentEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton, Divider, FormControlLabel, Switch, CircularProgress, alpha } from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { LegalDocument, batmanColors } from './types';

export const BatmanLegalDocumentEditor: React.FC<{ document: LegalDocument; open: boolean; onClose: () => void; onSave: (doc: LegalDocument) => Promise<void>; }> = ({ document, open, onClose, onSave }) => {
  const [editedDoc, setEditedDoc] = useState<LegalDocument>(document);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => { if (open) { setEditedDoc(document); setPreviewMode(false); } }, [open, document]);
  const handleSave = async () => { try { setSaving(true); await onSave(editedDoc); onClose(); } finally { setSaving(false); } };
  const handleChange = (field: keyof LegalDocument, value: string) => { setEditedDoc(prev => ({ ...prev, [field]: value })); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}`, maxHeight: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${batmanColors.gold}`, backgroundColor: batmanColors.surface2, px: 3, py: 2 }}>
        <Box><Typography variant="h6" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em' }}>{editedDoc._id ? 'Edit' : 'Create'} {editedDoc.title}</Typography><Typography variant="caption" sx={{ color: batmanColors.inkSub }}>Version: {editedDoc.version}</Typography></Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControlLabel control={<Switch checked={previewMode} onChange={(e) => setPreviewMode(e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: batmanColors.gold }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: batmanColors.gold } }} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><VisibilityIcon sx={{ fontSize: 16, color: batmanColors.gold }} /><Typography variant="body2" sx={{ color: batmanColors.ink }}>Preview</Typography></Box>} />
          <IconButton onClick={onClose} size="small" sx={{ color: batmanColors.inkMuted }}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {previewMode ? (
          <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: batmanColors.surface2, border: `2px solid ${batmanColors.gold}`, minHeight: 400, maxHeight: 500, overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem', color: batmanColors.ink }}>{editedDoc.content}</Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField fullWidth label="Document Title" value={editedDoc.title} onChange={(e) => handleChange('title', e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border }, '&:hover fieldset': { borderColor: batmanColors.gold } } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
            <TextField fullWidth label="Version" value={editedDoc.version} onChange={(e) => handleChange('version', e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border } } }} InputLabelProps={{ sx: { color: batmanColors.inkSub } }} />
            <Divider sx={{ borderColor: batmanColors.gold }} />
            <Box><Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: batmanColors.gold, letterSpacing: '0.05em' }}>Document Content</Typography>
              <TextField fullWidth multiline rows={12} value={editedDoc.content} onChange={(e) => handleChange('content', e.target.value)} placeholder="Enter document content..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: batmanColors.surface2, fontFamily: 'monospace', fontSize: '0.875rem', '& fieldset': { borderColor: batmanColors.border } } }} />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `2px solid ${batmanColors.gold}`, backgroundColor: batmanColors.surface2 }}>
        <Button onClick={onClose} disabled={saving} sx={{ color: batmanColors.inkSub }}>Cancel</Button>
        {!previewMode && <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={16} sx={{ color: '#0a0a0a' }} /> : <SaveIcon />} sx={{ backgroundColor: batmanColors.gold, color: '#0a0a0a', '&:hover': { backgroundColor: batmanColors.goldHov }, borderRadius: '12px', px: 3, fontWeight: 700 }}>{saving ? 'Saving...' : 'Save to Vault'}</Button>}
      </DialogActions>
    </Dialog>
  );
};