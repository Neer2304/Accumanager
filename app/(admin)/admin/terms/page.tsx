// app/admin/terms/page.tsx - GOOGLE MATERIAL DESIGN THEME
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  ArrowBack,
  Description,
  CheckCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TermsHistory {
  _id: string;
  version: string;
  title: string;
  effectiveDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function TermsManagementPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [termsHistory, setTermsHistory] = useState<TermsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchTermsHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/terms/history');
      
      if (!response.ok) throw new Error('Failed to fetch terms history');
      
      const history = await response.json();
      setTermsHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsHistory();
  }, []);

  const handleCreateNewTerms = async (formData: any) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create new terms');
      }
      
      setSuccess('Terms & Conditions created successfully!');
      setCreateDialogOpen(false);
      fetchTermsHistory(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create terms');
    }
  };

  const handleDeleteTerms = async (termsId: string) => {
    if (!window.confirm('Are you sure you want to delete these terms? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/terms/${termsId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete terms');
      }
      
      setSuccess('Terms & Conditions deleted successfully!');
      fetchTermsHistory(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete terms');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Button
            component={Link}
            href="/admin/dashboard"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 2,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
              },
            }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: '16px',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Description sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography 
                  variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                    lineHeight: 1.2,
                  }}
                >
                  Terms & Conditions
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mt: 0.5,
                  }}
                >
                  Manage legal terms and version history
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1669c1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
                },
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                fontWeight: 500,
              }}
            >
              Create New Version
            </Button>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #ea4335',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#ea4335' },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #34a853',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#34a853' },
            }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Main Content Card */}
        <Card sx={{
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 24px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Card Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <HistoryIcon sx={{ 
                fontSize: 24,
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                Terms Version History
              </Typography>
              <Chip 
                label={`${termsHistory.length} versions`}
                size="small"
                sx={{
                  ml: 'auto',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  fontWeight: 500,
                  border: 'none',
                }}
              />
            </Box>
            
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                py: 8,
              }}>
                <CircularProgress size={48} />
              </Box>
            ) : termsHistory.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 2,
              }}>
                <Description sx={{ 
                  fontSize: 48, 
                  mb: 2,
                  color: darkMode ? '#5f6368' : '#9aa0a6',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                    mb: 1,
                  }}
                >
                  No Terms & Conditions Found
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mb: 3,
                  }}
                >
                  Create your first terms & conditions document
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                  sx={{
                    backgroundColor: '#1a73e8',
                    '&:hover': { backgroundColor: '#1669c1' },
                    borderRadius: '12px',
                  }}
                >
                  Create Terms
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {termsHistory.map((terms, index) => (
                  <Paper
                    key={terms._id}
                    elevation={0}
                    sx={{
                      mb: 2,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      overflow: 'hidden',
                      '&:hover': {
                        backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                        borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      },
                    }}
                  >
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/admin/terms/${terms._id}/edit`)}
                            sx={{
                              backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                              color: darkMode ? '#fbbc04' : '#f57c00',
                              '&:hover': {
                                backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.2)',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {!terms.isActive && (
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTerms(terms._id)}
                              sx={{
                                backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                                color: darkMode ? '#ea4335' : '#d32f2f',
                                '&:hover': {
                                  backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.2)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      }
                      sx={{
                        py: 2.5,
                        px: { xs: 2, sm: 3 },
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ 
                        flex: 1,
                        mr: 2,
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          mb: 1,
                          flexWrap: 'wrap',
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 500,
                              color: darkMode ? '#e8eaed' : '#202124',
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                            }}
                          >
                            {terms.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={`v${terms.version}`}
                              size="small"
                              sx={{
                                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                fontWeight: 500,
                                border: 'none',
                                fontSize: '0.75rem',
                              }}
                            />
                            {terms.isActive && (
                              <Chip 
                                icon={<CheckCircle fontSize="small" />}
                                label="Active"
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                                  color: darkMode ? '#34a853' : '#2e7d32',
                                  fontWeight: 500,
                                  border: 'none',
                                  fontSize: '0.75rem',
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <span style={{ fontWeight: 500 }}>Effective:</span> {formatDate(terms.effectiveDate)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <span style={{ fontWeight: 500 }}>Created:</span> {formatDate(terms.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Create New Terms Dialog */}
        <CreateTermsDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateNewTerms}
          darkMode={darkMode}
        />
      </Container>
    </Box>
  );
}

// Dialog component for creating new terms
function CreateTermsDialog({ open, onClose, onSubmit, darkMode }: any) {
  const [formData, setFormData] = useState({
    version: '',
    title: '',
    description: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        color: darkMode ? '#e8eaed' : '#202124',
        fontWeight: 500,
        pb: 2,
      }}>
        Create New Terms & Conditions
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            mb: 2,
          }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g., 1.1.0"
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Effective Date"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Terms & Conditions 2024"
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of what changed in this version..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          pb: 3,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          pt: 2,
        }}>
          <Button 
            onClick={onClose}
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
              },
              borderRadius: '8px',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              backgroundColor: '#1a73e8',
              '&:hover': {
                backgroundColor: '#1669c1',
              },
              borderRadius: '8px',
              px: 3,
              fontWeight: 500,
            }}
          >
            Create New Terms
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}