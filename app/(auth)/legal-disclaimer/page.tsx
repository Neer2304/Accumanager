// app/(auth)/legal-disclaimer/page.tsx - FIXED VERSION
'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Alert,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  alpha,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  LinearProgress,
  Collapse,
} from '@mui/material';
import {
  Warning,
  ArrowForward,
  ArrowBack,
  VerifiedUser,
  Visibility,
  Close,
  Gavel,
  Security,
  BugReport,
  Code,
  Info,
  CheckCircle,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedBackground } from '@/components/common';

const steps = ['Read Disclaimer', 'Accept Terms', 'Access Granted'];

// Legal disclaimer content with color mapping
const disclaimerContent = {
  title: "⚠️ IMPORTANT LEGAL DISCLAIMER",
  subtitle: "Development Preview - Not For Production Use",
  
  criticalWarnings: [
    "THIS IS A DEVELOPMENT PREVIEW SYSTEM",
    "NOT FOR COMMERCIAL OR PRODUCTION USE",
    "DO NOT ENTER REAL CUSTOMER OR FINANCIAL DATA",
    "DATA MAY BE PERIODICALLY WIPED DURING UPDATES",
    "FEATURES MAY BE INCOMPLETE OR UNSTABLE"
  ],
  
  points: [
    {
      icon: <Warning color="warning" />,
      color: '#ff9800', // Orange
      title: "Development Preview Only",
      description: "This application is actively under development and is presented as a preview/demo version only.",
    },
    {
      icon: <Security color="error" />,
      color: '#f44336', // Red
      title: "No Real Data Policy",
      description: "Never enter real customer information, financial data, or sensitive business information. Use only test/dummy data.",
    },
    {
      icon: <Gavel color="action" />,
      color: '#757575', // Grey
      title: "No Liability",
      description: "This software is provided 'AS IS' without warranties. Developers assume no liability for data loss or issues.",
    },
    {
      icon: <BugReport color="secondary" />,
      color: '#9c27b0', // Purple
      title: "Expect Instability",
      description: "Features may be buggy, incomplete, or removed without notice. Do not rely on this for critical operations.",
    },
    {
      icon: <Code color="info" />,
      color: '#2196f3', // Blue
      title: "Feedback Welcome",
      description: "We welcome bug reports and feature suggestions via appropriate channels.",
    },
    {
      icon: <Info color="primary" />,
      color: '#1976d2', // Dark Blue
      title: "Educational Purpose",
      description: "This system is for demonstration, testing, and educational purposes only.",
    },
  ],

  prohibitedItems: [
    "Real customer names, addresses, or contact information",
    "Actual financial transactions or banking details",
    "Sensitive business information or trade secrets",
    "Personal identification information (PII)",
    "Payment card or financial account numbers"
  ],

  acknowledgment: `By accepting this disclaimer, you confirm that you understand this is a development preview system intended for testing and demonstration purposes only. You agree not to use real data and acknowledge that the developers assume no liability for any issues arising from the use of this application. Any data entered may be used for development and debugging purposes but will not be shared with third parties for commercial purposes.`
};

