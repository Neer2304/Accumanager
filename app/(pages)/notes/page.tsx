"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
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
  CircularProgress,
  Pagination,
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
  Search,
  Dashboard,
  TrendingUp,
  People,
  AttachMoney,
  Category,
  Lock,
  Upgrade,
  Sync,
  CloudOff,
  CloudQueue,
  CalendarToday,
  Flag,
  Description,
  Group,
  LocalOffer,
  Timeline,
  ArrowForward,
  CheckCircle,
  PlayArrow,
  Warning,
  NoteAdd,
  TextSnippet,
  Archive,
  Share,
  Delete,
  Edit,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { NoteGrid } from '@/components/notes/NoteGrid';
import { NotesFilters } from '@/components/note/NoteFilters';
import { NotesStats } from '@/components/note/NoteStats';
import { NoteBulkActions } from '@/components/notes/NoteBulkActions';
import { NoteMobileMenu } from '@/components/notes/NoteMobileMenu';
import { NoteShareDialog } from '@/components/notes/NoteShareDialog';
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

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tab';
import { Button } from '@/components/ui/Button';

export default function NotesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 12;

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
    window.location.href = '/notes/add';
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

  // Calculate filtered notes
  const filteredNotes = notes.filter(note => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        note.title?.toLowerCase().includes(searchLower) ||
        note.content?.toLowerCase().includes(searchLower) ||
        note.category?.toLowerCase().includes(searchLower) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, startIndex + notesPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate additional stats
  const calculatedStats = {
    total: notes.length,
    active: notes.filter(n => n.status === 'active').length,
    archived: notes.filter(n => n.status === 'archived').length,
    draft: notes.filter(n => n.status === 'draft').length,
    totalWords: notes.reduce((sum, n) => sum + (n.wordCount || calculateWordCount(n.content || '')), 0),
    totalReadTime: notes.reduce((sum, n) => sum + (n.readTime || calculateReadTime(n.content || '')), 0),
    avgWords: notes.length > 0 ? Math.round(notes.reduce((sum, n) => sum + (n.wordCount || calculateWordCount(n.content || '')), 0) / notes.length) : 0,
  };

  return (
    <MainLayout title="Notes Management">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <MuiLink 
              component={Link} 
              href="/dashboard" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300, 
                "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </MuiLink>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Notes Management
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              📝 Notes Management
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Organize your thoughts, ideas, and important information in one place
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error"
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                borderRadius: '8px',
                backgroundColor: darkMode ? '#3c1f1f' : '#fdeded',
                border: darkMode ? '1px solid #5c2b2b' : '1px solid #ef9a9a',
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
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
              sx={{ 
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Header with Search and Stats */}
          <Card
            title="Notes Management"
            subtitle={`${notes.length} total notes • ${filteredNotes.length} filtered`}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleDownloadNotes}
                  iconLeft={<Download />}
                  size="medium"
                  disabled={notes.length === 0}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#5f6368',
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                    '&.Mui-disabled': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#5f6368' : '#9aa0a6',
                    }
                  }}
                >
                  {isMobile ? 'Export' : 'Export Notes'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateNote}
                  iconLeft={<Add />}
                  size="medium"
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  New Note
                </Button>
              </Box>
            }
            hover
            sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 2,
            }}>
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                size="small"
                sx={{ flex: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Select
                  size="small"
                  label="Status"
                  value={filters.status}
                  onChange={(e: any) => setFilters({...filters, status: e.target.value})}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'active', label: 'Active' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                  sx={{ minWidth: 140 }}
                />

                <Select
                  size="small"
                  label="Priority"
                  value={filters.priority}
                  onChange={(e: any) => setFilters({...filters, priority: e.target.value})}
                  options={[
                    { value: '', label: 'All Priorities' },
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                  sx={{ minWidth: 140 }}
                />

                <Button
                  variant="outlined"
                  size="medium"
                  iconLeft={<FilterList />}
                  onClick={() => setShowMobileMenu(true)}
                >
                  Filter
                </Button>

                <IconButton
                  onClick={() => fetchNotes(filters)}
                  size="small"
                  sx={{
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '8px',
                  }}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </Box>
          </Card>

          {/* Stats Cards */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Total Notes', 
                value: calculatedStats.total, 
                icon: <Description />, 
                color: '#4285f4', 
                progress: 100,
                description: 'All notes in system' 
              },
              { 
                title: 'Active Notes', 
                value: calculatedStats.active, 
                icon: <PlayArrow />, 
                color: '#34a853', 
                progress: calculatedStats.total > 0 ? Math.round((calculatedStats.active / calculatedStats.total) * 100) : 0,
                description: 'Currently active notes' 
              },
              { 
                title: 'Archived', 
                value: calculatedStats.archived, 
                icon: <Archive />, 
                color: '#fbbc04', 
                progress: calculatedStats.total > 0 ? Math.round((calculatedStats.archived / calculatedStats.total) * 100) : 0,
                description: 'Archived notes' 
              },
              { 
                title: 'Drafts', 
                value: calculatedStats.draft, 
                icon: <TextSnippet />, 
                color: '#9aa0a6', 
                progress: calculatedStats.total > 0 ? Math.round((calculatedStats.draft / calculatedStats.total) * 100) : 0,
                description: 'In-progress drafts' 
              },
              { 
                title: 'Total Words', 
                value: calculatedStats.totalWords.toLocaleString(), 
                icon: <TextSnippet />, 
                color: '#8ab4f8', 
                progress: 100,
                description: 'Words across all notes' 
              },
              { 
                title: 'Avg Read Time', 
                value: `${Math.round(calculatedStats.avgWords / 200)} min`, 
                icon: <Timeline />, 
                color: '#ea4335', 
                progress: calculatedStats.avgWords > 1000 ? 100 : (calculatedStats.avgWords / 10),
                description: 'Average reading time' 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(33.333% - 16px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  borderRadius: '16px', 
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  background: darkMode 
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 }, 
                      borderRadius: '10px', 
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {React.cloneElement(stat.icon, { 
                        sx: { 
                          fontSize: { xs: 20, sm: 24, md: 28 }, 
                          color: stat.color,
                        } 
                      })}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                    }}
                  >
                    {stat.description}
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                        }}
                      >
                        Progress
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: stat.color,
                          fontWeight: 500,
                          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                        }}
                      >
                        {stat.progress}%
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      position: 'relative', 
                      height: 6, 
                      backgroundColor: darkMode ? '#3c4043' : '#e0e0e0', 
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${stat.progress}%`,
                          backgroundColor: stat.color,
                          borderRadius: 3,
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Tabs */}
          <Card hover sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            <Tabs
              tabs={[
                { label: `All Notes (${filteredNotes.length})`, icon: <Description />, count: filteredNotes.length },
                { label: `Active (${calculatedStats.active})`, icon: <PlayArrow />, count: calculatedStats.active },
                { label: `Archived (${calculatedStats.archived})`, icon: <Archive />, count: calculatedStats.archived },
                { label: `Drafts (${calculatedStats.draft})`, icon: <TextSnippet />, count: calculatedStats.draft },
                { label: 'Categories', icon: <Category /> },
              ]}
              value={0}
              onChange={(newValue: number) => {
                const statusMap = ['all', 'active', 'archived', 'draft', 'all'];
                if (newValue < 4) {
                  setFilters({...filters, status: statusMap[newValue]});
                }
              }}
              variant="scrollable"
            />
          </Card>

          {/* View Mode Toggle */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={`${selectedNotes.length} selected`}
                size="small"
                color="secondary"
                sx={{ 
                  display: selectedNotes.length > 0 ? 'flex' : 'none',
                  backgroundColor: '#4285f4',
                  color: 'white',
                }}
              />
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Showing {paginatedNotes.length} of {filteredNotes.length} notes
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Grid view">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  sx={{
                    backgroundColor: viewMode === 'grid' ? (darkMode ? '#3c4043' : '#e8f0fe') : 'transparent',
                    color: viewMode === 'grid' ? '#4285f4' : (darkMode ? '#9aa0a6' : '#5f6368'),
                    borderRadius: '8px',
                  }}
                >
                  <GridView />
                </IconButton>
              </Tooltip>

              <Tooltip title="List view">
                <IconButton
                  onClick={() => setViewMode('list')}
                  sx={{
                    backgroundColor: viewMode === 'list' ? (darkMode ? '#3c4043' : '#e8f0fe') : 'transparent',
                    color: viewMode === 'list' ? '#4285f4' : (darkMode ? '#9aa0a6' : '#5f6368'),
                    borderRadius: '8px',
                  }}
                >
                  <ViewList />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

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
          <Box sx={{ minHeight: 400 }}>
            <NoteGrid
              notes={paginatedNotes}
              loading={loading}
              selectedNotes={selectedNotes}
              viewMode={viewMode}
              // emptyMessage={...}
              onNoteSelect={handleNoteSelect}
              onNoteEdit={handleNoteEdit}
              onNoteDelete={handleNoteDelete}
              onNoteArchive={handleNoteArchive}
              onNoteShare={handleNoteShare}
              onCreateNote={handleCreateNote}
              darkMode={darkMode} // ADD THIS LINE
            />
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    '&.Mui-selected': {
                      backgroundColor: '#4285f4',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#3367d6',
                      },
                    },
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* No Notes State */}
          {notes.length === 0 && !loading && (
            <Card 
              hover
              sx={{ 
                p: { xs: 4, sm: 6 }, 
                textAlign: 'center',
                border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              }}
            >
              <Description sx={{ 
                fontSize: 60, 
                mb: 2,
                color: darkMode ? '#5f6368' : '#9aa0a6',
              }} />
              <Typography 
                variant="h5" 
                fontWeight={500}
                gutterBottom
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                No Notes Found
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                {searchTerm || filters.category
                  ? 'Try adjusting your search or filters'
                  : 'Create your first note to get started'}
              </Typography>
              <Button
                variant="contained"
                onClick={handleCreateNote}
                iconLeft={<Add />}
                size="medium"
                sx={{ 
                  backgroundColor: '#4285f4',
                  '&:hover': { backgroundColor: '#3367d6' }
                }}
              >
                Create Note
              </Button>
            </Card>
          )}

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

          {/* Mobile Menu */}
          <NoteMobileMenu
            open={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
            filters={filters}
            onFiltersChange={setFilters}
            stats={stats}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}