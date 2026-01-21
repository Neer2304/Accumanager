// app/(auth)/legal-disclaimer/page.tsx - PREMIUM DESIGN
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Alert,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  alpha,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  LinearProgress,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import {
  Warning,
  ArrowForward,
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
  ExpandMore,
  ExpandLess,
  Shield,
  Lock,
  Download,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FileText, User2 } from "lucide-react";

const steps = ["Read Disclaimer", "Accept Terms", "Access Granted"];

// Updated color scheme
const premiumColors = {
  primary: "#6366F1",
  warning: "#F59E0B",
  error: "#EF4444",
  success: "#10B981",
  darkBg: "#0F172A",
  cardBg: "#1E293B",
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
      icon: <Warning sx={{ color: premiumColors.warning }} />,
      color: premiumColors.warning,
      title: "Preview Status",
      description: "Actively under development - preview/demo version only.",
    },
    {
      icon: <Security sx={{ color: premiumColors.error }} />,
      color: premiumColors.error,
      title: "Test Data Policy",
      description:
        "Use only test/dummy data. No real customer or financial information.",
    },
    {
      icon: <Gavel sx={{ color: "#94A3B8" }} />,
      color: "#94A3B8",
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
      icon: <Info sx={{ color: premiumColors.primary }} />,
      color: premiumColors.primary,
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Check authentication and disclaimer status
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if already accepted
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
      // Collect user data
      const userAgent = navigator.userAgent;
      const timestamp = new Date().toISOString();

      // Call API to log acceptance
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

      // Show success
      setSuccess(true);

      // Store locally as backup
      localStorage.setItem("legal_disclaimer_accepted", "true");
      localStorage.setItem(
        "legal_disclaimer_accepted_date",
        new Date().toISOString(),
      );
      localStorage.setItem("legal_disclaimer_user_id", user?.id || "");
      localStorage.setItem("legal_disclaimer_user_name", user?.name || "");

      // Redirect after delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error accepting disclaimer:", error);
      setError(
        error.message || "Failed to accept disclaimer. Please try again.",
      );

      // Fallback - allow user to proceed with local storage only
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
          background: `linear-gradient(135deg, ${premiumColors.darkBg} 0%, #1E293B 100%)`,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: premiumColors.primary,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <Typography
            variant="h6"
            sx={{ mt: 3, color: "#CBD5E1", fontWeight: 500 }}
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
        background: `linear-gradient(135deg, ${premiumColors.darkBg} 0%, #1E293B 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(premiumColors.primary, 0.15)} 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, ${alpha(premiumColors.success, 0.1)} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 2, md: 4 }, position: "relative", zIndex: 1 }}
      >
        {/* User Info Bar */}
        <Card
          sx={{
            mb: 3,
            background: alpha(premiumColors.cardBg, 0.8),
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: "rgba(255,255,255,0.1)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${premiumColors.primary} 0%, #8B5CF6 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User2 />
                </Box>
                <Box>
                  <Typography sx={{ color: "white", fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleDecline}
                sx={{
                  color: premiumColors.error,
                  "&:hover": {
                    backgroundColor: alpha(premiumColors.error, 0.1),
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Zoom in={!!error}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                background: alpha(premiumColors.error, 0.1),
                border: "1px solid",
                borderColor: alpha(premiumColors.error, 0.3),
                color: "#FCA5A5",
                "& .MuiAlert-icon": { color: premiumColors.error },
              }}
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={() => setError(null)}
                  sx={{ color: "#FCA5A5" }}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          </Zoom>
        )}

        {/* Success Alert */}
        {success && (
          <Zoom in={success}>
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                background: alpha(premiumColors.success, 0.1),
                border: "1px solid",
                borderColor: alpha(premiumColors.success, 0.3),
                color: "#86EFAC",
                "& .MuiAlert-icon": { color: premiumColors.success },
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, color: "inherit" }}>
                  ✅ Disclaimer Accepted
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "inherit", opacity: 0.9 }}
                >
                  Redirecting to dashboard...
                </Typography>
              </Box>
            </Alert>
          </Zoom>
        )}

        <Zoom in={true} style={{ transitionDelay: "100ms" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: alpha(premiumColors.cardBg, 0.8),
              backdropFilter: "blur(20px)",
              border: "1px solid",
              borderColor: "rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${premiumColors.primary} 0%, ${premiumColors.success} 100%)`,
              },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                textAlign: "center",
                borderBottom: "1px solid",
                borderColor: "rgba(255,255,255,0.1)",
                background: `linear-gradient(135deg, ${alpha(premiumColors.primary, 0.2)} 0%, ${alpha(premiumColors.darkBg, 0.5)} 100%)`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${premiumColors.warning} 0%, #F97316 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 20px ${alpha(premiumColors.warning, 0.3)}`,
                  }}
                >
                  <Warning sx={{ fontSize: 28, color: "white" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(135deg, #FFF 0%, #CBD5E1 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5,
                    }}
                  >
                    {disclaimerContent.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#94A3B8",
                      fontWeight: 500,
                    }}
                  >
                    {disclaimerContent.subtitle}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Chip
                  icon={<Shield sx={{ fontSize: 16 }} />}
                  label="DEVELOPMENT PREVIEW"
                  size="small"
                  sx={{
                    background: alpha(premiumColors.warning, 0.2),
                    color: premiumColors.warning,
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: alpha(premiumColors.warning, 0.3),
                  }}
                />
                <Chip
                  icon={<Lock sx={{ fontSize: 16 }} />}
                  label="TEST DATA ONLY"
                  size="small"
                  sx={{
                    background: alpha(premiumColors.error, 0.2),
                    color: premiumColors.error,
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: alpha(premiumColors.error, 0.3),
                  }}
                />
                <Chip
                  icon={<FileText />}
                  label="VERSION 2.0.0"
                  size="small"
                  sx={{
                    background: alpha(premiumColors.primary, 0.2),
                    color: premiumColors.primary,
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: alpha(premiumColors.primary, 0.3),
                  }}
                />
              </Box>
            </Box>

            {/* Stepper */}
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          fontWeight: 600,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          color: activeStep >= index ? "white" : "#64748B",
                          "&.Mui-active, &.Mui-completed": {
                            color: "white",
                          },
                        },
                        "& .MuiStepIcon-root": {
                          color:
                            activeStep > index
                              ? premiumColors.success
                              : "#334155",
                          "&.Mui-active": {
                            color: premiumColors.primary,
                          },
                          "&.Mui-completed": {
                            color: premiumColors.success,
                          },
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Progress indicator */}
              <LinearProgress
                variant="determinate"
                value={(activeStep + 1) * 33.33}
                sx={{
                  mt: 2,
                  height: 6,
                  borderRadius: 3,
                  background: alpha("#334155", 0.5),
                  "& .MuiLinearProgress-bar": {
                    background: `linear-gradient(90deg, ${premiumColors.primary} 0%, ${premiumColors.success} 100%)`,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              {/* Critical Warnings */}
              <Alert
                severity="error"
                icon={<Warning sx={{ fontSize: 24 }} />}
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  background: alpha(premiumColors.error, 0.1),
                  border: "1px solid",
                  borderColor: alpha(premiumColors.error, 0.3),
                  color: "#FCA5A5",
                  "& .MuiAlert-icon": {
                    color: premiumColors.error,
                    alignItems: "center",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, color: "inherit" }}
                >
                  🚨 CRITICAL WARNINGS
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {disclaimerContent.criticalWarnings.map((warning, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{ mb: 1, display: "flex", alignItems: "flex-start" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "inherit",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <span
                          style={{
                            color: premiumColors.error,
                            minWidth: "1.5em",
                          }}
                        >
                          •
                        </span>
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
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      background: alpha(point.color, 0.05),
                      border: "1px solid",
                      borderColor: alpha(point.color, 0.2),
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: alpha(point.color, 0.1),
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 24px ${alpha(point.color, 0.15)}`,
                      },
                    }}
                    onClick={() => toggleSection(`point-${index}`)}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: alpha(point.color, 0.15),
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
                            fontWeight: 700,
                            mb: 0.5,
                            color: point.color,
                          }}
                        >
                          {point.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#94A3B8",
                            fontSize: "0.875rem",
                          }}
                        >
                          {point.description}
                        </Typography>
                      </Box>
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
                  borderRadius: 2,
                  background: alpha(premiumColors.error, 0.05),
                  border: "2px solid",
                  borderColor: alpha(premiumColors.error, 0.3),
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '"🚫"',
                    position: "absolute",
                    top: -20,
                    right: -20,
                    fontSize: "4rem",
                    opacity: 0.1,
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Security
                    sx={{
                      fontSize: 28,
                      color: premiumColors.error,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: premiumColors.error,
                      fontSize: "1.25rem",
                    }}
                  >
                    ABSOLUTELY PROHIBITED
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {disclaimerContent.prohibitedItems.map((item, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        padding: 1.5,
                        borderRadius: 1,
                        background:
                          index % 2 === 0 ? alpha("#000", 0.02) : "transparent",
                      }}
                    >
                      <Typography
                        component="div" // Use component="div" instead of default "p"
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          color: "#E2E8F0",
                          fontSize: "0.875rem",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: premiumColors.error,
                            mt: 0.75,
                            flexShrink: 0,
                          }}
                        />
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>

              <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }}>
                <Chip
                  label="FINAL ACKNOWLEDGMENT"
                  sx={{
                    background: alpha(premiumColors.primary, 0.2),
                    color: premiumColors.primary,
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: alpha(premiumColors.primary, 0.3),
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
                  borderRadius: 2,
                  background: alpha("#000", 0.2),
                  border: "1px solid",
                  borderColor: "rgba(255,255,255,0.1)",
                  mb: 4,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: alpha("#000", 0.2),
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: alpha(premiumColors.primary, 0.5),
                    borderRadius: "10px",
                    "&:hover": {
                      background: alpha(premiumColors.primary, 0.7),
                    },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#CBD5E1",
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                  }}
                >
                  {disclaimerContent.acknowledgment}
                </Typography>

                {/* Scroll indicator */}
                {!scrolledToBottom && (
                  <Fade in={!scrolledToBottom}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 3,
                        p: 2,
                        background: alpha(premiumColors.warning, 0.1),
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: alpha(premiumColors.warning, 0.3),
                      }}
                    >
                      <Visibility
                        sx={{
                          fontSize: 18,
                          mr: 1.5,
                          color: premiumColors.warning,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: premiumColors.warning,
                          fontSize: "0.875rem",
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
                          color: premiumColors.warning,
                          minWidth: "auto",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        Skip to bottom
                      </Button>
                    </Box>
                  </Fade>
                )}
              </Box>

              {/* Acceptance Section */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: alpha(premiumColors.primary, 0.05),
                  border: "1px solid",
                  borderColor: alpha(premiumColors.primary, 0.2),
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
                        "&.Mui-checked": {
                          color: premiumColors.success,
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 32,
                        },
                        "&.Mui-disabled": {
                          color: "#64748B",
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: checked ? premiumColors.success : "white",
                          fontSize: "1.125rem",
                        }}
                      >
                        ✅ I HAVE READ, UNDERSTOOD, AND AGREE TO ALL TERMS
                      </Typography>
                      {!scrolledToBottom && !loading && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: premiumColors.warning,
                            display: "block",
                            mt: 0.5,
                            fontSize: "0.875rem",
                          }}
                        >
                          (Please scroll to the bottom of the acknowledgment
                          text to enable this checkbox)
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{
                    mb: 4,
                    alignItems: "flex-start",
                    "& .MuiFormControlLabel-label": {
                      flex: 1,
                    },
                  }}
                />

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
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
                      minHeight: 56,
                      borderRadius: 2,
                      border: "2px solid",
                      borderColor: premiumColors.error,
                      color: premiumColors.error,
                      fontSize: "1rem",
                      fontWeight: 600,
                      px: 4,
                      "&:hover": {
                        borderWidth: 2,
                        background: alpha(premiumColors.error, 0.1),
                      },
                      "&.Mui-disabled": {
                        borderColor: "#64748B",
                        color: "#64748B",
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
                      minHeight: 56,
                      borderRadius: 2,
                      background:
                        checked && !loading
                          ? `linear-gradient(135deg, ${premiumColors.primary} 0%, ${premiumColors.success} 100%)`
                          : "#475569",
                      fontSize: "1rem",
                      fontWeight: 600,
                      px: 4,
                      "&:hover":
                        checked && !loading
                          ? {
                              background: `linear-gradient(135deg, ${premiumColors.primary} 0%, ${premiumColors.success} 100%)`,
                              transform: "translateY(-2px)",
                              boxShadow: `0 12px 24px ${alpha(premiumColors.primary, 0.3)}`,
                            }
                          : undefined,
                      "&.Mui-disabled": {
                        background: "#475569",
                        color: "#94A3B8",
                      },
                    }}
                  >
                    {loading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
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
                    borderTop: "1px solid",
                    borderColor: "rgba(255,255,255,0.1)",
                    gap: 2,
                  }}
                >
                  <Button
                    startIcon={<Download />}
                    onClick={downloadDisclaimer}
                    sx={{
                      color: "#94A3B8",
                      "&:hover": {
                        color: "white",
                        background: alpha(premiumColors.primary, 0.1),
                      },
                    }}
                  >
                    Download Copy
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    sx={{
                      color: "#94A3B8",
                      "&:hover": {
                        color: "white",
                        background: alpha(premiumColors.primary, 0.1),
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
                p: 3,
                borderTop: "1px solid",
                borderColor: "rgba(255,255,255,0.1)",
                background: alpha("#000", 0.2),
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  fontSize: "0.875rem",
                }}
              >
                Version 2.0.0 • Last Updated: {new Date().toLocaleDateString()}{" "}
                • User ID: {user?.id?.substring(0, 8) || "N/A"}
              </Typography>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}
