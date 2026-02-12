"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Breadcrumbs,
  useTheme,
  alpha,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  Badge,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  ContentCopy as ContentCopyIcon,
  Group as GroupIcon,
  HowToReg as HowToRegIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import Link from "next/link";

import { MainLayout } from "@/components/Layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button as CustomButton } from "@/components/ui/Button";
import { Alert as GoogleAlert } from "@/components/ui/Alert";

interface Member {
  _id: string;
  userId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: "admin" | "manager" | "member" | "viewer";
  status: "active" | "pending" | "inactive" | "suspended";
  joinedAt: string;
  isDefault?: boolean;
  isCurrentUser?: boolean;
  invitedBy?: string;
  invitedByName?: string;
  department?: string;
  jobTitle?: string;
  lastActiveAt?: string;
}

interface Company {
  _id: string;
  name: string;
  legalName?: string;
  email: string;
  industry?: string;
  size?: string;
  subscription?: {
    plan: string;
    seats: number;
    usedSeats: number;
  };
}

// Role Badge Component
const RoleBadge = ({ role }: { role: string }) => {
  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "#fbbc04";
      case "manager":
        return "#34a853";
      case "member":
        return "#4285f4";
      case "viewer":
        return "#80868b";
      default:
        return "#80868b";
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <AdminIcon sx={{ fontSize: 14 }} />;
      case "manager":
        return <SecurityIcon sx={{ fontSize: 14 }} />;
      case "member":
        return <PersonIcon sx={{ fontSize: 14 }} />;
      case "viewer":
        return <VisibilityIcon sx={{ fontSize: 14 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 14 }} />;
    }
  };

  return (
    <Chip
      icon={getRoleIcon()}
      label={role.charAt(0).toUpperCase() + role.slice(1)}
      size="small"
      sx={{
        backgroundColor: alpha(getRoleColor(), 0.1),
        color: getRoleColor(),
        borderColor: alpha(getRoleColor(), 0.3),
        fontWeight: 500,
        "& .MuiChip-icon": {
          color: getRoleColor(),
        },
      }}
    />
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "#34a853";
      case "pending":
        return "#fbbc04";
      case "inactive":
        return "#80868b";
      case "suspended":
        return "#ea4335";
      default:
        return "#80868b";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return <CheckCircleIcon sx={{ fontSize: 14 }} />;
      case "pending":
        return <ScheduleIcon sx={{ fontSize: 14 }} />;
      case "inactive":
        return <BlockIcon sx={{ fontSize: 14 }} />;
      case "suspended":
        return <ClearIcon sx={{ fontSize: 14 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 14 }} />;
    }
  };

  return (
    <Chip
      icon={getStatusIcon()}
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      size="small"
      sx={{
        backgroundColor: alpha(getStatusColor(), 0.1),
        color: getStatusColor(),
        borderColor: alpha(getStatusColor(), 0.3),
        "& .MuiChip-icon": {
          color: getStatusColor(),
        },
      }}
    />
  );
};

