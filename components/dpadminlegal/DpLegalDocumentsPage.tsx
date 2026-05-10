// components/dpadminlegal/DpLegalDocumentsPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { DpLegalHeader } from './components/DpLegalHeader';
import { DpLegalDocumentsTable } from './components/DpLegalDocumentsTable';
import { DpLegalDocumentEditor } from './components/DpLegalDocumentEditor';
import { DpLegalPreviewDialog } from './components/DpLegalPreviewDialog';
import { DpLegalSnackbar } from './components/DpLegalSnackbar';
import { DpLegalLoadingState } from './components/DpLegalLoadingState';
import { DpLegalErrorAlert } from './components/DpLegalErrorAlert';
import { useDpLegalDocuments } from './hooks/useDpLegalDocuments';
import { LegalDocument, DocumentTypeConfig, SnackbarState, dpColors } from './components/types';

const documentTypes: DocumentTypeConfig[] = [
  { type: "privacy_policy", label: "Privacy Policy", description: "How we handle your data (Don't worry, we're not evil)", apiEndpoint: "privacy-policy" },
  { type: "terms_of_service", label: "Terms of Service", description: "The fine print (Read it or else!)", apiEndpoint: "terms-of-service" },
  { type: "cookie_policy", label: "Cookie Policy", description: "We love cookies (the digital kind)", apiEndpoint: "cookie-policy" },
  { type: "refund_policy", label: "Refund Policy", description: "Money back? Maybe. Depends on my mood.", apiEndpoint: "refund-policy" },
  { type: "shipping_policy", label: "Shipping Policy", description: "We ship faster than I can say Chimichanga", apiEndpoint: "shipping-policy" }
];

export default function DpLegalDocumentsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const { documents, loading, error, fetchAllDocuments, getDocumentByType, createInitialDocument, formatDate } = useDpLegalDocuments({ documentTypes });
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
        setSnackbar({ open: true, message: "Document saved! Maximum effort! 🦸", severity: "success" });
        fetchAllDocuments();
        setEditingDoc(null);
      } else throw new Error(data.message);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Failed to save document", severity: "error" });
    }
  };

  if (loading) return <DpLegalLoadingState />;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: dpColors.bg, py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <DpLegalHeader title="Legal Documents - Deadpool Edition" onRefresh={fetchAllDocuments} loading={loading} />
        {error && <Box sx={{ mt: 2 }}><DpLegalErrorAlert message={error} /></Box>}
        <Box sx={{ mt: 2 }}>
          <DpLegalDocumentsTable documentTypes={documentTypes} documents={documents} formatDate={formatDate} onEdit={handleEdit} onPreview={handlePreview} />
        </Box>
        {editingDoc && !previewDialog && <DpLegalDocumentEditor document={editingDoc} open={!!editingDoc} onClose={() => setEditingDoc(null)} onSave={handleSave} />}
        <DpLegalPreviewDialog open={previewDialog} onClose={() => setPreviewDialog(false)} document={editingDoc} onEdit={() => { setPreviewDialog(false); }} />
        <DpLegalSnackbar snackbar={snackbar} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} />
      </Container>
    </Box>
  );
}