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
import { Note } from '@/components/note/types';

// Import Google-themed component
import { Card } from '@/components/ui/Card';

interface NoteGridProps {
  notes?: Note[];
  loading: boolean;
  selectedNotes?: string[];
  viewMode?: 'grid' | 'list';
  emptyMessage?: string;
  onNoteSelect?: (note: Note) => void;
  onNoteEdit?: (note: Note) => void;
  onNoteDelete?: (note: Note) => void;
  onNoteArchive?: (note: Note) => void;
  onNoteShare?: (note: Note) => void;
  onCreateNote?: () => void;
  darkMode?: boolean;
}

export const NoteGrid: React.FC<NoteGridProps> = ({
  notes = [],
  loading,
  selectedNotes = [],
  viewMode = 'grid',
  emptyMessage = 'No notes found',
  onNoteSelect,
  onNoteEdit,
  onNoteDelete,
  onNoteArchive,
  onNoteShare,
  onCreateNote,
  darkMode = false,
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
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}
        />
        <Typography 
          variant="body1" 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124' 
          }}
        >
          Loading notes...
        </Typography>
      </Box>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Card 
          hover
          sx={{ 
            p: 6,
            maxWidth: 500,
            mx: 'auto',
            border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          }}
        >
          <SearchOff
            sx={{
              fontSize: 64,
              color: darkMode ? '#5f6368' : '#9aa0a6',
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: darkMode ? '#e8eaed' : '#202124',
              fontWeight: 500,
            }}
          >
            {emptyMessage}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 4, 
              maxWidth: 400, 
              mx: 'auto',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            Create your first note to start organizing your thoughts, ideas, and important information.
          </Typography>
          {onCreateNote && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={onCreateNote}
              sx={{
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                backgroundColor: '#34a853',
                '&:hover': { backgroundColor: '#2d9248' },
                boxShadow: '0 2px 8px rgba(52, 168, 83, 0.3)',
              }}
            >
              Create New Note
            </Button>
          )}
        </Card>
      </Box>
    );
  }

  // List view
  if (viewMode === 'list') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
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
            darkMode={darkMode}
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
        backgroundColor: darkMode ? '#202124' : '#ffffff',
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
          darkMode={darkMode}
        />
      ))}
    </Box>
  );
};