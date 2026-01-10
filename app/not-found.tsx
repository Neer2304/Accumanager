// app/not-found.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from '@mui/material';
import {
  Home,
  ArrowBack,
  RocketLaunch,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function NotFound() {
  return (
    <MainLayout title="Page Not Found">
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          mt: 0,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)',
            animation: 'float 6s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            bottom: '15%',
            right: '15%',
            animation: 'pulse 3s ease-in-out infinite 1s',
          }}
        />

        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              zIndex: 1,
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            {/* Main Icon */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: '0 15px 35px rgba(255, 107, 107, 0.4)',
                animation: 'bounce 2s ease-in-out infinite',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}
            >
              <RocketLaunch
                sx={{
                  fontSize: 50,
                  color: 'white',
                  transform: 'rotate(-45deg)',
                }}
              />
            </Box>

            {/* Error Code */}
            <Typography
              variant="h1"
              sx={{
                fontSize: '5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53, #667eea)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1,
                mb: 1,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              404
            </Typography>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#2D3748',
                mb: 2,
                background: 'linear-gradient(45deg, #2D3748, #4A5568)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Lost in Space?
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: '#718096',
                mb: 4,
                lineHeight: 1.6,
                fontSize: '1.1rem',
                maxWidth: '400px',
                margin: '0 auto',
              }}
            >
              Looks like this page has taken off to another galaxy. 
              Don't worry, we'll help you get back on track.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                size="large"
                startIcon={<Home />}
                sx={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  minWidth: '160px',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Back to Home
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                onClick={() => window.history.back()}
                sx={{
                  borderColor: '#E2E8F0',
                  color: '#4A5568',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  minWidth: '160px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: '#667eea',
                    background: 'rgba(102, 126, 234, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Go Back
              </Button>
            </Box>

            {/* Quick Stats */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                mt: 4,
                pt: 3,
                borderTop: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                  404
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096' }}>
                  Error Code
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#764ba2', fontWeight: 'bold' }}>
                  ∞
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096' }}>
                  Possibilities
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                  100%
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096' }}>
                  Recoverable
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              © {new Date().getFullYear()} AccumaManage CRM • Navigating the digital universe
            </Typography>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}