"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from './hooks/useNotes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { NoteHeader } from './components/NoteHeader';
import { NoteForm } from './components/NoteForm';
import { NoteFormData } from './types/note.types';

// Password Dialog Component using Material-UI
function PasswordDialog({ 
  open, 
  onClose, 
  onSubmit, 
  error 
}: { 
  open: boolean; 
  onClose: () => void; 
  onSubmit: (password: string) => void; 
  error?: string 
}) {
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
      <DialogTitle>Password Required</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This note is password protected. Enter password to edit:
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
          placeholder="Enter password"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!password.trim()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function NoteEdit() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { noteColors } = useThemeColors();
  const { fetchNote, updateNote } = useNotes();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [storedPassword, setStoredPassword] = useState<string>('');
  
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    summary: '',
    category: 'general',
    priority: 'medium',
    tags: [],
    color: noteColors[0],
    icon: '📝',
    isPublic: false,
    password: '',
    removePassword: false,
  });

  useEffect(() => {
    if (id) {
      const noteId = Array.isArray(id) ? id[0] : id;
      
      // Try to get password from sessionStorage first (from detail page)
      const savedPassword = sessionStorage.getItem(`note_password_${noteId}`);
      
      // Then try from URL query params
      const urlPassword = searchParams.get('password');
      
      const password = savedPassword || (urlPassword ? decodeURIComponent(urlPassword) : undefined);
      
      if (password) {
        setStoredPassword(password);
        loadNote(noteId, password);
      } else {
        loadNote(noteId);
      }
    }
  }, [id]);

  const loadNote = async (noteId: string, password?: string) => {
    try {
      setLoading(true);
      setError('');
      setPasswordError('');
      
      const note = await fetchNote(noteId, password);
      
      setFormData({
        title: note.title || '',
        content: note.content || '',
        summary: note.summary || '',
        category: note.category || 'general',
        priority: note.priority || 'medium',
        tags: note.tags || [],
        color: note.color || noteColors[0],
        icon: note.icon || '📝',
        isPublic: note.isPublic || false,
        password: '',
        removePassword: false,
      });
      
      setRequiresPassword(false);
      
      // Store the password for future use
      if (password) {
        setStoredPassword(password);
        sessionStorage.setItem(`note_password_${noteId}`, password);
      }
      
    } catch (err: any) {
      console.error('Error loading note for edit:', err);
      
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
    if (id) {
      const noteId = Array.isArray(id) ? id[0] : id;
      await loadNote(noteId, password);
    }
  };

  const handleInputChange = (field: keyof NoteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError('');
      
      const updateData: any = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        category: formData.category,
        priority: formData.priority,
        tags: formData.tags,
        color: formData.color,
        icon: formData.icon,
        isPublic: formData.isPublic,
      };

      // Include password if set in form
      if (formData.password) {
        updateData.password = formData.password;
      }
      if (formData.removePassword) {
        updateData.removePassword = true;
      }

      // If note was password protected and we have the stored password,
      // we need to include it in the update request headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // If we have a stored password from viewing the note, include it
      if (storedPassword) {
        headers['x-note-password'] = storedPassword;
      }

      // Use custom fetch for update to include password
      const response = await fetch(`/api/note/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update note');
      }

      // Clean up stored password
      const noteId = Array.isArray(id) ? id[0] : id;
      sessionStorage.removeItem(`note_password_${noteId}`);
      
      router.push(`/note/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordDialogClose = () => {
    router.push(`/note/${id}`);
  };

  if (requiresPassword) {
    return (
      <MainLayout title="Enter Password">
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
        <PasswordDialog
          open={requiresPassword}
          onClose={handlePasswordDialogClose}
          onSubmit={handlePasswordSubmit}
          error={passwordError}
        />
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout title="Loading...">
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Note">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <NoteHeader
          title="Edit Note"
          noteId={id as string}
          mode="edit"
          loading={saving}
          onSave={handleSubmit}
        />

        <NoteForm
          formData={formData}
          onChange={handleInputChange}
          error={error}
          onErrorClose={() => setError('')}
          mode="edit"
          onSubmit={handleSubmit}
          loading={saving}
        />
      </Container>
    </MainLayout>
  );
}