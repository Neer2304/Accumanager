"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Category,
  Label,
  PriorityHigh,
  Lock,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from './hooks/useNotes';
import { NoteHeader } from './components/NoteHeader';
import { NotePasswordDialog } from './components/NotePasswordDialog';
import { NoteDeleteDialog } from './components/NoteDeleteDialog';
import { NoteArchiveDialog } from './components/NoteArchiveDialog';
import { Note } from './types/note.types';

function NoteDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  const { fetchNote, updateNote, deleteNote } = useNotes();
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  useEffect(() => {
    if (id) {
      const noteId = Array.isArray(id) ? id[0] : id;
      loadNote(noteId);
    } else {
      setError('Note ID is missing from URL');
      setLoading(false);
    }
  }, [id]);

  const loadNote = async (noteId: string, pwd?: string) => {
    try {
      setLoading(true);
      setError('');
      const noteData = await fetchNote(noteId, pwd);
      setNote(noteData);
      setRequiresPassword(false);
    } catch (err: any) {
      if (err.message.includes('Password required')) {
        setRequiresPassword(true);
      } else if (err.message.includes('Invalid password')) {
        setError('Invalid password. Please try again.');
      } else {
        setError(err.message || 'Failed to load note');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (id) {
      const noteId = Array.isArray(id) ? id[0] : id;
      await loadNote(noteId, password);
    }
  };

  const handleEdit = () => {
    if (note) {
      router.push(`/note/${note._id}/edit`);
    }
  };

  const handleArchive = async () => {
    try {
      if (!note) return;
      await updateNote(note._id, { 
        status: note.status === 'archived' ? 'active' : 'archived' 
      });
      loadNote(note._id);
      setShowArchiveDialog(false);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleDelete = async () => {
    try {
      if (!note) return;
      await deleteNote(note._id);
      router.push('/notes');
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (requiresPassword) {
    return (
      <NotePasswordDialog
        open={requiresPassword}
        onClose={() => router.push('/notes')}
        onSubmit={handlePasswordSubmit}
      />
    );
  }

  if (!note) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Note not found or you don\'t have permission to view it.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <NoteHeader
        title={`${note.icon} ${note.title}`}
        subTitle={`Updated ${new Date(note.updatedAt).toLocaleDateString()}`}
        noteId={note._id}
        mode="view"
        onEdit={handleEdit}
        onDelete={() => setShowDeleteDialog(true)}
        onArchive={() => setShowArchiveDialog(true)}
        noteStatus={note.status}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tags and Info */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            icon={<Category />}
            label={note.category}
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<PriorityHigh />}
            label={note.priority}
            color={
              note.priority === 'high' || note.priority === 'critical' 
                ? 'error' 
                : note.priority === 'medium' 
                  ? 'warning' 
                  : 'default'
            }
            size="small"
          />
          <Chip
            label={`${note.wordCount} words`}
            size="small"
          />
          <Chip
            label={`${note.readTime} min read`}
            size="small"
          />
          {note.passwordProtected && (
            <Chip
              icon={<Lock />}
              label="Protected"
              color="warning"
              size="small"
            />
          )}
          {note.isPublic && (
            <Chip
              label="Public"
              color="success"
              size="small"
            />
          )}
        </Box>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Label fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            {note.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Summary */}
      {note.summary && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Summary
          </Typography>
          <Typography>{note.summary}</Typography>
        </Paper>
      )}

      {/* Content */}
      <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Content
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {note.content}
        </Box>
      </Paper>

      {/* Stats */}
      <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Read {note.readCount} times
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last read: {note.readCount > 0 ? 'Recently' : 'Never'}
          </Typography>
        </Stack>
      </Paper>

      {/* Dialogs */}
      <NoteDeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />

      <NoteArchiveDialog
        open={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleArchive}
        isArchived={note.status === 'archived'}
      />
    </Container>
  );
}

export default function NoteDetail() {
  return (
    <MainLayout title="Note">
      <Suspense fallback={
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      }>
        <NoteDetailContent />
      </Suspense>
    </MainLayout>
  );
}