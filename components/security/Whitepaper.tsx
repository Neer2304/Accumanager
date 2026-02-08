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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Download,
  Description,
  Security,
  Lock,
  Cloud,
  Storage,
  VerifiedUser,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";
import { LandingHeader } from "@/components/landing/Header";
import { useTheme as useThemeContext } from "@/contexts/ThemeContext";

export default function WhitepaperPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  const whitepapers = [
    {
      title: "Security Architecture & Design",
      description:
        "Comprehensive overview of our multi-layered security architecture and defense mechanisms",
      pages: 45,
      lastUpdated: "March 2024",
      downloadUrl: "#",
      highlights: [
        "Zero-trust architecture implementation",
        "End-to-end encryption protocols",
        "Network segmentation strategy",
        "Incident response framework",
      ],
    },
    {
      title: "Data Protection & Privacy",
      description:
        "Detailed analysis of data protection measures and privacy-by-design principles",
      pages: 32,
      lastUpdated: "February 2024",
      downloadUrl: "#",
      highlights: [
        "GDPR compliance framework",
        "Data anonymization techniques",
        "Right to erasure implementation",
        "Privacy impact assessments",
      ],
    },
    {
      title: "Compliance & Certifications",
      description:
        "Overview of security certifications, audit processes, and compliance frameworks",
      pages: 28,
      lastUpdated: "January 2024",
      downloadUrl: "#",
      highlights: [
        "SOC 2 Type II certification process",
        "ISO 27001 implementation guide",
        "PCI DSS compliance roadmap",
        "Third-party audit methodology",
      ],
    },
  ];

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
            ? "linear-gradient(135deg, #1a237e 0%, #202124 100%)"
            : "linear-gradient(135deg, #0d47a1 0%, #4285f4 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Chip
              icon={<Description sx={{ fontSize: 16 }} />}
              label="Technical Whitepapers"
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
                Whitepapers
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
              In-depth technical documentation of our security architecture,
              protocols, and compliance frameworks
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        {/* Whitepapers List */}
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
            Available Whitepapers
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
            Download our comprehensive security documentation for detailed
            technical insights
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {whitepapers.map((paper, index) => (
              <Card
                key={index}
                sx={{
                  transition: "all 0.3s ease",
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: darkMode
                    ? "1px solid #3c4043"
                    : "1px solid #dadce0",
                  borderRadius: "16px",
                  overflow: "hidden",
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
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
                      alignItems: { md: "center" },
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "12px",
                            backgroundColor: alpha("#4285f4", 0.1),
                            color: "#4285f4",
                          }}
                        >
                          <Description sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight={600}
                            color={darkMode ? "#e8eaed" : "#202124"}
                          >
                            {paper.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mt: 0.5,
                            }}
                          >
                            <Chip
                              label={`${paper.pages} pages`}
                              size="small"
                              sx={{
                                backgroundColor: darkMode
                                  ? "#303134"
                                  : "#f8f9fa",
                                color: darkMode ? "#e8eaed" : "#202124",
                                fontSize: "0.75rem",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color={darkMode ? "#9aa0a6" : "#5f6368"}
                            >
                              Updated: {paper.lastUpdated}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        color={darkMode ? "#9aa0a6" : "#5f6368"}
                        sx={{ mb: 3 }}
                      >
                        {paper.description}
                      </Typography>

                      <List dense disablePadding>
                        {paper.highlights.map((highlight, idx) => (
                          <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle
                                sx={{ fontSize: 16, color: "#34a853" }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: darkMode ? "#e8eaed" : "#202124",
                                  }}
                                >
                                  {highlight}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        minWidth: { md: 200 },
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Download />}
                        fullWidth
                        onClick={() => window.open(paper.downloadUrl, "_blank")}
                        sx={{
                          backgroundColor: "#4285f4",
                          color: "white",
                          py: 1.5,
                          borderRadius: "12px",
                          "&:hover": {
                            backgroundColor: "#3367d6",
                          },
                        }}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() =>
                          window.location.href = "/contact/whitepaper"
                        }
                        sx={{
                          borderColor: darkMode ? "#3c4043" : "#dadce0",
                          color: darkMode ? "#e8eaed" : "#202124",
                          py: 1.5,
                          borderRadius: "12px",
                          "&:hover": {
                            borderColor: "#4285f4",
                            backgroundColor: darkMode
                              ? "rgba(66, 133, 244, 0.1)"
                              : "rgba(66, 133, 244, 0.04)",
                          },
                        }}
                      >
                        Request Custom Version
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Additional Resources */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: darkMode ? "#303134" : "#f8f9fa",
            border: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            borderRadius: "16px",
            textAlign: "center",
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
              mb: 3,
            }}
          >
            Need More Information?
          </Typography>

          <Typography
            variant="body1"
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 4,
              fontSize: isMobile ? "0.9rem" : "1.1rem",
              lineHeight: 1.8,
            }}
          >
            Contact our security team for custom whitepapers, technical briefs,
            or to schedule a security review session.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => window.location.href = "/contact/security"}
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
              Contact Security Team
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = "/compliance"}
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
              View Compliance Docs
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
            © {new Date().getFullYear()} AccumaManager Security Whitepapers.
            All documents are confidential and intended for authorized use only.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}