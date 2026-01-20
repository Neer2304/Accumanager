// app/dashboard/support/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import { Support as SupportIcon, Send } from '@mui/icons-material';

export default function UserSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/support');
      
      if (!response.ok) {
        throw new Error('Failed to fetch your tickets');
      }

      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      setError('Subject and message are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Support ticket created successfully!');
        setFormData({ subject: '', message: '', category: 'general', priority: 'medium' });
        fetchUserTickets(); // Refresh list
      } else {
        setError(data.message || 'Failed to create ticket');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <SupportIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Support Center
      </Typography>

      <Stack spacing={3}>
        {/* Create Ticket Form */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create New Support Ticket
            </Typography>
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  disabled={submitting}
                />
                
                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={submitting}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={<Send />}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit Ticket'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* User's Tickets */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Support Tickets ({tickets.length})
            </Typography>
            
            {loading ? (
              <CircularProgress />
            ) : tickets.length === 0 ? (
              <Typography color="text.secondary">
                You haven't created any support tickets yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {tickets.map((ticket) => (
                  <Card key={ticket._id} variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {ticket.subject}
                          </Typography>
                          <Chip label={ticket.status} size="small" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {ticket.message.substring(0, 100)}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ticket #{ticket.ticketNumber} • Created: {new Date(ticket.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}