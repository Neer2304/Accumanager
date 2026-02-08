"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  ExpandMore,
  PrivacyTip,
  Security,
  Description,
  Download,
  CheckCircle,
  People,
  DataObject,
  Policy,
  Gavel,
} from "@mui/icons-material";
import { LandingHeader } from "@/components/landing/Header";
import { useTheme as useThemeContext } from "@/contexts/ThemeContext";

export default function GdprPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  const gdprRights = [
    {
      title: "Right to Access",
      description:
        "You have the right to obtain confirmation as to whether or not personal data concerning you is being processed.",
      icon: <People />,
    },
    {
      title: "Right to Rectification",
      description:
        "You have the right to have inaccurate personal data rectified, or completed if it is incomplete.",
      icon: <CheckCircle />,
    },
    {
      title: "Right to Erasure",
      description:
        "You have the right to have personal data erased in certain circumstances.",
      icon: <Security />,
    },
    {
      title: "Right to Restrict Processing",
      description:
        "You have the right to request the restriction or suppression of your personal data.",
      icon: <Policy />,
    },
    {
      title: "Right to Data Portability",
      description:
        "You have the right to obtain and reuse your personal data for your own purposes across different services.",
      icon: <DataObject />,
    },
    {
      title: "Right to Object",
      description:
        "You have the right to object to the processing of your personal data in certain circumstances.",
      icon: <Gavel />,
    },
  ];

  const faqs = [
    {
      question: "How does AccumaManager comply with GDPR?",
      answer:
        "We implement data protection by design and default, maintain data processing records, conduct DPIAs, and have appointed a Data Protection Officer.",
    },
    {
      question: "Where is my data stored?",
      answer:
        "Data is stored in secure EU-based data centers. We offer data residency options for enterprise customers.",
    },
    {
      question: "How can I exercise my GDPR rights?",
      answer:
        "Contact our Data Protection Officer at dpo@accumamanager.com or use the data subject rights portal in your account settings.",
    },
    {
      question: "Do you have a Data Processing Agreement (DPA)?",
      answer:
        "Yes, we offer a standard DPA that complies with GDPR requirements for all our customers.",
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
            ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
            : "linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Chip
              icon={<PrivacyTip sx={{ fontSize: 16 }} />}
              label="GDPR Compliance"
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
              GDPR{" "}
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
              We are fully compliant with the General Data Protection Regulation
              (GDPR) to protect your personal data and privacy rights.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        {/* GDPR Rights */}
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
            Your GDPR Rights
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
            Under GDPR, you have several important rights regarding your
            personal data
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {gdprRights.map((right, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: darkMode
                    ? "1px solid #3c4043"
                    : "1px solid #dadce0",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: darkMode
                      ? "0 8px 24px rgba(0,0,0,0.3)"
                      : "0 8px 24px rgba(0,0,0,0.1)",
                  },
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
                    {right.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color={darkMode ? "#e8eaed" : "#202124"}
                  >
                    {right.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color={darkMode ? "#9aa0a6" : "#5f6368"}
                  sx={{ lineHeight: 1.6 }}
                >
                  {right.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* FAQs */}
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
            Frequently Asked Questions
          </Typography>

          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  backgroundColor: darkMode ? "#303134" : "#ffffff",
                  border: darkMode
                    ? "1px solid #3c4043"
                    : "1px solid #dadce0",
                  borderRadius: "8px !important",
                  mb: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography
                    fontWeight={500}
                    color={darkMode ? "#e8eaed" : "#202124"}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    color={darkMode ? "#9aa0a6" : "#5f6368"}
                    sx={{ lineHeight: 1.8 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Documentation & Contact */}
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
            GDPR Documentation
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
            Download our GDPR compliance documents or contact our Data
            Protection Officer for more information.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => window.open("#", "_blank")}
              sx={{
                backgroundColor: "#4285f4",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#3367d6",
                },
              }}
            >
              Download DPA
            </Button>
            <Button
              variant="contained"
              startIcon={<Description />}
              onClick={() => window.open("#", "_blank")}
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
              Privacy Policy
            </Button>
            <Button
              variant="outlined"
              onClick={() => (window.location.href = "mailto:dpo@accumamanager.com")}
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
              Contact DPO
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
            sx={{ mb: 2 }}
          >
            Data Protection Officer: dpo@accumamanager.com
          </Typography>
          <Typography
            variant="body2"
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            align="center"
          >
            © {new Date().getFullYear()} AccumaManager GDPR Compliance
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}