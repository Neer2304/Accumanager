// app/not-found.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  ArrowBack,
  Refresh,
  Search,
  ErrorOutline,
  HelpOutline,
  Lock,
  WifiOff,
  Satellite,
  RocketLaunch,
} from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useTheme as useThemeContext } from '@/contexts/ThemeContext'; // Import your theme context

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  
  // Use your theme context instead of local state
  const { mode, toggleTheme } = useThemeContext(); // Assuming your context has 'mode' and 'toggleTheme'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = mode === 'dark'; // Convert mode to boolean

  useEffect(() => {
    setMounted(true);
    // Safely get current URL only on client side
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    const timer = setTimeout(() => setShowAnimation(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You might want to change this to your actual domain
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)} site:yourdomain.com`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <MainLayout title="404 - Page Not Found">
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode ? '#202124' : '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40vh',
            background: darkMode 
              ? 'linear-gradient(135deg, #0d47a1 0%, #1b5e20 33%, #f57c00 66%, #b71c1c 100%)'
              : 'linear-gradient(135deg, #4285f4 0%, #34a853 33%, #fbbc05 66%, #ea4335 100%)',
            opacity: darkMode ? 0.08 : 0.05,
            transform: 'skewY(-12deg)',
            transformOrigin: '0',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Grid background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: darkMode
              ? `linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                 linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
              : `linear-gradient(90deg, rgba(66, 133, 244, 0.03) 1px, transparent 1px),
                 linear-gradient(rgba(66, 133, 244, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transition: 'all 0.3s ease',
          }}
        />

        <Container maxWidth="md">
          <Fade in={mounted} timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                textAlign: 'center',
                borderRadius: 3,
                background: darkMode ? '#292a2d' : 'white',
                border: darkMode ? '1px solid #5f6368' : '1px solid #dadce0',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '680px',
                margin: '0 auto',
                boxShadow: darkMode 
                  ? '0 1px 2px 0 rgba(0,0,0,.3), 0 2px 6px 2px rgba(0,0,0,.15)'
                  : '0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Google logo inspired header - Removed dark mode toggle since it's in the Header */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {['#4285f4', '#34a853', '#fbbc05', '#ea4335'].map((color, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: color,
                        animation: showAnimation ? `bounce 0.6s ease ${i * 0.1}s` : 'none',
                        '@keyframes bounce': {
                          '0%, 100%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(-8px)' },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Error Code */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '6rem', sm: '8rem' },
                    fontWeight: 400,
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    lineHeight: 1,
                    mb: 2,
                    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100px',
                      height: '4px',
                      background: 'linear-gradient(90deg, #4285f4, #34a853, #fbbc05, #ea4335)',
                      borderRadius: '2px',
                      animation: showAnimation ? 'grow 1s ease-out 0.5s forwards' : 'none',
                      '@keyframes grow': {
                        '0%': { width: 0 },
                        '100%': { width: '100px' },
                      },
                    },
                  }}
                >
                  404
                </Typography>
                <ErrorOutline
                  sx={{
                    fontSize: 56,
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    opacity: 0.7,
                    mb: 3,
                    animation: showAnimation ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.7 },
                      '50%': { opacity: 0.9 },
                    },
                  }}
                />
              </Box>

              {/* Main Message */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 400,
                  color: darkMode ? '#e8eaed' : '#202124',
                  mb: 1,
                  fontSize: { xs: '1.25rem', md: '1.75rem' },
                  fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                }}
              >
                Page not found
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1rem',
                  maxWidth: '500px',
                  margin: '0 auto',
                }}
              >
                The requested URL was not found on this server.
                <br />
                That's all we know.
              </Typography>

              {/* Search Bar - Light background always */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                elevation={1}
                sx={{
                  p: 1,
                  borderRadius: 24,
                  border: '1px solid #dfe1e5',
                  maxWidth: '584px',
                  margin: '0 auto 3rem',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    boxShadow: '0 1px 6px rgba(32,33,36,.28)',
                    borderColor: 'rgba(223,225,229,0)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <IconButton
                  sx={{
                    color: '#9aa0a6',
                    p: 1.5,
                    ml: 1,
                  }}
                  aria-label="search"
                >
                  <Search />
                </IconButton>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our site..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    padding: '8px 16px',
                    background: 'transparent',
                    fontFamily: 'inherit',
                    color: '#202124',
                  }}
                />
                <IconButton
                  type="submit"
                  sx={{
                    color: '#4285f4',
                    p: 1.5,
                    mr: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    },
                  }}
                  aria-label="submit search"
                >
                  <Search />
                </IconButton>
              </Paper>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  mb: 4,
                }}
              >
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<Home />}
                  sx={{
                    background: '#1a73e8',
                    borderRadius: 4,
                    px: 4,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    minWidth: '140px',
                    '&:hover': {
                      background: '#0d62d9',
                      boxShadow: '0 1px 3px rgba(66,133,244,.3)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Go to Home
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={() => window.history.back()}
                  sx={{
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#3c4043',
                    borderRadius: 4,
                    px: 4,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    minWidth: '140px',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#d2e3fc',
                      background: darkMode ? 'rgba(138, 180, 248, 0.1)' : '#f8fafe',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Go Back
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                  sx={{
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#3c4043',
                    borderRadius: 4,
                    px: 4,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    minWidth: '140px',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#d2e3fc',
                      background: darkMode ? 'rgba(138, 180, 248, 0.1)' : '#f8fafe',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Refresh
                </Button>
              </Box>

              {/* Helpful Links */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: isMobile ? 2 : 4,
                  flexWrap: 'wrap',
                  mb: 3,
                  pt: 3,
                  borderTop: darkMode ? '1px solid #5f6368' : '1px solid #e8eaed',
                }}
              >
                <Button
                  component={Link}
                  href="/help"
                  startIcon={<HelpOutline />}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      background: 'transparent',
                    },
                  }}
                >
                  Help Center
                </Button>
                <Button
                  component={Link}
                  href="/status"
                  startIcon={<WifiOff />}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      background: 'transparent',
                    },
                  }}
                >
                  System Status
                </Button>
                <Button
                  component={Link}
                  href="/privacy"
                  startIcon={<Lock />}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      background: 'transparent',
                    },
                  }}
                >
                  Privacy Policy
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  startIcon={<Satellite />}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      background: 'transparent',
                    },
                  }}
                >
                  Contact Support
                </Button>
              </Box>

              {/* Tech Info */}
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: darkMode ? '1px solid #5f6368' : '1px solid #e8eaed',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  Error 404 (Not Found)
                </Typography>
                {currentUrl && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      background: darkMode ? '#35363a' : '#f8f9fa',
                      p: 1,
                      borderRadius: 2,
                      display: 'inline-block',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={currentUrl}
                  >
                    {currentUrl}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Fade>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              mt: 4,
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                flexWrap: 'wrap',
              }}
            >
              <Box component="span">AccumaManage CRM</Box>
              <Box component="span" sx={{ opacity: 0.6 }}>•</Box>
              <Box component="span">{new Date().getFullYear()}</Box>
              <Box component="span" sx={{ opacity: 0.6 }}>•</Box>
              <Box component="span">Error 404</Box>
            </Typography>
          </Box>

          {/* Easter Egg */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              opacity: 0.1,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <IconButton
              onClick={() => {
                const rocket = document.createElement('div');
                rocket.innerHTML = '🚀';
                rocket.style.position = 'fixed';
                rocket.style.bottom = '20px';
                rocket.style.right = '20px';
                rocket.style.fontSize = '40px';
                rocket.style.zIndex = '1000';
                document.body.appendChild(rocket);
                
                const animation = rocket.animate([
                  { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                  { transform: 'translate(-100vw, -100vh) rotate(360deg)', opacity: 0 }
                ], {
                  duration: 2000,
                  easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
                });
                
                animation.onfinish = () => rocket.remove();
              }}
              sx={{
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            >
              <RocketLaunch />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}