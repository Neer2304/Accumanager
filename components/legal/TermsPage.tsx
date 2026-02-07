'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Chip,
  Container,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Grow,
  Button,
  Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  Gavel as GavelIcon,
  Article as ArticleIcon,
  CheckCircle,
  History,
  ExpandMore,
  ExpandLess,
  Update,
  PrivacyTip,
  Security,
  Description,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useTermsData } from '@/hooks/useTermsData';
import { TERMS_CONTENT } from './TermsContent';
import { LegalIcon, getSectionIcon } from './TermsIcons';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';

// Google-themed components
import { Alert as CustomAlert } from '@/components/ui/Alert';
import { Card as CustomCard } from '@/components/ui/Card';
import { Button as CustomButton } from '@/components/ui/Button';
import { Chip as CustomChip } from '@/components/ui/Chip';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        borderRadius: '12px',
        border: `1px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      {icon && (
        <Box sx={{ 
          mb: 3,
          color: darkMode ? '#5f6368' : '#9aa0a6',
          '& svg': {
            fontSize: 64,
          }
        }}>
          {icon}
        </Box>
      )}
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 1,
          color: darkMode ? '#e8eaed' : '#202124',
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 3, 
          maxWidth: 400,
          color: darkMode ? '#9aa0a6' : '#5f6368',
        }}
      >
        {description}
      </Typography>
      {action && (
        <CustomButton
          variant="contained"
          onClick={action.onClick}
          disabled={action.disabled}
          sx={{ 
            backgroundColor: '#4285f4',
            '&:hover': { backgroundColor: '#3367d6' }
          }}
        >
          {action.label}
        </CustomButton>
      )}
    </Box>
  );
};

interface DateChipProps {
  date: string;
  label?: string;
  variant?: 'filled' | 'outlined';
  sx?: any;
}

const DateChip = ({ 
  date, 
  label = "Updated", 
  variant = 'outlined',
  sx 
}: DateChipProps) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <CustomChip
      label={`${label}: ${formatDate(date)}`}
      variant={variant}
      sx={{
        backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
        borderColor: alpha('#4285f4', 0.3),
        color: darkMode ? '#8ab4f8' : '#4285f4',
        fontWeight: 500,
        ...sx,
      }}
      icon={<Update sx={{ fontSize: 16 }} />}
    />
  );
};

export default function TermsConditionsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  const { terms, loading, error, fetchTerms } = useTermsData();
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (loading) {
    return (
      <MainLayout title={TERMS_CONTENT.page.title}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <LoadingState />
        </Box>
      </MainLayout>
    );
  }

  if (error || !terms) {
    return (
      <MainLayout title={TERMS_CONTENT.page.title}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          <ErrorState 
            error={error || TERMS_CONTENT.page.errorTitle} 
            onRetry={fetchTerms}
            retryText={TERMS_CONTENT.buttons.retry}
          />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={TERMS_CONTENT.page.title}>
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
              {TERMS_CONTENT.page.title}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <GavelIcon sx={{ 
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
              {terms.title}
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
              {TERMS_CONTENT.header.effectiveDatePrefix}{terms.effectiveDate}
              {terms.description && ` • ${terms.description}`}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <CustomChip
              label={`${TERMS_CONTENT.labels.version} ${terms.version}`}
              variant="filled"
              sx={{
                backgroundColor: darkMode ? '#34a853' : '#34a853',
                color: 'white',
                fontWeight: 500,
              }}
              icon={<Description sx={{ fontSize: 16 }} />}
            />
            
            <DateChip 
              date={terms.lastUpdated}
              label={TERMS_CONTENT.labels.updated}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Important Notice */}
          <Grow in timeout={500}>
            <CustomAlert
              severity="warning"
              title={TERMS_CONTENT.importantNotice.title}
              message={TERMS_CONTENT.importantNotice.content}
              dismissible={false}
              icon={<Security />}
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                borderColor: alpha('#fbbc04', 0.3),
              }}
            />
          </Grow>

          {/* Agreement Overview */}
          <CustomCard
            title={TERMS_CONTENT.agreementOverview.title}
            subtitle="Read carefully before using our services"
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${alpha('#4285f4', 0.2)}`,
            }}
          >
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {TERMS_CONTENT.agreementOverview.content}
              </Typography>
            </Box>
          </CustomCard>

          {/* Dynamic Sections from API */}
          {terms.sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
            <Grow key={section._id || index} in timeout={(index + 1) * 200}>
              <CustomCard
                title={`${index + 1}. ${section.title}`}
                // subtitle={section.subtitle || ''}
                action={
                  <CustomButton
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
                  </CustomButton>
                }
                hover
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: darkMode 
                      ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                      : '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 2, 
                  mb: expandedSections.includes(index) ? 2 : 0 
                }}>
                  <Box sx={{ 
                    p: 1.5,
                    borderRadius: '10px',
                    backgroundColor: alpha('#4285f4', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <LegalIcon 
                      name={getSectionIcon(section.icon)} 
                      size="medium"
                      sx={{ 
                        color: '#4285f4',
                        fontSize: { xs: 20, sm: 24 },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    {expandedSections.includes(index) ? (
                      <Fade in timeout={300}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: darkMode ? '#e8eaed' : '#202124',
                            lineHeight: 1.8,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                          }}
                        >
                          {section.content}
                        </Typography>
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
                        }}
                      >
                        {section.content.substring(0, 200)}...
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CustomCard>
            </Grow>
          ))}

          {/* Important Points / User Obligations */}
          <CustomCard
            title={`${terms.sections.length + 1}. ${TERMS_CONTENT.userObligations.titlePrefix}`}
            subtitle="Key responsibilities and requirements"
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${alpha('#34a853', 0.2)}`,
            }}
          >
            <List sx={{ 
              mt: 1,
              '& .MuiListItem-root': {
                px: 0,
                py: 1,
              }
            }}>
              {(terms.importantPoints.length > 0 
                ? terms.importantPoints
                    .sort((a, b) => a.order - b.order)
                : TERMS_CONTENT.userObligations.defaultPoints.map((text, index) => ({
                    _id: index.toString(),
                    text,
                    order: index
                  }))
              ).map((point, index) => (
                <ListItem key={point._id || index}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle sx={{ 
                      fontSize: 20, 
                      color: '#34a853',
                    }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1"
                        sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        {point.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CustomCard>

          {/* Contact & Support */}
          <CustomCard
            title="Need Help?"
            subtitle="Contact our legal team"
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              p: 3,
            }}>
              <Box sx={{ 
                flex: 1,
                p: 2,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 1,
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                  }}
                >
                  Legal Support
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mb: 2,
                  }}
                >
                  For questions about these terms
                </Typography>
                <CustomButton
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Contact Legal Team
                </CustomButton>
              </Box>
              
              <Box sx={{ 
                flex: 1,
                p: 2,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 1,
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                  }}
                >
                  General Questions
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mb: 2,
                  }}
                >
                  For service-related inquiries
                </Typography>
                <CustomButton
                  variant="contained"
                  size="small"
                  sx={{ 
                    backgroundColor: '#4285f4',
                    '&:hover': { backgroundColor: '#3367d6' }
                  }}
                >
                  Contact Support
                </CustomButton>
              </Box>
            </Box>
          </CustomCard>

          {/* Footer */}
          <CustomCard
            sx={{ 
              mt: 4,
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              border: 'none',
              textAlign: 'center',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 3,
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
              }}>
                <History sx={{ 
                  fontSize: 20, 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  {TERMS_CONTENT.labels.version}: {terms.version} • 
                  {TERMS_CONTENT.labels.effectiveDate}: {terms.effectiveDate}
                </Typography>
              </Box>
              
              <Divider sx={{ 
                width: '100%', 
                borderColor: darkMode ? '#3c4043' : '#dadce0' 
              }} />
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  display: 'block',
                  maxWidth: 600,
                }}
              >
                {TERMS_CONTENT.footer.updateNotice}
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  display: 'block',
                }}
              >
                {TERMS_CONTENT.footer.contactEmail}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                mt: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                <MuiLink
                  href="#"
                  sx={{ 
                    textDecoration: 'none',
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontSize: '0.875rem',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Privacy Policy
                </MuiLink>
                <MuiLink
                  href="#"
                  sx={{ 
                    textDecoration: 'none',
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontSize: '0.875rem',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Cookie Policy
                </MuiLink>
                <MuiLink
                  href="#"
                  sx={{ 
                    textDecoration: 'none',
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                    fontSize: '0.875rem',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Acceptable Use Policy
                </MuiLink>
              </Box>
            </Box>
          </CustomCard>

          {/* Back to Dashboard */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
          }}>
            <CustomButton
              variant="outlined"
              onClick={() => window.history.back()}
              sx={{
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              Back to Dashboard
            </CustomButton>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}