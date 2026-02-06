// app/loading.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

export default function Loading() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Use theme context instead of local state
  const { mode } = useThemeContext(); // Assuming your context has 'mode'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = mode === 'dark';

  useEffect(() => {
    setMounted(true);
    
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Smooth progress animation
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(progress + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <Fade in={mounted} timeout={800}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkMode 
            ? '#202124' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Animated background elements */}
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
            opacity: darkMode ? 0.08 : 0.15,
            transform: 'skewY(-12deg)',
            transformOrigin: '0',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              borderRadius: '50%',
              background: darkMode 
                ? `rgba(138, 180, 248, ${Math.random() * 0.3})`
                : `rgba(255, 255, 255, ${Math.random() * 0.5})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
              '@keyframes float': {
                '0%, 100%': { 
                  transform: 'translateY(0) translateX(0)',
                  opacity: 0.3,
                },
                '50%': { 
                  transform: 'translateY(-20px) translateX(10px)',
                  opacity: 0.6,
                },
              },
            }}
          />
        ))}

        {/* Main loading container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            p: { xs: 3, md: 4 },
            background: darkMode 
              ? 'rgba(41, 42, 45, 0.9)' 
              : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3,
            border: darkMode 
              ? '1px solid rgba(95, 99, 104, 0.3)' 
              : '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(102, 126, 234, 0.2)',
            maxWidth: '500px',
            width: '90%',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Google-inspired logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {['#4285f4', '#34a853', '#fbbc05', '#ea4335'].map((color, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: color,
                    animation: `bounce 0.6s ease ${i * 0.1}s infinite`,
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-8px)' },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Main loading indicator */}
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={120}
              thickness={4}
              sx={{
                color: darkMode ? '#8ab4f8' : '#667eea',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: darkMode ? '#e8eaed' : '#667eea',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
          </Box>

          {/* Loading message */}
          <Typography
            variant="h4"
            sx={{
              color: darkMode ? '#e8eaed' : '#2D3748',
              fontWeight: 500,
              mb: 2,
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
            }}
          >
            Loading AccumaManage
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: darkMode ? '#9aa0a6' : '#718096',
              mb: 4,
              lineHeight: 1.6,
              fontSize: '1rem',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            Preparing your dashboard experience...
          </Typography>

          {/* Progress bar with animation */}
          <Box
            sx={{
              width: '100%',
              height: 8,
              backgroundColor: darkMode 
                ? 'rgba(154, 160, 166, 0.2)' 
                : 'rgba(226, 232, 240, 0.8)',
              borderRadius: 4,
              overflow: 'hidden',
              mb: 2,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: '100%',
                background: darkMode 
                  ? 'linear-gradient(90deg, #8ab4f8, #34a853)'
                  : 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: 4,
                transition: 'width 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  background: darkMode
                    ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shimmer 2s infinite',
                  '@keyframes shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                  },
                },
              }}
            />
          </Box>

          {/* Loading steps */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mt: 3,
              pt: 3,
              borderTop: darkMode 
                ? '1px solid rgba(95, 99, 104, 0.3)' 
                : '1px solid rgba(226, 232, 240, 0.5)',
            }}
          >
            {[
              { label: 'Data', active: progress > 30 },
              { label: 'Layout', active: progress > 60 },
              { label: 'Ready', active: progress > 90 },
            ].map((step, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: step.active
                      ? darkMode ? '#34a853' : '#764ba2'
                      : darkMode ? '#5f6368' : '#e2e8f0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    ...(step.active && {
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.2)' },
                      },
                    }),
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: step.active
                      ? darkMode ? '#e8eaed' : '#2D3748'
                      : darkMode ? '#9aa0a6' : '#a0aec0',
                    fontWeight: step.active ? 600 : 400,
                    fontSize: '0.75rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Tip/Message */}
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? '#9aa0a6' : '#718096',
              display: 'block',
              mt: 3,
              fontSize: '0.75rem',
              fontStyle: 'italic',
            }}
          >
            Pro tip: Loading times may vary based on your connection speed
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? '#9aa0a6' : 'rgba(255, 255, 255, 0.8)',
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
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}