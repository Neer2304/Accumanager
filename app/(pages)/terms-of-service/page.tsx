// app/terms-of-service/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  alpha,
  Grow,
  Fade,
  Divider,
  List,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Article as ArticleIcon,
  Update,
  History,
  Gavel,
  PrivacyTip,
  Security,
  Description,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  ChevronRight,
} from '@mui/icons-material';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Google-themed components
import { MainLayout } from '@/components/Layout/MainLayout';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

interface LegalDocument {
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
  effectiveDate?: string;
  description?: string;
}

export default function TermsOfServicePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/legal/terms-of-service');
      
      if (!response.ok) {
        throw new Error('Failed to fetch terms of service');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDocument(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load terms of service');
      console.error('Error fetching terms of service:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Parse content into sections based on headers
  const parseContent = (content: string) => {
    const sections = [];
    const lines = content.split('\n');
    let currentSection: { title: string; content: string[]; level: number } | null = null;
    
    for (const line of lines) {
      // Check if line is a header
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentSection.content.join('\n')
          });
        }
        
        // Start new section
        currentSection = {
          title: headerMatch[2],
          content: [],
          level: headerMatch[1].length
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }
    
    // Add last section
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentSection.content.join('\n')
      });
    }
    
    return sections;
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const MarkdownContent = ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <Typography 
              variant="h4" 
              sx={{ 
                mt: 4, 
                mb: 2, 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              }}
            >
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography 
              variant="h5" 
              sx={{ 
                mt: 3, 
                mb: 1.5, 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              }}
            >
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 2, 
                mb: 1, 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
              }}
            >
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2, 
                lineHeight: 1.8,
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              {children}
            </Typography>
          ),
          ul: ({ children }) => (
            <List 
              sx={{ 
                pl: 2, 
                mb: 2,
                listStyleType: 'disc',
                '& li': { 
                  display: 'list-item',
                  color: darkMode ? '#e8eaed' : '#202124',
                  mb: 1,
                }
              }}
            >
              {children}
            </List>
          ),
          ol: ({ children }) => (
            <List 
              component="ol"
              sx={{ 
                pl: 2, 
                mb: 2,
                listStyleType: 'decimal',
                '& li': { 
                  display: 'list-item',
                  color: darkMode ? '#e8eaed' : '#202124',
                  mb: 1,
                }
              }}
            >
              {children}
            </List>
          ),
          li: ({ children }) => (
            <ListItem sx={{ 
              display: 'list-item', 
              p: 0,
              mb: 0.5,
            }}>
              <ListItemIcon sx={{ 
                minWidth: 24, 
                mt: 0.5,
                mr: 1,
              }}>
                <ChevronRight sx={{ 
                  fontSize: 16, 
                  color: darkMode ? '#5f6368' : '#9aa0a6',
                }} />
              </ListItemIcon>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {children}
              </Typography>
            </ListItem>
          ),
          strong: ({ children }) => (
            <Typography 
              component="span" 
              sx={{ 
                fontWeight: 600,
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              {children}
            </Typography>
          ),
          em: ({ children }) => (
            <Typography 
              component="span" 
              sx={{ 
                fontStyle: 'italic',
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Box sx={{ 
              pl: 2, 
              ml: 2, 
              borderLeft: `4px solid ${darkMode ? '#4285f4' : '#1a73e8'}`,
              mb: 2,
              backgroundColor: darkMode ? alpha('#4285f4', 0.05) : alpha('#4285f4', 0.03),
              p: 2,
              borderRadius: '0 4px 4px 0',
            }}>
              {children}
            </Box>
          ),
          code: ({ children }) => (
            <Box
              component="code"
              sx={{
                fontFamily: 'monospace',
                backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                color: darkMode ? '#e8eaed' : '#202124',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.875em',
              }}
            >
              {children}
            </Box>
          ),
          a: ({ children, href }) => (
            <MuiLink 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              {children}
            </MuiLink>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  if (loading) {
    return (
      <MainLayout title="Terms of Service">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading Terms of Service...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Terms of Service">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <MuiLink 
              component={Link} 
              href="/dashboard" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300, 
                "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </MuiLink>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Terms of Service
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Gavel sx={{ 
              fontSize: { xs: 48, sm: 60, md: 72 }, 
              mb: 2,
              color: darkMode ? '#8ab4f8' : '#4285f4',
            }} />
            
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {document?.title || 'Terms of Service'}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {document?.description || 'Please read these terms carefully before using our services'}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            {document && (
              <>
                <Chip
                  label={`Version ${document.version}`}
                  variant="filled"
                  sx={{
                    backgroundColor: darkMode ? '#34a853' : '#34a853',
                    color: 'white',
                    fontWeight: 500,
                  }}
                  icon={<Description sx={{ fontSize: 16 }} />}
                />
                
                <Chip
                  label={`Last updated: ${formatDate(document.lastUpdated)}`}
                  variant="outlined"
                  sx={{
                    backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                    borderColor: alpha('#4285f4', 0.3),
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontWeight: 500,
                  }}
                  icon={<Update sx={{ fontSize: 16 }} />}
                />

                {document.effectiveDate && (
                  <Chip
                    label={`Effective: ${formatDate(document.effectiveDate)}`}
                    variant="outlined"
                    sx={{
                      backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                      borderColor: alpha('#fbbc04', 0.3),
                      color: darkMode ? '#fdd663' : '#fbbc04',
                      fontWeight: 500,
                    }}
                    icon={<History sx={{ fontSize: 16 }} />}
                  />
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <Grow in timeout={500}>
              <Alert
                severity="error"
                title="Error Loading Document"
                message={error}
                dismissible
                onDismiss={() => setError('')}
                action={
                  <Button
                    variant="text"
                    onClick={fetchDocument}
                    size="small"
                    sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}
                  >
                    Retry
                  </Button>
                }
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              />
            </Grow>
          )}

          {/* Important Notice */}
          <Grow in timeout={600}>
            <Alert
              severity="warning"
              title="Important Notice"
              message="By accessing or using our services, you agree to be bound by these Terms of Service. Please read them carefully."
              dismissible={false}
              icon={<Security />}
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                borderColor: alpha('#fbbc04', 0.3),
              }}
            />
          </Grow>

          {/* Document Content */}
          {document && (
            <Box>
              {/* Display Full Content in Expandable Sections */}
              {(() => {
                const sections = parseContent(document.content);
                
                if (sections.length === 0) {
                  // If no sections found, show full content
                  return (
                    <Card
                      hover
                      sx={{ 
                        mb: { xs: 2, sm: 3, md: 4 },
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${alpha('#4285f4', 0.2)}`,
                      }}
                    >
                      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <MarkdownContent content={document.content} />
                      </Box>
                    </Card>
                  );
                }
                
                return sections.map((section, index) => (
                  <Grow key={`section-${index}`} in timeout={(index + 1) * 200}>
                    <Card
                      title={section.title}
                      subtitle={`Section ${index + 1}`}
                      action={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => toggleSection(index)}
                          iconRight={expandedSections.includes(index) ? <ExpandLess /> : <ExpandMore />}
                          sx={{
                            minWidth: 'auto',
                            p: 1,
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}
                        >
                          {expandedSections.includes(index) ? 'Show Less' : 'Show More'}
                        </Button>
                      }
                      hover
                      sx={{ 
                        mb: { xs: 2, sm: 3 },
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${
                          section.level === 1 
                            ? alpha('#4285f4', 0.3)
                            : section.level === 2
                              ? alpha('#34a853', 0.3)
                              : darkMode 
                                ? '#3c4043' 
                                : '#dadce0'
                        }`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: darkMode 
                            ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                            : '0 8px 24px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        {expandedSections.includes(index) || section.level <= 2 ? (
                          <Fade in timeout={300}>
                            <Box>
                              <MarkdownContent content={section.content} />
                            </Box>
                          </Fade>
                        ) : (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontStyle: 'italic',
                            }}
                          >
                            Click "Show More" to view this section...
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  </Grow>
                ));
              })()}

              {/* Acceptance Agreement */}
              <Card
                title="Acceptance of Terms"
                subtitle="Your agreement"
                hover
                sx={{ 
                  mb: { xs: 2, sm: 3, md: 4 },
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${alpha('#34a853', 0.2)}`,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 2,
                  p: { xs: 2, sm: 3, md: 4 },
                }}>
                  <CheckCircle sx={{ 
                    fontSize: { xs: 32, sm: 40 }, 
                    color: '#34a853',
                    mt: 0.5,
                  }} />
                  
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1.5,
                        color: darkMode ? '#e8eaed' : '#202124',
                        fontWeight: 600,
                      }}
                    >
                      Agreement Confirmation
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2,
                        color: darkMode ? '#e8eaed' : '#202124',
                        lineHeight: 1.8,
                      }}
                    >
                      By continuing to use our services, you acknowledge that you have read, 
                      understood, and agree to be bound by all the terms and conditions 
                      outlined in this document.
                    </Typography>
                    
                    <Box sx={{ 
                      mt: 3,
                      p: 2,
                      backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.05),
                      borderRadius: '8px',
                      border: `1px solid ${alpha('#34a853', 0.2)}`,
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: darkMode ? '#81c995' : '#2e7d32',
                          fontStyle: 'italic',
                        }}
                      >
                        Last updated: {formatDate(document.lastUpdated)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>

              {/* Download & Contact Section */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: { xs: 2, sm: 3, md: 4 },
              }}>
                {/* Download Card */}
                <Card
                  hover
                  sx={{ 
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mb: 2,
                    }}>
                      <ArticleIcon sx={{ 
                        fontSize: 32, 
                        color: darkMode ? '#5f6368' : '#9aa0a6',
                      }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontWeight: 600,
                        }}
                      >
                        Download Document
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 3,
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}
                    >
                      Download a PDF copy of these Terms of Service for your records.
                    </Typography>
                    
                    <Button
                      variant="contained"
                      iconLeft={<DownloadIcon />}
                      fullWidth
                      sx={{ 
                        backgroundColor: '#4285f4',
                        '&:hover': { backgroundColor: '#3367d6' }
                      }}
                    >
                      Download PDF (Version {document.version})
                    </Button>
                  </Box>
                </Card>

                {/* Contact Card */}
                <Card
                  hover
                  sx={{ 
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mb: 2,
                    }}>
                      <PrivacyTip sx={{ 
                        fontSize: 32, 
                        color: darkMode ? '#5f6368' : '#9aa0a6',
                      }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontWeight: 600,
                        }}
                      >
                        Questions?
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 3,
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}
                    >
                      If you have any questions about these Terms of Service, please contact us.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          color: darkMode ? '#e8eaed' : '#202124',
                          justifyContent: 'flex-start',
                        }}
                      >
                        legal@company.com
                      </Button>
                      
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          color: darkMode ? '#e8eaed' : '#202124',
                          justifyContent: 'flex-start',
                        }}
                      >
                        +1 (555) 123-4567
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Box>
          )}

          {/* Footer Links */}
          <Card
            sx={{ 
              mt: 2,
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              border: 'none',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 3,
              textAlign: 'center',
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                Related Documents
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                <MuiLink
                  component={Link}
                  href="/privacy-policy"
                  sx={{ 
                    textDecoration: 'none',
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': { 
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Privacy Policy
                </MuiLink>
                
                <MuiLink
                  component={Link}
                  href="/cookie-policy"
                  sx={{ 
                    textDecoration: 'none',
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': { 
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Cookie Policy
                </MuiLink>
                
                <MuiLink
                  component={Link}
                  href="/acceptable-use"
                  sx={{ 
                    textDecoration: 'none',
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': { 
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Acceptable Use Policy
                </MuiLink>
                
                <MuiLink
                  component={Link}
                  href="/data-processing"
                  sx={{ 
                    textDecoration: 'none',
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': { 
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Data Processing Agreement
                </MuiLink>
              </Box>
            </Box>
          </Card>

          {/* Back Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
          }}>
            <Button
              variant="outlined"
              iconLeft={<BackIcon />}
              component={Link}
              href="/dashboard"
              sx={{
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                px: 4,
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}