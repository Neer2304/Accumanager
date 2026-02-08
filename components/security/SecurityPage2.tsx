"use client";

import { useState, useEffect } from "react";
import { 
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Security,
  Shield,
  Lock,
  VerifiedUser,
  VisibilityOff,
  DataSaverOff,
  ArrowForward,
  CheckCircle,
  Warning,
  BugReport,
  Cloud,
  Storage,
  Code,
  MonitorHeart,
} from "@mui/icons-material";
import Link from "next/link";
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { LandingHeader } from "@/components/landing/Header";
import { AlertTriangle, FileLock, Key, Globe, Server, Users, Zap, RefreshCw } from "lucide-react";

// Import common components
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'infrastructure' | 'application' | 'compliance' | 'privacy';
  details: string[];
}

interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'in-progress' | 'planned';
  icon: React.ReactNode;
}

export default function SecurityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getResponsiveTypography = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  const securityFeatures: SecurityFeature[] = [
    {
      id: "encryption",
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest",
      icon: <Lock sx={{ fontSize: 32, color: '#4285f4' }} />,
      category: 'infrastructure',
      details: [
        "AES-256 encryption for data at rest",
        "TLS 1.3 for data in transit",
        "Encrypted backups with unique keys",
        "Zero-knowledge architecture"
      ]
    },
    {
      id: "authentication",
      title: "Multi-Factor Authentication",
      description: "Advanced authentication mechanisms",
      icon: <VerifiedUser sx={{ fontSize: 32, color: '#34a853' }} />,
      category: 'application',
      details: [
        "2FA via TOTP and biometrics",
        "Single Sign-On (SSO) support",
        "Passwordless authentication",
        "Device fingerprinting"
      ]
    },
    {
      id: "compliance",
      title: "GDPR & SOC 2 Compliance",
      description: "Enterprise-grade compliance standards",
      icon: <Shield sx={{ fontSize: 32, color: '#fbbc04' }} />,
      category: 'compliance',
      details: [
        "GDPR compliant data processing",
        "SOC 2 Type II certified",
        "Regular security audits",
        "Data residency controls"
      ]
    },
    {
      id: "privacy",
      title: "Privacy by Design",
      description: "Privacy-first approach to development",
      icon: <VisibilityOff sx={{ fontSize: 32, color: '#ea4335' }} />,
      category: 'privacy',
      details: [
        "Data minimization principles",
        "User data anonymization",
        "Privacy impact assessments",
        "Right to erasure support"
      ]
    },
    {
      id: "monitoring",
      title: "24/7 Security Monitoring",
      description: "Real-time threat detection and response",
      icon: <MonitorHeart sx={{ fontSize: 32, color: '#4285f4' }} />,
      category: 'infrastructure',
      details: [
        "Real-time intrusion detection",
        "Automated threat response",
        "Security event logging",
        "Incident response team"
      ]
    },
    {
      id: "penetration",
      title: "Penetration Testing",
      description: "Regular security assessments",
      icon: <BugReport sx={{ fontSize: 32, color: '#34a853' }} />,
      category: 'application',
      details: [
        "Quarterly penetration tests",
        "Vulnerability scanning",
        "Bug bounty program",
        "Security code reviews"
      ]
    },
    {
      id: "backup",
      title: "Disaster Recovery",
      description: "Comprehensive backup and recovery",
      icon: <Cloud sx={{ fontSize: 32, color: '#fbbc04' }} />,
      category: 'infrastructure',
      details: [
        "Daily encrypted backups",
        "Multi-region replication",
        "99.9% uptime SLA",
        "RTO/RTO compliance"
      ]
    },
    {
      id: "access",
      title: "Access Controls",
      description: "Granular permission management",
      icon: <Key/>,
      category: 'application',
      details: [
        "Role-based access control",
        "Least privilege principle",
        "Access audit trails",
        "Session management"
      ]
    }
  ];

  const complianceStandards: ComplianceStandard[] = [
    {
      id: "gdpr",
      name: "GDPR",
      description: "General Data Protection Regulation",
      status: 'compliant',
      icon: <FileLock />
    },
    {
      id: "soc2",
      name: "SOC 2 Type II",
      description: "Service Organization Control",
      status: 'compliant',
      icon: <Shield />
    },
    {
      id: "iso27001",
      name: "ISO 27001",
      description: "Information Security Management",
      status: 'in-progress',
      icon: <VerifiedUser />
    },
    {
      id: "hipaa",
      name: "HIPAA",
      description: "Health Insurance Portability",
      status: 'planned',
      icon: <Medical />
    },
    {
      id: "pci",
      name: "PCI DSS",
      description: "Payment Card Industry",
      status: 'in-progress',
      icon: <CreditCard />
    },
    {
      id: "ccpa",
      name: "CCPA",
      description: "California Consumer Privacy",
      status: 'compliant',
      icon: <PrivacyTip />
    }
  ];

  const securityStats = [
    { label: "Security Audits", value: "Quarterly", icon: <Shield /> },
    { label: "Penetration Tests", value: "Monthly", icon: <BugReport /> },
    { label: "Vulnerability Scans", value: "Daily", icon: <MonitorHeart /> },
    { label: "Incident Response", value: "24/7", icon: <Warning /> },
    { label: "Data Encryption", value: "100%", icon: <Lock /> },
    { label: "Uptime SLA", value: "99.9%", icon: <Cloud /> }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh",
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width={120} height={40} />
        </Box>
        
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: 'center',
            mb: 8
          }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Box key={item} sx={{ 
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)' }
              }}>
                <Card sx={{ 
                  height: '100%', 
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                    {[1, 2, 3, 4].map((feature) => (
                      <Skeleton key={feature} variant="text" width="90%" height={20} sx={{ mb: 1 }} />
                    ))}
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: "100vh",
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="sm">
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            borderRadius: '16px',
          }}>
            <AlertTriangle/>
            <Typography variant="h4" fontWeight={500} gutterBottom color={darkMode ? "#e8eaed" : "#202124"}>
              Error Loading Security Information
            </Typography>
            <Typography variant="body1" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              onClick={() => window.location.reload()}
              startIcon={<RefreshCw />}
              variant="contained"
              sx={{
                backgroundColor: '#4285f4',
                color: "white",
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: '#3367d6',
                },
              }}
            >
              Retry
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      transition: 'all 0.3s ease',
    }}>
      <LandingHeader />

      {/* Header Section */}
      <Box
        sx={{
          pt: { xs: 8, sm: 10, md: 12 },
          pb: { xs: 6, sm: 8, md: 10 },
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          color: "white",
          position: "relative",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              icon={<Shield sx={{ fontSize: 16 }} />}
              label="Enterprise-Grade Security"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'white' }
              }}
            />

            <Typography
              variant="h1"
              component="h1"
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: getResponsiveTypography('2rem', '2.5rem', '3rem'),
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: "white",
                mb: 3,
              }}
            >
              Security{" "}
              <Box component="span" sx={{ color: '#34a853' }}>
                Built In
              </Box>
              , Not{" "}
              <Box component="span" sx={{ color: '#fbbc04' }}>
                Bolted On
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                fontWeight: 300,
                color: "white",
              }}
            >
              We take security seriously. Every aspect of our platform is designed with security as a core principle.
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              mb: 4
            }}>
              <Button
                variant="contained"
                onClick={() => window.location.href = "/contact"}
                sx={{
                  backgroundColor: '#34a853',
                  color: "white",
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: '#2d9248',
                  },
                }}
              >
                Request Security Report
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.location.href = "/docs/security"}
                sx={{
                  borderColor: "white",
                  color: "white",
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                View Security Docs
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Security Stats */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          mb: { xs: 6, sm: 8 }
        }}>
          {securityStats.map((stat, index) => (
            <Fade in key={index} timeout={(index + 1) * 200}>
              <Card
                sx={{
                  width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 8px)', md: 'calc(16.666% - 8px)' },
                  minWidth: 150,
                  textAlign: 'center',
                  p: 3,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode 
                      ? '0 8px 24px rgba(0,0,0,0.3)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mb: 2,
                  color: '#4285f4'
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight={600} gutterBottom color={darkMode ? "#e8eaed" : "#202124"}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  {stat.label}
                </Typography>
              </Card>
            </Fade>
          ))}
        </Box>

        {/* Security Features */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}>
          <Typography
            variant="h2"
            component="h2"
            fontWeight={500}
            gutterBottom
            color={darkMode ? "#e8eaed" : "#202124"}
            sx={{ 
              fontSize: getResponsiveTypography('1.75rem', '2rem', '2.25rem'),
              mb: 2
            }}
          >
            Comprehensive Security Features
          </Typography>
          <Typography
            variant="body1"
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{ 
              maxWidth: 600, 
              mx: "auto",
              fontWeight: 300,
              fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
            }}
          >
            Multiple layers of security protecting your data at every level
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          mb: 8
        }}>
          {securityFeatures.map((feature) => (
            <Box
              key={feature.id}
              sx={{
                width: { 
                  xs: '100%',
                  sm: 'calc(50% - 12px)',
                  md: 'calc(33.333% - 12px)'
                },
                minWidth: { xs: '100%', sm: 280 },
              }}
            >
              <Fade in>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderRadius: '16px',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: darkMode 
                        ? '0 8px 24px rgba(0,0,0,0.3)'
                        : '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      {feature.icon}
                      <Box sx={{ ml: 2 }}>
                        <Chip
                          label={feature.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              feature.category === 'infrastructure' ? '#4285f4' :
                              feature.category === 'application' ? '#34a853' :
                              feature.category === 'compliance' ? '#fbbc04' : '#ea4335',
                              0.1
                            ),
                            color: darkMode ? '#e8eaed' : '#202124',
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      sx={{ 
                        fontSize: getResponsiveTypography('1.1rem', '1.25rem', '1.5rem'),
                        mb: 2
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      color={darkMode ? "#9aa0a6" : "#5f6368"}
                      sx={{ 
                        mb: 3,
                        fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>

                    <List dense disablePadding>
                      {feature.details.map((detail, index) => (
                        <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ fontSize: 16, color: '#34a853' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: darkMode ? '#e8eaed' : '#202124',
                                  fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem')
                                }}
                              >
                                {detail}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          ))}
        </Box>

        {/* Compliance Standards */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            textAlign: "center",
            background: darkMode 
              ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
              : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
            color: "white",
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            mb: { xs: 6, sm: 8 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<VerifiedUser sx={{ fontSize: 16 }} />}
              label="Compliance & Certifications"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'white' }
              }}
            />

            <Typography
              variant="h3"
              component="h2"
              fontWeight={500}
              gutterBottom
              sx={{ 
                fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
                mb: 3,
              }}
            >
              Meeting Global Standards
            </Typography>

            <Typography
              variant="body1"
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              We comply with industry-leading security standards and undergo regular third-party audits
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
              mb: 3
            }}>
              {complianceStandards.map((standard) => (
                <Fade in key={standard.id}>
                  <Card
                    sx={{
                      width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 8px)', md: 'calc(16.666% - 8px)' },
                      minWidth: 120,
                      p: 2,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      mb: 1,
                      color: 'white'
                    }}>
                      {standard.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {standard.name}
                    </Typography>
                    <Chip
                      label={standard.status}
                      size="small"
                      sx={{
                        backgroundColor: 
                          standard.status === 'compliant' ? '#34a853' :
                          standard.status === 'in-progress' ? '#fbbc04' : '#ea4335',
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Card>
                </Fade>
              ))}
            </Box>

            <Button
              variant="outlined"
              onClick={() => window.location.href = "/compliance"}
              sx={{
                borderColor: "white",
                color: "white",
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                mt: 2,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              View All Certifications
            </Button>
          </Box>
        </Paper>

        {/* Security Commitment */}
        <Card
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            borderRadius: '16px',
            mb: { xs: 6, sm: 8 }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box sx={{ 
              flex: 1,
              textAlign: { xs: 'center', md: 'left' }
            }}>
              <Typography
                variant="h3"
                component="h3"
                fontWeight={500}
                gutterBottom
                color={darkMode ? "#e8eaed" : "#202124"}
                sx={{ 
                  fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
                  mb: 2
                }}
              >
                Our Security Commitment
              </Typography>
              <Typography
                variant="body1"
                color={darkMode ? "#9aa0a6" : "#5f6368"}
                sx={{ 
                  mb: 3,
                  fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                  lineHeight: 1.8
                }}
              >
                We are committed to maintaining the highest security standards. Our security team works 
                around the clock to protect your data and ensure compliance with the latest security 
                protocols and regulations.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => window.location.href = "/contact/security"}
                  sx={{
                    backgroundColor: '#34a853',
                    color: "white",
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: '#2d9248',
                    },
                  }}
                >
                  Contact Security Team
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.location.href = "/security/whitepaper"}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    },
                  }}
                >
                  Download Whitepaper
                </Button>
              </Box>
            </Box>
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Security sx={{ 
                fontSize: { xs: 120, md: 160 }, 
                color: '#4285f4',
                opacity: 0.8
              }} />
            </Box>
          </Box>
        </Card>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 4, sm: 5, md: 6 },
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          color: darkMode ? '#e8eaed' : '#202124',
          borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, sm: 6 },
            mb: { xs: 4, sm: 5 },
          }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ fontSize: 24, color: '#4285f4', mr: 1.5 }} />
                <Typography
                  variant="h6"
                  fontWeight={500}
                  sx={{ 
                    fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                  }}
                >
                  AccumaManage Security
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ 
                  opacity: 0.8, 
                  mb: 2,
                  maxWidth: 400,
                  fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                }}
              >
                Your security is our top priority. We employ industry-leading practices to protect your data.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 3, sm: 4 },
                flex: 1,
              }}
            >
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  Security
                </Typography>
                <Stack spacing={1}>
                  {["Overview", "Features", "Compliance", "Audits"].map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href={`/security/${item.toLowerCase()}`}
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        '&:hover': {
                          color: darkMode ? '#e8eaed' : '#202124',
                        }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  Resources
                </Typography>
                <Stack spacing={1}>
                  {["Whitepaper", "Documentation", "FAQ", "Contact"].map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href="#"
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        '&:hover': {
                          color: darkMode ? '#e8eaed' : '#202124',
                        }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  Legal
                </Typography>
                <Stack spacing={1}>
                  {["Privacy", "Terms", "GDPR", "Compliance"].map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href={`/legal/${item.toLowerCase()}`}
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        '&:hover': {
                          color: darkMode ? '#e8eaed' : '#202124',
                        }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ 
            borderColor: darkMode ? '#3c4043' : '#dadce0', 
            mb: { xs: 3, sm: 4 } 
          }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ 
                opacity: 0.6,
                fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
              }}
            >
              © {new Date().getFullYear()} AccumaManage Security. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

// Add missing icons
const Medical = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const CreditCard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const PrivacyTip = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
  </svg>
);