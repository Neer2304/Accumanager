// components/dpadminlegal/components/DpLegalDocumentsTable.tsx
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Box, Typography, Tooltip, alpha } from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon, Description as DescriptionIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';
import { LegalDocument, DocumentTypeConfig, dpColors } from './types';

export const DpLegalDocumentsTable: React.FC<{ documentTypes: DocumentTypeConfig[]; documents: LegalDocument[]; formatDate: (date: string) => string; onEdit: (docType: DocumentTypeConfig) => void; onPreview: (doc: LegalDocument) => void; }> = ({ documentTypes, documents, formatDate, onEdit, onPreview }) => {
  const getDocumentStatus = (docType: DocumentTypeConfig) => {
    const doc = documents.find(d => d.type === docType.type);
    return { exists: !!doc, doc, lastUpdated: doc?.lastUpdated, updatedBy: doc?.lastUpdatedBy?.name || 'System' };
  };
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: `2px solid ${dpColors.border}`, overflow: 'hidden', backgroundColor: dpColors.surface }}>
      <Table>
        <TableHead><TableRow sx={{ backgroundColor: dpColors.surface2, borderBottom: `2px solid ${dpColors.red}` }}>
          <TableCell sx={{ fontWeight: 700, color: dpColors.red, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Type</TableCell>
          <TableCell sx={{ fontWeight: 700, color: dpColors.red, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
          <TableCell sx={{ fontWeight: 700, color: dpColors.red, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Version</TableCell>
          <TableCell sx={{ fontWeight: 700, color: dpColors.red, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated</TableCell>
          <TableCell sx={{ fontWeight: 700, color: dpColors.red, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Updated By</TableCell>
          <TableCell align="right" sx={{ fontWeight: 700, color: dpColors.red, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
        </TableRow></TableHead>
        <TableBody>
          {documentTypes.map((docType) => {
            const { exists, doc, lastUpdated, updatedBy } = getDocumentStatus(docType);
            return (<TableRow key={docType.type} hover sx={{ '&:hover': { backgroundColor: dpColors.redSoft }, borderBottom: `1px solid ${dpColors.border}` }}>
              <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: alpha(dpColors.red, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', color: dpColors.red }}><DescriptionIcon fontSize="small" /></Box><Box><Typography variant="body2" fontWeight="bold" sx={{ color: dpColors.ink }}>{docType.label}</Typography><Typography variant="caption" sx={{ color: dpColors.inkSub }}>{docType.description}</Typography></Box></Box></TableCell>
              <TableCell><Chip icon={exists ? <CheckCircleIcon /> : <ErrorIcon />} label={exists ? 'Published' : 'Draft'} size="small" sx={{ backgroundColor: exists ? alpha('#34a853', 0.15) : alpha('#fbbc04', 0.15), color: exists ? '#34a853' : '#fbbc04', border: 'none', fontWeight: 600 }} /></TableCell>
              <TableCell><Typography variant="body2" sx={{ color: dpColors.ink }}>{doc?.version || '1.0.0'}</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ color: dpColors.ink }}>{lastUpdated ? formatDate(lastUpdated) : 'Never'}</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ color: dpColors.ink }}>{updatedBy}</Typography></TableCell>
              <TableCell align="right"><Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {exists && <Tooltip title="Preview"><IconButton size="small" onClick={() => onPreview(doc!)} sx={{ color: dpColors.red }}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>}
                <Tooltip title={exists ? "Edit" : "Create"}><IconButton size="small" onClick={() => onEdit(docType)} sx={{ color: dpColors.gold }}><EditIcon fontSize="small" /></IconButton></Tooltip>
              </Box></TableCell>
            </TableRow>);
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};