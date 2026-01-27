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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Category,
  Label,
  PriorityHigh,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from './hooks/useNotes';
import { NoteHeader } from './components/NoteHeader';
import { NoteDeleteDialog } from './components/NoteDeleteDialog';
import { NoteArchiveDialog } from './components/NoteArchiveDialog';
import { Note } from './types/note.types';

// Password Dialog Component
interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error?: string;
}

function PasswordDialog({ open, onClose, onSubmit, error }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = () => {
    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }
    onSubmit(password);
    setPassword('');
    setLocalError('');
  };

  const handleClose = () => {
    setPassword('');
    setLocalError('');
    onClose();
  };

  const displayError = error || localError;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Enter Password</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This note is password protected. Please enter the password to view it.
        </Typography>
        
        <TextField
          autoFocus
          margin="dense"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLocalError('');
          }}
          error={!!displayError}
          helperText={displayError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!password.trim()}
        >
          Unlock
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function NoteDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  const { fetchNote, updateNote, deleteNote } = useNotes();
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordUsed, setPasswordUsed] = useState(''); // Track password entered by user
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

  const loadNote = async (noteId: string, password?: string) => {
    try {
      setLoading(true);
      setError('');
      setPasswordError('');
      const noteData = await fetchNote(noteId, password);
      setNote(noteData);
      setRequiresPassword(false);
      if (password) {
        setPasswordUsed(password); // Store the successful password
      }
    } catch (err: any) {
      console.error('Error loading note:', err);
      if (err.message === 'Password required') {
        setRequiresPassword(true);
      } else if (err.message === 'Invalid password' || err.message.includes('password')) {
        setPasswordError(err.message);
        setRequiresPassword(true);
      } else {
        setError(err.message || 'Failed to load note');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setPasswordUsed(password); // Store the password entered by user
    if (id) {
      const noteId = Array.isArray(id) ? id[0] : id;
      await loadNote(noteId, password);
    }
  };

  const handlePasswordDialogClose = () => {
    router.push('/notes');
  };

  const handleEdit = () => {
    if (note) {
      // Store password in sessionStorage before navigating to edit page
      if (note.passwordProtected && passwordUsed) {
        sessionStorage.setItem(`note_password_${note._id}`, passwordUsed);
      }
      router.push(`/note/${note._id}/edit`);
    }
  };

  const handleArchive = async () => {
    try {
      if (!note) return;
      
      // Prepare headers with password if needed
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Include password in header if note is password protected
      if (note.passwordProtected && passwordUsed) {
        headers['x-note-password'] = passwordUsed;
      }
      
      // Use fetch directly to include password header
      const response = await fetch(`/api/note/${note._id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ 
          status: note.status === 'archived' ? 'active' : 'archived' 
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update note');
      }
      
      loadNote(note._id, note.passwordProtected ? passwordUsed : undefined);
      setShowArchiveDialog(false);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleDelete = async () => {
    try {
      if (!note) return;
      
      // Prepare headers with password if needed
      const headers: HeadersInit = {};
      
      // Include password in header if note is password protected
      if (note.passwordProtected && passwordUsed) {
        headers['x-note-password'] = passwordUsed;
      }
      
      // Use fetch directly to include password header
      const response = await fetch(`/api/note/${note._id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete note');
      }
      
      // Clean up stored password
      sessionStorage.removeItem(`note_password_${note._id}`);
      router.push('/notes');
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  if (loading && !requiresPassword) {
    return (
      <Container>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          key="loading-fallback"
        >
          <CircularProgress size={40} />
        </Box>
      </Container>
    );
  }

  // Password Dialog
  if (requiresPassword) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PasswordDialog
          open={requiresPassword}
          onClose={handlePasswordDialogClose}
          onSubmit={handlePasswordSubmit}
          error={passwordError}
        />
      </Box>
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
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="60vh"
            key="suspense-fallback"
          >
            <CircularProgress size={40} />
          </Box>
        </Container>
      }>
        <NoteDetailContent />
      </Suspense>
    </MainLayout>
  );
}