// app/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Home as HomeIcon, Settings as SettingsIcon } from "@mui/icons-material";
import Link from "next/link";

// Import Google-themed components
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
// import { Switch } from "@/components/ui/Switch";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";

// Import custom icons
import {
  Business,
  Notifications,
  Security,
  Palette,
  Payment,
  Backup,
  Save,
  Upgrade,
} from "@mui/icons-material";

// Import settings components
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { BackupSettings } from "@/components/settings/BackupSettings";

// Import types
import { SettingsData, SubscriptionStatus } from "@/types/settings";

// Custom fade component for SSR
const SafeFade = ({ children, ...props }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{children}</>;
  }
  
  return (
    <div style={{ opacity: 1, transition: "opacity 300ms" }}>
      {children}
    </div>
  );
};

export default function SettingsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const darkMode = theme.palette.mode === "dark";
  
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [error, setError] = useState("");

  // Default settings
  const defaultSettings: SettingsData = {
    business: {
      name: "My Business",
      taxRate: 18,
      invoicePrefix: "INV",
      gstNumber: "",
      businessAddress: "",
      phone: "",
      email: "",
      website: "",
      logoUrl: "",
    },
    notifications: {
      email: true,
      push: true,
      salesAlerts: true,
      lowStockAlerts: true,
      newCustomerAlerts: true,
      billingReminders: true,
      monthlyReports: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordChangeRequired: false,
      loginAlerts: true,
      ipWhitelist: [],
    },
    appearance: {
      themeMode: darkMode ? "dark" : "light", // Only theme mode
      language: "en",
      dateFormat: "dd/MM/yyyy",
      compactMode: false,
    },
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/settings");
      return;
    }
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load settings
      const response = await fetch("/api/settings", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          setLogoPreview(data.settings.business?.logoUrl || "");
        } else {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
      
      // Load subscription status
      const subResponse = await fetch("/api/subscription", {
        credentials: "include",
      });
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscriptionStatus(subData.subscription || null);
      }
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load settings");
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (
    section: keyof SettingsData,
    key: string,
    value: any,
  ) => {
    if (!settings) return;
    
    setSettings((prev) => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
        
        // Update theme if appearance changed
        if (settings.appearance.themeMode) {
          // This would typically be handled by your theme provider
          // Reload to apply theme changes
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
      } else {
        throw new Error(data.message || "Failed to save settings");
      }
    } catch (err: any) {
      console.error("Error saving settings:", err);
      setSaveStatus("error");
      setError(err.message);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        handleSettingChange("business", "logoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackup = async (type: string) => {
    try {
      const response = await fetch(`/api/settings/backup?type=${type}`, {
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${type}-${new Date().toISOString().split("T")[0]}.${type === "csv" ? "csv" : "json"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  const handleUpgradePlan = async (plan: string) => {
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        const result = await response.json();
        const paymentData = result.data;
        window.open(paymentData.upiUrl, "_blank");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const tabs = [
    { label: "Business", icon: <Business /> },
    { label: "Notifications", icon: <Notifications /> },
    { label: "Security", icon: <Security /> },
    { label: "Appearance", icon: <Palette /> },
    { label: "Subscription", icon: <Payment /> },
    { label: "Backup", icon: <Backup /> },
  ];

  if (loading) {
    return (
      <MainLayout title="Settings">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
            }}
          >
            <CircularProgress sx={{ color: "#4285f4", mb: 2 }} />
            <Typography
              variant="h6"
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 300,
              }}
            >
              Loading Settings...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  const displaySettings = settings || defaultSettings;

  return (
    <MainLayout title="Settings">
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
            borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            background: darkMode
              ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
              : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          }}
        >
          <SafeFade>
            <Breadcrumbs
              sx={{
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
              }}
            >
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 300,
                  "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
                }}
              >
                <HomeIcon
                  sx={{
                    mr: 0.5,
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  }}
                />
                Dashboard
              </MuiLink>
              <Typography
                color={darkMode ? "#e8eaed" : "#202124"}
                fontWeight={400}
              >
                Settings
              </Typography>
            </Breadcrumbs>
          </SafeFade>

          <SafeFade>
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 2, sm: 3, md: 4 },
                px: { xs: 1, sm: 2, md: 3 },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                fontWeight={500}
                gutterBottom
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <SettingsIcon
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  }}
                />
                Settings
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 300,
                  fontSize: { xs: "0.85rem", sm: "1rem", md: "1.125rem" },
                  lineHeight: 1.5,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Configure your application preferences and manage business
                settings
              </Typography>
            </Box>
          </SafeFade>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <SafeFade>
              <Alert
                severity="error"
                title="Error"
                message={error}
                dismissible
                onDismiss={() => setError("")}
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              />
            </SafeFade>
          )}

          {/* Save Status Alert */}
          {saveStatus === "success" && (
            <SafeFade>
              <Alert
                severity="success"
                title="Success"
                message="Settings saved successfully!"
                dismissible
                onDismiss={() => setSaveStatus("idle")}
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              />
            </SafeFade>
          )}

          {/* Tabs Navigation */}
          <SafeFade>
            <Card
              title="Settings Navigation"
              hover
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                tabs={tabs}
                variant={isMobile ? "scrollable" : "fullWidth"}
              />
            </Card>
          </SafeFade>

          {/* Tab Content */}
          <SafeFade>
            <Box>
              {/* Business Tab */}
              {activeTab === 0 && (
                <Card
                  title="Business Settings"
                  subtitle="Configure your business details"
                  hover
                  sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
                >
                  <BusinessSettings
                    settings={displaySettings.business}
                    logoPreview={logoPreview}
                    onSettingChange={(key, value) =>
                      handleSettingChange("business", key, value)
                    }
                    onLogoUpload={handleLogoUpload}
                  />
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === 1 && (
                <Card
                  title="Notification Settings"
                  subtitle="Manage your notification preferences"
                  hover
                  sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
                >
                  <NotificationSettings
                    settings={displaySettings.notifications}
                    onSettingChange={(key, value) =>
                      handleSettingChange("notifications", key, value)
                    }
                  />
                </Card>
              )}

              {/* Security Tab */}
              {activeTab === 2 && (
                <Card
                  title="Security Settings"
                  subtitle="Enhance your account security"
                  hover
                  sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
                >
                  <SecuritySettings
                    settings={displaySettings.security}
                    onSettingChange={(key, value) =>
                      handleSettingChange("security", key, value)
                    }
                  />
                </Card>
              )}

              {/* Appearance Tab */}
              {activeTab === 3 && (
                <Card
                  title="Appearance Settings"
                  subtitle="Customize your interface"
                  hover
                  sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
                >
                  <AppearanceSettings
                    settings={displaySettings.appearance}
                    onSettingChange={(key, value) =>
                      handleSettingChange("appearance", key, value)
                    }
                  />
                </Card>
              )}

              {/* Subscription Tab */}
              {activeTab === 4 && (
                <Card
                  title="Subscription"
                  subtitle="Manage your subscription plan"
                  hover
                  sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
                >
                  <SubscriptionSettings
                    subscription={subscriptionStatus}
                    onUpgradeClick={handleUpgradePlan}
                  />
                </Card>
              )}

              {/* Backup Tab */}
              {activeTab === 5 && (
                <Card
                  title="Backup & Export"
                  subtitle="Backup your data for safekeeping"
                  hover
                  sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
                >
                  <BackupSettings onBackup={handleBackup} />
                </Card>
              )}
            </Box>
          </SafeFade>

          {/* Save Button */}
          <SafeFade>
            <Box
              sx={{
                position: "sticky",
                bottom: 20,
                mt: 4,
                display: "flex",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <Button
                variant="contained"
                iconLeft={
                  saveStatus === "saving" ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <Save />
                  )
                }
                onClick={handleSaveSettings}
                disabled={saveStatus === "saving"}
                size="large"
                sx={{
                  minWidth: 200,
                  borderRadius: "20px",
                  boxShadow: 4,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {saveStatus === "saving" ? "Saving..." : "Save All Settings"}
              </Button>
            </Box>
          </SafeFade>
        </Container>
      </Box>
    </MainLayout>
  );
}