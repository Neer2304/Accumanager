"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Article as ArticleIcon,
  Update,
  History,
  PrivacyTip,
  Security,
  CheckCircle,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { LegalMarkdown } from './LegalMarkdown';

interface LegalDocument {
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
  effectiveDate?: string;
  description?: string;
}

interface LegalDocumentPageProps {
  title: string;
  apiEndpoint: string;
  icon: React.ReactNode;
  description?: string;
  relatedLinks?: Array<{ label: string; href: string }>;
}

export const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({
  title,
  apiEndpoint,
  icon,
  description,
  relatedLinks = [],
}) => {
  const theme = useTheme();
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
      
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${title}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDocument(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || `Failed to load ${title}`);
      console.error(`Error fetching ${title}:`, err);
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

  const parseContent = (content: string) => {
    const sections = [];
    const lines = content.split('\n');
    let currentSection: { title: string; content: string[]; level: number } | null = null;
    
    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headerMatch) {
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentSection.content.join('\n')
          });
        }
        
        currentSection = {
          title: headerMatch[2],
          content: [],
          level: headerMatch[1].length
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }
    
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

  if (loading) {
    return (
      <MainLayout title={title}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading {title}...
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={title}>
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
              {title}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Box sx={{ 
              fontSize: { xs: 48, sm: 60, md: 72 }, 
              mb: 2,
              color: darkMode ? '#8ab4f8' : '#4285f4',
            }}>
              {icon}
            </Box>
            
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {document?.title || title}
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
              {document?.description || description}
            </Typography>
          </Box>

          {document && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2,
              flexWrap: 'wrap',
              mt: 3,
            }}>
              <Chip
                label={`Version ${document.version}`}
                variant="filled"
                sx={{
                  backgroundColor: '#34a853',
                  color: 'white',
                  fontWeight: 500,
                }}
                icon={<ArticleIcon sx={{ fontSize: 16 }} />}
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
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {error && (
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
          )}

          <Alert
            severity="warning"
            title="Important Notice"
            message={`By accessing or using our services, you agree to be bound by this ${title}. Please read it carefully.`}
            dismissible={false}
            icon={<Security />}
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
              borderColor: alpha('#fbbc04', 0.3),
            }}
          />

          {document && (
            <Box>
              {(() => {
                const sections = parseContent(document.content);
                
                if (sections.length === 0) {
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
                        <LegalMarkdown content={document.content} darkMode={darkMode} />
                      </Box>
                    </Card>
                  );
                }
                
                return sections.map((section, index) => (
                  <Card
                    key={`section-${index}`}
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
                        <LegalMarkdown content={section.content} darkMode={darkMode} />
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
                ));
              })()}

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

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: { xs: 2, sm: 3, md: 4 },
              }}>
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
                      Download a PDF copy for your records.
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
                      If you have any questions, please contact us.
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

          {relatedLinks.length > 0 && (
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
                  {relatedLinks.map((link) => (
                    <MuiLink
                      key={link.href}
                      component={Link}
                      href={link.href}
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
                      {link.label}
                    </MuiLink>
                  ))}
                </Box>
              </Box>
            </Card>
          )}

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
};