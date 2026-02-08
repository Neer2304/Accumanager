"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Verified,
  Security,
  CheckCircle,
  Schedule,
  Download,
  Description,
  Policy,
  Gavel,
  Lock,
  Cloud,
  Storage,
  People,
} from "@mui/icons-material";
import { LandingHeader } from "@/components/landing/Header";
import { useTheme as useThemeContext } from "@/contexts/ThemeContext";

interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: "certified" | "compliant" | "in-progress" | "planned";
  certificationDate?: string;
  validity: string;
  details: string[];
}

export default function CompliancePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  const complianceStandards: ComplianceStandard[] = [
    {
      id: "soc2",
      name: "SOC 2 Type II",
      description: "Service Organization Control",
      status: "certified",
      certificationDate: "2024-01-15",
      validity: "Annual renewal",
      details: [
        "Security, Availability, and Confidentiality Trust Services Criteria",
        "Independent third-party audit",
        "Regular monitoring and reporting",
        "Continuous compliance monitoring",
      ],
    },
    {
      id: "gdpr",
      name: "GDPR",
      description: "General Data Protection Regulation",
      status: "compliant",
      validity: "Ongoing compliance",
      details: [
        "Data protection by design and default",
        "Right to access and erasure",
        "Data breach notification procedures",
        "Data Protection Impact Assessments (DPIAs)",
      ],
    },
    {
      id: "iso27001",
      name: "ISO 27001",
      description: "Information Security Management",
      status: "certified",
      certificationDate: "2024-03-20",
      validity: "3-year certification",
      details: [
        "Information Security Management System (ISMS)",
        "Risk assessment and treatment",
        "Continuous improvement process",
        "Management commitment and responsibility",
      ],
    },
    {
      id: "hipaa",
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act",
      status: "compliant",
      validity: "Ongoing compliance",
      details: [
        "Protected Health Information (PHI) safeguards",
        "Business Associate Agreements (BAAs)",
        "Privacy Rule compliance",
        "Security Rule requirements",
      ],
    },
    {
      id: "pci-dss",
      name: "PCI DSS 4.0",
      description: "Payment Card Industry Data Security Standard",
      status: "certified",
      certificationDate: "2024-02-10",
      validity: "Annual assessment",
      details: [
        "Secure network and systems",
        "Cardholder data protection",
        "Vulnerability management",
        "Access control measures",
      ],
    },
    {
      id: "ccpa",
      name: "CCPA/CPRA",
      description: "California Consumer Privacy Act",
      status: "compliant",
      validity: "Ongoing compliance",
      details: [
        "Consumer rights implementation",
        "Opt-out mechanisms",
        "Data processing agreements",
        "Privacy policy updates",
      ],
    },
  ];

  const auditReports = [
    {
      title: "SOC 2 Type II Report",
      date: "January 2024",
      description: "Independent auditor's report covering security controls",
      downloadUrl: "#",
    },
    {
      title: "Penetration Test Report",
      date: "March 2024",
      description: "External security assessment results",
      downloadUrl: "#",
    },
    {
      title: "Vulnerability Assessment",
      date: "April 2024",
      description: "Quarterly vulnerability scan results",
      downloadUrl: "#",
    },
  ];

  const getStatusColor = (status: ComplianceStandard["status"]) => {
    switch (status) {
      case "certified":
        return "#34a853";
      case "compliant":
        return "#4285f4";
      case "in-progress":
        return "#fbbc05";
      case "planned":
        return "#5f6368";
      default:
        return "#5f6368";
    }
  };

  const getStatusIcon = (status: ComplianceStandard["status"]) => {
    switch (status) {
      case "certified":
        return <Verified />;
      case "compliant":
        return <CheckCircle />;
      case "in-progress":
        return <Schedule />;
      case "planned":
        return <Policy />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#202124" : "#ffffff",
        color: darkMode ? "#e8eaed" : "#202124",
      }}
    >
      <LandingHeader />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, sm: 10, md: 12 },
          pb: { xs: 6, sm: 8, md: 10 },
          background: darkMode
            ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
            : "linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Chip
              icon={<Verified sx={{ fontSize: 16 }} />}
              label="Compliance & Certifications"
              sx={{
                mb: 3,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
                "& .MuiChip-icon": { color: "white" },
              }}
            />

            <Typography
              variant="h1"
              component="h1"
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: isMobile ? "2rem" : "3rem",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                mb: 3,
              }}
            >
              Industry-Leading{" "}
              <Box component="span" sx={{ color: "#34a853" }}>
                Compliance
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: isMobile ? "1rem" : "1.25rem",
                fontWeight: 300,
              }}
            >
              We maintain the highest standards of security and compliance to
              protect your data and meet regulatory requirements.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        {/* Compliance Standards */}
        <Box sx={{ mb: { xs: 8, sm: 10 } }}>
          <Typography
            variant="h2"
            component="h2"
            fontWeight={500}
            gutterBottom
            color={darkMode ? "#e8eaed" : "#202124"}
            sx={{
              fontSize: isMobile ? "1.75rem" : "2.25rem",
              mb: 2,
              textAlign: "center",
            }}
          >
            Compliance Standards
          </Typography>
          <Typography
            variant="body1"
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 6,
              textAlign: "center",
              fontSize: isMobile ? "0.9rem" : "1.1rem",
            }}
          >
            Our commitment to security is verified by independent audits and
            certifications
          </Typography>

          <Grid container spacing={3}>
            {complianceStandards.map((standard) => (
              <Grid item xs={12} md={6} lg={4} key={standard.id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                    border: darkMode
                      ? "1px solid #3c4043"
                      : "1px solid #dadce0",
                    borderRadius: "16px",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: darkMode
                        ? "0 8px 24px rgba(0,0,0,0.3)"
                        : "0 8px 24px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "12px",
                            backgroundColor: alpha(getStatusColor(standard.status), 0.1),
                            color: getStatusColor(standard.status),
                          }}
                        >
                          {getStatusIcon(standard.status)}
                        </Box>
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight={600}
                            color={darkMode ? "#e8eaed" : "#202124"}
                          >
                            {standard.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={darkMode ? "#9aa0a6" : "#5f6368"}
                          >
                            {standard.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Chip
                      label={standard.status.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(standard.status),
                        color: "white",
                        fontWeight: 500,
                        mb: 3,
                      }}
                    />

                    <List dense disablePadding>
                      {standard.details.map((detail, index) => (
                        <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle
                              sx={{ fontSize: 20, color: "#34a853" }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                              >
                                {detail}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    {standard.certificationDate && (
                      <Box
                        sx={{
                          mt: 3,
                          pt: 2,
                          borderTop: darkMode
                            ? "1px solid #3c4043"
                            : "1px solid #dadce0",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color={darkMode ? "#9aa0a6" : "#5f6368"}
                        >
                          Certified: {standard.certificationDate} •{" "}
                          {standard.validity}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Audit Reports */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            backgroundColor: darkMode ? "#303134" : "#f8f9fa",
            border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            borderRadius: "16px",
            mb: { xs: 6, sm: 8 },
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            fontWeight={500}
            gutterBottom
            color={darkMode ? "#e8eaed" : "#202124"}
            sx={{
              fontSize: isMobile ? "1.5rem" : "2rem",
              mb: 4,
              textAlign: "center",
            }}
          >
            Audit Reports & Documentation
          </Typography>

          <Grid container spacing={3}>
            {auditReports.map((report, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: darkMode ? "#202124" : "#ffffff",
                    border: darkMode
                      ? "1px solid #3c4043"
                      : "1px solid #dadce0",
                    borderRadius: "12px",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Description sx={{ color: "#4285f4" }} />
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color={darkMode ? "#e8eaed" : "#202124"}
                        >
                          {report.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={darkMode ? "#9aa0a6" : "#5f6368"}
                        >
                          {report.date}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color={darkMode ? "#9aa0a6" : "#5f6368"}
                      sx={{ mb: 3 }}
                    >
                      {report.description}
                    </Typography>

                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      fullWidth
                      onClick={() => window.open(report.downloadUrl, "_blank")}
                      sx={{
                        borderColor: darkMode ? "#3c4043" : "#dadce0",
                        color: darkMode ? "#e8eaed" : "#202124",
                        "&:hover": {
                          borderColor: "#4285f4",
                          backgroundColor: darkMode
                            ? "rgba(66, 133, 244, 0.1)"
                            : "rgba(66, 133, 244, 0.04)",
                        },
                      }}
                    >
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Compliance Commitment */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight={500}
            gutterBottom
            color={darkMode ? "#e8eaed" : "#202124"}
            sx={{
              fontSize: isMobile ? "1.5rem" : "2rem",
              mb: 3,
            }}
          >
            Our Compliance Commitment
          </Typography>

          <Typography
            variant="body1"
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{
              maxWidth: 800,
              mx: "auto",
              mb: 4,
              fontSize: isMobile ? "0.9rem" : "1.1rem",
              lineHeight: 1.8,
            }}
          >
            We are committed to maintaining the highest standards of compliance
            through regular audits, continuous monitoring, and adherence to
            global regulatory requirements. Our dedicated compliance team works
            to ensure that we not only meet but exceed industry standards.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={() => window.location.href = "/contact"}
              sx={{
                backgroundColor: "#34a853",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#2d9248",
                },
              }}
            >
              Request Compliance Documents
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = "/security"}
              sx={{
                borderColor: darkMode ? "#3c4043" : "#dadce0",
                color: darkMode ? "#e8eaed" : "#202124",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                "&:hover": {
                  borderColor: "#4285f4",
                },
              }}
            >
              View Security Overview
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          backgroundColor: darkMode ? "#202124" : "#f8f9fa",
          borderTop: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            align="center"
          >
            © {new Date().getFullYear()} AccumaManager Compliance. All
            certifications are maintained and verified by independent third
            parties.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}