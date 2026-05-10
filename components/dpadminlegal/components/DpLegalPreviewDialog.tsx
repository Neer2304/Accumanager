// components/dpadminlegal/components/DpLegalPreviewDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, Typography, IconButton, Box } from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { LegalDocument, dpColors } from './types';

export const DpLegalPreviewDialog: React.FC<{ open: boolean; onClose: () => void; document: LegalDocument | null; onEdit: () => void; }> = ({ open, onClose, document, onEdit }) => {
  if (!document) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}` } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${dpColors.border}`, backgroundColor: dpColors.surface2, px: 3, py: 2 }}>
        <Box><Typography variant="h6" fontWeight={800} sx={{ color: dpColors.red }}>Preview: {document.title}</Typography><Typography variant="caption" sx={{ color: dpColors.inkSub }}>Version: {document.version}</Typography></Box>
        <IconButton onClick={onClose} size="small" sx={{ color: dpColors.inkMuted }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', backgroundColor: dpColors.surface2, border: `2px solid ${dpColors.border}`, maxHeight: "60vh", overflow: "auto", whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.875rem", color: dpColors.ink }}>{document.content || "No content"}</Paper>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `2px solid ${dpColors.border}`, backgroundColor: dpColors.surface2 }}>
        <Button onClick={onClose} sx={{ color: dpColors.inkSub }}>Close</Button>
        <Button variant="contained" onClick={() => { onClose(); onEdit(); }} startIcon={<EditIcon />} sx={{ backgroundColor: dpColors.red, '&:hover': { backgroundColor: dpColors.redHov }, borderRadius: '12px', px: 3 }}>Edit</Button>
      </DialogActions>
    </Dialog>
  );
};