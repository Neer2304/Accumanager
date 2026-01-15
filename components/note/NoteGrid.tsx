import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Add, NoteAdd, SearchOff } from '@mui/icons-material';
import { NoteCard } from './NoteCard';
import { Note } from './types';

interface NoteGridProps {
  notes?: Note[];  // Make optional
  loading: boolean;
  selectedNotes?: string[];  // Make optional
  viewMode?: 'grid' | 'list';
  emptyMessage?: string;
  onNoteSelect?: (note: Note) => void;
  onNoteEdit?: (note: Note) => void;
  onNoteDelete?: (note: Note) => void;
  onNoteArchive?: (note: Note) => void;
  onNoteShare?: (note: Note) => void;
  onCreateNote?: () => void;
}

export const NoteGrid: React.FC<NoteGridProps> = ({
  notes = [],  // Default to empty array
  loading,
  selectedNotes = [],  // Default to empty array
  viewMode = 'grid',
  emptyMessage = 'No notes found',
  onNoteSelect,
  onNoteEdit,
  onNoteDelete,
  onNoteArchive,
  onNoteShare,
  onCreateNote,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Loading notes...
        </Typography>
      </Box>
    );
  }

  // Check if notes is undefined/null or empty
  if (!notes || notes.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
        }}
      >
        <Paper
          sx={{
            p: 6,
            maxWidth: 500,
            mx: 'auto',
            background: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <SearchOff
            sx={{
              fontSize: 64,
              color: theme.palette.text.secondary,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {emptyMessage}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Create your first note to start organizing your thoughts, ideas, and important information.
          </Typography>
          {onCreateNote && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={onCreateNote}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              Create New Note
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  // List view
  if (viewMode === 'list') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            isSelected={selectedNotes.includes(note._id)}
            onSelect={onNoteSelect}
            onEdit={onNoteEdit}
            onDelete={onNoteDelete}
            onArchive={onNoteArchive}
            onShare={onNoteShare}
          />
        ))}
      </Box>
    );
  }

  // Grid view (default)
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          isSelected={selectedNotes.includes(note._id)}
          onSelect={onNoteSelect}
          onEdit={onNoteEdit}
          onDelete={onNoteDelete}
          onArchive={onNoteArchive}
          onShare={onNoteShare}
        />
      ))}
    </Box>
  );
};

// Optional: Add a default props configuration
// NoteGrid.defaultProps = {
//   notes: [],
//   selectedNotes: [],
//   viewMode: 'grid',
//   emptyMessage: 'No notes found',
// };