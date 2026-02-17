// app/pricing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { PaymentVerification } from "@/components/payment/PaymentVerification";
import { useAuth } from "@/hooks/useAuth";
import { 
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Alert,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { LandingHeader } from "@/components/landing/Header";

// Import Google Pricing components
import {
  GooglePricingSkeleton,
  GooglePricingHeader,
  GooglePricingGrid,
  GooglePricingCTABanner,
  GooglePricingFAQ,
  GooglePricingFooter,
  PricingPlan,
  FAQ,
} from "@/components/googlepricing";

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

  const faqs: FAQ[] = [
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
  ];

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
    return <GooglePricingSkeleton />;
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
              Error Loading Plans
            </Typography>
            <Typography variant="body1" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              onClick={fetchPricingPlans}
              startIcon={<RefreshCw size={18} />}
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

  const popularPlan = plans.find(p => p.popular && p.id !== "trial");

  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      transition: 'all 0.3s ease',
    }}>
      <LandingHeader />

      <GooglePricingHeader 
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GooglePricingGrid 
        plans={plans}
        isAuthenticated={isAuthenticated}
        onSubscribe={handleSubscribe}
        darkMode={darkMode}
        isMobile={isMobile}
        isTablet={isTablet}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GooglePricingCTABanner 
        isAuthenticated={isAuthenticated}
        popularPlanId={popularPlan?.id}
        onSubscribe={handleSubscribe}
        darkMode={darkMode}
        isMobile={isMobile}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GooglePricingFAQ 
        faqs={faqs}
        darkMode={darkMode}
        isMobile={isMobile}
        getResponsiveTypography={getResponsiveTypography}
      />

      <GooglePricingFooter 
        darkMode={darkMode}
        getResponsiveTypography={getResponsiveTypography}
      />

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