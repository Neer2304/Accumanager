// app/dashboard/support/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress as MuiCircularProgress,
  TextField as MuiTextField,
} from '@mui/material';
import {
  Home as HomeIcon,
  Support as SupportIcon,
  Send,
  PriorityHigh,
  HelpOutline,
  BugReport,
  Assignment,
  CheckCircle,
  Pending,
  Error,
  AccessTime,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import Google-themed components
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';

// Safe Fade component
const SafeFade = ({ children, ...props }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{children}</>;
  }
  
  return (
    <div style={{ opacity: 1, transition: 'opacity 300ms' }}>
      {children}
    </div>
  );
};

export default function UserSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });
  const [visibleTickets, setVisibleTickets] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/support');
      
      if (!response.ok) {
        // throw new Error('Failed to fetch your tickets');
        null
      }

      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      setError('Subject and message are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Support ticket created successfully! Our team will get back to you soon.');
        setFormData({ subject: '', message: '', category: 'general', priority: 'medium' });
        fetchUserTickets(); // Refresh list
      } else {
        setError(data.message || 'Failed to create ticket');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleTickets(prev => prev + 5);
      setLoadingMore(false);
    }, 500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return <BugReport />;
      case 'feature': return <Assignment />;
      case 'billing': return <Assignment />;
      case 'technical': return <BugReport />;
      default: return <HelpOutline />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#d93025';
      case 'medium': return '#e37400';
      case 'low': return '#0d652d';
      default: return '#5f6368';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#1a73e8';
      case 'pending': return '#e37400';
      case 'resolved': return '#0d652d';
      case 'closed': return '#5f6368';
      default: return '#5f6368';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Error sx={{ fontSize: 14 }} />;
      case 'pending': return <Pending sx={{ fontSize: 14 }} />;
      case 'resolved': return <CheckCircle sx={{ fontSize: 14 }} />;
      case 'closed': return <CheckCircle sx={{ fontSize: 14 }} />;
      default: return <Pending sx={{ fontSize: 14 }} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const displayedTickets = tickets.slice(0, visibleTickets);
  const hasMoreTickets = visibleTickets < tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
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
          p: { xs: 2, sm: 3 },
          borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
          background: darkMode
            ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <SafeFade>
          <Breadcrumbs
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
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
                fontWeight: 400,
                "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
              }}
            >
              <HomeIcon
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "16px", sm: "18px" },
                }}
              />
              Dashboard
            </MuiLink>
            <Typography
              color={darkMode ? "#e8eaed" : "#202124"}
              fontWeight={500}
            >
              Support Center
            </Typography>
          </Breadcrumbs>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Support Center
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Get help, report issues, or request features
            </Typography>
          </Box>
        </SafeFade>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        {/* Stats Cards */}
        <SafeFade>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
            gap: 2, 
            mb: 4,
          }}>
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#1a73e8">
                {tickets.length}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Total Tickets
              </Typography>
            </Card>
            
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#d93025">
                {openTickets}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Open Tickets
              </Typography>
            </Card>
            
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#0d652d">
                {resolvedTickets}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                Resolved
              </Typography>
            </Card>
            
            <Card sx={{ 
              p: 2.5, 
              textAlign: 'center',
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography variant="h4" fontWeight={700} color="#e37400">
                {tickets.filter(t => t.priority === 'high').length}
              </Typography>
              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                High Priority
              </Typography>
            </Card>
          </Box>
        </SafeFade>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}>
          {/* Left Column - Create Ticket */}
          <Box sx={{ flex: { md: 1 } }}>
            <SafeFade>
              <Card
                title="Create New Ticket"
                subtitle="Describe your issue or request in detail"
                hover
                sx={{ mb: 4 }}
              >
                {success && (
                  <Alert
                    severity="success"
                    title="Success"
                    message={success}
                    dismissible
                    onDismiss={() => setSuccess('')}
                    sx={{ mb: 3 }}
                  />
                )}
                
                {error && (
                  <Alert
                    severity="error"
                    title="Error"
                    message={error}
                    dismissible
                    onDismiss={() => setError('')}
                    sx={{ mb: 3 }}
                  />
                )}
                
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Subject */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Subject
                      </Typography>
                      <Input
                        placeholder="Briefly describe your issue"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        disabled={submitting}
                      />
                    </Box>

                    {/* Category and Priority */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2 
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Category
                        </Typography>
                        <Select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          options={[
                            { value: 'general', label: 'General Inquiry' },
                            { value: 'bug', label: 'Bug Report' },
                            { value: 'feature', label: 'Feature Request' },
                            { value: 'billing', label: 'Billing Issue' },
                            { value: 'technical', label: 'Technical Support' },
                          ]}
                          disabled={submitting}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Priority
                        </Typography>
                        <Select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          options={[
                            { value: 'low', label: 'Low Priority' },
                            { value: 'medium', label: 'Medium Priority' },
                            { value: 'high', label: 'High Priority' },
                          ]}
                          disabled={submitting}
                        />
                      </Box>
                    </Box>

                    {/* Message */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Detailed Description
                      </Typography>
                      <MuiTextField
                        fullWidth
                        multiline
                        rows={6}
                        placeholder="Provide detailed information about your issue or request..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        disabled={submitting}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: darkMode ? '#303134' : '#ffffff',
                            '&:hover': {
                              backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                            },
                          },
                        }}
                      />
                      <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mt: 1 }}>
                        Please include steps to reproduce, screenshots if applicable, and any error messages
                      </Typography>
                    </Box>

                    {/* Submit Button */}
                    <Box>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={submitting}
                        iconLeft={submitting ? <MuiCircularProgress size={20} /> : <Send />}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        {submitting ? 'Creating Ticket...' : 'Submit Ticket'}
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Card>
            </SafeFade>
          </Box>

          {/* Right Column - Tickets List */}
          <Box sx={{ flex: { md: 1 } }}>
            <SafeFade>
              <Card
                title="Your Support Tickets"
                subtitle={`${tickets.length} total tickets`}
                hover={false}
                sx={{ mb: 4 }}
              >
                {loading ? (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    p: 6,
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <MuiCircularProgress size={isMobile ? 40 : 60} sx={{ color: '#1a73e8' }} />
                    <Typography variant="body1" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                      Loading your tickets...
                    </Typography>
                  </Box>
                ) : displayedTickets.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    color: darkMode ? "#9aa0a6" : "#5f6368"
                  }}>
                    <SupportIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom sx={{ color: darkMode ? "#e8eaed" : "#202124" }}>
                      No tickets yet
                    </Typography>
                    <Typography variant="body2">
                      Create your first support ticket to get help from our team
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {displayedTickets.map((ticket, index) => (
                      <React.Fragment key={ticket._id}>
                        <Card
                          hover
                          sx={{
                            p: 2.5,
                            borderLeft: `4px solid ${getPriorityColor(ticket.priority)}`,
                            bgcolor: darkMode ? '#303134' : '#ffffff',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: darkMode 
                                ? '0 4px 20px rgba(0,0,0,0.3)' 
                                : '0 4px 20px rgba(0,0,0,0.08)',
                            }
                          }}
                          onClick={() => router.push(`/dashboard/support/${ticket._id}`)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{ 
                                  bgcolor: alpha(getPriorityColor(ticket.priority), 0.1), 
                                  color: getPriorityColor(ticket.priority),
                                  width: 40,
                                  height: 40
                                }}
                              >
                                {getCategoryIcon(ticket.category)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600} color={darkMode ? "#e8eaed" : "#202124"}>
                                  {ticket.subject}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                                    #{ticket.ticketNumber}
                                  </Typography>
                                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: darkMode ? "#5f6368" : "#bdbdbd" }} />
                                  <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                                    {ticket.category}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Chip
                              label={ticket.status}
                              size="small"
                              sx={{
                                bgcolor: alpha(getStatusColor(ticket.status), 0.1),
                                color: getStatusColor(ticket.status),
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 24
                              }}
                              icon={getStatusIcon(ticket.status)}
                            />
                          </Box>

                          <Typography 
                            variant="body2" 
                            color={darkMode ? "#9aa0a6" : "#5f6368"}
                            sx={{ 
                              mb: 2,
                              lineHeight: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {ticket.message}
                          </Typography>

                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 2,
                            borderTop: darkMode ? '1px solid #3c4043' : '1px solid #f0f0f0'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTime sx={{ fontSize: 14, opacity: 0.7 }} />
                              <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                                {formatDate(ticket.createdAt)}
                              </Typography>
                            </Box>
                            <Chip
                              label={ticket.priority}
                              size="small"
                              sx={{
                                bgcolor: alpha(getPriorityColor(ticket.priority), 0.1),
                                color: getPriorityColor(ticket.priority),
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </Box>
                        </Card>
                        {index < displayedTickets.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}

                    {/* Load More Button */}
                    {hasMoreTickets && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mt: 3,
                        mb: 2 
                      }}>
                        <Button
                          variant="outlined"
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          size="medium"
                          sx={{
                            minWidth: 200,
                            borderColor: darkMode ? '#5f6368' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              bgcolor: darkMode ? 'rgba(138, 180, 248, 0.04)' : 'rgba(26, 115, 232, 0.04)',
                            }
                          }}
                        >
                          {loadingMore ? (
                            <>
                              <MuiCircularProgress size={16} sx={{ mr: 1 }} />
                              Loading...
                            </>
                          ) : (
                            `Load More Tickets (${tickets.length - visibleTickets} remaining)`
                          )}
                        </Button>
                      </Box>
                    )}

                    {/* Show when all tickets are loaded */}
                    {!hasMoreTickets && tickets.length > 5 && (
                      <Box sx={{ 
                        textAlign: 'center', 
                        mt: 3, 
                        p: 2,
                        borderRadius: 1,
                        bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      }}>
                        <Typography 
                          variant="body2" 
                          color={darkMode ? "#9aa0a6" : "#5f6368"}
                        >
                          You've viewed all {tickets.length} tickets
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Card>
            </SafeFade>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}