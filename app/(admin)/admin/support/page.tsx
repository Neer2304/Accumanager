"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  Stack,
  Avatar,
  InputAdornment,
  Badge,
  Divider,
} from "@mui/material";
import {
  Support as SupportIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  PriorityHigh as PriorityIcon,
  Person,
  AccessTime,
  Forum,
  FilterList,
  Clear,
  CheckCircle,
  ArrowBack,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Description,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SupportTicket {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  replies: Array<{
    message: string;
    isAdmin: boolean;
    createdAt: string;
  }>;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use real API endpoint
      const response = await fetch("/api/admin/support");

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message || "Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setViewDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const response = await fetch(
        `/api/admin/support/${selectedTicket._id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: replyMessage }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      const data = await response.json();
      setReplyMessage("");
      setSelectedTicket(data.ticket);
      setSuccess("Reply sent successfully!");

      // Refresh tickets list
      fetchTickets();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to send reply");
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket status");
      }

      const data = await response.json();

      // Update in tickets list
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? data.ticket : t)),
      );

      // Update selected ticket if open
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(data.ticket);
      }

      setSuccess(`Ticket marked as ${status.replace("-", " ")} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update ticket status");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#ea4335";
      case "high":
        return "#f57c00";
      case "medium":
        return "#fbbc04";
      case "low":
        return "#34a853";
      default:
        return "#5f6368";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#1a73e8";
      case "in-progress":
        return "#fbbc04";
      case "resolved":
        return "#34a853";
      case "closed":
        return "#5f6368";
      default:
        return "#5f6368";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (
      search &&
      !ticket.subject.toLowerCase().includes(search.toLowerCase()) &&
      !ticket.userName.toLowerCase().includes(search.toLowerCase()) &&
      !ticket.userEmail.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter && ticket.status !== statusFilter) {
      return false;
    }
    if (priorityFilter && ticket.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    urgent: tickets.filter((t) => t.priority === "urgent").length,
    total: tickets.length,
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Button
            component={Link}
            href="/admin/dashboard"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 2,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
              },
            }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: '16px',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <SupportIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography 
                  variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                    lineHeight: 1.2,
                  }}
                >
                  Support Center
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mt: 0.5,
                  }}
                >
                  Manage user inquiries and support requests
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchTickets}
              disabled={loading}
              sx={{
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1669c1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
                },
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                fontWeight: 500,
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #ea4335',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#ea4335' },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #34a853',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#34a853' },
            }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Stats Cards */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 4, flexWrap: "wrap" }}
        >
          <Card sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}>
                  <Forum />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color={darkMode ? '#8ab4f8' : '#1a73e8'}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Total Tickets
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                  color: darkMode ? '#ea4335' : '#ea4335',
                }}>
                  <PriorityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color={darkMode ? '#ea4335' : '#ea4335'}>
                    {stats.urgent}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Urgent Priority
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}>
                  <ChatIcon />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color={darkMode ? '#8ab4f8' : '#1a73e8'}>
                    {stats.open}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Open Tickets
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                  color: darkMode ? '#34a853' : '#34a853',
                }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color={darkMode ? '#34a853' : '#34a853'}>
                    {stats.resolved}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Resolved
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Search and Filters */}
        <Card sx={{ 
          mb: 3, 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 24px rgba(0, 0, 0, 0.05)',
        }}>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
            >
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <TextField
                  fullWidth
                  placeholder="Search tickets by user, subject, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color={darkMode ? "inherit" : "action"} sx={{ 
                          color: darkMode ? '#9aa0a6' : 'inherit'
                        }} />
                      </InputAdornment>
                    ),
                    endAdornment: search && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          onClick={() => setSearch("")}
                          sx={{ color: darkMode ? '#9aa0a6' : 'inherit' }}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      '&:hover': {
                        borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                    '& .MuiInputBase-input': {
                      color: darkMode ? '#e8eaed' : '#202124',
                    },
                  }}
                />
              </Box>

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Button
                  variant={statusFilter === "" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setStatusFilter("")}
                  sx={{
                    backgroundColor: statusFilter === "" ? '#1a73e8' : 'transparent',
                    color: statusFilter === "" ? '#ffffff' : (darkMode ? '#e8eaed' : '#202124'),
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: statusFilter === "" ? '#1669c1' : (darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)'),
                    },
                  }}
                >
                  All Status
                </Button>
                <Button
                  variant={statusFilter === "open" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setStatusFilter("open")}
                  sx={{
                    backgroundColor: statusFilter === "open" ? '#1a73e8' : 'transparent',
                    color: statusFilter === "open" ? '#ffffff' : (darkMode ? '#e8eaed' : '#202124'),
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: statusFilter === "open" ? '#1669c1' : (darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)'),
                    },
                  }}
                >
                  Open
                </Button>
                <Button
                  variant={statusFilter === "in-progress" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setStatusFilter("in-progress")}
                  sx={{
                    backgroundColor: statusFilter === "in-progress" ? '#fbbc04' : 'transparent',
                    color: statusFilter === "in-progress" ? '#202124' : (darkMode ? '#e8eaed' : '#202124'),
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: statusFilter === "in-progress" ? '#e6a800' : (darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)'),
                    },
                  }}
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === "resolved" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setStatusFilter("resolved")}
                  sx={{
                    backgroundColor: statusFilter === "resolved" ? '#34a853' : 'transparent',
                    color: statusFilter === "resolved" ? '#ffffff' : (darkMode ? '#e8eaed' : '#202124'),
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: statusFilter === "resolved" ? '#2d8e47' : (darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)'),
                    },
                  }}
                >
                  Resolved
                </Button>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setPriorityFilter("");
                }}
                size="small"
                sx={{
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              >
                Clear All
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card sx={{ 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 24px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              p: 3, 
              pb: 2, 
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                    Support Tickets
                  </Typography>
                  <Typography
                    variant="body2"
                    color={darkMode ? '#9aa0a6' : '#5f6368'}
                    sx={{ mt: 0.5 }}
                  >
                    {filteredTickets.length} of {tickets.length} tickets
                  </Typography>
                </Box>
                <Badge 
                  badgeContent={stats.open} 
                  color="primary" 
                  showZero
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#1a73e8',
                      color: '#ffffff',
                    }
                  }}
                >
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Open Tickets
                  </Typography>
                </Badge>
              </Stack>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      User
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Subject & Message
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Created
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <CircularProgress />
                        <Typography
                          variant="body2"
                          color={darkMode ? '#9aa0a6' : '#5f6368'}
                          sx={{ mt: 2 }}
                        >
                          Loading support tickets...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <ChatIcon
                          sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }}
                        />
                        <Typography variant="h6" color={darkMode ? '#e8eaed' : '#202124'}>
                          No support tickets found
                        </Typography>
                        <Typography
                          variant="body2"
                          color={darkMode ? '#9aa0a6' : '#5f6368'}
                          sx={{ mt: 1 }}
                        >
                          {search || statusFilter
                            ? "Try changing your search criteria"
                            : "No support requests yet"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket._id}
                        hover
                        sx={{
                          backgroundColor: darkMode ? '#303134' : '#ffffff',
                          '&:hover': { backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4' },
                          cursor: "pointer",
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{ 
                                bgcolor: getPriorityColor(ticket.priority),
                                color: '#ffffff',
                              }}
                            >
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                                {ticket.userName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color={darkMode ? '#9aa0a6' : '#5f6368'}
                              >
                                {ticket.userEmail}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Typography variant="subtitle2" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                            {ticket.subject}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={darkMode ? '#9aa0a6' : '#5f6368'}
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              maxWidth: 400,
                            }}
                          >
                            {ticket.message}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Chip
                            label={ticket.priority}
                            size="small"
                            sx={{
                              bgcolor: `${getPriorityColor(ticket.priority)}20`,
                              color: getPriorityColor(ticket.priority),
                              fontWeight: "bold",
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Chip
                            label={ticket.status.replace("-", " ")}
                            size="small"
                            sx={{
                              bgcolor: `${getStatusColor(ticket.status)}20`,
                              color: getStatusColor(ticket.status),
                              fontWeight: "medium",
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color={darkMode ? '#e8eaed' : '#202124'}>
                              {formatDate(ticket.createdAt)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ChatIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTicket(ticket);
                            }}
                            sx={{
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                              borderColor: darkMode ? '#3c4043' : '#dadce0',
                              borderRadius: '8px',
                              '&:hover': {
                                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Ticket Details Dialog */}
        {selectedTicket && (
          <TicketDetailsDialog
            open={viewDialogOpen}
            ticket={selectedTicket}
            replyMessage={replyMessage}
            onReplyChange={setReplyMessage}
            onSendReply={handleSendReply}
            onUpdateStatus={handleUpdateStatus}
            onClose={() => {
              setViewDialogOpen(false);
              setSelectedTicket(null);
              setReplyMessage("");
            }}
            darkMode={darkMode}
          />
        )}
      </Container>
    </Box>
  );
}

function TicketDetailsDialog({
  open,
  ticket,
  replyMessage,
  onReplyChange,
  onSendReply,
  onUpdateStatus,
  onClose,
  darkMode,
}: any) {
  if (!ticket) return null;

  const handleStatusChange = (status: string) => {
    onUpdateStatus(ticket._id, status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#ea4335";
      case "high":
        return "#f57c00";
      case "medium":
        return "#fbbc04";
      case "low":
        return "#34a853";
      default:
        return "#5f6368";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#1a73e8";
      case "in-progress":
        return "#fbbc04";
      case "resolved":
        return "#34a853";
      case "closed":
        return "#5f6368";
      default:
        return "#5f6368";
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        color: darkMode ? '#e8eaed' : '#202124',
        fontWeight: 500,
        pb: 2,
      }}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight="bold">
            Support Ticket #{ticket._id.substring(0, 8)}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              label={`Priority: ${ticket.priority}`}
              size="small"
              sx={{
                bgcolor: `${getPriorityColor(ticket.priority)}20`,
                color: getPriorityColor(ticket.priority),
                fontWeight: "bold",
                border: 'none',
              }}
            />
            <Chip
              label={`Status: ${ticket.status}`}
              size="small"
              sx={{
                bgcolor: `${getStatusColor(ticket.status)}20`,
                color: getStatusColor(ticket.status),
                fontWeight: "medium",
                border: 'none',
              }}
            />
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {/* User Info */}
          <Card sx={{
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                    {ticket.userName}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    {ticket.userEmail}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={darkMode ? '#9aa0a6' : '#5f6368'}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
                  >
                    <AccessTime fontSize="small" />
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Ticket Content */}
          <Card sx={{
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color={darkMode ? '#8ab4f8' : '#1a73e8'}>
                {ticket.subject}
              </Typography>
              <Typography variant="body1" color={darkMode ? '#e8eaed' : '#202124'} paragraph>
                {ticket.message}
              </Typography>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Paper sx={{ 
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
              Update Status:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {["in-progress", "resolved", "closed"].map(
                (status) =>
                  ticket.status !== status && (
                    <Button
                      key={status}
                      size="small"
                      variant="outlined"
                      onClick={() => handleStatusChange(status)}
                      sx={{ 
                        textTransform: "capitalize",
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      }}
                    >
                      Mark as {status.replace("-", " ")}
                    </Button>
                  ),
              )}
            </Stack>
          </Paper>

          {/* Conversation */}
          {ticket.replies.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                Conversation ({ticket.replies.length} replies):
              </Typography>
              <Stack spacing={2}>
                {ticket.replies.map((reply: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: reply.isAdmin 
                        ? (darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.08)') 
                        : (darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.08)'),
                      borderLeft: `4px solid ${reply.isAdmin 
                        ? (darkMode ? '#8ab4f8' : '#1a73e8') 
                        : (darkMode ? '#9aa0a6' : '#5f6368')}`,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                        {reply.isAdmin ? "📌 Admin" : "👤 User"}
                      </Typography>
                      <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                        {new Date(reply.createdAt).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ mt: 1 }} color={darkMode ? '#e8eaed' : '#202124'}>
                      {reply.message}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Reply Box */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
              Send Reply:
            </Typography>
            <TextareaAutosize
              minRows={4}
              value={replyMessage}
              onChange={(e) => onReplyChange(e.target.value)}
              placeholder="Type your response to the user here..."
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                fontFamily: "inherit",
                fontSize: "14px",
                color: darkMode ? '#e8eaed' : '#202124',
                marginBottom: "12px",
                resize: "vertical",
                transition: "border 0.2s",
              }}
            />
            <Button
              variant="contained"
              onClick={onSendReply}
              disabled={!replyMessage.trim()}
              startIcon={<EmailIcon />}
              sx={{
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1669c1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
                },
                borderRadius: '12px',
                fontWeight: 500,
                px: 3,
              }}
              fullWidth
            >
              Send Reply to User
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Button 
          onClick={onClose}
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
            },
            borderRadius: '8px',
            px: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}