export default function CompanyMembersPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [members, setMembers] = useState<Member[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Invite Dialog
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Action Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Role Change Dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("member");
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch company details
      const companiesRes = await fetch("/api/companies", {
        credentials: "include",
      });
      const companiesData = await companiesRes.json();
      const foundCompany = companiesData.companies?.find(
        (c: any) => c._id === companyId,
      );
      setCompany(foundCompany);

      // Fetch members
      const membersRes = await fetch(`/api/companies/${companyId}/members`, {
        credentials: "include",
      });

      if (membersRes.status === 403) {
        // User doesn't have access - add yourself!
        setError(
          'You are not a member of this company. Click "Add Me as Member" button below.',
        );
        setMembers([]);
        setLoading(false);
        return;
      }

      if (!membersRes.ok) {
        throw new Error("Failed to fetch members");
      }

      const membersData = await membersRes.json();
      setMembers(membersData.members || []);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to add yourself
  const addMyselfAsMember = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/debug/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyId }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Added you as a member! Refreshing...");
        setTimeout(() => {
          fetchData();
        }, 1500);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      setInviteError("Email is required");
      return;
    }

    if (!inviteEmail.includes("@")) {
      setInviteError("Please enter a valid email address");
      return;
    }

    try {
      setInviteLoading(true);
      setInviteError(null);
      setInviteSuccess(false);

      const response = await fetch("/api/user-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyId,
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      setInviteSuccess(true);
      setInviteEmail("");

      // Refresh members list
      await fetchData();

      setTimeout(() => {
        setInviteDialog(false);
        setInviteSuccess(false);
      }, 2000);
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const response = await fetch(
        `/api/companies/${companyId}/members?userId=${selectedMember.userId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove member");
      }

      setSuccessMessage(`Member removed successfully`);

      // Refresh members list
      await fetchData();

      setDeleteDialogOpen(false);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedMember) return;

    try {
      setRoleLoading(true);
      setRoleError(null);

      const response = await fetch(
        `/api/companies/${companyId}/members?userId=${selectedMember.userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: newRole }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setSuccessMessage(`Role updated to ${newRole}`);

      // Refresh members list
      await fetchData();

      setRoleDialogOpen(false);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setRoleError(err.message);
    } finally {
      setRoleLoading(false);
    }
  };

  const handleResendInvitation = async () => {
    if (!selectedMember) return;

    try {
      setInviteLoading(true);

      const response = await fetch("/api/user-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyId,
          email: selectedMember.user.email,
          role: selectedMember.role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend invitation");
      }

      setSuccessMessage(`Invitation resent to ${selectedMember.user.email}`);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInviteLoading(false);
      setAnchorEl(null);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite?company=${companyId}&email=${selectedMember?.user.email}`;
    navigator.clipboard.writeText(inviteLink);

    setSuccessMessage("Invitation link copied to clipboard");

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    setAnchorEl(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    member: Member,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const openRoleDialog = (member: Member) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setRoleDialogOpen(true);
    handleMenuClose();
  };

  const openDeleteDialog = (member: Member) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const getActiveMembers = () => members.filter((m) => m.status === "active");
  const getPendingMembers = () => members.filter((m) => m.status === "pending");
  const getInactiveMembers = () =>
    members.filter((m) => m.status === "inactive" || m.status === "suspended");

  const activeCount = getActiveMembers().length;
  const pendingCount = getPendingMembers().length;
  const totalSeats = company?.subscription?.seats || 5;
  const usedSeats = company?.subscription?.usedSeats || activeCount;

  if (loading) {
    return (
      <MainLayout title="Loading...">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!company) {
    return (
      <MainLayout title="Company Not Found">
        <Box sx={{ textAlign: "center", py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: "#9aa0a6", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Company Not Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            The company you are looking for does not exist.
          </Typography>
          <Button variant="contained" onClick={() => router.push("/companies")}>
            View Companies
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // If no members yet, assume current user is admin
  const isAdmin =
    members.length === 0
      ? true
      : members.find((m) => m.isCurrentUser)?.role === "admin";
  const isManager =
    members.length === 0
      ? false
      : members.find((m) => m.isCurrentUser)?.role === "manager";
  const canManageMembers = members.length === 0 || isAdmin || isManager;

  return (
    <MainLayout title={`${company.name} - Members`}>
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#f8f9fa",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link
                href="/dashboard"
                style={{
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Link>
              <Link
                href="/companies"
                style={{
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                }}
              >
                Companies
              </Link>
              <Link
                href={`/company/${companyId}`}
                style={{
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                }}
              >
                {company.name}
              </Link>
              <Typography color={darkMode ? "#e8eaed" : "#202124"}>
                Members
              </Typography>
            </Breadcrumbs>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={() => router.back()}
                  sx={{ color: darkMode ? "#e8eaed" : "#5f6368" }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box>
                  <Typography variant="h5" fontWeight={500}>
                    Team Members
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage who has access to {company.name}
                  </Typography>
                </Box>
              </Box>

              {canManageMembers && (
                <CustomButton
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setInviteDialog(true)}
                  sx={{ borderRadius: "8px" }}
                >
                  Invite Member
                </CustomButton>
              )}
            </Box>
          </Box>

          {/* Success/Error Messages */}
          {successMessage && (
            <GoogleAlert
              severity="success"
              message={successMessage}
              sx={{ mb: 3 }}
              onClose={() => setSuccessMessage(null)}
            />
          )}

          {error && (
            <GoogleAlert
              severity="error"
              message={error}
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            />
          )}

          {/* Stats Cards */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ mb: 4 }}
          >
            <Card
              sx={{
                flex: 1,
                p: 2.5,
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{ bgcolor: alpha("#4285f4", 0.1), width: 48, height: 48 }}
                >
                  <GroupIcon sx={{ color: "#4285f4" }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{ color: "#4285f4" }}
                  >
                    {activeCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Members
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Card
              sx={{
                flex: 1,
                p: 2.5,
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{ bgcolor: alpha("#fbbc04", 0.1), width: 48, height: 48 }}
                >
                  <ScheduleIcon sx={{ color: "#fbbc04" }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{ color: "#fbbc04" }}
                  >
                    {pendingCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Invitations
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Card
              sx={{
                flex: 1,
                p: 2.5,
                backgroundColor: darkMode ? "#303134" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{ bgcolor: alpha("#34a853", 0.1), width: 48, height: 48 }}
                >
                  <HowToRegIcon sx={{ color: "#34a853" }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{ color: "#34a853" }}
                  >
                    {usedSeats}/{totalSeats}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seats Used
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Stack>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab
                label={
                  <Badge
                    badgeContent={activeCount}
                    color="primary"
                    sx={{ "& .MuiBadge-badge": { right: -8 } }}
                  >
                    Active Members
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={pendingCount}
                    color="warning"
                    sx={{ "& .MuiBadge-badge": { right: -8 } }}
                  >
                    Pending
                  </Badge>
                }
              />
              <Tab label="Inactive" />
            </Tabs>
          </Box>

          {/* Active Members Tab */}
          {tabValue === 0 && (
            <Card
              sx={{
                backgroundColor: darkMode ? "#202124" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{ backgroundColor: darkMode ? "#303134" : "#f8f9fa" }}
                  >
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Last Active</TableCell>
                      {canManageMembers && (
                        <TableCell align="right">Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getActiveMembers().length > 0 ? (
                      getActiveMembers().map((member) => (
                        <TableRow key={member._id} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha("#4285f4", 0.1),
                                  color: "#4285f4",
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                {member.user?.name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </Avatar>
                              <Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body1" fontWeight={500}>
                                    {member.user?.name || "Unknown User"}
                                  </Typography>
                                  {member.isCurrentUser && (
                                    <Chip
                                      label="You"
                                      size="small"
                                      sx={{
                                        height: 20,
                                        backgroundColor: alpha("#4285f4", 0.1),
                                        color: "#4285f4",
                                      }}
                                    />
                                  )}
                                  {member.isDefault && (
                                    <Chip
                                      label="Default"
                                      size="small"
                                      sx={{
                                        height: 20,
                                        backgroundColor: alpha("#34a853", 0.1),
                                        color: "#34a853",
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {member.user?.email}
                                </Typography>
                                {member.jobTitle && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {member.jobTitle}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={member.role} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={member.status} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              by {member.invitedByName || "System"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {member.lastActiveAt ? (
                              <Typography variant="body2">
                                {new Date(
                                  member.lastActiveAt,
                                ).toLocaleDateString()}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Never
                              </Typography>
                            )}
                          </TableCell>
                          {canManageMembers && (
                            <TableCell align="right">
                              {!member.isCurrentUser && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleMenuOpen(e, member)}
                                  sx={{
                                    color: darkMode ? "#9aa0a6" : "#5f6368",
                                  }}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={canManageMembers ? 6 : 5}
                          align="center"
                          sx={{ py: 6 }}
                        >
                          <GroupIcon
                            sx={{ fontSize: 48, color: "#9aa0a6", mb: 2 }}
                          />
                          <Typography variant="h6" gutterBottom>
                            No Active Members
                          </Typography>
                          <Typography color="text.secondary">
                            {canManageMembers
                              ? "Invite team members to start collaborating"
                              : "No active members in this company"}
                          </Typography>
                          {canManageMembers && (
                            <Button
                              variant="contained"
                              startIcon={<PersonAddIcon />}
                              onClick={() => setInviteDialog(true)}
                              sx={{ mt: 2 }}
                            >
                              Invite Member
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {/* Pending Invitations Tab */}
          {tabValue === 1 && (
            <Card
              sx={{
                backgroundColor: darkMode ? "#202124" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{ backgroundColor: darkMode ? "#303134" : "#f8f9fa" }}
                  >
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Invited By</TableCell>
                      <TableCell>Invited On</TableCell>
                      {canManageMembers && (
                        <TableCell align="right">Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getPendingMembers().length > 0 ? (
                      getPendingMembers().map((member) => (
                        <TableRow key={member._id} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <EmailIcon
                                sx={{ fontSize: 20, color: "#fbbc04" }}
                              />
                              <Typography variant="body2">
                                {member.user?.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={member.role} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {member.invitedByName || "System"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          {canManageMembers && (
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, member)}
                                sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={canManageMembers ? 5 : 4}
                          align="center"
                          sx={{ py: 6 }}
                        >
                          <ScheduleIcon
                            sx={{ fontSize: 48, color: "#9aa0a6", mb: 2 }}
                          />
                          <Typography variant="h6" gutterBottom>
                            No Pending Invitations
                          </Typography>
                          <Typography color="text.secondary">
                            No pending invitations at the moment
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {/* Inactive Members Tab */}
          {tabValue === 2 && (
            <Card
              sx={{
                backgroundColor: darkMode ? "#202124" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{ backgroundColor: darkMode ? "#303134" : "#f8f9fa" }}
                  >
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Active</TableCell>
                      {canManageMembers && (
                        <TableCell align="right">Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getInactiveMembers().length > 0 ? (
                      getInactiveMembers().map((member) => (
                        <TableRow key={member._id} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha("#80868b", 0.1),
                                  color: "#80868b",
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                {member.user?.name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {member.user?.name || "Unknown User"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {member.user?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={member.role} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={member.status} />
                          </TableCell>
                          <TableCell>
                            {member.lastActiveAt ? (
                              <Typography variant="body2">
                                {new Date(
                                  member.lastActiveAt,
                                ).toLocaleDateString()}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Never
                              </Typography>
                            )}
                          </TableCell>
                          {canManageMembers && (
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, member)}
                                sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={canManageMembers ? 5 : 4}
                          align="center"
                          sx={{ py: 6 }}
                        >
                          <BlockIcon
                            sx={{ fontSize: 48, color: "#9aa0a6", mb: 2 }}
                          />
                          <Typography variant="h6" gutterBottom>
                            No Inactive Members
                          </Typography>
                          <Typography color="text.secondary">
                            All team members are active
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Box>
      </Box>

      {/* Invite Member Dialog */}
      <Dialog
        open={inviteDialog}
        onClose={() => !inviteLoading && setInviteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            backgroundColor: darkMode ? "#202124" : "#ffffff",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddIcon sx={{ color: "#4285f4" }} />
            <Typography variant="h6">Invite Team Member</Typography>
          </Box>
          <IconButton
            onClick={() => setInviteDialog(false)}
            disabled={inviteLoading}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {inviteSuccess ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: "#34a853", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Invitation Sent!
              </Typography>
              <Typography color="text.secondary">
                An invitation has been sent to {inviteEmail}
              </Typography>
            </Box>
          ) : (
            <Box>
              {inviteError && (
                <GoogleAlert
                  severity="error"
                  message={inviteError}
                  sx={{ mb: 3 }}
                  onClose={() => setInviteError(null)}
                />
              )}

              <Typography variant="body2" sx={{ mb: 2 }}>
                Invite a new member to join <strong>{company?.name}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon
                        sx={{
                          fontSize: 18,
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={inviteRole}
                  label="Role"
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <MenuItem value="admin">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AdminIcon sx={{ fontSize: 18, color: "#fbbc04" }} />
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
                      <SecurityIcon sx={{ fontSize: 18, color: "#34a853" }} />
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
                      <PersonIcon sx={{ fontSize: 18, color: "#4285f4" }} />
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
                      <VisibilityIcon sx={{ fontSize: 18, color: "#80868b" }} />
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

              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha("#4285f4", 0.05),
                  borderRadius: 1,
                  border: `1px solid ${alpha("#4285f4", 0.1)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  The user will receive an email invitation to join{" "}
                  {company?.name}. They must have an account to accept the
                  invitation.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
          }}
        >
          {!inviteSuccess ? (
            <>
              <Button
                onClick={() => setInviteDialog(false)}
                disabled={inviteLoading}
              >
                Cancel
              </Button>
              <CustomButton
                variant="contained"
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail}
              >
                {inviteLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Send Invitation"
                )}
              </CustomButton>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => setInviteDialog(false)}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            backgroundColor: darkMode ? "#202124" : "#ffffff",
            border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            minWidth: 200,
          },
        }}
      >
        {selectedMember?.status === "pending" ? (
          <>
            <MenuItem onClick={handleResendInvitation} disabled={inviteLoading}>
              <ListItemIcon>
                <RefreshIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Resend Invitation</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleCopyInviteLink}>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy Invite Link</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => openDeleteDialog(selectedMember)}
              sx={{ color: "#ea4335" }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: "#ea4335" }} />
              </ListItemIcon>
              <ListItemText>Cancel Invitation</ListItemText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => openRoleDialog(selectedMember!)}>
              <ListItemIcon>
                <SecurityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Change Role</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => openDeleteDialog(selectedMember!)}
              sx={{ color: "#ea4335" }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: "#ea4335" }} />
              </ListItemIcon>
              <ListItemText>Remove Member</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Role Change Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => !roleLoading && setRoleDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Member Role</DialogTitle>
        <DialogContent>
          {roleError && (
            <GoogleAlert severity="error" message={roleError} sx={{ mb: 2 }} />
          )}
          <Typography variant="body2" sx={{ mb: 2 }}>
            Change role for <strong>{selectedMember?.user?.name}</strong>
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>New Role</InputLabel>
            <Select
              value={newRole}
              label="New Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRoleDialogOpen(false)}
            disabled={roleLoading}
          >
            Cancel
          </Button>
          <CustomButton
            variant="contained"
            onClick={handleRoleChange}
            disabled={roleLoading || newRole === selectedMember?.role}
          >
            {roleLoading ? <CircularProgress size={24} /> : "Update Role"}
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DeleteIcon sx={{ color: "#ea4335" }} />
          {selectedMember?.status === "pending"
            ? "Cancel Invitation"
            : "Remove Member"}
        </DialogTitle>
        <DialogContent>
          {deleteError && (
            <GoogleAlert
              severity="error"
              message={deleteError}
              sx={{ mb: 2 }}
            />
          )}
          <Typography variant="body2">
            {selectedMember?.status === "pending"
              ? `Are you sure you want to cancel the invitation for ${selectedMember?.user?.email}?`
              : `Are you sure you want to remove ${selectedMember?.user?.name} from ${company?.name}?`}
          </Typography>
          {selectedMember?.status !== "pending" && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mt: 2 }}
            >
              This action cannot be undone. The member will lose access to all
              company resources.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <CustomButton
            variant="contained"
            onClick={handleRemoveMember}
            disabled={deleteLoading}
            sx={{
              backgroundColor: "#ea4335",
              "&:hover": { backgroundColor: "#d93025" },
            }}
          >
            {deleteLoading ? (
              <CircularProgress size={24} />
            ) : selectedMember?.status === "pending" ? (
              "Cancel Invitation"
            ) : (
              "Remove Member"
            )}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
