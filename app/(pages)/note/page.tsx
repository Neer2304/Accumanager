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
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Add,
  GridView,
  ViewList,
  FilterList,
  Refresh,
  Download,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { NoteGrid } from '@/components/note/NoteGrid';
import { NotesFilters } from '@/components/note/NoteFilters';
import { NotesStats } from '@/components/note/NoteStats';
import { NoteBulkActions } from '@/components/note/NoteBulkActions';
import { NoteMobileMenu } from '@/components/note/NoteMobileMenu';
import { NoteShareDialog } from '@/components/note/NoteShareDialog';
import { useNotes } from '@/components/note/hooks/useNotes';
import { 
  Note, 
  NotePriority, 
  NoteStatus, 
  NoteFilters as NoteFiltersType, 
  NoteStats as NoteStatsType,
  NoteFormData,
  ShareRole,
  getPriorityLabel,
  getStatusLabel,
  getPriorityColor,
  getStatusColor,
  calculateReadTime,
  calculateWordCount
} from '@/components/note/types';

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
  const [filters, setFilters] = useState<NoteFiltersType>({
    search: '',
    category: '',
    tag: '',
    priority: '',
    status: 'active',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
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
        case 'change-category':
          message = `${selectedNotes.length} note(s) category updated`;
          break;
        case 'change-priority':
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

  const handleDownloadNotes = () => {
    try {
      // Create CSV content
      const headers = [
        'Title', 
        'Content', 
        'Category', 
        'Tags', 
        'Priority', 
        'Status', 
        'Word Count', 
        'Read Time (mins)', 
        'Created At', 
        'Updated At',
        'Attachments',
        'References',
        'Is Public',
        'Password Protected',
        'AI Summary'
      ];
      
      const csvContent = [
        headers.join(','),
        ...notes.map(note => {
          // Escape quotes in content
          const escapeQuotes = (text: string) => `"${text.replace(/"/g, '""')}"`;
          
          return [
            escapeQuotes(note.title || ''),
            escapeQuotes(note.content || ''),
            escapeQuotes(note.category || 'general'),
            escapeQuotes(note.tags?.join('; ') || ''),
            escapeQuotes(getPriorityLabel(note.priority || 'medium')),
            escapeQuotes(getStatusLabel(note.status || 'draft')),
            note.wordCount || calculateWordCount(note.content || ''),
            note.readTime || calculateReadTime(note.content || ''),
            escapeQuotes(new Date(note.createdAt).toLocaleDateString()),
            escapeQuotes(new Date(note.updatedAt).toLocaleDateString()),
            note.attachments?.length || 0,
            note.references?.length || 0,
            note.isPublic ? 'Yes' : 'No',
            note.passwordProtected ? 'Yes' : 'No',
            escapeQuotes(note.summary || '')
          ].join(',');
        })
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `notes_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSnackbar(`${notes.length} notes exported successfully`, 'success');
    } catch (error) {
      console.error('Error exporting notes:', error);
      showSnackbar('Failed to export notes', 'error');
    }
  };

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateNote = () => {
    window.location.href = '/note/add';
  };

  const handleBack = () => {
    window.history.back();
  };

  // Get stats summary for display
  const getStatsSummary = () => {
    if (!stats) return { active: 0, archived: 0, total: 0 };
    
    const activeCount = stats.statuses?.find(s => s._id === 'active')?.count || 0;
    const archivedCount = stats.statuses?.find(s => s._id === 'archived')?.count || 0;
    const totalCount = stats.totalNotes || 0;
    
    return { active: activeCount, archived: archivedCount, total: totalCount };
  };

  const statsSummary = getStatsSummary();

  return (
    <MainLayout title="Notes Management">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Mobile Menu */}
        <NoteMobileMenu
          open={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          filters={filters}
          onFiltersChange={setFilters}
          stats={stats}
        />

        {/* Header - Updated style similar to Events page */}
        <Box sx={{ mb: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
            variant="outlined"
          >
            Back to Dashboard
          </Button>

          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Notes</Typography>
          </Breadcrumbs>

          {/* Main Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                📝 Notes Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Organize your thoughts, ideas, and important information in one place
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              spacing={1}
              alignItems="center"
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-between', sm: 'flex-end' }
              }}
            >
              {/* Status Chips */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip 
                  label={`${statsSummary.total} Total`}
                  size="small"
                  color="default"
                  variant="outlined"
                />
                <Chip 
                  label={`${statsSummary.active} Active`}
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(getStatusColor('active'), 0.1),
                    color: getStatusColor('active'),
                    border: `1px solid ${alpha(getStatusColor('active'), 0.3)}`
                  }}
                />
                <Chip 
                  label={`${statsSummary.archived} Archived`}
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(getStatusColor('archived'), 0.1),
                    color: getStatusColor('archived'),
                    border: `1px solid ${alpha(getStatusColor('archived'), 0.3)}`
                  }}
                />
                {selectedNotes.length > 0 && (
                  <Chip 
                    label={`${selectedNotes.length} Selected`}
                    size="small"
                    color="secondary"
                  />
                )}
              </Stack>

              {/* Download Button */}
              <Tooltip title="Download Notes as CSV">
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownloadNotes}
                  size={isMobile ? 'small' : 'medium'}
                  disabled={notes.length === 0}
                  sx={{
                    borderRadius: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                    '&.Mui-disabled': {
                      borderColor: theme.palette.action.disabled,
                      color: theme.palette.action.disabled,
                    }
                  }}
                >
                  {isMobile ? 'Export' : 'Export Notes'}
                </Button>
              </Tooltip>

              {/* New Note Button */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateNote}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                New Note
              </Button>
            </Stack>
          </Box>

          {/* Action Bar */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {/* Left side - View controls and Refresh */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Grid view">
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    size="small"
                  >
                    <GridView />
                  </IconButton>
                </Tooltip>

                <Tooltip title="List view">
                  <IconButton
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    size="small"
                  >
                    <ViewList />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Refresh">
                  <IconButton 
                    onClick={() => fetchNotes(filters)} 
                    size="small"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>

                {isMobile && (
                  <Tooltip title="Filters">
                    <IconButton
                      onClick={() => setShowMobileMenu(true)}
                      size="small"
                      sx={{ border: 1, borderColor: 'divider' }}
                    >
                      <FilterList />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* Right side - Stats summary */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>{notes.length}</strong> notes displayed
                </Typography>
                {filters.search && (
                  <Chip 
                    label={`Search: "${filters.search}"`}
                    size="small"
                    onDelete={() => setFilters({...filters, search: ''})}
                  />
                )}
                {filters.category && (
                  <Chip 
                    label={`Category: ${filters.category}`}
                    size="small"
                    onDelete={() => setFilters({...filters, category: ''})}
                  />
                )}
                {filters.priority && (
                  <Chip 
                    label={`Priority: ${getPriorityLabel(filters.priority as NotePriority)}`}
                    size="small"
                    sx={{ 
                      backgroundColor: alpha(getPriorityColor(filters.priority as NotePriority), 0.1),
                      color: getPriorityColor(filters.priority as NotePriority),
                    }}
                    onDelete={() => setFilters({...filters, priority: ''})}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

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

        {/* Stats Cards */}
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
            onShare={async (userIds: string[], role: ShareRole) => {
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