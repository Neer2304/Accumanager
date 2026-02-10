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
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from '@/components/note/hooks/useNotes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { NoteHeader } from './NoteHeader';
import { NoteForm } from './NoteForm';
import { NoteFormData } from '@/components/note/types/note.types';

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Password Dialog Component with Google theme
function PasswordDialog({ 
  open, 
  onClose, 
  onSubmit, 
  error,
  darkMode = false 
}: { 
  open: boolean; 
  onClose: () => void; 
  onSubmit: (password: string) => void; 
  error?: string;
  darkMode?: boolean;
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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        },
      }}
    >
      <DialogTitle sx={{ 
        color: darkMode ? '#e8eaed' : '#202124',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        fontWeight: 500,
      }}>
        Password Required
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ 
          mb: 2,
          color: darkMode ? '#9aa0a6' : '#5f6368',
          fontSize: '0.875rem',
        }}>
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
          placeholder="Enter password"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#5f6368',
              },
            },
            '& .MuiInputLabel-root': {
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
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
      <DialogActions sx={{ 
        p: 2,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Button 
          onClick={handleClose}
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!password.trim()}
          sx={{
            backgroundColor: '#34a853',
            '&:hover': { backgroundColor: '#2d9248' },
            '&.Mui-disabled': {
              backgroundColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
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
      
      const savedPassword = sessionStorage.getItem(`note_password_${noteId}`);
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

      if (formData.password) {
        updateData.password = formData.password;
      }
      if (formData.removePassword) {
        updateData.removePassword = true;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (storedPassword) {
        headers['x-note-password'] = storedPassword;
      }

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
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          minHeight: '100vh',
        }}>
          <Container>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '60vh',
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  size={60} 
                  sx={{ color: darkMode ? '#8ab4f8' : '#4285f4', mb: 2 }}
                />
                <Typography sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '1rem',
                }}>
                  Loading note...
                </Typography>
              </Box>
            </Box>
          </Container>
          <PasswordDialog
            open={requiresPassword}
            onClose={handlePasswordDialogClose}
            onSubmit={handlePasswordSubmit}
            error={passwordError}
            darkMode={darkMode}
          />
        </Box>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout title="Loading...">
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          minHeight: '100vh',
        }}>
          <Container>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '60vh',
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  size={60} 
                  sx={{ color: darkMode ? '#8ab4f8' : '#4285f4', mb: 2 }}
                />
                <Typography sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '1rem',
                }}>
                  Loading note for editing...
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Note">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <NoteHeader
            title="Edit Note"
            noteId={id as string}
            mode="edit"
            loading={saving}
            onSave={handleSubmit}
            darkMode={darkMode}
          />

          <NoteForm
            formData={formData}
            onChange={handleInputChange}
            error={error}
            onErrorClose={() => setError('')}
            mode="edit"
            onSubmit={handleSubmit}
            loading={saving}
            darkMode={darkMode}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}