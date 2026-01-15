"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  GridView,
  ViewList,
  FilterList,
  Sort,
  Search,
  Refresh,
  Delete,
  Archive,
  Unarchive,
  Share,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { NoteGrid } from '@/components/note/NoteGrid';
import { NotesFilters } from '@/components/note/NoteFilters';
import { NotesStats } from '@/components/note/NoteStats';
import { NoteBulkActions } from '@/components/note/NoteBulkActions';
import { NoteMobileMenu } from '@/components/note/NoteMobileMenu';
import { NoteShareDialog } from '@/components/note/NoteShareDialog';
import { useNotes } from '@/components/note/hooks/useNotes';
import { Note } from '@/components/note/types';

export default function NotesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const {
    notes,
    loading,
    error,
    stats,
    fetchNotes,
    fetchStats,
    deleteNote,
    bulkAction,
    shareNote,
    setError,
  } = useNotes();

  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    tag: '',
    priority: '',
    status: 'active',
    sortBy: 'updatedAt' as const,
    sortOrder: 'desc' as const,
    showShared: false,
    page: 1,
    limit: 20,
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    fetchNotes(filters);
    fetchStats();
  }, [filters]);

  const handleNoteSelect = (note: Note) => {
    if (selectedNotes.includes(note._id)) {
      setSelectedNotes(selectedNotes.filter(id => id !== note._id));
    } else {
      setSelectedNotes([...selectedNotes, note._id]);
    }
  };

  const handleNoteEdit = (note: Note) => {
    window.location.href = `/note/${note._id}`;
  };

  const handleNoteDelete = async (note: Note) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note._id);
        showSnackbar('Note deleted successfully', 'success');
        fetchNotes(filters);
      } catch (err) {
        showSnackbar('Failed to delete note', 'error');
      }
    }
  };

  const handleNoteArchive = async (note: Note) => {
    try {
      const action = note.status === 'archived' ? 'restore' : 'archive';
      await bulkAction([note._id], action);
      showSnackbar(
        note.status === 'archived' ? 'Note restored' : 'Note archived',
        'success'
      );
      fetchNotes(filters);
    } catch (err) {
      showSnackbar('Failed to update note', 'error');
    }
  };

  const handleNoteShare = (note: Note) => {
    setNoteToShare(note);
    setShowShareDialog(true);
  };

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedNotes.length === 0) return;

    try {
      await bulkAction(selectedNotes, action, data);
      
      let message = '';
      switch (action) {
        case 'archive':
          message = `${selectedNotes.length} note(s) archived`;
          break;
        case 'delete':
          message = `${selectedNotes.length} note(s) deleted`;
          break;
        case 'restore':
          message = `${selectedNotes.length} note(s) restored`;
          break;
        case 'changeCategory':
          message = `${selectedNotes.length} note(s) category updated`;
          break;
        case 'changePriority':
          message = `${selectedNotes.length} note(s) priority updated`;
          break;
      }

      showSnackbar(message, 'success');
      setSelectedNotes([]);
      fetchNotes(filters);
    } catch (err) {
      showSnackbar('Failed to perform bulk action', 'error');
    }
  };

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateNote = () => {
    window.location.href = '/note/add';
  };

  return (
    <MainLayout title="Notes">
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, sm: 2 } }}>
        {/* Mobile Menu */}
        <NoteMobileMenu
          open={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          filters={filters}
          onFiltersChange={setFilters}
          stats={stats}
        />

        {/* Header */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            boxShadow: theme.shadows[1],
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
                📝 Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organize your thoughts, ideas, and important information
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: { xs: '100%', md: 'auto' },
              }}
            >
              {isMobile && (
                <IconButton
                  onClick={() => setShowMobileMenu(true)}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  <FilterList />
                </IconButton>
              )}

              <Tooltip title="Grid view">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <GridView />
                </IconButton>
              </Tooltip>

              <Tooltip title="List view">
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh">
                <IconButton onClick={() => fetchNotes(filters)}>
                  <Refresh />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateNote}
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  borderRadius: 3,
                  px: { xs: 2, md: 3 },
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${
                    theme.palette.primary.dark
                  } 100%)`,
                }}
              >
                New Note
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Stats */}
        <NotesStats stats={stats} loading={loading} />

        {/* Filters - Desktop */}
        {!isMobile && (
          <NotesFilters filters={filters} onFiltersChange={setFilters} sx={{ mb: 3 }} />
        )}

        {/* Bulk Actions */}
        {selectedNotes.length > 0 && (
          <NoteBulkActions
            selectedCount={selectedNotes.length}
            onBulkArchive={() => handleBulkAction('archive')}
            onBulkDelete={() => handleBulkAction('delete')}
            onBulkShare={() => {
              // Handle bulk share
            }}
            onClearSelection={() => setSelectedNotes([])}
          />
        )}

        {/* Notes Grid */}
        <NoteGrid
          notes={notes}
          loading={loading}
          selectedNotes={selectedNotes}
          viewMode={viewMode}
          emptyMessage={
            filters.search
              ? 'No notes match your search'
              : filters.category
              ? `No notes in ${filters.category} category`
              : 'No notes found'
          }
          onNoteSelect={handleNoteSelect}
          onNoteEdit={handleNoteEdit}
          onNoteDelete={handleNoteDelete}
          onNoteArchive={handleNoteArchive}
          onNoteShare={handleNoteShare}
          onCreateNote={handleCreateNote}
        />

        {/* Share Dialog */}
        {noteToShare && (
          <NoteShareDialog
            open={showShareDialog}
            note={noteToShare}
            onClose={() => {
              setShowShareDialog(false);
              setNoteToShare(null);
            }}
            onShare={async (userIds, role) => {
              try {
                await shareNote(noteToShare._id, userIds, role);
                showSnackbar('Note shared successfully', 'success');
                setShowShareDialog(false);
                setNoteToShare(null);
              } catch (err) {
                showSnackbar('Failed to share note', 'error');
              }
            }}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}