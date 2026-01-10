// app/admin/terms/page.tsx - ADMIN MANAGEMENT PAGE
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

interface TermsHistory {
  _id: string;
  version: string;
  title: string;
  effectiveDate: string;
  isActive: boolean;
}

export default function TermsManagementPage() {
  const [termsHistory, setTermsHistory] = useState<TermsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      const response = await fetch('/api/terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create new terms');
      
      setCreateDialogOpen(false);
      fetchTermsHistory(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create terms');
    }
  };

  return (
    <MainLayout title="Manage Terms & Conditions">
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Terms & Conditions Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create New Version
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon />
              Terms Version History
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {termsHistory.map((terms) => (
                  <ListItem
                    key={terms._id}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton edge="end">
                          <EditIcon />
                        </IconButton>
                        {!terms.isActive && (
                          <IconButton edge="end" color="error">
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6">
                            {terms.title}
                          </Typography>
                          <Chip 
                            label={`v${terms.version}`} 
                            size="small" 
                            color="primary"
                          />
                          {terms.isActive && (
                            <Chip 
                              label="Active" 
                              size="small" 
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={`Effective: ${new Date(terms.effectiveDate).toLocaleDateString()}`}
                    />
                  </ListItem>
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
        />
      </Box>
    </MainLayout>
  );
}

// Dialog component for creating new terms
function CreateTermsDialog({ open, onClose, onSubmit }: any) {
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Terms & Conditions</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g., 1.1.0"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Effective Date"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Terms & Conditions 2024"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what changed in this version..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create New Terms
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}