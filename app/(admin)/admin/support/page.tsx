"use client";

import React, { useState, useEffect } from 'react';
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
  IconButton,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
} from '@mui/material';
import {
  Support as SupportIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ResolveIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';

interface SupportTicket {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
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
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/support');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load support tickets');
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
      const response = await fetch(`/api/admin/support/${selectedTicket._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (response.ok) {
        setReplyMessage('');
        fetchTickets(); // Refresh tickets
        // Refresh the selected ticket
        const updatedTicket = await response.json();
        setSelectedTicket(updatedTicket.ticket);
      }
    } catch (err) {
      setError('Failed to send reply');
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/support/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchTickets(); // Refresh
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status } as any);
        }
      }
    } catch (err) {
      setError('Failed to update ticket status');
    }
  };

  const getPriorityChip = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Chip label="Urgent" color="error" size="small" icon={<PriorityIcon />} />;
      case 'high':
        return <Chip label="High" color="warning" size="small" />;
      case 'medium':
        return <Chip label="Medium" color="info" size="small" />;
      case 'low':
        return <Chip label="Low" color="success" size="small" />;
      default:
        return <Chip label={priority} size="small" />;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'open':
        return <Chip label="Open" color="primary" size="small" />;
      case 'in-progress':
        return <Chip label="In Progress" color="warning" size="small" />;
      case 'resolved':
        return <Chip label="Resolved" color="success" size="small" icon={<ResolveIcon />} />;
      case 'closed':
        return <Chip label="Closed" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (search && !ticket.subject.toLowerCase().includes(search.toLowerCase()) && 
        !ticket.userName.toLowerCase().includes(search.toLowerCase()) &&
        !ticket.userEmail.toLowerCase().includes(search.toLowerCase())) {
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            <SupportIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Support Tickets
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user support requests
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchTickets}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {tickets.filter(t => t.status === 'open').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open Tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {tickets.filter(t => t.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {tickets.filter(t => t.status === 'resolved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {tickets.filter(t => t.priority === 'urgent').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Urgent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setPriorityFilter('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Support Tickets ({filteredTickets.length})
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Replies</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">No tickets found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket._id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {ticket.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ticket.userEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{ticket.subject}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                          {ticket.message.substring(0, 50)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getPriorityChip(ticket.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(ticket.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {ticket.replies.length}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={() => handleViewTicket(ticket)}
                          startIcon={<ChatIcon />}
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
          setReplyMessage('');
        }}
      />
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
  onClose 
}: any) {
  if (!ticket) return null;

  const handleStatusChange = (status: string) => {
    onUpdateStatus(ticket._id, status);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Support Ticket #{ticket._id.substring(0, 8)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          From: {ticket.userName} ({ticket.userEmail})
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {/* Ticket Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {ticket.subject}
          </Typography>
          <Typography variant="body1" paragraph>
            {ticket.message}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label={`Priority: ${ticket.priority}`} />
            <Chip label={`Status: ${ticket.status}`} />
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Status Actions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Update Status:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {ticket.status !== 'in-progress' && (
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => handleStatusChange('in-progress')}
              >
                Mark as In Progress
              </Button>
            )}
            {ticket.status !== 'resolved' && (
              <Button 
                size="small" 
                variant="outlined" 
                color="success"
                onClick={() => handleStatusChange('resolved')}
              >
                Mark as Resolved
              </Button>
            )}
            {ticket.status !== 'closed' && (
              <Button 
                size="small" 
                variant="outlined" 
                color="default"
                onClick={() => handleStatusChange('closed')}
              >
                Close Ticket
              </Button>
            )}
          </Box>
        </Box>

        {/* Conversation */}
        <Typography variant="subtitle2" gutterBottom>
          Conversation:
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 3 }}>
          {ticket.replies.map((reply: any, index: number) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 1,
                bgcolor: reply.isAdmin ? '#e3f2fd' : '#f5f5f5',
                borderRadius: 1,
                borderLeft: `4px solid ${reply.isAdmin ? '#1976d2' : '#757575'}`,
              }}
            >
              <Typography variant="body2" fontWeight={reply.isAdmin ? 'bold' : 'normal'}>
                {reply.isAdmin ? 'Admin' : ticket.userName}
              </Typography>
              <Typography variant="body1">{reply.message}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(reply.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Reply Box */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Reply to User:
          </Typography>
          <TextareaAutosize
            minRows={3}
            value={replyMessage}
            onChange={(e) => onReplyChange(e.target.value)}
            placeholder="Type your reply here..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              fontSize: '14px',
              marginBottom: '12px',
            }}
          />
          <Button
            variant="contained"
            onClick={onSendReply}
            disabled={!replyMessage.trim()}
            startIcon={<EmailIcon />}
          >
            Send Reply
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}