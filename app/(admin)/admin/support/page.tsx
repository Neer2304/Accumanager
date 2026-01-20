"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  Stack,
  Avatar,
  IconButton,
  InputAdornment,
  Badge,
  Divider,
} from "@mui/material";
import {
  Support as SupportIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ResolveIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  PriorityHigh as PriorityIcon,
  Person,
  AccessTime,
  Forum,
  FilterList,
  Clear,
  CheckCircle,
} from "@mui/icons-material";

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
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      setError("");

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

      // Refresh tickets list
      fetchTickets();
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
    } catch (err: any) {
      setError(err.message || "Failed to update ticket status");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#ea580c";
      case "medium":
        return "#2563eb";
      case "low":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#3b82f6";
      case "in-progress":
        return "#f59e0b";
      case "resolved":
        return "#10b981";
      case "closed":
        return "#6b7280";
      default:
        return "#6b7280";
    }
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <SupportIcon sx={{ fontSize: 36 }} />
            Support Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user inquiries and support requests
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchTickets}
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError("")}
          action={
            <Button color="inherit" size="small" onClick={fetchTickets}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards - Using Stack instead of Grid */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 4, flexWrap: "wrap" }}
      >
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#3b82f620", color: "#3b82f6" }}>
                <Forum />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" color="#3b82f6">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tickets
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#dc262620", color: "#dc2626" }}>
                <PriorityIcon />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" color="#dc2626">
                  {stats.urgent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Urgent Priority
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#3b82f620", color: "#3b82f6" }}>
                <ChatIcon />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" color="#3b82f6">
                  {stats.open}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open Tickets
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#10b98120", color: "#10b981" }}>
                <CheckCircle />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" color="#10b981">
                  {stats.resolved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolved
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
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
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch("")}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Button
                variant={statusFilter === "" ? "contained" : "outlined"}
                size="small"
                onClick={() => setStatusFilter("")}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === "open" ? "contained" : "outlined"}
                color="primary"
                size="small"
                onClick={() => setStatusFilter("open")}
              >
                Open
              </Button>
              <Button
                variant={
                  statusFilter === "in-progress" ? "contained" : "outlined"
                }
                color="warning"
                size="small"
                onClick={() => setStatusFilter("in-progress")}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === "resolved" ? "contained" : "outlined"}
                color="success"
                size="small"
                onClick={() => setStatusFilter("resolved")}
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
            >
              Clear All
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                Support Tickets
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  ({filteredTickets.length} of {tickets.length})
                </Typography>
              </Typography>
              <Badge badgeContent={stats.open} color="primary" showZero>
                <Typography variant="body2" color="text.secondary">
                  Open Tickets
                </Typography>
              </Badge>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "action.hover" }}>
                  <TableCell width="250">User</TableCell>
                  <TableCell>Subject & Message</TableCell>
                  <TableCell width="120">Priority</TableCell>
                  <TableCell width="120">Status</TableCell>
                  <TableCell width="120">Created</TableCell>
                  <TableCell width="100" align="right">
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
                        color="text.secondary"
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
                        sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        No support tickets found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
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
                        "&:hover": { backgroundColor: "action.hover" },
                        cursor: "pointer",
                      }}
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{ bgcolor: getPriorityColor(ticket.priority) }}
                          >
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {ticket.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {ticket.userEmail}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {ticket.subject}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
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
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            bgcolor: `${getPriorityColor(ticket.priority)}20`,
                            color: getPriorityColor(ticket.priority),
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(ticket.status)}20`,
                            color: getStatusColor(ticket.status),
                            fontWeight: "medium",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="caption">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(ticket.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ChatIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTicket(ticket);
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
        />
      )}
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
}: any) {
  if (!ticket) return null;

  const handleStatusChange = (status: string) => {
    onUpdateStatus(ticket._id, status);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight="bold">
            Support Ticket #{ticket._id.substring(0, 8)}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`Priority: ${ticket.priority}`}
              size="small"
              sx={{
                bgcolor: `${getPriorityColor(ticket.priority)}20`,
                color: getPriorityColor(ticket.priority),
                fontWeight: "bold",
              }}
            />
            <Chip
              label={`Status: ${ticket.status}`}
              size="small"
              sx={{
                bgcolor: `${getStatusColor(ticket.status)}20`,
                color: getStatusColor(ticket.status),
                fontWeight: "medium",
              }}
            />
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* User Info */}
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {ticket.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.userEmail}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <AccessTime fontSize="small" />
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Ticket Content */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                {ticket.subject}
              </Typography>
              <Typography variant="body1" paragraph>
                {ticket.message}
              </Typography>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
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
                      // color={
                      //   status === 'in-progress' ? 'warning' :
                      //   status === 'resolved' ? 'success' : 'default'
                      // }
                      onClick={() => handleStatusChange(status)}
                      sx={{ textTransform: "capitalize" }}
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
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Conversation ({ticket.replies.length} replies):
              </Typography>
              <Stack spacing={2}>
                {ticket.replies.map((reply: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: reply.isAdmin ? "#e3f2fd" : "#f5f5f5",
                      borderLeft: `4px solid ${reply.isAdmin ? "#1976d2" : "#757575"}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {reply.isAdmin ? "📌 Admin" : "👤 User"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(reply.createdAt).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {reply.message}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Reply Box */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
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
                borderRadius: "8px",
                border: "2px solid #e5e7eb",
                fontFamily: "inherit",
                fontSize: "14px",
                marginBottom: "12px",
                resize: "vertical",
                transition: "border 0.2s",
                // '&:focus': {
                //   outline: 'none',
                //   borderColor: '#667eea',
                // }
              }}
            />
            <Button
              variant="contained"
              onClick={onSendReply}
              disabled={!replyMessage.trim()}
              startIcon={<EmailIcon />}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                },
              }}
              fullWidth
            >
              Send Reply to User
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// Helper functions moved outside
function getPriorityColor(priority: string) {
  switch (priority) {
    case "urgent":
      return "#dc2626";
    case "high":
      return "#ea580c";
    case "medium":
      return "#2563eb";
    case "low":
      return "#16a34a";
    default:
      return "#6b7280";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "#3b82f6";
    case "in-progress":
      return "#f59e0b";
    case "resolved":
      return "#10b981";
    case "closed":
      return "#6b7280";
    default:
      return "#6b7280";
  }
}
