"use client";

import { useState, useEffect } from "react";
import { 
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Security,
  Shield,
  Lock,
  VerifiedUser,
  VisibilityOff,
  BugReport,
  Cloud,
  MonitorHeart,
} from "@mui/icons-material";
import { AlertTriangle, FileLock, Key, RefreshCw } from "lucide-react";
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { LandingHeader } from "@/components/landing/Header";

// Import Google Security components
import {
  GoogleSecuritySkeleton,
  GoogleSecurityHeader,
  GoogleSecurityStats,
  GoogleSecurityFeatures,
  GoogleSecurityCompliance,
  GoogleSecurityCommitment,
  GoogleSecurityFooter,
  Medical,
  CreditCard,
  PrivacyTip,
  SecurityFeature,
  ComplianceStandard,
} from "@/components/googlesecurity";

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
        "RTO/RPO compliance"
      ]
    },
    {
      id: "access",
      title: "Access Controls",
      description: "Granular permission management",
      icon: <Key size={32} color="#ea4335" />,
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
      icon: <FileLock size={24} />
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

  if (loading) {
    return <GoogleSecuritySkeleton />;
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
            <AlertTriangle size={48} style={{ margin: '0 auto 16px', color: '#ea4335' }} />
            <Typography variant="h4" fontWeight={500} gutterBottom color={darkMode ? "#e8eaed" : "#202124"}>
              Error Loading Security Information
            </Typography>
            <Typography variant="body1" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 3 }}>
              {error}
            </Typography>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const handleRequestReport = () => {
    window.location.href = "/contact";
  };

  const handleViewDocs = () => {
    window.location.href = "/docs/security";
  };

  const handleViewAllCertifications = () => {
    window.location.href = "/compliance";
  };

  const handleContactSecurity = () => {
    window.location.href = "/contact/security";
  };

  const handleDownloadWhitepaper = () => {
    window.location.href = "/security/whitepaper";
  };

  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      transition: 'all 0.3s ease',
    }}>
      <LandingHeader />

      <GoogleSecurityHeader 
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
        onRequestReport={handleRequestReport}
        onViewDocs={handleViewDocs}
      />

      <GoogleSecurityStats 
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GoogleSecurityFeatures 
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
        features={securityFeatures}
      />

      <GoogleSecurityCompliance 
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
        standards={complianceStandards}
        onViewAll={handleViewAllCertifications}
      />

      <GoogleSecurityCommitment 
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
        onContact={handleContactSecurity}
        onDownload={handleDownloadWhitepaper}
      />

      <GoogleSecurityFooter 
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
      />
    </Box>
  );
}