// components/proadminlegal/ProLegalDocumentsPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { ProLegalHeader } from './components/ProLegalHeader';
import { ProLegalDocumentsTable } from './components/ProLegalDocumentsTable';
import { ProLegalDocumentEditor } from './components/ProLegalDocumentEditor';
import { ProLegalPreviewDialog } from './components/ProLegalPreviewDialog';
import { ProLegalSnackbar } from './components/ProLegalSnackbar';
import { ProLegalLoadingState } from './components/ProLegalLoadingState';
import { ProLegalErrorAlert } from './components/ProLegalErrorAlert';
import { useProLegalDocuments } from './hooks/useProLegalDocuments';
import { LegalDocument, DocumentTypeConfig, SnackbarState } from './components/types';

const documentTypes: DocumentTypeConfig[] = [
  { type: "privacy_policy", label: "Privacy Policy", description: "How user data is collected and used", apiEndpoint: "privacy-policy" },
  { type: "terms_of_service", label: "Terms of Service", description: "Rules and guidelines for using the platform", apiEndpoint: "terms-of-service" },
  { type: "cookie_policy", label: "Cookie Policy", description: "Information about cookies and tracking", apiEndpoint: "cookie-policy" },
  { type: "refund_policy", label: "Refund Policy", description: "Policy for refunds and returns", apiEndpoint: "refund-policy" },
  { type: "shipping_policy", label: "Shipping Policy", description: "Information about shipping and delivery", apiEndpoint: "shipping-policy" }
];

export default function ProLegalDocumentsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const { documents, loading, error, fetchAllDocuments, getDocumentByType, createInitialDocument, formatDate } = useProLegalDocuments({ documentTypes });
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
        setSnackbar({ open: true, message: data.message || "Document saved successfully", severity: "success" });
        fetchAllDocuments();
        setEditingDoc(null);
      } else throw new Error(data.message);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Failed to save document", severity: "error" });
    }
  };

  if (loading) return <ProLegalLoadingState />;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: darkMode ? '#202124' : '#f8f9fa', py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <ProLegalHeader title="Legal Documents Management" onRefresh={fetchAllDocuments} loading={loading} />
        {error && <Box sx={{ mt: 2 }}><ProLegalErrorAlert message={error} /></Box>}
        <Box sx={{ mt: 2 }}>
          <ProLegalDocumentsTable documentTypes={documentTypes} documents={documents} formatDate={formatDate} onEdit={handleEdit} onPreview={handlePreview} />
        </Box>
        {editingDoc && !previewDialog && <ProLegalDocumentEditor document={editingDoc} open={!!editingDoc} onClose={() => setEditingDoc(null)} onSave={handleSave} />}
        <ProLegalPreviewDialog open={previewDialog} onClose={() => setPreviewDialog(false)} document={editingDoc} onEdit={() => { setPreviewDialog(false); }} />
        <ProLegalSnackbar snackbar={snackbar} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} />
      </Container>
    </Box>
  );
}