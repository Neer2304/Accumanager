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
  useMediaQuery
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
} from "@mui/icons-material";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/Header";
import { useAuth } from "@/hooks/useAuth";

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const features = [
    {
      icon: <Analytics sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: "Sales Analytics",
      description: "Track your revenue, monitor sales trends, and make data-driven decisions with real-time analytics.",
      color: "#2563eb",
    },
    {
      icon: <Inventory sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: "Inventory Management",
      description: "Manage stock levels, track products, and automate reordering with smart inventory controls.",
      color: "#059669",
    },
    {
      icon: <People sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: "Customer CRM",
      description: "Build lasting relationships with comprehensive customer profiles and interaction tracking.",
      color: "#dc2626",
    },
    {
      icon: <Receipt sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: "Invoice & Billing",
      description: "Create professional invoices, track payments, and manage your billing effortlessly.",
      color: "#7c3aed",
    },
    {
      icon: <Security sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with GST compliance and data protection built-in.",
      color: "#ea580c",
    },
    {
      icon: <Speed sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: "Real-time Updates",
      description: "Live sync across all devices with instant updates and collaborative features.",
      color: "#db2777",
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

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <LandingHeader />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 10, sm: 12, md: 16 },
          pb: { xs: 6, sm: 8, md: 12 },
          background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
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
                variant={isMobile ? "h3" : isTablet ? "h2" : "h1"}
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { 
                    xs: "2rem", 
                    sm: "2.5rem", 
                    md: "3.5rem",
                    lg: "4rem" 
                  },
                  lineHeight: 1.2,
                  color: "white",
                }}
              >
                Streamline Your Business with{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  AccumaManage
                </Box>
              </Typography>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { 
                    xs: "1rem", 
                    sm: "1.1rem", 
                    md: "1.25rem" 
                  },
                  color: "white",
                }}
              >
                All-in-one business management platform for inventory, sales, customers, and invoicing. Grow your business with powerful tools designed for modern enterprises.
              </Typography>
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
                      sx={{
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: "0.95rem", sm: "1.1rem" },
                        background: "linear-gradient(45deg, #FFD700, #FFA500)",
                        color: "black",
                        fontWeight: "bold",
                        minWidth: { xs: "100%", sm: "auto" },
                        "&:hover": {
                          background: "linear-gradient(45deg, #FFC400, #FF8C00)",
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
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: "0.95rem", sm: "1.1rem" },
                        borderColor: "white",
                        color: "white",
                        minWidth: { xs: "100%", sm: "auto" },
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
                    sx={{
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: "0.95rem", sm: "1.1rem" },
                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                      color: "black",
                      fontWeight: "bold",
                      minWidth: { xs: "100%", sm: "auto" },
                      "&:hover": {
                        background: "linear-gradient(45deg, #FFC400, #FF8C00)",
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
              textAlign: "center",
              display: { xs: "none", md: "block" }
            }}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, md: 4 },
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  borderRadius: { xs: 3, md: 4 },
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <RocketLaunch
                  sx={{ 
                    fontSize: { xs: 80, md: 120 }, 
                    opacity: 0.9, 
                    mb: 2, 
                    color: "#FFD700" 
                  }}
                />
                <Typography variant="h6" fontWeight="bold" color="white">
                  Everything You Need in One Platform
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 6, sm: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
            component="h2"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            color="text.primary"
            sx={{ mb: { xs: 2, sm: 3 } }}
          >
            Powerful Features for Your Business
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary"
            textAlign="center"
            sx={{ 
              mb: { xs: 4, sm: 6, md: 8 }, 
              maxWidth: 600, 
              mx: "auto",
              px: { xs: 2, sm: 0 }
            }}
          >
            Designed to streamline your operations and boost productivity with intuitive tools and automation.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 3, sm: 4 },
            }}
          >
            {features.map((feature) => (
              <Card
                key={feature.title}
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ 
                  p: { xs: 2.5, sm: 3, md: 4 }, 
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    fontWeight="bold"
                    gutterBottom
                    color="text.primary"
                    sx={{ mb: { xs: 1, sm: 2 } }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
            component="h2"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            color="text.primary"
            sx={{ mb: { xs: 2, sm: 3 } }}
          >
            Trusted by Businesses
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary"
            textAlign="center"
            sx={{ 
              mb: { xs: 4, sm: 6, md: 8 }, 
              maxWidth: 600, 
              mx: "auto",
              px: { xs: 2, sm: 0 }
            }}
          >
            Join hundreds of businesses that trust AccumaManage to power their operations.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 4, 
              maxWidth: 600, 
              mx: "auto",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : reviews.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                color="text.primary" 
                gutterBottom
                sx={{ mb: 2 }}
              >
                Be the First to Review!
              </Typography>
              <Typography 
                variant={isMobile ? "body2" : "body1"} 
                color="text.secondary" 
                sx={{ mb: 3, maxWidth: 500, mx: "auto" }}
              >
                Our platform is new and we're excited to hear from our first users.
              </Typography>
              {!isAuthenticated && !authLoading && (
                <Button
                  variant="contained"
                  component={Link}
                  href="/signup"
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    color: "black",
                    fontWeight: "bold",
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 }
                  }}
                >
                  Join Now and Be the First Reviewer
                </Button>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: { xs: 3, sm: 4 },
              }}
            >
              {reviews.map((review) => (
                <Paper
                  key={review._id}
                  sx={{
                    p: { xs: 2.5, sm: 3, md: 4 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        sx={{
                          color: i < review.rating ? "#FFD700" : "#e5e7eb",
                          fontSize: { xs: 18, sm: 20 },
                        }}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    fontWeight="bold"
                    gutterBottom
                    color="text.primary"
                    sx={{ mb: 2 }}
                  >
                    {review.title}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    sx={{ 
                      mb: 3, 
                      fontStyle: "italic",
                      flex: 1 
                    }}
                    color="text.primary"
                  >
                    "{review.comment}"
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                    }}
                  >
                    <Box>
                      <Typography
                        variant={isMobile ? "body2" : "subtitle1"}
                        fontWeight="bold"
                        color="text.primary"
                      >
                        {review.userName}
                      </Typography>
                      <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                        {review.userCompany}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {summary && !loading && (
            <Box sx={{ textAlign: "center", mt: { xs: 6, sm: 8 } }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight="bold"
                gutterBottom
                color="text.primary"
              >
                {summary.averageRating.toFixed(1)} ★
              </Typography>
              <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
                Average rating from {summary.totalReviews} verified reviews
              </Typography>
              <Button
                component={Link}
                href="/reviews"
                variant="outlined"
                sx={{ 
                  mt: 2,
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                }}
              >
                Read All Reviews
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: "center",
              background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
              color: "white",
              borderRadius: { xs: 3, md: 4 },
            }}
          >
            <Typography
              variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
              component="h2"
              fontWeight="bold"
              gutterBottom
              color="white"
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            >
              Ready to Transform Your Business?
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                opacity: 0.95,
                px: { xs: 1, sm: 0 }
              }}
              color="white"
            >
              Join thousands of businesses using AccumaManage to streamline their operations.
            </Typography>
            {!isAuthenticated && !authLoading ? (
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                component={Link}
                href="/dashboard"
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  background: "linear-gradient(45deg, #FFD700, #FFA500)",
                  color: "black",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FFC400, #FF8C00)",
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
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  background: "linear-gradient(45deg, #FFD700, #FFA500)",
                  color: "black",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FFC400, #FF8C00)",
                  },
                }}
              >
                Go to Dashboard
              </Button>
            )}
            {!isAuthenticated && !authLoading && (
              <Typography
                variant="body2"
                sx={{ 
                  mt: 2, 
                  opacity: 0.9,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }
                }}
                color="white"
              >
                No credit card required • 14-day free trial • Cancel anytime
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 3, sm: 4, md: 6 },
          background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, sm: 6 },
              mb: { xs: 3, sm: 4 },
            }}
          >
            <Box sx={{ flex: 2 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="bold"
                gutterBottom
                color="white"
              >
                AccumaManage
              </Typography>
              <Typography
                variant={isMobile ? "body2" : "body1"}
                sx={{ 
                  opacity: 0.8, 
                  mb: 2,
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                }}
                color="white"
              >
                Streamlining business operations for modern enterprises with powerful, intuitive tools that drive growth and efficiency.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 3, sm: 4 },
                flex: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom 
                  color="white"
                  sx={{ mb: { xs: 1, sm: 2 } }}
                >
                  Product
                </Typography>
                <Stack spacing={0.5}>
                  {["Features", "Pricing", "Solutions"].map((item) => (
                    <Button
                      key={item}
                      component="a"
                      href={item === "Pricing" ? "/pricing" : `#${item.toLowerCase()}`}
                      sx={{
                        color: "white",
                        opacity: 0.8,
                        justifyContent: "flex-start",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        p: 0,
                        minHeight: "auto",
                        "&:hover": {
                          opacity: 1,
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </Stack>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom 
                  color="white"
                  sx={{ mb: { xs: 1, sm: 2 } }}
                >
                  Company
                </Typography>
                <Stack spacing={0.5}>
                  {["About", "Contact", "Sign In"].map((item) => (
                    <Button
                      key={item}
                      component={item === "Sign In" ? Link : "a"}
                      href={item === "Sign In" ? "/login" : `#${item.toLowerCase()}`}
                      sx={{
                        color: "white",
                        opacity: 0.8,
                        justifyContent: "flex-start",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        p: 0,
                        minHeight: "auto",
                        "&:hover": {
                          opacity: 1,
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
          <Box sx={{ 
            borderTop: "1px solid rgba(255,255,255,0.1)", 
            pt: { xs: 2, sm: 3 } 
          }}>
            <Typography
              variant="body2"
              sx={{ 
                opacity: 0.6, 
                textAlign: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem" }
              }}
              color="white"
            >
              © {new Date().getFullYear()} AccumaManage. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}