import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  Paper,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  Upload,
  CloudUpload,
  Description,
  PictureAsPdf,
  TextFields,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface NoteImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (files: File[], options: ImportOptions) => Promise<ImportResult>;
}

interface ImportOptions {
  parseMetadata: boolean;
  preserveStructure: boolean;
  importTags: boolean;
  importAttachments: boolean;
  conflictResolution: 'skip' | 'overwrite' | 'rename';
}

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ fileName: string; error: string }>;
}

interface FileWithStatus {
  file: File;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export const NoteImportDialog: React.FC<NoteImportDialogProps> = ({
  open,
  onClose,
  onImport,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [options, setOptions] = useState<ImportOptions>({
    parseMetadata: true,
    preserveStructure: true,
    importTags: true,
    importAttachments: true,
    conflictResolution: 'rename',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'pending' as const,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setResult(null);
    
    // Update file statuses
    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));

    try {
      const result = await onImport(
        files.map(f => f.file),
        options
      );
      
      setResult(result);
      
      // Update file statuses based on result
      setFiles(prev => prev.map((fileWithStatus, index) => {
        const error = result.errors.find(e => 
          e.fileName === fileWithStatus.file.name
        );
        return {
          ...fileWithStatus,
          status: error ? 'error' : 'success',
          error: error?.error,
        };
      }));
    } catch (error) {
      console.error('Import failed:', error);
      setResult({
        success: 0,
        failed: files.length,
        errors: files.map(f => ({
          fileName: f.file.name,
          error: 'Failed to import',
        })),
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <PictureAsPdf />;
    if (fileName.endsWith('.md')) return <Description />;
    if (fileName.endsWith('.txt')) return <TextFields />;
    return <Description />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, minHeight: 500 },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Import Notes
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Import notes from files (JSON, Markdown, TXT, HTML, PDF)
        </Typography>
      </DialogContent>

      <DialogContent sx={{ p: 3 }}>
        {/* Drag & Drop Area */}
        {files.length === 0 && (
          <Paper
            {...getRootProps()}
            sx={{
              p: 6,
              mb: 3,
              textAlign: 'center',
              borderRadius: 3,
              border: `2px dashed ${
                isDragActive ? theme.palette.primary.main : theme.palette.divider
              }`,
              bgcolor: isDragActive
                ? alpha(theme.palette.primary.main, 0.05)
                : alpha(theme.palette.action.hover, 0.5),
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 2,
                opacity: 0.8,
              }}
            />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to browse files
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports: JSON, Markdown, TXT, HTML, PDF
            </Typography>
          </Paper>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Selected Files ({files.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 200, overflow: 'auto' }}>
              {files.map((fileWithStatus, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(
                      fileWithStatus.status === 'success'
                        ? theme.palette.success.main
                        : fileWithStatus.status === 'error'
                        ? theme.palette.error.main
                        : theme.palette.background.paper,
                      0.1
                    ),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: theme.palette.primary.main }}>
                      {getFileIcon(fileWithStatus.file.name)}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {fileWithStatus.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(fileWithStatus.file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {fileWithStatus.status === 'processing' && (
                      <LinearProgress sx={{ width: 100 }} />
                    )}
                    {fileWithStatus.status === 'success' && (
                      <CheckCircle sx={{ color: theme.palette.success.main }} />
                    )}
                    {fileWithStatus.status === 'error' && (
                      <Error sx={{ color: theme.palette.error.main }} />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => removeFile(index)}
                      disabled={loading}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Import Result */}
        {result && (
          <Alert
            severity={result.failed > 0 ? 'warning' : 'success'}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Import Complete
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${result.success} successful`}
                color="success"
                size="small"
              />
              <Chip
                label={`${result.failed} failed`}
                color="error"
                size="small"
              />
            </Box>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={loading || files.length === 0}
          startIcon={loading ? <LinearProgress size={20} /> : <Upload />}
        >
          {loading ? 'Importing...' : `Import ${files.length} file${files.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};