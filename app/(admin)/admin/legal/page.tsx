// app/admin/legal/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Description as DocumentIcon,
} from "@mui/icons-material";
import LegalDocumentEditor from "@/components/admin/LegalDocumentEditor";

interface LegalDocument {
  _id: string;
  type: string;
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
  lastUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
}

const documentTypes = [
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
];

export default function LegalDocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchDocument = async (docType: typeof documentTypes[0]) => {
    try {
      const response = await fetch(`/api/admin/legal/${docType.apiEndpoint}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Document doesn't exist yet
        }
        throw new Error(`Failed to fetch ${docType.label}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`Error fetching ${docType.label}:`, error);
      return null;
    }
  };

  const fetchAllDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const promises = documentTypes.map(docType => fetchDocument(docType));
      const results = await Promise.all(promises);

      const docs: LegalDocument[] = results
        .filter(doc => doc !== null)
        .map(doc => ({
          ...doc,
          type: doc.type // This will be 'privacy_policy', 'terms_of_service', etc.
        }));

      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || "Failed to load documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const getDocumentByType = (type: string) => {
    return documents.find((doc) => doc.type === type);
  };

  const handleEdit = (docType: typeof documentTypes[0]) => {
    const existingDoc = getDocumentByType(docType.type);
    
    if (existingDoc) {
      setEditingDoc(existingDoc);
    } else {
      // Create new document object
      setEditingDoc({
        _id: "",
        type: docType.type,
        title: docType.label,
        content: "# " + docType.label + "\n\nStart typing your content here...",
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: { _id: "", name: "", email: "" },
        isActive: true
      });
    }
  };

  const handlePreview = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setPreviewDialog(true);
  };

  const handleSave = async (updatedDoc: LegalDocument) => {
    try {
      // Find the document type config
      const docType = documentTypes.find(dt => dt.type === updatedDoc.type);
      if (!docType) {
        throw new Error("Invalid document type");
      }

      console.log("🔍 Saving to:", `/api/admin/legal/${docType.apiEndpoint}`);

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
      console.error("❌ Save error:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to save document",
        severity: "error",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentTypes.map((docType) => {
              const doc = getDocumentByType(docType.type);

              return (
                <TableRow key={docType.type}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DocumentIcon color="primary" />
                      <Typography variant="body1" fontWeight="medium">
                        {docType.label}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{docType.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc?.version || "Not created"}
                      color={doc ? "primary" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {doc ? formatDate(doc.lastUpdated) : "-"}
                  </TableCell>
                  <TableCell>{doc?.lastUpdatedBy?.name || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc?.isActive ? "Active" : "Not created"}
                      color={doc?.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => doc && handlePreview(doc)}
                        disabled={!doc}
                        title="Preview"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(docType)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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