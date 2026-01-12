// app/admin/legal/page.tsx - Refactored using common components
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import LegalDocumentEditor from "@/components/admin/LegalDocumentEditor";
import LegalDocumentsTable from "@/components/admin/LegalDocumentsTable";
import { useLegalDocuments } from "@/hooks/useLegalDocuments";
import { LegalDocument, DocumentTypeConfig } from "@/types/legal";

const documentTypes: DocumentTypeConfig[] = [
  {
    type: "privacy_policy",
    label: "Privacy Policy",
    description: "How user data is collected and used",
    apiEndpoint: "privacy-policy"
  },
  {
    type: "terms_of_service", 
    label: "Terms of Service",
    description: "Rules and guidelines for using the platform",
    apiEndpoint: "terms-of-service"
  },
  {
    type: "cookie_policy",
    label: "Cookie Policy",
    description: "Information about cookies and tracking",
    apiEndpoint: "cookie-policy"
  },
  // Add more document types as needed
  {
    type: "refund_policy",
    label: "Refund Policy",
    description: "Policy for refunds and returns",
    apiEndpoint: "refund-policy"
  },
  {
    type: "shipping_policy",
    label: "Shipping Policy",
    description: "Information about shipping and delivery",
    apiEndpoint: "shipping-policy"
  }
];

export default function LegalDocumentsPage() {
  const {
    documents,
    loading,
    error,
    fetchAllDocuments,
    getDocumentByType,
    createInitialDocument,
    formatDate
  } = useLegalDocuments({ documentTypes });

  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchAllDocuments();
  }, [fetchAllDocuments]);

  const handleEdit = (docType: DocumentTypeConfig) => {
    const existingDoc = getDocumentByType(docType.type);
    
    if (existingDoc) {
      setEditingDoc(existingDoc);
    } else {
      setEditingDoc(createInitialDocument(docType));
    }
  };

  const handlePreview = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setPreviewDialog(true);
  };

  const handleSave = async (updatedDoc: LegalDocument) => {
    try {
      const docType = documentTypes.find(dt => dt.type === updatedDoc.type);
      if (!docType) {
        throw new Error("Invalid document type");
      }

      const response = await fetch(`/api/admin/legal/${docType.apiEndpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedDoc.title,
          content: updatedDoc.content,
          version: updatedDoc.version,
        }),
        credentials: "include",
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        setSnackbar({
          open: true,
          message: data.message || "Document saved successfully",
          severity: "success",
        });
        fetchAllDocuments();
        setEditingDoc(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to save document",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Legal Documents Management
        </Typography>
        <Button startIcon={<RefreshIcon />} onClick={fetchAllDocuments} variant="outlined">
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <LegalDocumentsTable
          documentTypes={documentTypes}
          documents={documents}
          formatDate={formatDate}
          onEdit={handleEdit}
          onPreview={handlePreview}
        />
      </Paper>

      {/* Edit Dialog */}
      {editingDoc && !previewDialog && (
        <LegalDocumentEditor
          document={editingDoc}
          open={!!editingDoc}
          onClose={() => setEditingDoc(null)}
          onSave={handleSave}
        />
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Preview: {editingDoc?.title}
          <Typography variant="caption" display="block" color="text.secondary">
            Version: {editingDoc?.version}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              maxHeight: "60vh",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
          >
            {editingDoc?.content || "No content"}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setPreviewDialog(false);
              if (editingDoc) {
                setEditingDoc(editingDoc);
              }
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}