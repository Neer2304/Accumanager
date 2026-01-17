// app/components/user-side/meetings&notes/components/NoteCard.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  CardContent,
  CardActions,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  PushPin,
  Delete,
  Edit,
  Share,
  Lock,
  LockOpen,
  Label,
  AccessTime,
} from '@mui/icons-material';
import { GlassCard } from '../common/GlassCard';
import { NoteCategoryChip } from '../common/NoteCategoryChip';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onShare?: (note: Note) => void;
  onTogglePin?: (note: Note) => void;
  compact?: boolean;
  showActions?: boolean;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onShare,
  onTogglePin,
  compact = false,
  showActions = true,
}: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getContentPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <GlassCard>
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        {/* Header with category and pin */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <NoteCategoryChip category={note.category} />
          
          <Stack direction="row" spacing={0.5}>
            {note.isEncrypted && (
              <Tooltip title="Encrypted Note">
                <Lock color="warning" fontSize="small" />
              </Tooltip>
            )}
            
            {note.isShared && (
              <Tooltip title="Shared Note">
                <Share color="info" fontSize="small" />
              </Tooltip>
            )}
            
            {note.isPinned && (
              <Tooltip title="Pinned">
                <PushPin color="warning" fontSize="small" />
              </Tooltip>
            )}
          </Stack>
        </Box>

        {/* Note Title */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {note.title}
        </Typography>

        {/* Content Preview */}
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            mb: compact ? 1 : 3,
            lineHeight: 1.6,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {note.isEncrypted ? '🔒 Encrypted content' : getContentPreview(note.content, compact ? 100 : 150)}
        </Typography>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && !compact && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {note.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  icon={<Label fontSize="small" />}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {note.tags.length > 3 && (
                <Chip
                  label={`+${note.tags.length - 3}`}
                  size="small"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Footer - Metadata */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Updated {formatDate(note.updatedAt)}
            </Typography>
          </Box>
          
          {note.wordCount && !compact && (
            <Typography variant="caption" color="text.secondary">
              {note.wordCount} words
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ 
          p: compact ? 1 : 2, 
          pt: 0,
          borderTop: 1, 
          borderColor: 'divider',
          justifyContent: 'space-between'
        }}>
          <Stack direction="row" spacing={compact ? 0.5 : 1}>
            {onEdit && (
              <Tooltip title="Edit Note">
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(note)}
                  sx={{ color: 'text.secondary' }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {onShare && (
              <Tooltip title="Share Note">
                <IconButton 
                  size="small" 
                  onClick={() => onShare(note)}
                  sx={{ color: 'primary.main' }}
                >
                  <Share fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {onTogglePin && (
              <Tooltip title={note.isPinned ? "Unpin Note" : "Pin Note"}>
                <IconButton 
                  size="small" 
                  onClick={() => onTogglePin(note)}
                  sx={{ color: note.isPinned ? 'warning.main' : 'text.secondary' }}
                >
                  <PushPin fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <Stack direction="row" spacing={compact ? 0.5 : 1}>
            {onDelete && (
              <Tooltip title="Delete Note">
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(note)}
                  sx={{ color: 'error.main' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </CardActions>
      )}
    </GlassCard>
  );
}