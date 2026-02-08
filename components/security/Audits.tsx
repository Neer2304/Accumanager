"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Verified,
  Security,
  BugReport,
  Schedule,
  Download,
  CheckCircle,
  Warning,
  Error,
  Assessment,
} from "@mui/icons-material";
import { LandingHeader } from "@/components/landing/Header";
import { useTheme as useThemeContext } from "@/contexts/ThemeContext";

export default function AuditsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  const auditReports = [
    {
      type: "Penetration Test",
      provider: "Security Audit Partners",
      date: "Q1 2024",
      status: "Passed",
      severity: "Low",
      findings: 2,
      reportUrl: "#",
    },
    {
      type: "Vulnerability Assessment",
      provider: "Internal Security Team",
      date: "March 2024",
      status: "Completed",
      severity: "Medium",
      findings: 5,
      reportUrl: "#",
    },
    {
      type: "SOC 2 Audit",
      provider: "Deloitte",
      date: "January 2024",
      status: "Certified",
      severity: "None",
      findings: 0,
      reportUrl: "#",
    },
    {
      type: "Code Security Review",
      provider: "External Security Firm",
      date: "February 2024",
      status: "Passed",
      severity: "Low",
      findings: 3,
      reportUrl: "#",
    },
  ];

  const securityMetrics = [
    { label: "Mean Time to Detect (MTTD)", value: "15 minutes" },
    { label: "Mean Time to Respond (MTTR)", value: "30 minutes" },
    { label: "Security Score", value: "98%" },
    { label: "Vulnerability Closure Rate", value: "99%" },
    { label: "False Positive Rate", value: "2%" },
    { label: "Audit Coverage", value: "100%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
      case "certified":
        return "#34a853";
      case "completed":
        return "#4285f4";
      case "in-progress":
        return "#fbbc05";
      default:
        return "#5f6368";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "none":
        return "#34a853";
      case "low":
        return "#fbbc05";
      case "medium":
        return "#ea4335";
      case "high":
        return "#d93025";
      default:
        return "#5f6368";
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
              icon={<Assessment sx={{ fontSize: 16 }} />}
              label="Security Audits"
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
              Security{" "}
              <Box component="span" sx={{ color: "#34a853" }}>
                Audits & Assessments
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
              Regular independent security audits and assessments to ensure the
              highest level of security for our platform
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        {/* Audit Reports Table */}
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
            Recent Audit Reports
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
            Independent third-party security assessments and their results
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: darkMode ? "#303134" : "#ffffff",
              border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                    }}
                  >
                    Audit Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                    }}
                  >
                    Provider
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                    }}
                  >
                    Findings
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? "#e8eaed" : "#202124",
                      backgroundColor: darkMode ? "#202124" : "#f8f9fa",
                    }}
                  >
                    Report
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditReports.map((report, index) => (
                  <TableRow key={index} hover>
                    <TableCell
                      sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                    >
                      {report.type}
                    </TableCell>
                    <TableCell
                      sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                    >
                      {report.provider}
                    </TableCell>
                    <TableCell
                      sx={{ color: darkMode ? "#e8eaed" : "#202124" }}
                    >
                      {report.date}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(report.status),
                          color: "white",
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={report.severity}
                          size="small"
                          sx={{
                            backgroundColor: getSeverityColor(report.severity),
                            color: "white",
                            fontWeight: 500,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={darkMode ? "#e8eaed" : "#202124"}
                        >
                          ({report.findings})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() => window.open(report.reportUrl, "_blank")}
                        sx={{
                          color: "#4285f4",
                          textTransform: "none",
                        }}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Security Metrics */}
        <Grid container spacing={3} sx={{ mb: { xs: 8, sm: 10 } }}>
          <Grid item xs={12}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight={500}
              gutterBottom
              color={darkMode ? "#e8eaed" : "#202124"}
              sx={{
                fontSize: isMobile ? "1.75rem" : "2.25rem",
                mb: 4,
                textAlign: "center",
              }}
            >
              Security Metrics
            </Typography>
          </Grid>
          {securityMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: darkMode
                    ? "1px solid #3c4043"
                    : "1px solid #dadce0",
                  borderRadius: "16px",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={600}
                  color="#4285f4"
                  sx={{ mb: 1, fontSize: isMobile ? "1.5rem" : "2rem" }}
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="body2"
                  color={darkMode ? "#9aa0a6" : "#5f6368"}
                >
                  {metric.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Audit Schedule */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: darkMode ? "#303134" : "#f8f9fa",
            border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            borderRadius: "16px",
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
            Audit Schedule
          </Typography>

          <List>
            <ListItem sx={{ px: 0, py: 2 }}>
              <ListItemIcon>
                <Schedule sx={{ color: "#4285f4" }} />
              </ListItemIcon>
              <ListItemText
                primary="Quarterly Penetration Tests"
                secondary="Conducted by independent third-party security firms"
              />
              <Chip label="Q2 2024" size="small" />
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0, py: 2 }}>
              <ListItemIcon>
                <BugReport sx={{ color: "#4285f4" }} />
              </ListItemIcon>
              <ListItemText
                primary="Monthly Vulnerability Scans"
                secondary="Automated security scanning of all systems"
              />
              <Chip label="Monthly" size="small" />
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0, py: 2 }}>
              <ListItemIcon>
                <Verified sx={{ color: "#4285f4" }} />
              </ListItemIcon>
              <ListItemText
                primary="Annual SOC 2 Audit"
                secondary="Comprehensive audit of security controls"
              />
              <Chip label="Q4 2024" size="small" />
            </ListItem>
          </List>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => window.location.href = "/contact/audit"}
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
              Request Audit Information
            </Button>
          </Box>
        </Paper>
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
            © {new Date().getFullYear()} AccumaManager Security Audits. All
            audit reports are confidential and available to customers under NDA.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}