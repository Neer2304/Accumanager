"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
} from "@mui/material";
import {
  RocketLaunch,
  Analytics,
  Inventory,
  People,
  Receipt,
  Security,
  Speed,
  Star,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/Header";
import { useAuth } from "@/hooks/useAuth";
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

interface Review {
  _id: string;
  userName: string;
  userCompany: string;
  rating: number;
  title: string;
  comment: string;
  userRole: string;
  createdAt: string;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{ _id: number; count: number }>;
}

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const features = [
    {
      icon: <Analytics sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />,
      title: "Sales Analytics",
      description: "Track revenue, monitor trends, and make data-driven decisions.",
      color: "#4285f4",
    },
    {
      icon: <Inventory sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />,
      title: "Inventory",
      description: "Manage stock levels and automate reordering.",
      color: "#34a853",
    },
    {
      icon: <People sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />,
      title: "Customer CRM",
      description: "Build relationships with customer profiles and tracking.",
      color: "#ea4335",
    },
    {
      icon: <Receipt sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />,
      title: "Invoicing",
      description: "Create professional invoices and track payments.",
      color: "#fbbc05",
    },
    {
      icon: <Security sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />,
      title: "Security",
      description: "Enterprise-grade security with compliance built-in.",
      color: "#4285f4",
    },
    {
      icon: <Speed sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />,
      title: "Real-time",
      description: "Live sync across all devices with instant updates.",
      color: "#34a853",
    },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reviews?limit=3&featured=true");
        const data = await response.json();

        if (response.ok) {
          setReviews(data.reviews || []);
          setSummary(data.summary || null);
        } else {
          setError(data.error || "Failed to load reviews");
        }
      } catch (err) {
        setError("Unable to connect to the server");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getResponsiveTypography = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      transition: 'all 0.3s ease',
    }}>
      <LandingHeader />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, sm: 10, md: 12 },
          pb: { xs: 6, sm: 8, md: 10 },
          background: darkMode 
            ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 4, md: 6 },
            }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
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
                  mb: 2,
                }}
              >
                Streamline Your Business
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    mt: 1,
                    fontWeight: 400,
                    fontSize: getResponsiveTypography('0.8em', '0.85em', '0.9em'),
                    opacity: 0.9,
                  }}
                >
                  with AccuManage
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
                All-in-one platform for modern business management
              </Typography>
              
              <Box sx={{ 
                mb: 4,
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 },
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                {['Inventory', 'Sales', 'CRM', 'Invoicing'].map((item) => (
                  <Box key={item} sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    mr: { xs: 1, sm: 2 },
                    mb: 1 
                  }}>
                    <CheckCircle sx={{ 
                      fontSize: getResponsiveTypography('14px', '15px', '16px'), 
                      mr: 0.75, 
                      color: '#34a853' 
                    }} />
                    <Typography 
                      variant="body2" 
                      color="white"
                      sx={{ fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem') }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ 
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" }
                }}
              >
                {!isAuthenticated && !authLoading ? (
                  <>
                    <Button
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      component={Link}
                      href="/dashboard"
                      endIcon={<ArrowForward />}
                      sx={{
                        px: getResponsiveTypography('3', '4', '5'),
                        py: getResponsiveTypography('1.25', '1.5', '1.75'),
                        fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                        backgroundColor: '#34a853',
                        color: "white",
                        fontWeight: 500,
                        minWidth: { xs: "100%", sm: "auto" },
                        borderRadius: '20px',
                        textTransform: 'none',
                        "&:hover": {
                          backgroundColor: '#2d9248',
                          boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                        },
                      }}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outlined"
                      size={isMobile ? "medium" : "large"}
                      component={Link}
                      href="/login"
                      sx={{
                        px: getResponsiveTypography('3', '4', '5'),
                        py: getResponsiveTypography('1.25', '1.5', '1.75'),
                        fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                        borderColor: "white",
                        color: "white",
                        minWidth: { xs: "100%", sm: "auto" },
                        borderRadius: '20px',
                        textTransform: 'none',
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    component={Link}
                    href="/dashboard"
                    endIcon={<ArrowForward />}
                    sx={{
                      px: getResponsiveTypography('3', '4', '5'),
                      py: getResponsiveTypography('1.25', '1.5', '1.75'),
                      fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                      backgroundColor: '#34a853',
                      color: "white",
                      fontWeight: 500,
                      minWidth: { xs: "100%", sm: "auto" },
                      borderRadius: '20px',
                      textTransform: 'none',
                      "&:hover": {
                        backgroundColor: '#2d9248',
                        boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                      },
                    }}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </Stack>
            </Box>
            <Box sx={{ 
              flex: 1, 
              position: "relative",
              display: { xs: "none", md: "block" }
            }}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '160px',
                    height: '160px',
                    background: 'radial-gradient(circle, rgba(52, 168, 83, 0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                  }
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 2 
                  }}>
                    {[1, 2, 3, 4].map((item) => (
                      <Box key={item} sx={{ 
                        p: 1.5, 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        borderRadius: '10px',
                        textAlign: 'center',
                        flex: 1,
                        mx: 0.5
                      }}>
                        <Typography variant="h5" color="white" fontWeight={500}>
                          {item * 25}%
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          Efficiency
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <RocketLaunch
                    sx={{ 
                      fontSize: 60, 
                      mb: 2, 
                      color: "#34a853" 
                    }}
                  />
                  <Typography variant="subtitle1" fontWeight={500} color="white">
                    Everything You Need
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 6, sm: 8, md: 10 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
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
              Powerful Features
            </Typography>
            <Typography
              variant="body1"
              color={darkMode ? "#9aa0a6" : "#5f6368"}
              sx={{ 
                maxWidth: 500, 
                mx: "auto",
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
              }}
            >
              Streamline operations with intuitive tools and automation
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3 },
              justifyContent: 'center',
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={feature.title}
                sx={{
                  width: { 
                    xs: 'calc(50% - 8px)',
                    sm: 'calc(33.333% - 16px)',
                    md: 'calc(25% - 16px)',
                    lg: 'calc(33.333% - 16px)'
                  },
                  minWidth: { xs: 140, sm: 160 },
                }}
              >
                <Fade in timeout={(index + 1) * 150}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      color: darkMode ? '#e8eaed' : '#202124',
                      borderRadius: '12px',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: darkMode 
                          ? '0 6px 16px rgba(0,0,0,0.3)'
                          : '0 6px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ 
                      p: { xs: 2, sm: 2.5 }, 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                      <Box sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: 44, sm: 48 },
                        height: { xs: 44, sm: 48 },
                        borderRadius: '10px',
                        backgroundColor: alpha(feature.color, 0.1),
                        color: feature.color,
                        mb: 2,
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={500}
                        gutterBottom
                        sx={{ 
                          mb: 1,
                          fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                          lineHeight: 1.2
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={darkMode ? "#9aa0a6" : "#5f6368"}
                        sx={{ 
                          lineHeight: 1.4,
                          fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ 
        py: { xs: 6, sm: 8, md: 10 },
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
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
              Trusted by Businesses
            </Typography>
            <Typography
              variant="body1"
              color={darkMode ? "#9aa0a6" : "#5f6368"}
              sx={{ 
                maxWidth: 500, 
                mx: "auto",
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
              }}
            >
              Join hundreds of businesses that trust AccuManage
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 4, 
              maxWidth: 500, 
              mx: "auto",
              borderRadius: '10px',
              fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
            }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={isMobile ? 30 : 40} />
            </Box>
          ) : reviews.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography 
                variant="h6" 
                color={darkMode ? "#e8eaed" : "#202124"} 
                gutterBottom
                sx={{ 
                  mb: 2,
                  fontSize: getResponsiveTypography('1.1rem', '1.25rem', '1.5rem'),
                }}
              >
                Be the First to Review!
              </Typography>
              <Typography 
                variant="body1" 
                color={darkMode ? "#9aa0a6" : "#5f6368"} 
                sx={{ 
                  mb: 3, 
                  maxWidth: 400, 
                  mx: "auto",
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                }}
              >
                Our platform is new and we're excited to hear from our first users.
              </Typography>
              {!isAuthenticated && !authLoading && (
                <Button
                  variant="contained"
                  component={Link}
                  href="/signup"
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: '#4285f4',
                    color: "white",
                    fontWeight: 500,
                    borderRadius: '20px',
                    px: getResponsiveTypography('3', '4', '5'),
                    py: getResponsiveTypography('1', '1.25', '1.5'),
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                    "&:hover": {
                      backgroundColor: '#3367d6',
                    },
                  }}
                >
                  Join Now and Review
                </Button>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 3 },
                justifyContent: 'center',
              }}
            >
              {reviews.map((review) => (
                <Box
                  key={review._id}
                  sx={{
                    width: { 
                      xs: '100%',
                      sm: 'calc(50% - 12px)',
                      md: 'calc(33.333% - 16px)'
                    },
                    maxWidth: 400,
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      height: '100%',
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      color: darkMode ? '#e8eaed' : '#202124',
                      borderRadius: '12px',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                      "&:hover": {
                        boxShadow: darkMode 
                          ? '0 6px 16px rgba(0,0,0,0.3)'
                          : '0 6px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", mb: 1.5 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            color: i < review.rating ? "#fbbc05" : darkMode ? "#5f6368" : "#dadce0",
                            fontSize: getResponsiveTypography('16px', '18px', '20px'),
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      gutterBottom
                      sx={{ 
                        mb: 1.5,
                        fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                        lineHeight: 1.2
                      }}
                    >
                      {review.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ 
                        mb: 2, 
                        fontStyle: "italic",
                        flex: 1,
                        color: darkMode ? "#9aa0a6" : "#5f6368",
                        fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                        lineHeight: 1.4
                      }}
                    >
                      "{review.comment}"
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                        pt: 1.5,
                        borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem') }}
                        >
                          {review.userName}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color={darkMode ? "#9aa0a6" : "#5f6368"}
                          sx={{ fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem') }}
                        >
                          {review.userCompany}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        color={darkMode ? "#9aa0a6" : "#5f6368"}
                        sx={{ fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem') }}
                      >
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          )}

          {summary && !loading && (
            <Box sx={{ textAlign: "center", mt: { xs: 6, sm: 8 } }}>
              <Typography
                variant="h3"
                fontWeight={500}
                gutterBottom
                sx={{ 
                  fontSize: getResponsiveTypography('2rem', '2.25rem', '2.5rem'),
                  mb: 1
                }}
              >
                {summary.averageRating.toFixed(1)} ★
              </Typography>
              <Typography 
                variant="body1" 
                color={darkMode ? "#9aa0a6" : "#5f6368"} 
                sx={{ 
                  mb: 2,
                  fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                }}
              >
                Average rating from {summary.totalReviews} verified reviews
              </Typography>
              <Button
                component={Link}
                href="/reviews"
                variant="outlined"
                sx={{ 
                  borderRadius: '20px',
                  px: getResponsiveTypography('3', '4', '5'),
                  py: getResponsiveTypography('0.75', '1', '1.25'),
                  fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#4285f4',
                    backgroundColor: darkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.04)',
                  }
                }}
              >
                Read All Reviews
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 6, sm: 8, md: 10 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              textAlign: "center",
              background: darkMode 
                ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
                : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
              color: "white",
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
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
            <Typography
              variant="h2"
              component="h2"
              fontWeight={500}
              gutterBottom
              sx={{ 
                fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
                mb: { xs: 2, sm: 3 },
                position: 'relative',
                zIndex: 1,
              }}
            >
              Ready to Transform Your Business?
            </Typography>
            <Typography
              variant="body1"
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                opacity: 0.9,
                fontWeight: 300,
                position: 'relative',
                zIndex: 1,
                fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
              }}
            >
              Join thousands of businesses using AccuManage
            </Typography>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {!isAuthenticated && !authLoading ? (
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  component={Link}
                  href="/dashboard"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: getResponsiveTypography('4', '5', '6'),
                    py: getResponsiveTypography('1.25', '1.5', '1.75'),
                    fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                    backgroundColor: '#34a853',
                    color: "white",
                    fontWeight: 500,
                    borderRadius: '20px',
                    textTransform: 'none',
                    "&:hover": {
                      backgroundColor: '#2d9248',
                      boxShadow: '0 6px 16px rgba(52, 168, 83, 0.3)',
                    },
                  }}
                >
                  Start Your Free Trial
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  component={Link}
                  href="/dashboard"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: getResponsiveTypography('4', '5', '6'),
                    py: getResponsiveTypography('1.25', '1.5', '1.75'),
                    fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                    backgroundColor: '#34a853',
                    color: "white",
                    fontWeight: 500,
                    borderRadius: '20px',
                    textTransform: 'none',
                    "&:hover": {
                      backgroundColor: '#2d9248',
                      boxShadow: '0 6px 16px rgba(52, 168, 83, 0.3)',
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
              )}
              {!isAuthenticated && !authLoading && (
                <Typography
                  variant="caption"
                  sx={{ 
                    mt: 2, 
                    opacity: 0.9,
                    display: 'block',
                    fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
                  }}
                >
                  No credit card required • 14-day free trial • Cancel anytime
                </Typography>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 3, sm: 4, md: 5 },
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          color: darkMode ? '#e8eaed' : '#202124',
          borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 3, sm: 4 },
              mb: { xs: 3, sm: 4 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={500}
                gutterBottom
                sx={{ 
                  mb: 2,
                  fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                }}
              >
                AccuManage
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  opacity: 0.8, 
                  mb: 2,
                  maxWidth: 400,
                  fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                }}
              >
                Streamlining business operations for modern enterprises with powerful tools.
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
                  Product
                </Typography>
                <Stack spacing={1}>
                  {["Features", "Pricing", "Solutions"].map((item) => (
                    <Typography
                      key={item}
                      component={Link}
                      href={item === "Pricing" ? "/pricing" : `#${item.toLowerCase()}`}
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
                  Company
                </Typography>
                <Stack spacing={1}>
                  {["About", "Contact", "Sign In"].map((item) => (
                    <Typography
                      key={item}
                      component={Link}
                      href={item === "Sign In" ? "/login" : `#${item.toLowerCase()}`}
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
          <Box sx={{ 
            borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0', 
            pt: { xs: 2, sm: 3 },
            mt: { xs: 3, sm: 4 },
            textAlign: 'center',
          }}>
            <Typography
              variant="caption"
              sx={{ 
                opacity: 0.6,
                fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
              }}
            >
              © {new Date().getFullYear()} AccuManage. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}