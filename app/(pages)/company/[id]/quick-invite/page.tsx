"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Email as EmailIcon } from '@mui/icons-material';

export default function QuickInvitePage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/user-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          companyId,
          email,
          role: 'member'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      setSuccess(true);
      setEmail('');
      
      setTimeout(() => {
        router.push(`/company/${companyId}/members`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            <PersonAddIcon sx={{ fontSize: 32 }} />
          </Avatar>
          
          <Typography variant="h5" fontWeight={600}>
            Invite Team Member
          </Typography>
          
          <Typography color="text.secondary" align="center">
            Enter the email address of the person you want to invite
          </Typography>

          {success && (
            <Alert severity="success" sx={{ width: '100%' }}>
              Invitation sent successfully! Redirecting...
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleInvite}
            disabled={loading || !email}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Invitation'}
          </Button>

          <Divider sx={{ width: '100%' }} />

          <Button 
            variant="text" 
            onClick={() => router.push(`/company/${companyId}/members`)}
          >
            Back to Members
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}