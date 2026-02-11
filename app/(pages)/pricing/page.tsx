// app/pricing/page.tsx
"use client";
import { useState, useEffect } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { PaymentVerification } from "@/components/payment/PaymentVerification";
import { useAuth } from "@/hooks/useAuth";
import { 
  Box,
  Container,
  Typography,
  Button,
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
  Alert,
  IconButton,
  Fade,
} from "@mui/material";
import {
  CheckCircle,
  RocketLaunch,
  Receipt,
  Storage,
  SupportAgent,
  Person,
  ArrowForward,
} from "@mui/icons-material";
import Link from "next/link";
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { LandingHeader } from "@/components/landing/Header";
import { AlertTriangle, Crown, Package, RefreshCw, Sparkles, Users } from "lucide-react";
import { HelpCircleIcon } from "@/assets/icons/SecurityIcons";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  originalPrice?: number;
  description: string;
  popular: boolean;
  features: {
    included: Array<{
      name: string;
    }>;
    excluded: string[];
  };
  limits: {
    customers: number;
    products: number;
    invoices: number;
    storageMB: number;
    users: number;
    supportHours: number;
  };
  savingPercentage?: number;
}

// Skeleton Components
const PricingSkeleton = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width={120} height={40} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
          <Skeleton variant="rectangular" width={200} height={50} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          justifyContent: 'center',
          mb: 8
        }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 12px)' },
              minWidth: { xs: '100%', sm: '300px', md: '250px' }
            }}>
              <Card sx={{ 
                height: '100%', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton 
                    variant="rectangular" 
                    width={100} 
                    height={24} 
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16, 
                      borderRadius: 12 
                    }} 
                  />
                  
                  <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    {[1, 2, 3, 4].map((feature) => (
                      <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                      </Box>
                    ))}
                  </Box>

                  <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Card sx={{ 
          mt: 6, 
          p: 4, 
          textAlign: 'center',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 3 }} />
          <Skeleton variant="rectangular" width={200} height={48} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Card>
      </Container>
    </Box>
  );
};

