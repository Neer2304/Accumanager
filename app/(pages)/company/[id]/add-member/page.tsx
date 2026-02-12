"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Card,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { MainLayout } from "@/components/Layout/MainLayout";
import { Button as CustomButton } from "@/components/ui/Button";

export default function AddMemberPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch company details
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch("/api/companies", {
          credentials: "include",
        });
        const data = await res.json();
        const company = data.companies?.find((c: any) => c._id === companyId);
        if (company) {
          setCompanyName(company.name);
        }
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };
    fetchCompany();
  }, [companyId]);

  const handleAddMember = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const response = await fetch("/api/user-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyId,
          email,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add member");
      }

      setSuccess(true);
      setEmail("");
      
      // Auto close after 2 seconds
      setTimeout(() => {
        router.push(`/company/${companyId}/members`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/user-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyId,
          email,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add member");
      }

      // Clear form but stay on page
      setEmail("");
      setError("");
      alert(`Invitation sent to ${email}!`);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add Team Member">
      <Box sx={{ 
        backgroundColor: darkMode ? "#202124" : "#f8f9fa",
        minHeight: "100vh",
        py: 4
      }}>
        <Box sx={{ maxWidth: 600, mx: "auto", px: 3 }}>
          {/* Header */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/dashboard" style={{ textDecoration: "none", color: darkMode ? "#9aa0a6" : "#5f6368" }}>
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Dashboard
            </Link>
            <Link href="/companies" style={{ textDecoration: "none", color: darkMode ? "#9aa0a6" : "#5f6368" }}>
              Companies
            </Link>
            <Link href={`/company/${companyId}`} style={{ textDecoration: "none", color: darkMode ? "#9aa0a6" : "#5f6368" }}>
              {companyName || "Company"}
            </Link>
            <Link href={`/company/${companyId}/members`} style={{ textDecoration: "none", color: darkMode ? "#9aa0a6" : "#5f6368" }}>
              Members
            </Link>
            <Typography color={darkMode ? "#e8eaed" : "#202124"}>
              Add Member
            </Typography>
          </Breadcrumbs>

          {/* Back Button */}
          <IconButton 
            onClick={() => router.back()}
            sx={{ mb: 2, color: darkMode ? "#e8eaed" : "#5f6368" }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Main Card */}
          <Card sx={{
            p: 4,
            backgroundColor: darkMode ? "#202124" : "#ffffff",
            border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            borderRadius: "16px",
          }}>
            <Stack spacing={3}>
              {/* Icon & Title */}
              <Box sx={{ textAlign: "center" }}>
                <Avatar sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: alpha("#4285f4", 0.1),
                  color: "#4285f4",
                  mx: "auto",
                  mb: 2
                }}>
                  <PersonAddIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Add Team Member
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invite someone to join {companyName || "your company"}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }} />

              {/* Success Message */}
              {success && (
                <Alert 
                  severity="success"
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  sx={{ 
                    backgroundColor: alpha("#34a853", 0.1),
                    color: "#34a853",
                    border: `1px solid ${alpha("#34a853", 0.3)}`,
                    "& .MuiAlert-icon": { color: "#34a853" }
                  }}
                >
                  Invitation sent successfully! Redirecting to members page...
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert 
                  severity="error"
                  onClose={() => setError("")}
                  sx={{ 
                    backgroundColor: alpha("#ea4335", 0.1),
                    color: "#ea4335",
                    border: `1px solid ${alpha("#ea4335", 0.3)}`,
                    "& .MuiAlert-icon": { color: "#ea4335" }
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                variant="outlined"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                  },
                }}
              />

              {/* Role Selection */}
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#303134" : "#ffffff",
                  }}
                >
                  <MenuItem value="admin">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AdminIcon sx={{ color: "#fbbc04" }} />
                      <Box>
                        <Typography variant="body2">Admin</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Full access to all settings and members
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="manager">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SecurityIcon sx={{ color: "#34a853" }} />
                      <Box>
                        <Typography variant="body2">Manager</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Can manage members and most settings
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="member">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon sx={{ color: "#4285f4" }} />
                      <Box>
                        <Typography variant="body2">Member</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Can view and edit, cannot manage members
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="viewer">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <VisibilityIcon sx={{ color: "#80868b" }} />
                      <Box>
                        <Typography variant="body2">Viewer</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Read-only access
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Info Box */}
              <Box sx={{
                p: 2,
                backgroundColor: alpha("#4285f4", 0.05),
                borderRadius: "8px",
                border: `1px solid ${alpha("#4285f4", 0.1)}`,
              }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Note:</strong> The user must have an account in the system. 
                  If they don't have an account, ask them to register first at /auth/register.
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.back()}
                  disabled={loading}
                  sx={{ 
                    borderRadius: "8px",
                    height: 48
                  }}
                >
                  Cancel
                </Button>
                <CustomButton
                  fullWidth
                  variant="contained"
                  onClick={handleAddMember}
                  disabled={loading || !email}
                  sx={{ 
                    borderRadius: "8px",
                    height: 48,
                    backgroundColor: "#34a853",
                    "&:hover": { backgroundColor: "#2d9248" }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Invitation"
                  )}
                </CustomButton>
              </Stack>

              {/* Add Another Button */}
              {success && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleAddAnother}
                  startIcon={<PersonAddIcon />}
                  sx={{ mt: 1 }}
                >
                  Add Another Member
                </Button>
              )}
            </Stack>
          </Card>

          {/* Quick Actions */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="text"
              onClick={() => router.push(`/company/${companyId}/members`)}
              startIcon={<PersonIcon />}
            >
              View All Members
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}