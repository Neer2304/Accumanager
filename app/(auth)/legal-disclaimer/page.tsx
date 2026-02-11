// app/(auth)/legal-disclaimer/page.tsx - GOOGLE MATERIAL DESIGN THEME
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Warning,
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
  Shield,
  Lock,
  Download,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ExpandMore,
  ExpandLess,
  Print,
  CloudDownload,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent2 } from '@/components/ui/Card';

const steps = ["Read Disclaimer", "Accept Terms", "Access Granted"];

// Google Material Design Colors
const googleColors = {
  primary: "#1a73e8",
  primaryLight: "#8ab4f8",
  primaryDark: "#1669c1",
  secondary: "#34a853",
  warning: "#fbbc04",
  error: "#ea4335",
  grey50: "#f8f9fa",
  grey100: "#f1f3f4",
  grey200: "#e8eaed",
  grey300: "#dadce0",
  grey400: "#bdc1c6",
  grey500: "#9aa0a6",
  grey600: "#80868b",
  grey700: "#5f6368",
  grey800: "#3c4043",
  grey900: "#202124",
  darkBg: "#202124",
  cardBgLight: "#ffffff",
  cardBgDark: "#303134",
  elevation1: "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
  elevation2: "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)",
  elevation4: "0 2px 4px rgba(0,0,0,.2), 0 4px 12px rgba(0,0,0,.1)",
  elevation8: "0 4px 8px rgba(0,0,0,.2), 0 8px 16px rgba(0,0,0,.1)",
};

