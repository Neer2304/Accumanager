// app/admin/legal/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
  TextField,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import LegalDocumentEditor from '@/components/admin/LegalDocumentEditor';

interface LegalDocument {
  _id: string;
  type: string;
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
  lastUpdatedBy: {
    name: string;
    email: string;
  };
  isActive: boolean;
}

const documentTypes = [
  {
    type: 'privacy_policy',
    label: 'Privacy Policy',
    description: 'How user data is collected and used'
  },
  {
    type: 'terms_of_service',
    label: 'Terms of Service',
    description: 'Rules and guidelines for using the platform'
  },
  {
    type: 'cookie_policy',
    label: 'Cookie Policy',
    description: 'Information about cookies and tracking'
  }
];

export default function LegalDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/legal');
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  const handleEdit = (doc: LegalDocument) => {
    setEditingDoc(doc);
  };

  const handlePreview = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setPreviewDialog(true);
  };

  const handleSave = async (updatedDoc: LegalDocument) => {
    try {
      const response = await fetch(`/api/admin/legal/${updatedDoc.type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedDoc.title,
          content: updatedDoc.content,
          version: updatedDoc.version
        })
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Document updated successfully',
          severity: 'success'
        });
        fetchDocuments();
        setEditingDoc(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update document',
        severity: 'error'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Legal Documents Management
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchDocuments}
          variant="outlined"
        >
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DocumentIcon color="primary" />
                      <Typography variant="body1" fontWeight="medium">
                        {docType.label}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{docType.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={doc?.version || 'Not created'} 
                      color={doc ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {doc ? formatDate(doc.lastUpdated) : '-'}
                  </TableCell>
                  <TableCell>
                    {doc?.lastUpdatedBy?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={doc?.isActive ? 'Active' : 'Inactive'} 
                      color={doc?.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
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
                        onClick={() => doc ? handleEdit(doc) : handleEdit({
                          _id: '',
                          type: docType.type,
                          title: docType.label,
                          content: '',
                          version: '1.0.0',
                          lastUpdated: new Date().toISOString(),
                          lastUpdatedBy: { name: '', email: '' },
                          isActive: true
                        })}
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
              maxHeight: '60vh', 
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          >
            {editingDoc?.content || 'No content'}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          <Button 
            variant="contained"
            onClick={() => {
              setPreviewDialog(false);
              handleEdit(editingDoc!);
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