// app/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { useTheme as useThemeContext } from "@/contexts/ThemeContext";

// Import Google-themed components
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";

// Import Google Settings components
import {
  GoogleSettingsHeader,
  GoogleSettingsTabs,
  GoogleSettingsSaveBar,
  GoogleSettingsBusiness,
  GoogleSettingsNotifications,
  GoogleSettingsSecurity,
  GoogleSettingsAppearance,
  GoogleSettingsSubscription,
  GoogleSettingsBackup,
  SettingsData,
  SubscriptionStatus,
} from "@/components/googlesettings";

export default function SettingsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { mode, toggleTheme } = useThemeContext();
  const darkMode = mode === "dark";
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
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
      themeMode: darkMode ? "dark" : "light",
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
        if (settings.appearance.themeMode !== mode) {
          // This will trigger theme context to update
          if (settings.appearance.themeMode === 'dark' && mode === 'light') {
            toggleTheme();
          } else if (settings.appearance.themeMode === 'light' && mode === 'dark') {
            toggleTheme();
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
        <GoogleSettingsHeader 
          darkMode={darkMode}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              title="Error"
              message={error}
              dismissible
              onDismiss={() => setError("")}
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            />
          )}

          {/* Save Status Alert */}
          {saveStatus === "success" && (
            <Alert
              severity="success"
              title="Success"
              message="Settings saved successfully!"
              dismissible
              onDismiss={() => setSaveStatus("idle")}
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            />
          )}

          {/* Tabs Navigation */}
          <Card
            title="Settings Navigation"
            hover
            sx={{ mb: { xs: 2, sm: 3, md: 4 }, p: 0, overflow: 'hidden' }}
          >
            <GoogleSettingsTabs
              activeTab={activeTab}
              onChange={handleTabChange}
              isMobile={isMobile}
              darkMode={darkMode}
            />
          </Card>

          {/* Tab Content */}
          <Box>
            {/* Business Tab */}
            {activeTab === 0 && (
              <Card
                title="Business Settings"
                subtitle="Configure your business details"
                hover
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              >
                <GoogleSettingsBusiness
                  settings={displaySettings.business}
                  logoPreview={logoPreview}
                  onSettingChange={(key, value) =>
                    handleSettingChange("business", key, value)
                  }
                  onLogoUpload={handleLogoUpload}
                  darkMode={darkMode}
                  isMobile={isMobile}
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
                <GoogleSettingsNotifications
                  settings={displaySettings.notifications}
                  onSettingChange={(key, value) =>
                    handleSettingChange("notifications", key, value)
                  }
                  darkMode={darkMode}
                  isMobile={isMobile}
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
                <GoogleSettingsSecurity
                  settings={displaySettings.security}
                  onSettingChange={(key, value) =>
                    handleSettingChange("security", key, value)
                  }
                  darkMode={darkMode}
                  isMobile={isMobile}
                />
              </Card>
            )}

            {/* Appearance Tab - SIMPLIFIED */}
            {activeTab === 3 && (
              <Card
                title="Appearance Settings"
                subtitle="Customize your interface"
                hover
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              >
                <GoogleSettingsAppearance
                  settings={displaySettings.appearance}
                  onSettingChange={(key, value) =>
                    handleSettingChange("appearance", key, value)
                  }
                  darkMode={darkMode}
                  isMobile={isMobile}
                  isTablet={isTablet}
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
                <GoogleSettingsSubscription
                  subscription={subscriptionStatus}
                  onUpgradeClick={handleUpgradePlan}
                  darkMode={darkMode}
                  isMobile={isMobile}
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
                <GoogleSettingsBackup
                  onBackup={handleBackup}
                  darkMode={darkMode}
                  isMobile={isMobile}
                />
              </Card>
            )}
          </Box>

          {/* Save Button */}
          <GoogleSettingsSaveBar
            saveStatus={saveStatus}
            onSave={handleSaveSettings}
            darkMode={darkMode}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}