const disclaimerContent = {
  title: "Legal Disclaimer",
  subtitle: "Development Preview • Handle with Care",

  criticalWarnings: [
    "DEVELOPMENT PREVIEW SYSTEM",
    "NOT FOR COMMERCIAL USE",
    "TEST DATA ONLY - NO REAL INFORMATION",
    "PERIODIC DATA RESETS POSSIBLE",
    "FEATURES MAY BE UNSTABLE",
  ],

  points: [
    {
      icon: <Warning sx={{ color: googleColors.warning }} />,
      color: googleColors.warning,
      title: "Preview Status",
      description: "Actively under development - preview/demo version only.",
    },
    {
      icon: <Security sx={{ color: googleColors.error }} />,
      color: googleColors.error,
      title: "Test Data Policy",
      description:
        "Use only test/dummy data. No real customer or financial information.",
    },
    {
      icon: <Gavel sx={{ color: googleColors.grey500 }} />,
      color: googleColors.grey500,
      title: "No Liability",
      description:
        "Provided 'AS IS' - no warranties or liability for data loss.",
    },
    {
      icon: <BugReport sx={{ color: "#8B5CF6" }} />,
      color: "#8B5CF6",
      title: "Expect Bugs",
      description:
        "Features may be buggy, incomplete, or removed without notice.",
    },
    {
      icon: <Code sx={{ color: "#0EA5E9" }} />,
      color: "#0EA5E9",
      title: "Feedback Welcome",
      description: "Bug reports and suggestions via appropriate channels.",
    },
    {
      icon: <Info sx={{ color: googleColors.primary }} />,
      color: googleColors.primary,
      title: "Educational Use",
      description: "For demonstration, testing, and educational purposes only.",
    },
  ],

  prohibitedItems: [
    "Real customer names, addresses, or contact information",
    "Actual financial transactions or banking details",
    "Sensitive business information or trade secrets",
    "Personal identification information (PII)",
    "Payment card or financial account numbers",
  ],

  acknowledgment: `By accepting this disclaimer, you confirm that you understand this is a development preview system intended for testing and demonstration purposes only. You agree not to use real data and acknowledge that the developers assume no liability for any issues arising from the use of this application. Any data entered may be used for development and debugging purposes but will not be shared with third parties for commercial purposes.`,
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
  const [expanded, setExpanded] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = theme.palette.mode === "dark";

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const checkDisclaimerStatus = async () => {
      try {
        const response = await fetch("/api/legals/check", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.accepted) {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.log("Disclaimer check failed, proceeding with page");
      }
    };

    checkDisclaimerStatus();
  }, [isAuthenticated, isLoading, router]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom =
      Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) <
      10;
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
      const userAgent = navigator.userAgent;
      const timestamp = new Date().toISOString();

      const response = await fetch("/api/legals/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          userEmail: user?.email,
          acceptVersion: "2.0.0",
          userAgent: userAgent,
          timestamp: timestamp,
          ipAddress: await getClientIP(),
          platform: navigator.platform,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to accept disclaimer",
        );
      }

      setSuccess(true);

      localStorage.setItem("legal_disclaimer_accepted", "true");
      localStorage.setItem(
        "legal_disclaimer_accepted_date",
        new Date().toISOString(),
      );
      localStorage.setItem("legal_disclaimer_user_id", user?.id || "");
      localStorage.setItem("legal_disclaimer_user_name", user?.name || "");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error accepting disclaimer:", error);
      setError(
        error.message || "Failed to accept disclaimer. Please try again.",
      );

      setTimeout(() => {
        localStorage.setItem("legal_disclaimer_accepted", "true");
        router.push("/dashboard");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      await logout();
      localStorage.removeItem("legal_disclaimer_accepted");
      sessionStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return "unknown";
    }
  };

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const downloadDisclaimer = () => {
    const text = `LEGAL DISCLAIMER ACCEPTANCE\n\nAccepted by: ${user?.name}\nEmail: ${user?.email}\nDate: ${new Date().toLocaleString()}\n\n${disclaimerContent.acknowledgment}\n\nVersion: 2.0.0`;

    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "disclaimer-acceptance.txt";
    document.body.appendChild(element);
    element.click();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkMode ? googleColors.darkBg : googleColors.grey50,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: googleColors.primary,
            }}
          />
          <Typography
            variant="h6"
            sx={{ mt: 3, color: darkMode ? googleColors.grey200 : googleColors.grey700, fontWeight: 500 }}
          >
            Loading legal disclaimer...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? googleColors.darkBg : googleColors.grey50,
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* User Info Card */}
        <Card
          hover
          variant="elevation"
          sx={{
            mb: 3,
            borderRadius: '16px',
            backgroundColor: darkMode ? googleColors.cardBgDark : googleColors.cardBgLight,
            border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey300}`,
            boxShadow: darkMode ? googleColors.elevation2 : googleColors.elevation1,
          }}
        >
          <CardContent2>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "20px",
                    backgroundColor: darkMode ? googleColors.primary : googleColors.primaryLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lock sx={{ fontSize: 20, color: "white" }} />
                </Box>
                <Box>
                  <Typography sx={{ 
                    color: darkMode ? googleColors.grey200 : googleColors.grey900,
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}>
                    {user?.name}
                  </Typography>
                  <Typography sx={{ 
                    color: darkMode ? googleColors.grey500 : googleColors.grey600,
                    fontSize: '0.85rem'
                  }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleDecline}
                size="small"
                sx={{
                  color: darkMode ? googleColors.grey500 : googleColors.grey600,
                  '&:hover': {
                    backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </CardContent2>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
              border: `1px solid ${googleColors.error}`,
              color: darkMode ? googleColors.grey200 : googleColors.grey900,
              '& .MuiAlert-icon': { color: googleColors.error },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey50,
              border: `1px solid ${googleColors.secondary}`,
              color: darkMode ? googleColors.grey200 : googleColors.grey900,
              '& .MuiAlert-icon': { color: googleColors.secondary },
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
              ✅ Disclaimer Accepted
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Redirecting to dashboard...
            </Typography>
          </Alert>
        )}

        <Card
          hover
          variant="elevation"
          sx={{
            borderRadius: '20px',
            backgroundColor: darkMode ? googleColors.cardBgDark : googleColors.cardBgLight,
            border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey300}`,
            boxShadow: darkMode ? googleColors.elevation4 : googleColors.elevation2,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${googleColors.primary} 0%, ${googleColors.secondary} 100%)`,
            },
          }}
        >
          <CardContent2>
            {/* Header */}
            <Box sx={{ 
              textAlign: "center", 
              mb: 4,
              p: { xs: 2, sm: 3 },
            }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 2, 
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "28px",
                    backgroundColor: googleColors.warning,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${alpha(googleColors.warning, 0.3)}`,
                  }}
                >
                  <Warning sx={{ fontSize: 28, color: "white" }} />
                </Box>
                <Box>
                  <Typography
                    variant={isMobile ? "h4" : "h3"}
                    sx={{
                      fontWeight: 500,
                      color: darkMode ? googleColors.grey200 : googleColors.grey900,
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                    }}
                  >
                    {disclaimerContent.title}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    sx={{
                      color: darkMode ? googleColors.grey500 : googleColors.grey600,
                      fontWeight: 400,
                    }}
                  >
                    {disclaimerContent.subtitle}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mt: 3 }}>
                <Chip
                  icon={<Warning sx={{ fontSize: 16 }} />}
                  label="DEVELOPMENT PREVIEW"
                  size="small"
                  sx={{
                    backgroundColor: alpha(googleColors.warning, 0.1),
                    color: googleColors.warning,
                    fontWeight: 500,
                    border: `1px solid ${alpha(googleColors.warning, 0.3)}`,
                  }}
                />
                <Chip
                  icon={<Security sx={{ fontSize: 16 }} />}
                  label="TEST DATA ONLY"
                  size="small"
                  sx={{
                    backgroundColor: alpha(googleColors.error, 0.1),
                    color: googleColors.error,
                    fontWeight: 500,
                    border: `1px solid ${alpha(googleColors.error, 0.3)}`,
                  }}
                />
                <Chip
                  icon={<Info sx={{ fontSize: 16 }} />}
                  label="VERSION 2.0.0"
                  size="small"
                  sx={{
                    backgroundColor: alpha(googleColors.primary, 0.1),
                    color: googleColors.primary,
                    fontWeight: 500,
                    border: `1px solid ${alpha(googleColors.primary, 0.3)}`,
                  }}
                />
              </Box>
            </Box>

            {/* Stepper */}
            <Box sx={{ p: 3, borderBottom: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}` }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontWeight: 500,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          color: darkMode ? googleColors.grey400 : googleColors.grey600,
                          '&.Mui-active, &.Mui-completed': {
                            color: darkMode ? googleColors.grey200 : googleColors.grey900,
                          },
                        },
                        '& .MuiStepIcon-root': {
                          color: darkMode ? googleColors.grey800 : googleColors.grey300,
                          '&.Mui-active': {
                            color: googleColors.primary,
                          },
                          '&.Mui-completed': {
                            color: googleColors.secondary,
                          },
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <LinearProgress
                variant="determinate"
                value={(activeStep + 1) * 33.33}
                sx={{
                  mt: 2,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey200,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: googleColors.primary,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              {/* Critical Warnings */}
              <Alert
                severity="error"
                icon={<Warning />}
                sx={{
                  mb: 4,
                  borderRadius: '12px',
                  backgroundColor: alpha(googleColors.error, 0.05),
                  border: `1px solid ${alpha(googleColors.error, 0.2)}`,
                  color: darkMode ? googleColors.grey200 : googleColors.grey900,
                  '& .MuiAlert-icon': {
                    color: googleColors.error,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: googleColors.error }}
                >
                  🚨 CRITICAL WARNINGS
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {disclaimerContent.criticalWarnings.map((warning, index) => (
                    <Box component="li" key={index} sx={{ mb: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: 'inherit',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                        }}
                      >
                        <span style={{ color: googleColors.error, minWidth: '1.5em' }}>•</span>
                        {warning}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Alert>

              {/* Info Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 2,
                  mb: 4,
                }}
              >
                {disclaimerContent.points.map((point, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    hover
                    sx={{
                      p: 2.5,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? googleColors.grey900 : 'white',
                      border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => toggleExpand(index)}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '8px',
                          backgroundColor: alpha(point.color, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {point.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: point.color,
                          }}
                        >
                          {point.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: darkMode ? googleColors.grey500 : googleColors.grey600,
                            fontSize: "0.875rem",
                          }}
                        >
                          {point.description}
                        </Typography>
                      </Box>
                      <IconButton size="small" sx={{ p: 0 }}>
                        {expanded === index ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                  </Card>
                ))}
              </Box>

              {/* Prohibited Items */}
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: '12px',
                  backgroundColor: alpha(googleColors.error, 0.02),
                  border: `2px solid ${alpha(googleColors.error, 0.2)}`,
                  position: "relative",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Security sx={{ fontSize: 24, color: googleColors.error }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: googleColors.error,
                    }}
                  >
                    ABSOLUTELY PROHIBITED
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {disclaimerContent.prohibitedItems.map((item, index) => (
                    <Box component="li" key={index} sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: googleColors.error,
                          mt: 0.75,
                          mr: 2,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? googleColors.grey300 : googleColors.grey700,
                          flex: 1,
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>

              <Divider sx={{ my: 4, borderColor: darkMode ? googleColors.grey800 : googleColors.grey200 }}>
                <Chip
                  label="FINAL ACKNOWLEDGMENT"
                  sx={{
                    backgroundColor: alpha(googleColors.primary, 0.1),
                    color: googleColors.primary,
                    fontWeight: 500,
                    border: `1px solid ${alpha(googleColors.primary, 0.3)}`,
                  }}
                />
              </Divider>

              {/* Scrollable acknowledgment section */}
              <Box
                ref={scrollRef}
                onScroll={handleScroll}
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  p: 3,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? googleColors.grey900 : googleColors.grey50,
                  border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                  mb: 4,
                  '&::-webkit-scrollbar': {
                    width: "8px",
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey200,
                    borderRadius: "4px",
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: darkMode ? googleColors.grey600 : googleColors.grey400,
                    borderRadius: "4px",
                    '&:hover': {
                      backgroundColor: darkMode ? googleColors.grey500 : googleColors.grey500,
                    },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: darkMode ? googleColors.grey300 : googleColors.grey700,
                    lineHeight: 1.6,
                  }}
                >
                  {disclaimerContent.acknowledgment}
                </Typography>

                {!scrolledToBottom && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 3,
                      p: 2,
                      backgroundColor: alpha(googleColors.warning, 0.05),
                      borderRadius: '8px',
                      border: `1px dashed ${alpha(googleColors.warning, 0.3)}`,
                    }}
                  >
                    <Visibility sx={{ fontSize: 18, mr: 1.5, color: googleColors.warning }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        color: googleColors.warning,
                      }}
                    >
                      Scroll to the bottom to continue
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={scrollToBottom}
                      sx={{
                        ml: 2,
                        color: googleColors.warning,
                        minWidth: "auto",
                        fontWeight: 500,
                      }}
                    >
                      Skip to bottom
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Acceptance Section */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? googleColors.grey900 : googleColors.grey50,
                  border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                }}
              >
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
                      sx={{
                        '&.Mui-checked': {
                          color: googleColors.secondary,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 28,
                        },
                        '&.Mui-disabled': {
                          color: darkMode ? googleColors.grey700 : googleColors.grey400,
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          color: checked ? googleColors.secondary : (darkMode ? googleColors.grey200 : googleColors.grey900),
                        }}
                      >
                        ✅ I HAVE READ, UNDERSTOOD, AND AGREE TO ALL TERMS
                      </Typography>
                      {!scrolledToBottom && !loading && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: googleColors.warning,
                            display: "block",
                            mt: 1,
                          }}
                        >
                          (Please scroll to the bottom of the acknowledgment text to enable this checkbox)
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{
                    mb: 4,
                    alignItems: "flex-start",
                    '& .MuiFormControlLabel-label': {
                      flex: 1,
                    },
                  }}
                />

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleDecline}
                    startIcon={<ArrowBack />}
                    size="large"
                    fullWidth={isMobile}
                    disabled={loading}
                    sx={{
                      height: 48,
                      borderRadius: '12px',
                      border: `1px solid ${googleColors.error}`,
                      color: googleColors.error,
                      fontWeight: 500,
                      '&:hover': {
                        borderWidth: 1,
                        backgroundColor: alpha(googleColors.error, 0.05),
                      },
                      '&.Mui-disabled': {
                        borderColor: darkMode ? googleColors.grey700 : googleColors.grey400,
                        color: darkMode ? googleColors.grey700 : googleColors.grey400,
                      },
                    }}
                  >
                    I DO NOT ACCEPT - LOGOUT
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleAccept}
                    disabled={!checked || loading}
                    endIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <VerifiedUser />
                      )
                    }
                    size="large"
                    fullWidth={isMobile}
                    sx={{
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: checked && !loading ? googleColors.primary : (darkMode ? googleColors.grey700 : googleColors.grey400),
                      fontWeight: 500,
                      '&:hover': checked && !loading ? {
                        backgroundColor: googleColors.primaryDark,
                        boxShadow: googleColors.elevation4,
                      } : undefined,
                      '&.Mui-disabled': {
                        backgroundColor: darkMode ? googleColors.grey700 : googleColors.grey400,
                        color: darkMode ? googleColors.grey500 : googleColors.grey500,
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} color="inherit" />
                        PROCESSING ACCEPTANCE...
                      </Box>
                    ) : (
                      "I ACCEPT & PROCEED TO DASHBOARD"
                    )}
                  </Button>
                </Box>

                {/* Additional Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    pt: 3,
                    borderTop: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                    gap: 2,
                  }}
                >
                  <Button
                    startIcon={<Download />}
                    onClick={downloadDisclaimer}
                    size="small"
                    sx={{
                      color: darkMode ? googleColors.grey500 : googleColors.grey600,
                      '&:hover': {
                        color: darkMode ? googleColors.grey300 : googleColors.grey900,
                        backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                      },
                    }}
                  >
                    Download Copy
                  </Button>
                  <Button
                    startIcon={<Print />}
                    onClick={() => window.print()}
                    size="small"
                    sx={{
                      color: darkMode ? googleColors.grey500 : googleColors.grey600,
                      '&:hover': {
                        color: darkMode ? googleColors.grey300 : googleColors.grey900,
                        backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                      },
                    }}
                  >
                    Print
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
                backgroundColor: darkMode ? googleColors.grey900 : googleColors.grey50,
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? googleColors.grey500 : googleColors.grey600,
                }}
              >
                Version 2.0.0 • Last Updated: {new Date().toLocaleDateString()} • User ID: {user?.id?.substring(0, 8) || "N/A"}
              </Typography>
            </Box>
          </CardContent2>
        </Card>
      </Container>
    </Box>
  );
}