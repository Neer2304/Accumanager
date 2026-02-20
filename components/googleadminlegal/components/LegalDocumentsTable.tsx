// components/googleadminlegal/components/LegalDocumentsTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { LegalDocument, DocumentTypeConfig } from './types';

interface LegalDocumentsTableProps {
  documentTypes: DocumentTypeConfig[];
  documents: LegalDocument[];
  formatDate: (date: string) => string;
  onEdit: (docType: DocumentTypeConfig) => void;
  onPreview: (doc: LegalDocument) => void;
}

export const LegalDocumentsTable: React.FC<LegalDocumentsTableProps> = ({
  documentTypes,
  documents,
  formatDate,
  onEdit,
  onPreview
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getDocumentStatus = (docType: DocumentTypeConfig) => {
    const doc = documents.find(d => d.type === docType.type);
    return {
      exists: !!doc,
      doc,
      lastUpdated: doc?.lastUpdated,
      updatedBy: doc?.lastUpdatedBy?.name || 'System'
    };
  };

  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        overflow: 'hidden',
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: 'none',
            }}>
              Document Type
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: 'none',
            }}>
              Status
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: 'none',
            }}>
              Version
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: 'none',
            }}>
              Last Updated
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: 'none',
            }}>
              Updated By
            </TableCell>
            <TableCell align="right" sx={{ 
              fontWeight: 600, 
              color: darkMode ? '#e8eaed' : '#202124',
              borderBottom: 'none',
            }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documentTypes.map((docType) => {
            const { exists, doc, lastUpdated, updatedBy } = getDocumentStatus(docType);
            
            return (
              <TableRow
                key={docType.type}
                hover
                sx={{
                  '&:hover': { 
                    backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4' 
                  },
                  borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      backgroundColor: alpha(darkMode ? '#8ab4f8' : '#1a73e8', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    }}>
                      <DescriptionIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {docType.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {docType.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Chip
                    icon={exists ? <CheckCircleIcon /> : <ErrorIcon />}
                    label={exists ? 'Published' : 'Draft'}
                    size="small"
                    sx={{
                      backgroundColor: exists 
                        ? alpha('#34a853', darkMode ? 0.1 : 0.1)
                        : alpha('#fbbc04', darkMode ? 0.1 : 0.1),
                      color: exists ? '#34a853' : '#fbbc04',
                      border: 'none',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: exists ? '#34a853' : '#fbbc04' },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {doc?.version || '1.0.0'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {lastUpdated ? formatDate(lastUpdated) : 'Never'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {updatedBy}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {exists && (
                      <Tooltip title="Preview">
                        <IconButton
                          size="small"
                          onClick={() => onPreview(doc!)}
                          sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={exists ? "Edit" : "Create"}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(docType)}
                        sx={{ color: darkMode ? '#fbbc04' : '#f57c00' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};