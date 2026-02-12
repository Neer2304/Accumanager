"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
  Button,
} from "@mui/material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { 
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon 
} from "@mui/icons-material";
import Link from "next/link";

export default function CompanyRedirectPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkCompanies = async () => {
      try {
        console.log("🔍 Checking companies...");
        setDebugInfo("Checking for companies...");

        const response = await fetch("/api/companies", {
          credentials: "include",
        });

        const text = await response.text();
        console.log("📝 Raw response:", text);

        try {
          const data = JSON.parse(text);
          console.log("📊 Parsed data:", data);
          
          // ✅ Store companies
          setCompanies(data.companies || []);
          
          if (data.companies && data.companies.length > 0) {
            console.log("✅ Companies found:", data.companies.length);
            setDebugInfo(`Found ${data.companies.length} companies - REDIRECTING TO DASHBOARD!`);
            
            // Store in localStorage
            localStorage.setItem('companies', JSON.stringify(data.companies));
            localStorage.setItem('currentCompany', JSON.stringify(data.companies[0]));
            
            // Clear any existing timer
            if (redirectTimer) clearTimeout(redirectTimer);
            
            // Redirect to dashboard
            router.push("/dashboard");
            return;
          } else {
            console.log("⚠️ No companies found");
            setDebugInfo(`No companies found, redirecting to setup...`);
            setLoading(false);
            
            // No companies, redirect to setup after 3 seconds
            const timer = setTimeout(() => {
              router.push("/company/setup");
            }, 3000);
            
            setRedirectTimer(timer);
          }
        } catch (e) {
          console.error("❌ Failed to parse JSON:", text);
          setDebugInfo(`Error: Invalid JSON response`);
          setLoading(false);
          
          const timer = setTimeout(() => {
            router.push("/company/setup");
          }, 3000);
          
          setRedirectTimer(timer);
        }
      } catch (error) {
        console.error("❌ Error:", error);
        setDebugInfo(`Error: ${error}`);
        setLoading(false);
        
        const timer = setTimeout(() => {
          router.push("/company/setup");
        }, 3000);
        
        setRedirectTimer(timer);
      } finally {
        setLoading(false);
      }
    };

    checkCompanies();

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router]);

  // If companies exist, show loading with redirect
  if (companies.length > 0) {
    return (
      <MainLayout title="Redirecting...">
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "70vh",
          gap: 3,
          p: 3,
        }}>
          <Box sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: alpha("#34a853", 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: "#34a853" }} />
          </Box>

          <CircularProgress size={48} thickness={4} sx={{ color: "#34a853" }} />

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Company Found! Redirecting...
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 500 }}>
            You have {companies.length} active compan{companies.length > 1 ? 'ies' : 'y'}. 
            Taking you to dashboard...
          </Typography>

          <Button
            variant="contained"
            startIcon={<DashboardIcon />}
            onClick={() => router.push("/dashboard")}
            sx={{ mt: 2, borderRadius: '8px' }}
          >
            Go to Dashboard Now
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // No companies found
  return (
    <MainLayout title="No Company Found">
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "70vh",
        gap: 3,
        p: 3,
      }}>
        <Box sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: darkMode
            ? alpha("#4285f4", 0.1)
            : alpha("#4285f4", 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}>
          <BusinessIcon sx={{ fontSize: 64, color: "#4285f4" }} />
        </Box>

        {loading ? (
          <CircularProgress size={48} thickness={4} sx={{ color: "#4285f4" }} />
        ) : (
          <>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              No Active Company Found
            </Typography>

            <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 500 }}>
              You don't have an active company workspace yet. 
              Set up your company to start managing leads, contacts, and deals.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/company/setup")}
                sx={{ borderRadius: '8px' }}
              >
                Create Company
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/dashboard")}
                sx={{ borderRadius: '8px' }}
              >
                Go to Dashboard
              </Button>
            </Box>
          </>
        )}

        {/* Debug info */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Status: {debugInfo || "Initializing..."}
        </Typography>
      </Box>
    </MainLayout>
  );
}