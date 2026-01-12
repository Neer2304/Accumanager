import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import { Description, Update, Person } from '@mui/icons-material';
import { LegalDocument } from '@/types/legal';
import IconButton from '../buttons/IconButton';
import { Edit, Visibility } from '@mui/icons-material';

interface DocumentCardProps {
  document: LegalDocument;
  onEdit?: () => void;
  onPreview?: () => void;
  actions?: React.ReactNode;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onEdit,
  onPreview,
  actions,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <Description color="primary" />
          <Typography variant="h6" component="h3" noWrap>
            {document.title}
          </Typography>
          <Chip
            label={`v${document.version}`}
            size="small"
            color="primary"
            sx={{ ml: 'auto' }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {document.content.substring(0, 200)}...
        </Typography>

        <Stack spacing={1} sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Update fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Updated: {formatDate(document.lastUpdated)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              By: {document.lastUpdatedBy?.name || 'Unknown'}
            </Typography>
          </Box>

          <Chip
            label={document.isActive ? 'Active' : 'Inactive'}
            size="small"
            color={document.isActive ? 'success' : 'default'}
            sx={{ alignSelf: 'flex-start' }}
          />
        </Stack>
      </CardContent>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        {actions || (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              tooltip="Preview"
              onClick={onPreview}
              variant="outlined"
              size="small"
            >
              <Visibility fontSize="small" />
            </IconButton>
            <IconButton
              tooltip="Edit"
              onClick={onEdit}
              variant="contained"
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default DocumentCard;