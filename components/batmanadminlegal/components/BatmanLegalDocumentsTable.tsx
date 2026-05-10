// components/batmanadminlegal/components/BatmanLegalDocumentsTable.tsx
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Box, Typography, Tooltip, alpha } from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon, Description as DescriptionIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';
import { LegalDocument, DocumentTypeConfig, batmanColors } from './types';

export const BatmanLegalDocumentsTable: React.FC<{ documentTypes: DocumentTypeConfig[]; documents: LegalDocument[]; formatDate: (date: string) => string; onEdit: (docType: DocumentTypeConfig) => void; onPreview: (doc: LegalDocument) => void; }> = ({ documentTypes, documents, formatDate, onEdit, onPreview }) => {
  const getDocumentStatus = (docType: DocumentTypeConfig) => {
    const doc = documents.find(d => d.type === docType.type);
    return { exists: !!doc, doc, lastUpdated: doc?.lastUpdated, updatedBy: doc?.lastUpdatedBy?.name || 'System' };
  };
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: `2px solid ${batmanColors.gold}`, overflow: 'hidden', backgroundColor: batmanColors.surface }}>
      <Table>
        <TableHead><TableRow sx={{ backgroundColor: batmanColors.surface2, borderBottom: `2px solid ${batmanColors.gold}` }}>
          <TableCell sx={{ fontWeight: 700, color: batmanColors.gold, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Document Type</TableCell>
          <TableCell sx={{ fontWeight: 700, color: batmanColors.gold, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
          <TableCell sx={{ fontWeight: 700, color: batmanColors.gold, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Version</TableCell>
          <TableCell sx={{ fontWeight: 700, color: batmanColors.gold, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Last Updated</TableCell>
          <TableCell sx={{ fontWeight: 700, color: batmanColors.gold, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Updated By</TableCell>
          <TableCell align="right" sx={{ fontWeight: 700, color: batmanColors.gold, borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
        </TableRow></TableHead>
        <TableBody>
          {documentTypes.map((docType) => {
            const { exists, doc, lastUpdated, updatedBy } = getDocumentStatus(docType);
            return (<TableRow key={docType.type} hover sx={{ '&:hover': { backgroundColor: batmanColors.goldSoft }, borderBottom: `1px solid ${batmanColors.border}` }}>
              <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: alpha(batmanColors.gold, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', color: batmanColors.gold }}><DescriptionIcon fontSize="small" /></Box><Box><Typography variant="body2" fontWeight="bold" sx={{ color: batmanColors.ink }}>{docType.label}</Typography><Typography variant="caption" sx={{ color: batmanColors.inkSub }}>{docType.description}</Typography></Box></Box></TableCell>
              <TableCell><Chip icon={exists ? <CheckCircleIcon /> : <ErrorIcon />} label={exists ? 'Published' : 'Draft'} size="small" sx={{ backgroundColor: exists ? alpha('#34a853', 0.15) : alpha('#fbbc04', 0.15), color: exists ? '#34a853' : '#fbbc04', border: 'none', fontWeight: 600 }} /></TableCell>
              <TableCell><Typography variant="body2" sx={{ color: batmanColors.ink }}>{doc?.version || '1.0.0'}</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ color: batmanColors.ink }}>{lastUpdated ? formatDate(lastUpdated) : 'Never'}</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ color: batmanColors.ink }}>{updatedBy}</Typography></TableCell>
              <TableCell align="right"><Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {exists && <Tooltip title="Preview"><IconButton size="small" onClick={() => onPreview(doc!)} sx={{ color: batmanColors.gold }}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>}
                <Tooltip title={exists ? "Edit" : "Create"}><IconButton size="small" onClick={() => onEdit(docType)} sx={{ color: batmanColors.gold }}><EditIcon fontSize="small" /></IconButton></Tooltip>
              </Box></TableCell>
            </TableRow>);
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};