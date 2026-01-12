// components/admin/LegalDocumentsTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { Description as DocumentIcon } from '@mui/icons-material';
import { LegalDocument, DocumentTypeConfig } from '@/types/legal';

interface LegalDocumentsTableProps {
  documentTypes: DocumentTypeConfig[];
  documents: LegalDocument[];
  formatDate: (dateString: string) => string;
  onEdit: (docType: DocumentTypeConfig) => void;
  onPreview: (doc: LegalDocument) => void;
}

const LegalDocumentsTable: React.FC<LegalDocumentsTableProps> = ({
  documentTypes,
  documents,
  formatDate,
  onEdit,
  onPreview
}) => {
  const getDocumentByType = (type: string) => {
    return documents.find((doc) => doc.type === type);
  };

  return (
    <TableContainer>
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
                      onClick={() => doc && onPreview(doc)}
                      disabled={!doc}
                      title="Preview"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(docType)}
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
  );
};

export default LegalDocumentsTable;