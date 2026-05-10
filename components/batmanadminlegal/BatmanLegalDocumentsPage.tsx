// components/batmanadminlegal/BatmanLegalDocumentsPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { BatmanLegalHeader } from './components/BatmanLegalHeader';
import { BatmanLegalDocumentsTable } from './components/BatmanLegalDocumentsTable';
import { BatmanLegalDocumentEditor } from './components/BatmanLegalDocumentEditor';
import { BatmanLegalPreviewDialog } from './components/BatmanLegalPreviewDialog';
import { BatmanLegalSnackbar } from './components/BatmanLegalSnackbar';
import { BatmanLegalLoadingState } from './components/BatmanLegalLoadingState';
import { BatmanLegalErrorAlert } from './components/BatmanLegalErrorAlert';
import { useBatmanLegalDocuments } from './hooks/useBatmanLegalDocuments';
import { LegalDocument, DocumentTypeConfig, SnackbarState, batmanColors } from './components/types';

const documentTypes: DocumentTypeConfig[] = [
  { type: "privacy_policy", label: "Privacy Policy", description: "Gotham citizen data protection protocols", apiEndpoint: "privacy-policy" },
  { type: "terms_of_service", label: "Terms of Service", description: "Wayne Enterprises user agreement", apiEndpoint: "terms-of-service" },
  { type: "cookie_policy", label: "Cookie Policy", description: "Batcomputer tracking and analytics", apiEndpoint: "cookie-policy" },
  { type: "refund_policy", label: "Refund Policy", description: "WayneTech purchase protection", apiEndpoint: "refund-policy" },
  { type: "shipping_policy", label: "Shipping Policy", description: "Gotham-wide delivery protocols", apiEndpoint: "shipping-policy" }
];

export default function BatmanLegalDocumentsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const { documents, loading, error, fetchAllDocuments, getDocumentByType, createInitialDocument, formatDate } = useBatmanLegalDocuments({ documentTypes });
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: "", severity: "success" });

  useEffect(() => { fetchAllDocuments(); }, [fetchAllDocuments]);

  const handleEdit = (docType: DocumentTypeConfig) => {
    const existingDoc = getDocumentByType(docType.type);
    setEditingDoc(existingDoc || createInitialDocument(docType));
  };

  const handlePreview = (doc: LegalDocument) => { setEditingDoc(doc); setPreviewDialog(true); };
  
  const handleSave = async (updatedDoc: LegalDocument) => {
    try {
      const docType = documentTypes.find(dt => dt.type === updatedDoc.type);
      if (!docType) throw new Error("Invalid document type");
      const response = await fetch(`/api/admin/legal/${docType.apiEndpoint}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedDoc.title, content: updatedDoc.content, version: updatedDoc.version }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);
      if (data.success) {
        setSnackbar({ open: true, message: "Document secured in Batcomputer vault. 🦇", severity: "success" });
        fetchAllDocuments();
        setEditingDoc(null);
      } else throw new Error(data.message);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Failed to save document", severity: "error" });
    }
  };

  if (loading) return <BatmanLegalLoadingState />;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: batmanColors.bg, py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <BatmanLegalHeader title="Gotham Legal Vault" onRefresh={fetchAllDocuments} loading={loading} />
        {error && <Box sx={{ mt: 2 }}><BatmanLegalErrorAlert message={error} /></Box>}
        <Box sx={{ mt: 2 }}>
          <BatmanLegalDocumentsTable documentTypes={documentTypes} documents={documents} formatDate={formatDate} onEdit={handleEdit} onPreview={handlePreview} />
        </Box>
        {editingDoc && !previewDialog && <BatmanLegalDocumentEditor document={editingDoc} open={!!editingDoc} onClose={() => setEditingDoc(null)} onSave={handleSave} />}
        <BatmanLegalPreviewDialog open={previewDialog} onClose={() => setPreviewDialog(false)} document={editingDoc} onEdit={() => { setPreviewDialog(false); }} />
        <BatmanLegalSnackbar snackbar={snackbar} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} />
      </Container>
    </Box>
  );
}