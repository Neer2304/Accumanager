// app/admin/support/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

import {
  GoogleSupportSkeleton,
  GoogleSupportHeader,
  GoogleSupportStats,
  GoogleSupportFilters,
  GoogleSupportTable,
  GoogleSupportDialog,
  GoogleSupportAlerts,
  SupportTicket,
  SupportStats,
  SupportFilters,
} from "@/components/googleadminsupport";

export default function AdminSupportPage() {
  const router = useRouter();
  const theme = useTheme();
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filters, setFilters] = useState<SupportFilters>({
    search: "",
    status: "",
    priority: "",
  });
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

      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? data.ticket : t)),
      );

      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(data.ticket);
      }

      setSuccess(`Ticket marked as ${status.replace("-", " ")} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update ticket status");
    }
  };

  const handleFilterChange = (key: keyof SupportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
    });
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
      filters.search &&
      !ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) &&
      !ticket.userName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !ticket.userEmail.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status && ticket.status !== filters.status) {
      return false;
    }
    if (filters.priority && ticket.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  const stats: SupportStats = {
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    urgent: tickets.filter((t) => t.priority === "urgent").length,
    total: tickets.length,
  };

  if (loading && tickets.length === 0) {
    return <GoogleSupportSkeleton />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        <GoogleSupportHeader
          onRefresh={fetchTickets}
          loading={loading}
          darkMode={darkMode}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        <GoogleSupportAlerts
          error={error}
          success={success}
          onErrorClose={() => setError(null)}
          onSuccessClose={() => setSuccess(null)}
          darkMode={darkMode}
        />

        <GoogleSupportStats
          stats={stats}
          darkMode={darkMode}
        />

        <GoogleSupportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          darkMode={darkMode}
        />

        <GoogleSupportTable
          tickets={filteredTickets}
          loading={loading}
          filteredCount={filteredTickets.length}
          totalCount={tickets.length}
          onViewTicket={handleViewTicket}
          darkMode={darkMode}
          getPriorityColor={getPriorityColor}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
        />

        <GoogleSupportDialog
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
          getPriorityColor={getPriorityColor}
          getStatusColor={getStatusColor}
        />
      </Container>
    </Box>
  );
}