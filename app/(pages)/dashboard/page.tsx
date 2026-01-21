"use client";

import { MainLayout } from "@/components/Layout/MainLayout";
import Dashboard from "@/components/dashboard/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  useMediaQuery,
  useTheme,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Warning, ArrowBack } from "@mui/icons-material";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [checkingDisclaimer, setCheckingDisclaimer] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    const checkDisclaimer = async () => {
      if (!isLoading) {
        if (!isAuthenticated) {
          // Not authenticated, redirect to login
          router.push("/login");
          return;
        }

        // Check if user has accepted disclaimer
        const hasAccepted = localStorage.getItem("legal_disclaimer_accepted");
        const userId = localStorage.getItem("legal_disclaimer_user_id");

        if (hasAccepted && userId === user?.id) {
          // User has accepted disclaimer
          setDisclaimerAccepted(true);
        } else {
          // User hasn't accepted disclaimer, redirect to disclaimer page
          router.push("/legal-disclaimer");
        }

        setCheckingDisclaimer(false);
      }
    };

    checkDisclaimer();
  }, [isAuthenticated, isLoading, router, user?.id]);

  // Show loading while checking
  if (isLoading || checkingDisclaimer) {
    return (
      <MainLayout title="Dashboard Overview">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress />
          <p>Checking access permissions...</p>
        </Box>
      </MainLayout>
    );
  }

  // If not authenticated or disclaimer not accepted, don't show dashboard
  if (!isAuthenticated || !disclaimerAccepted) {
    return (
      <MainLayout title="Access Required">
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Alert severity="warning" sx={{ maxWidth: 500 }} icon={<Warning />}>
            <strong>Legal Disclaimer Required</strong>
            <p>
              You must accept the legal disclaimer before accessing the
              dashboard.
            </p>
          </Alert>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push("/legal-disclaimer")}
            >
              Go to Disclaimer
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  // Only show dashboard if authenticated AND disclaimer accepted
  // Inside your DashboardPage return:
  return (
    <MainLayout title="Dashboard Overview">
      <Box
        sx={{
          mt: { xs: -2, sm: -3, md: -8, xl: -12 }, // Negative margin to pull content up
          px: { xs: 0, sm: 1 },
        }}
      >
        <Dashboard />
      </Box>
    </MainLayout>
  );
}
