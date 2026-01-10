"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Fade,
  Container,
  Divider,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Login,
  Rocket,
  Email,
  Key,
  Shield,
} from '@mui/icons-material';

export default function MeetingNoteLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Your manual credentials
  const CORRECT_EMAIL = 'neermehta123432@gmail.com';
  const CORRECT_PASSWORD = 'Neer@2324';

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    // Manual validation
    setTimeout(() => {
      if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
        // Store auth token in sessionStorage
        sessionStorage.setItem('meeting_note_auth_token', 'verified_access_2024');
        sessionStorage.setItem('meeting_note_user', email);
        sessionStorage.setItem('meeting_note_timestamp', Date.now().toString());
        
        // Redirect to actual meeting notes page
        router.push('/meetings-notes');
      } else {
        setError('Invalid credentials. Access denied.');
      }
      setLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(circle at 1px 1px, #667eea 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Decorative glow effect */}
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 3,
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                  animation: 'pulse 2s infinite',
                }}
              >
                <Shield sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ 
                color: 'white',
                background: 'linear-gradient(90deg, #667eea, #ec4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                SECURE ACCESS
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                Meeting Intelligence Platform
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Restricted Area • Authorized Personnel Only
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Login Form */}
            <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                fullWidth
                placeholder="authorized@email.com"
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="medium"
                error={!!error}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#94a3b8',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                fullWidth
                placeholder="••••••••"
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="medium"
                error={!!error}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#94a3b8',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: '#94a3b8' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 2,
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    color: '#fca5a5',
                  }}
                  icon={false}
                >
                  <Typography variant="body2">{error}</Typography>
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading || !email || !password}
                sx={{
                  py: 1.8,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    background: '#374151',
                    color: '#9ca3af',
                  },
                  transition: 'all 0.3s ease',
                  mt: 2,
                }}
                startIcon={loading ? null : <Login />}
              >
                {loading ? (
                  <>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid transparent',
                          borderTopColor: 'white',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      Verifying Access...
                    </Box>
                  </>
                ) : (
                  'Verify & Enter Platform'
                )}
              </Button>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  🔐 Access restricted to authorized personnel only
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 1 }}>
                  All access attempts are logged and monitored
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Fade>
      </Container>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}