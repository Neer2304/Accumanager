'use client'

import { signIn } from "next-auth/react";
import { Button, Container, Paper, Typography, Stack } from '@mui/material';
import { GitHub } from '@mui/icons-material';

export default function TestLoginPage() {
  
  const handleGithubLogin = () => {
    // This tells NextAuth to start the GitHub flow
    // and redirect to /dashboard on success
    signIn('github', { callbackUrl: '/dashboard' });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: '#1e293b', color: 'white' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Verify GitHub Connection</Typography>
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<GitHub />}
          onClick={handleGithubLogin}
          sx={{ bgcolor: '#24292e', py: 1.5 }}
        >
          Authorize AccuManage
        </Button>
      </Paper>
    </Container>
  );
}