export default function PricingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pricing/plans");

      if (!response.ok) throw new Error("Failed to fetch pricing plans");

      const data = await response.json();
      if (data.success && data.data) {
        setPlans(data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load pricing plans");
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      setError("Plan not found");
      return;
    }

    setSelectedPlan(planId);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (transactionData: any) => {
    setCurrentTransaction(transactionData);
    setIsPaymentModalOpen(false);
    setIsVerificationOpen(true);
  };

  const getResponsiveTypography = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  if (loading) {
    return <PricingSkeleton />;
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
              Error Loading Plans
            </Typography>
            <Typography variant="body1" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              onClick={fetchPricingPlans}
              startIcon={<RefreshCw />}
              variant="contained"
              sx={{
                backgroundColor: '#4285f4',
                color: "white",
                borderRadius: '20px',
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
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              icon={<Sparkles />}
              label="No Credit Card Required for Trial"
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
              Pricing That{" "}
              <Box component="span" sx={{ color: '#34a853' }}>
                Grows
              </Box>{" "}
              With Your Business
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
              Start free, scale smart. Choose the perfect plan with transparent pricing and no hidden fees.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{ 
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                mb: 4
              }}
            >
              {["14-day free trial", "No setup fees", "Cancel anytime", "24/7 support"].map((feature) => (
                <Box key={feature} sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ fontSize: 16, mr: 1, color: '#34a853' }} />
                  <Typography variant="body2" color="white">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
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
            Simple, Transparent Pricing
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
            Choose the plan that fits your business. All plans include our core features.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            mb: 8
          }}
        >
          {plans.map((plan) => (
            <Box
              key={plan.id}
              sx={{
                width: { 
                  xs: '100%',
                  sm: 'calc(50% - 12px)',
                  md: 'calc(25% - 12px)'
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
                        ? '0 8px 24px rgba(0,0,0,0.4)'
                        : '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <Chip
                      icon={<Crown/>}
                      label="Most Popular"
                      sx={{
                        position: 'absolute',
                        top: -5,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                        backgroundColor: '#4285f4',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}

                  {/* Saving Badge */}
                  {plan.savingPercentage && (
                    <Chip
                      label={`Save ${plan.savingPercentage}%`}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: '#34a853',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}

                  <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Plan Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        gutterBottom
                        sx={{ fontSize: getResponsiveTypography('1.1rem', '1.25rem', '1.5rem') }}
                      >
                        {plan.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
                        <Typography
                          variant="h3"
                          fontWeight={600}
                          sx={{ fontSize: getResponsiveTypography('2rem', '2.25rem', '2.5rem') }}
                        >
                          ₹{plan.price}
                        </Typography>
                        {plan.originalPrice && (
                          <Typography
                            variant="body1"
                            sx={{ 
                              ml: 1,
                              textDecoration: 'line-through',
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem')
                            }}
                          >
                            ₹{plan.originalPrice}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        color={darkMode ? "#9aa0a6" : "#5f6368"}
                        sx={{ fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem') }}
                      >
                        {plan.period}
                      </Typography>
                    </Box>

                    {/* Limits Summary */}
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 2,
                      mb: 4,
                      p: 2,
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                      borderRadius: '12px',
                    }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Users />
                        <Typography variant="body2" fontWeight={600}>
                          {plan.limits.customers === 0 ? "Unlimited" : plan.limits.customers.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                          Customers
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Package/>
                        <Typography variant="body2" fontWeight={600}>
                          {plan.limits.products === 0 ? "Unlimited" : plan.limits.products.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                          Products
                        </Typography>
                      </Box>
                    </Box>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isAuthenticated && plan.id === "trial"}
                      endIcon={<ArrowForward />}
                      variant="contained"
                      fullWidth
                      sx={{
                        mb: 4,
                        py: 1.5,
                        backgroundColor: plan.popular ? '#4285f4' : '#34a853',
                        color: "white",
                        fontWeight: 500,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                        '&:hover': {
                          backgroundColor: plan.popular ? '#3367d6' : '#2d9248',
                          boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                        }
                      }}
                    >
                      {plan.id === "trial" && isAuthenticated
                        ? "Already Using"
                        : plan.id === "trial"
                        ? "Start Free Trial"
                        : "Get Started"}
                    </Button>

                    {/* Features List */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                        sx={{ 
                          mb: 2,
                          fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem')
                        }}
                      >
                        Key Features:
                      </Typography>
                      <Stack spacing={1.5}>
                        {plan.features.included.slice(0, 6).map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <CheckCircle sx={{ 
                              fontSize: 18, 
                              color: '#34a853', 
                              mr: 1.5,
                              flexShrink: 0,
                              mt: 0.25
                            }} />
                            <Typography
                              variant="body2"
                              color={darkMode ? "#e8eaed" : "#202124"}
                              sx={{ 
                                fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                                lineHeight: 1.4
                              }}
                            >
                              {feature.name}
                            </Typography>
                          </Box>
                        ))}
                        {plan.features.included.length > 6 && (
                          <Typography
                            variant="body2"
                            sx={{ 
                              color: '#4285f4',
                              fontWeight: 500,
                              fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                              mt: 1
                            }}
                          >
                            + {plan.features.included.length - 6} more features
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          ))}
        </Box>

        {/* Free Trial Banner */}
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
              icon={<RocketLaunch sx={{ fontSize: 16 }} />}
              label={isAuthenticated ? "Upgrade Your Plan" : "Limited Time Offer"}
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
              {isAuthenticated ? "Unlock More Features" : "Start Your 14-Day Free Trial"}
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
              {isAuthenticated 
                ? "Your current plan gives you basic access. Upgrade to unlock advanced features."
                : "Get full access to all Premium features. No credit card required."}
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    href="/dashboard"
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      backgroundColor: '#34a853',
                      color: "white",
                      fontWeight: 500,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                      "&:hover": {
                        backgroundColor: '#2d9248',
                        boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                      },
                    }}
                  >
                    Go to Dashboard
                  </Button>
                  {plans.find(p => p.id !== "trial" && p.popular) && (
                    <Button
                      onClick={() => handleSubscribe(plans.find(p => p.id !== "trial" && p.popular)!.id)}
                      variant="outlined"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderColor: "white",
                        color: "white",
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Upgrade Now
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => handleSubscribe("trial")}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 5,
                    py: 1.75,
                    backgroundColor: '#34a853',
                    color: "white",
                    fontWeight: 500,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                    "&:hover": {
                      backgroundColor: '#2d9248',
                      boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                    },
                  }}
                >
                  Sign Up for Free Trial
                </Button>
              )}
            </Box>

            <Typography
              variant="caption"
              sx={{ 
                mt: 3, 
                opacity: 0.9,
                display: 'block',
                fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
              }}
            >
              {isAuthenticated 
                ? "Need help choosing? Contact our sales team"
                : "No credit card required • Cancel anytime • Instant setup"}
            </Typography>
          </Box>
        </Paper>

        {/* FAQ Section */}
        <Box sx={{ mt: { xs: 8, sm: 10 } }}>
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
              Frequently Asked Questions
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
              Get answers to common questions about our pricing and plans
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
          }}>
            {[
              {
                question: "How does the UPI payment verification work?",
                answer: "After initiating payment, you'll receive a UPI QR code. Once payment is successful, our system automatically verifies the transaction through webhook notifications.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major UPI apps (Google Pay, PhonePe, Paytm), net banking, credit/debit cards, and other digital payment methods.",
              },
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with pro-rated billing.",
              },
              {
                question: "Is there a setup fee?",
                answer: "No, there are no hidden setup fees. You only pay for the plan you choose, starting after your free trial period ends.",
              },
              {
                question: "Do you offer discounts for annual plans?",
                answer: "Yes! Our annual plans offer significant savings compared to monthly billing.",
              },
              {
                question: "What happens if I exceed my plan limits?",
                answer: "You'll receive notifications when approaching your limits. You can either upgrade your plan or purchase additional capacity.",
              },
            ].map((faq, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: '100%', md: 'calc(50% - 12px)' },
                  maxWidth: 500,
                }}
              >
                <Fade in timeout={(index + 1) * 100}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      color: darkMode ? '#e8eaed' : '#202124',
                      borderRadius: '12px',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: darkMode 
                          ? '0 6px 16px rgba(0,0,0,0.3)'
                          : '0 6px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <HelpCircleIcon />
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ 
                          fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                          lineHeight: 1.2
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color={darkMode ? "#9aa0a6" : "#5f6368"}
                      sx={{ 
                        fontSize: getResponsiveTypography('0.85rem', '0.9rem', '0.95rem'),
                        lineHeight: 1.6,
                        pl: 4
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 4, sm: 5, md: 6 },
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          color: darkMode ? '#e8eaed' : '#202124',
          borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          mt: { xs: 8, sm: 10 }
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, sm: 6 },
              mb: { xs: 4, sm: 5 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RocketLaunch sx={{ fontSize: 24, color: '#4285f4', mr: 1.5 }} />
                <Typography
                  variant="h6"
                  fontWeight={500}
                  sx={{ 
                    fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                  }}
                >
                  AccuManage
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
                Streamline your business operations with our all-in-one management platform.
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
                  {["Features", "Pricing", "API", "Documentation"].map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href={`#${item.toLowerCase()}`}
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
                  {["About", "Blog", "Careers", "Contact"].map((item) => (
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
                  Support
                </Typography>
                <Stack spacing={1}>
                  {["Help Center", "Community", "Status", "Security"].map((item) => (
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
              © {new Date().getFullYear()} AccuManage. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Modals */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlan}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {currentTransaction && (
        <PaymentVerification
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          transaction={currentTransaction}
        />
      )}
    </Box>
  );
}