export default function LegalDisclaimerPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Check authentication and disclaimer status
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if already accepted
    const checkDisclaimerStatus = async () => {
      try {
        const response = await fetch('/api/legals/check', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.accepted) {
            // Already accepted, redirect to dashboard
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.log('Disclaimer check failed, proceeding with page');
      }
    };

    checkDisclaimerStatus();
  }, [isAuthenticated, isLoading, router]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 10;
    setScrolledToBottom(bottom);
    if (bottom && activeStep === 0) {
      setActiveStep(1);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setScrolledToBottom(true);
      setActiveStep(1);
    }
  };

  const handleAccept = async () => {
    if (!checked) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Collect user data
      const userAgent = navigator.userAgent;
      const timestamp = new Date().toISOString();
      
      // Call API to log acceptance
      const response = await fetch('/api/legals/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          userEmail: user?.email,
          acceptVersion: '2.0.0',
          userAgent: userAgent,
          timestamp: timestamp,
          ipAddress: await getClientIP(),
          platform: navigator.platform,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to accept disclaimer');
      }

      // Show success
      setSuccess(true);
      
      // Store locally as backup
      localStorage.setItem('legal_disclaimer_accepted', 'true');
      localStorage.setItem('legal_disclaimer_accepted_date', new Date().toISOString());
      localStorage.setItem('legal_disclaimer_user_id', user?.id || '');
      localStorage.setItem('legal_disclaimer_user_name', user?.name || '');
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error accepting disclaimer:', error);
      setError(error.message || 'Failed to accept disclaimer. Please try again.');
      
      // Fallback - allow user to proceed with local storage only
      setTimeout(() => {
        localStorage.setItem('legal_disclaimer_accepted', 'true');
        router.push('/dashboard');
      }, 2000);
      
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      await logout();
      localStorage.removeItem('legal_disclaimer_accepted');
      sessionStorage.clear();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <AnimatedBackground showRadial>
        <Container sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 3
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading legal disclaimer...
          </Typography>
        </Container>
      </AnimatedBackground>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AnimatedBackground showRadial>
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Error Alert */}
        {error && (
          <Zoom in={!!error}>
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setError(null)}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          </Zoom>
        )}

        {/* Success Alert */}
        {success && (
          <Zoom in={success}>
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<CheckCircle />}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                ✅ Disclaimer Accepted Successfully
              </Typography>
              <Typography variant="body2">
                Redirecting to dashboard...
              </Typography>
            </Alert>
          </Zoom>
        )}

        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'warning.main',
              backgroundColor: 'background.paper',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                p: { xs: 2, md: 3 },
                textAlign: 'center',
                color: 'white',
                position: 'relative',
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white',
                }}
                onClick={handleDecline}
              >
                <Close />
              </IconButton>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 2, 
                mb: 1,
                flexWrap: 'wrap'
              }}>
                <Warning sx={{ fontSize: { xs: 32, md: 40 } }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {disclaimerContent.title}
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
                {disclaimerContent.subtitle}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
                {user && (
                  <Chip 
                    label={`User: ${user.name}`} 
                    size="small" 
                    sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
                <Chip 
                  label="DEVELOPMENT PREVIEW" 
                  size="small" 
                  color="warning"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip 
                  label="TEST DATA ONLY" 
                  size="small" 
                  color="error"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Box>

            {/* Stepper */}
            <Box sx={{ p: 3, bgcolor: alpha('#ff9800', 0.05) }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel 
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {/* Progress indicator */}
              <LinearProgress 
                variant="determinate" 
                value={(activeStep + 1) * 33.33} 
                sx={{ 
                  mt: 2, 
                  height: 4, 
                  borderRadius: 2,
                  bgcolor: alpha('#ff9800', 0.2),
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)',
                  }
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {/* Critical Warnings */}
              <Alert 
                severity="error" 
                icon={<Warning />}
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  border: '2px solid #f44336',
                  '& .MuiAlert-icon': { fontSize: 28 }
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🚨 CRITICAL WARNINGS
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {disclaimerContent.criticalWarnings.map((warning, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {warning}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Alert>

              {/* Expandable Sections */}
              {disclaimerContent.points.map((point, index) => (
                <Collapse key={index} in={expandedSection === `point-${index}` || expandedSection === null}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: alpha(point.color || '#2196f3', 0.05),
                      borderColor: alpha(point.color || '#2196f3', 0.3),
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha(point.color || '#2196f3', 0.1),
                      }
                    }}
                    onClick={() => toggleSection(`point-${index}`)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        bgcolor: alpha(point.color || '#2196f3', 0.1), 
                        p: 1, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {point.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {point.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {point.description}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        {expandedSection === `point-${index}` ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                  </Paper>
                </Collapse>
              ))}

              {/* Prohibited Items */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 2,
                  bgcolor: alpha('#f44336', 0.05),
                  borderColor: alpha('#f44336', 0.3),
                  borderWidth: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Security sx={{ color: '#f44336' }} />
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    🚫 ABSOLUTELY PROHIBITED
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {disclaimerContent.prohibitedItems.map((item, index) => (
                    <Box component="li" key={index} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <span style={{ color: '#f44336', fontWeight: 'bold', minWidth: '1.5em' }}>•</span>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Divider sx={{ my: 3 }}>
                <Chip label="FINAL ACKNOWLEDGMENT" color="primary" />
              </Divider>
            </Box>

            {/* Scrollable acknowledgment section */}
            <Box
              ref={scrollRef}
              onScroll={handleScroll}
              sx={{
                maxHeight: 200,
                overflow: 'auto',
                p: 3,
                borderTop: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '10px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {disclaimerContent.acknowledgment}
              </Typography>
              
              {/* Scroll indicator */}
              {!scrolledToBottom && (
                <Fade in={!scrolledToBottom}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 2,
                      p: 1.5,
                      bgcolor: alpha('#ff9800', 0.1),
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'warning.main',
                    }}
                  >
                    <Visibility sx={{ fontSize: 18, mr: 1.5, color: 'warning.main' }} />
                    <Typography variant="caption" fontWeight="bold" color="warning.main">
                      Scroll to the bottom to continue
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={scrollToBottom}
                      sx={{ ml: 2, color: 'warning.main', minWidth: 'auto' }}
                    >
                      Skip to bottom
                    </Button>
                  </Box>
                </Fade>
              )}
            </Box>

            {/* Acceptance Section */}
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => {
                      setChecked(e.target.checked);
                      if (e.target.checked && activeStep === 1) {
                        setActiveStep(2);
                      }
                    }}
                    disabled={!scrolledToBottom || loading}
                    color="primary"
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 32,
                      }
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color={checked ? 'primary.main' : 'text.primary'}>
                      ✅ I HAVE READ, UNDERSTOOD, AND AGREE TO ALL TERMS
                    </Typography>
                    {!scrolledToBottom && !loading && (
                      <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
                        (Please scroll to the bottom of the acknowledgment text to enable this checkbox)
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ 
                  mb: 3,
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                  }
                }}
              />

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDecline}
                  startIcon={<ArrowBack />}
                  size="large"
                  fullWidth={isMobile}
                  disabled={loading}
                  sx={{ 
                    minHeight: 48,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: 'error.light',
                    }
                  }}
                >
                  I DO NOT ACCEPT - LOGOUT
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAccept}
                  disabled={!checked || loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedUser />}
                  size="large"
                  fullWidth={isMobile}
                  sx={{ 
                    minHeight: 48,
                    borderRadius: 2,
                    background: checked && !loading 
                      ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)'
                      : undefined,
                    '&:hover': checked && !loading ? {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                    } : undefined,
                    '&.Mui-disabled': {
                      background: '#e0e0e0',
                      color: '#9e9e9e',
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} color="inherit" />
                      PROCESSING ACCEPTANCE...
                    </Box>
                  ) : (
                    'I ACCEPT & PROCEED TO DASHBOARD'
                  )}
                </Button>
              </Box>

              {/* Step Navigation */}
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}>
                  <Button
                    disabled={activeStep === 0 || loading}
                    onClick={() => setActiveStep(activeStep - 1)}
                    size="small"
                    variant="text"
                  >
                    ← Previous Step
                  </Button>
                  <Button
                    disabled={activeStep === 2 || (activeStep === 0 && !scrolledToBottom) || (activeStep === 1 && !checked) || loading}
                    onClick={() => setActiveStep(activeStep + 1)}
                    variant="outlined"
                    size="small"
                  >
                    Next Step →
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Zoom>

        {/* Footer Info */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Version 2.0.0 • Last Updated: {new Date().toLocaleDateString()} • 
            <Button 
              size="small" 
              sx={{ ml: 1, fontSize: '0.75rem' }}
              onClick={() => window.print()}
            >
              Print Disclaimer
            </Button>
          </Typography>
        </Box>
      </Container>
    </AnimatedBackground>
  );
}