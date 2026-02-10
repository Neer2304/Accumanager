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
  Schedule,
  TextSnippet,
  Public,
  ArrowBack,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from '@/components/note/hooks/useNotes';
import { NoteHeader } from './NoteHeader';
import { NoteDeleteDialog } from './NoteDeleteDialog';
import { NoteArchiveDialog } from './NoteArchiveDialog';
import { Note } from '@/components/note/types/note.types';

// Import Google-themed components
import { Card } from '@/components/ui/Card';

// Password Dialog Component
interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error?: string;
  darkMode?: boolean;
}

function PasswordDialog({ open, onClose, onSubmit, error, darkMode = false }: PasswordDialogProps) {
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
      }}>
        Enter Password
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ 
          mb: 2,
          color: darkMode ? '#9aa0a6' : '#5f6368',
        }}>
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
  const darkMode = theme.palette.mode === 'dark';
  
  const { fetchNote, updateNote, deleteNote } = useNotes();
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordUsed, setPasswordUsed] = useState('');
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
        setPasswordUsed(password);
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
    setPasswordUsed(password);
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
      if (note.passwordProtected && passwordUsed) {
        sessionStorage.setItem(`note_password_${note._id}`, passwordUsed);
      }
      router.push(`/note/${note._id}/edit`);
    }
  };

  const handleArchive = async () => {
    try {
      if (!note) return;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (note.passwordProtected && passwordUsed) {
        headers['x-note-password'] = passwordUsed;
      }
      
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
      
      const headers: HeadersInit = {};
      
      if (note.passwordProtected && passwordUsed) {
        headers['x-note-password'] = passwordUsed;
      }
      
      const response = await fetch(`/api/note/${note._id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete note');
      }
      
      sessionStorage.removeItem(`note_password_${note._id}`);
      router.push('/notes');
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !requiresPassword) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
    );
  }

  if (requiresPassword) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <PasswordDialog
          open={requiresPassword}
          onClose={handlePasswordDialogClose}
          onSubmit={handlePasswordSubmit}
          error={passwordError}
          darkMode={darkMode}
        />
      </Box>
    );
  }

  if (!note) {
    return (
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        minHeight: '100vh',
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card
            hover
            sx={{ 
              p: 6,
              textAlign: 'center',
              border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 500,
              }}
            >
              Note Not Found
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3,
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
              {error || 'Note not found or you don\'t have permission to view it.'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/notes')}
              startIcon={<ArrowBack />}
              sx={{
                borderRadius: '16px',
                backgroundColor: '#4285f4',
                '&:hover': { backgroundColor: '#3367d6' }
              }}
            >
              Back to Notes
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return '#3b82f6';
      case 'personal': return '#8b5cf6';
      case 'ideas': return '#ec4899';
      case 'projects': return '#10b981';
      case 'learning': return '#f59e0b';
      case 'tasks': return '#ef4444';
      case 'meetings': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <MainLayout title={`${note.icon} ${note.title}`}>
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <NoteHeader
            title={`${note.icon} ${note.title}`}
            subTitle={`Last updated ${formatDate(note.updatedAt)}`}
            noteId={note._id}
            mode="view"
            onEdit={handleEdit}
            onDelete={() => setShowDeleteDialog(true)}
            onArchive={() => setShowArchiveDialog(true)}
            noteStatus={note.status}
            darkMode={darkMode}
          />

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#3c1f1f' : '#fdeded',
                border: darkMode ? '1px solid #5c2b2b' : '1px solid #ef9a9a',
              }} 
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Note Info Card */}
          <Card
            hover
            sx={{ 
              p: 3, 
              mb: 3,
              borderRadius: '16px',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                icon={<Category />}
                label={note.category}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  backgroundColor: darkMode ? alpha(getCategoryColor(note.category), 0.15) : alpha(getCategoryColor(note.category), 0.1),
                  color: getCategoryColor(note.category),
                  border: `1px solid ${alpha(getCategoryColor(note.category), 0.3)}`,
                }}
              />
              <Chip
                icon={<PriorityHigh />}
                label={note.priority}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  backgroundColor: darkMode ? alpha(getPriorityColor(note.priority), 0.15) : alpha(getPriorityColor(note.priority), 0.1),
                  color: getPriorityColor(note.priority),
                  border: `1px solid ${alpha(getPriorityColor(note.priority), 0.3)}`,
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<TextSnippet />}
                label={`${note.wordCount?.toLocaleString() || '0'} words`}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  color: darkMode ? '#e8eaed' : '#202124',
                  border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
                }}
              />
              <Chip
                icon={<Schedule />}
                label={`${note.readTime || 5} min read`}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  color: darkMode ? '#e8eaed' : '#202124',
                  border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
                }}
              />
              {note.passwordProtected && (
                <Chip
                  icon={<Lock />}
                  label="Password Protected"
                  size="small"
                  sx={{
                    fontSize: '0.75rem',
                    backgroundColor: darkMode ? alpha('#fbbc04', 0.15) : alpha('#fbbc04', 0.1),
                    color: '#fbbc04',
                    border: `1px solid ${alpha('#fbbc04', 0.3)}`,
                  }}
                />
              )}
              {note.isPublic && (
                <Chip
                  icon={<Public />}
                  label="Public"
                  size="small"
                  sx={{
                    fontSize: '0.75rem',
                    backgroundColor: darkMode ? alpha('#34a853', 0.15) : alpha('#34a853', 0.1),
                    color: '#34a853',
                    border: `1px solid ${alpha('#34a853', 0.3)}`,
                  }}
                />
              )}
            </Box>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Label sx={{ 
                  fontSize: 16, 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  mr: 0.5,
                }} />
                {note.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      backgroundColor: darkMode ? alpha('#4285f4', 0.15) : alpha('#4285f4', 0.1),
                      color: darkMode ? '#8ab4f8' : '#4285f4',
                      border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`,
                      borderRadius: '6px',
                    }}
                  />
                ))}
              </Box>
            )}
          </Card>

          {/* Summary Section */}
          {note.summary && (
            <Card
              hover
              sx={{ 
                p: 3, 
                mb: 3,
                borderRadius: '16px',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                backgroundColor: darkMode ? '#303134' : '#ffffff',
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 500,
                  fontSize: '1.125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                📋 Summary
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderColor: darkMode ? '#3c4043' : '#dadce0' 
              }} />
              <Typography sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: '0.95rem',
                lineHeight: 1.7,
              }}>
                {note.summary}
              </Typography>
            </Card>
          )}

          {/* Content Section */}
          <Card
            hover
            sx={{ 
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              minHeight: 400,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 500,
                fontSize: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              📝 Content
            </Typography>
            <Divider sx={{ 
              mb: 3, 
              borderColor: darkMode ? '#3c4043' : '#dadce0' 
            }} />
            <Box sx={{ 
              whiteSpace: 'pre-wrap', 
              lineHeight: 1.8,
              fontFamily: "'Roboto', 'Noto Sans', sans-serif",
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: '0.95rem',
            }}>
              {note.content}
            </Box>
          </Card>

          {/* Stats Footer */}
          <Card
            hover
            sx={{ 
              p: 2, 
              mt: 3,
              borderRadius: '16px',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
                📅 Created: {formatDate(note.createdAt)}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
                👁️ Read {note.readCount || 0} times
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
                ⏰ Last read: {note.readCount > 0 ? 'Recently' : 'Never'}
              </Typography>
            </Stack>
          </Card>

          {/* Dialogs */}
          <NoteDeleteDialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDelete}
            darkMode={darkMode}
          />

          <NoteArchiveDialog
            open={showArchiveDialog}
            onClose={() => setShowArchiveDialog(false)}
            onConfirm={handleArchive}
            isArchived={note.status === 'archived'}
            darkMode={darkMode}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}

export default function NoteDetail() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <MainLayout title="Note">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        minHeight: '100vh',
      }}>
        <Suspense fallback={
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
        }>
          <NoteDetailContent />
        </Suspense>
      </Box>
    </MainLayout>
  );
}