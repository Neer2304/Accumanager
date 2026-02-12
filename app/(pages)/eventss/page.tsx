"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
  alpha,
  Divider,
  Breadcrumbs,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Avatar,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip as MuiChip,
  Paper,
  Grid
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Videocam as VideoIcon,
  AccessTime as TimeIcon,
  Repeat as RepeatIcon,
  Group as GroupIcon,
  Link as LinkIcon,
  FileCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Import Layout
import { MainLayout } from "@/components/Layout/MainLayout";

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Alert as GoogleAlert } from '@/components/ui/Alert';

// Event Type Config
const EVENT_TYPES = [
  { value: "meeting", label: "Meeting", color: "#4285f4", emoji: "👥" },
  { value: "call", label: "Call", color: "#34a853", emoji: "📞" },
  { value: "demo", label: "Demo", color: "#fbbc04", emoji: "🎯" },
  { value: "training", label: "Training", color: "#9334e6", emoji: "📚" },
  { value: "webinar", label: "Webinar", color: "#ea4335", emoji: "🎥" },
  { value: "holiday", label: "Holiday", color: "#80868b", emoji: "🎉" },
  { value: "lunch", label: "Lunch", color: "#34a853", emoji: "🍽️" },
  { value: "appointment", label: "Appointment", color: "#4285f4", emoji: "📅" },
  { value: "other", label: "Other", color: "#80868b", emoji: "📌" }
];

// Event Status Config
const EVENT_STATUS = [
  { value: "scheduled", label: "Scheduled", color: "#4285f4", emoji: "📅" },
  { value: "ongoing", label: "Ongoing", color: "#fbbc04", emoji: "🔄" },
  { value: "completed", label: "Completed", color: "#34a853", emoji: "✅" },
  { value: "cancelled", label: "Cancelled", color: "#ea4335", emoji: "❌" },
  { value: "rescheduled", label: "Rescheduled", color: "#9334e6", emoji: "🔄" }
];

interface Event {
  _id: string;
  title: string;
  description?: string;
  type: string;
  startDateTime: string;
  endDateTime: string;
  allDay: boolean;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  organizerId: string;
  organizerName: string;
  attendees: Array<{
    userId?: string;
    name: string;
    email: string;
    status: string;
  }>;
  status: string;
  createdAt: string;
}

export default function EventsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Event>('startDateTime');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "meeting",
    startDateTime: new Date().toISOString().slice(0, 16),
    endDateTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    allDay: false,
    location: "",
    isVirtual: false,
    meetingLink: "",
    attendees: [] as string[],
    attendeeEmails: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📡 Fetching events from /api/eventss...");
      
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/eventss?${params.toString()}`, {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events || []);
      
      console.log(`✅ Loaded ${data.events?.length || 0} events`);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [typeFilter, statusFilter]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Select Changes
  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleFormTypeChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, type: event.target.value });
  };

  const handleFormAllDayChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, allDay: event.target.value === 'true' });
  };

  const handleFormVirtualChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, isVirtual: event.target.value === 'true' });
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Event title is required";
    }
    
    if (!formData.startDateTime) {
      errors.startDateTime = "Start date/time is required";
    }
    
    if (!formData.endDateTime) {
      errors.endDateTime = "End date/time is required";
    }
    
    if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      errors.endDateTime = "End time must be after start time";
    }
    
    if (formData.isVirtual && !formData.meetingLink) {
      errors.meetingLink = "Meeting link is required for virtual events";
    }
    
    if (formData.attendeeEmails) {
      const emails = formData.attendeeEmails.split(',').map(e => e.trim());
      const invalidEmails = emails.filter(e => e && !/\S+@\S+\.\S+/.test(e));
      if (invalidEmails.length > 0) {
        errors.attendeeEmails = `Invalid email(s): ${invalidEmails.join(', ')}`;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add event
  const addEvent = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const attendeeList = formData.attendeeEmails
        .split(',')
        .map(e => e.trim())
        .filter(e => e)
        .map(email => ({
          email,
          name: email.split('@')[0],
          status: 'pending'
        }));

      const eventData = {
        ...formData,
        attendees: attendeeList,
        allDay: formData.allDay,
        isVirtual: formData.isVirtual
      };

      const response = await fetch("/api/eventss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add event");
      }

      const newEvent = await response.json();
      setEvents(prev => [newEvent.event, ...prev]);
      
      // Reset form
      setAddDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        type: "meeting",
        startDateTime: new Date().toISOString().slice(0, 16),
        endDateTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        allDay: false,
        location: "",
        isVirtual: false,
        meetingLink: "",
        attendees: [],
        attendeeEmails: ""
      });
      setValidationErrors({});
      
      console.log("✅ Event added successfully");
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update event status
  const updateStatus = async (eventId: string, newStatus: string) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/eventss/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status");

      setEvents(prev => prev.map(event => 
        event._id === eventId ? { ...event, status: newStatus } : event
      ));
      
      if (selectedEvent?._id === eventId) {
        setSelectedEvent({ ...selectedEvent, status: newStatus });
      }
      
      console.log("✅ Status updated");
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete event
  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/eventss/${eventId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete event");

      setEvents(prev => prev.filter(event => event._id !== eventId));
      setDetailDialogOpen(false);
      
      console.log("✅ Event deleted");
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update attendee status
  const updateAttendeeStatus = async (eventId: string, attendeeEmail: string, status: string) => {
    try {
      const response = await fetch(`/api/eventss/${eventId}/attendees`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email: attendeeEmail, status })
      });

      if (!response.ok) throw new Error("Failed to update attendee status");

      fetchEvents();
      console.log("✅ Attendee status updated");
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    }
  };

  // Sorting
  const handleSort = (property: keyof Event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (orderBy === 'startDateTime' || orderBy === 'endDateTime' || orderBy === 'createdAt') {
        return order === 'asc' 
          ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
      }
      
      return order === 'asc'
        ? String(aVal || '').localeCompare(String(bVal || ''))
        : String(bVal || '').localeCompare(String(aVal || ''));
    });
  }, [events, orderBy, order]);

  // Pagination
  const paginatedEvents = sortedEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get event type config
  const getEventType = (type: string) => {
    return EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[EVENT_TYPES.length - 1];
  };

  // Get event status config
  const getEventStatus = (status: string) => {
    return EVENT_STATUS.find(s => s.value === status) || EVENT_STATUS[0];
  };

  // Format date
  const formatEventDate = (event: Event) => {
    if (event.allDay) {
      return new Date(event.startDateTime).toLocaleDateString();
    }
    const start = new Date(event.startDateTime).toLocaleString();
    const end = new Date(event.endDateTime).toLocaleTimeString();
    return `${start} - ${end}`;
  };

  // Loading state
  if (loading && events.length === 0) {
    return (
      <MainLayout title="Event Management">
        <Box sx={{ 
          p: 3, 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: 400,
          gap: 3 
        }}>
          <CircularProgress size={60} thickness={4} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="500" gutterBottom>
              Loading Events
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fetching your calendar events...
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Event Management">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '& a': { color: darkMode ? '#9aa0a6' : '#5f6368' }
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit',
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Events
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              Event Management
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Schedule and manage meetings, calls, and events
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mt: 3,
          }}>
            <Card 
              sx={{ 
                flex: '1 1 calc(25% - 18px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 18px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#4285f4', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Total Events
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4285f4', fontWeight: 600 }}>
                    {events.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#4285f4', 0.1) }}>
                  <CalendarIcon sx={{ color: '#4285f4' }} />
                </Box>
              </Box>
            </Card>

            <Card 
              sx={{ 
                flex: '1 1 calc(25% - 18px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 18px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#fbbc04', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Today's Events
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fbbc04', fontWeight: 600 }}>
                    {events.filter(e => {
                      const today = new Date().toDateString();
                      return new Date(e.startDateTime).toDateString() === today;
                    }).length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#fbbc04', 0.1) }}>
                  <ScheduleIcon sx={{ color: '#fbbc04' }} />
                </Box>
              </Box>
            </Card>

            <Card 
              sx={{ 
                flex: '1 1 calc(25% - 18px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 18px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#34a853', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Upcoming
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#34a853', fontWeight: 600 }}>
                    {events.filter(e => {
                      return e.status === 'scheduled' && new Date(e.startDateTime) > new Date();
                    }).length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#34a853', 0.1) }}>
                  <CheckCircleIcon sx={{ color: '#34a853' }} />
                </Box>
              </Box>
            </Card>

            <Card 
              sx={{ 
                flex: '1 1 calc(25% - 18px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 18px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${alpha('#ea4335', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Virtual Events
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ea4335', fontWeight: 600 }}>
                    {events.filter(e => e.isVirtual).length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: alpha('#ea4335', 0.1) }}>
                  <VideoIcon sx={{ color: '#ea4335' }} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <GoogleAlert
              severity="error"
              title="Error"
              message={error}
              action={
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={fetchEvents}
                >
                  Retry
                </Button>
              }
              sx={{ mb: 3 }}
            />
          )}

          {/* Filters and Actions */}
          <Card
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2
              }}>
                {/* Search */}
                <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery("")}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        },
                      },
                    }}
                  />
                  <IconButton 
                    onClick={fetchEvents}
                    sx={{ 
                      bgcolor: darkMode ? '#303134' : '#f8f9fa',
                      '&:hover': { bgcolor: darkMode ? '#3c4043' : '#f1f3f4' }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>

                {/* Filters */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5,
                  flexWrap: 'wrap'
                }}>
                  <FormControl 
                    size="small" 
                    sx={{ 
                      minWidth: 140,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                      }
                    }}
                  >
                    <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Event Type
                    </InputLabel>
                    <Select
                      value={typeFilter}
                      label="Event Type"
                      onChange={handleTypeFilterChange}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      {EVENT_TYPES.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{type.emoji}</span>
                            {type.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl 
                    size="small" 
                    sx={{ 
                      minWidth: 140,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                      }
                    }}
                  >
                    <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Status
                    </InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={handleStatusFilterChange}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      {EVENT_STATUS.map(status => (
                        <MenuItem key={status.value} value={status.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{status.emoji}</span>
                            {status.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                    sx={{ 
                      borderRadius: '8px',
                      backgroundColor: '#4285f4',
                      '&:hover': { backgroundColor: '#3367d6' },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Add Event
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Events Table */}
          {!isMobile && (
            <Card sx={{ 
              overflow: 'hidden',
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'title'}
                          direction={orderBy === 'title' ? order : 'asc'}
                          onClick={() => handleSort('title')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
                        >
                          Event
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'startDateTime'}
                          direction={orderBy === 'startDateTime' ? order : 'asc'}
                          onClick={() => handleSort('startDateTime')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
                        >
                          Date & Time
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'status'}
                          direction={orderBy === 'status' ? order : 'asc'}
                          onClick={() => handleSort('status')}
                          sx={{
                            color: darkMode ? '#e8eaed' : '#202124',
                            '& .MuiTableSortLabel-icon': {
                              color: darkMode ? '#e8eaed' : '#202124',
                            }
                          }}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Attendees</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedEvents.map((event) => {
                      const eventType = getEventType(event.type);
                      const eventStatus = getEventStatus(event.status);
                      return (
                        <TableRow 
                          key={event._id}
                          hover
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: darkMode ? '#303134' : '#f8f9fa' },
                            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          }}
                          onClick={() => {
                            setSelectedEvent(event);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: alpha(eventType.color, 0.1),
                                  color: eventType.color,
                                  width: 32,
                                  height: 32
                                }}
                              >
                                {eventType.emoji}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                  {event.title}
                                </Typography>
                                {event.description && (
                                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    {event.description.substring(0, 50)}...
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={eventType.label}
                              size="small"
                              sx={{
                                backgroundColor: alpha(eventType.color, 0.1),
                                color: eventType.color,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {formatEventDate(event)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {event.isVirtual ? (
                                <VideoIcon sx={{ fontSize: 14, color: '#ea4335' }} />
                              ) : (
                                <LocationIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              )}
                              <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {event.isVirtual ? 'Virtual' : event.location || 'No location'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={eventStatus.label}
                              size="small"
                              sx={{
                                backgroundColor: alpha(eventStatus.color, 0.1),
                                color: eventStatus.color,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <GroupIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {event.attendees?.length || 0}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                  setDetailDialogOpen(true);
                                }}
                                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAnchorEl(e.currentTarget);
                                  setSelectedEvent(event);
                                }}
                                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                              >
                                <MoreIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={sortedEvents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, p) => setPage(p)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{
                  borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              />
            </Card>
          )}

          {/* Mobile Card View */}
          {isMobile && (
            <Box>
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => {
                  const eventType = getEventType(event.type);
                  const eventStatus = getEventStatus(event.status);
                  return (
                    <Card
                      key={event._id}
                      hover
                      onClick={() => {
                        setSelectedEvent(event);
                        setDetailDialogOpen(true);
                      }}
                      sx={{ 
                        mb: 2,
                        cursor: 'pointer',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: alpha(eventType.color, 0.1),
                                color: eventType.color,
                                width: 40,
                                height: 40
                              }}
                            >
                              {eventType.emoji}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {event.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                Organized by {event.organizerName}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {formatEventDate(event)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {event.isVirtual ? (
                              <VideoIcon sx={{ fontSize: 16, color: '#ea4335' }} />
                            ) : (
                              <LocationIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            )}
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {event.isVirtual ? 'Virtual Meeting' : event.location || 'No location'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GroupIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {event.attendees?.length || 0} attendees
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={eventType.label}
                            size="small"
                            sx={{
                              backgroundColor: alpha(eventType.color, 0.1),
                              color: eventType.color,
                            }}
                          />
                          <Chip
                            label={eventStatus.label}
                            size="small"
                            sx={{
                              backgroundColor: alpha(eventStatus.color, 0.1),
                              color: eventStatus.color,
                            }}
                          />
                        </Box>

                        {event.meetingLink && event.isVirtual && (
                          <Box sx={{ 
                            mt: 1.5, 
                            pt: 1.5, 
                            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
                          }}>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LinkIcon sx={{ fontSize: 12 }} />
                              Meeting link available
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Card>
                  );
                })
              ) : (
                <Card sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  px: 3,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <CalendarIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    No Events Found
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                      ? "No events match your current filters."
                      : "Schedule your first event to get started."}
                  </Typography>
                  {!searchQuery && typeFilter === 'all' && statusFilter === 'all' && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddDialogOpen(true)}
                      sx={{ 
                        backgroundColor: '#4285f4',
                        '&:hover': { backgroundColor: '#3367d6' }
                      }}
                    >
                      Create Your First Event
                    </Button>
                  )}
                </Card>
              )}
            </Box>
          )}

          {/* Mobile Pagination */}
          {isMobile && paginatedEvents.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
            }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Page {page + 1} of {Math.ceil(sortedEvents.length / rowsPerPage) || 1}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(sortedEvents.length / rowsPerPage) - 1}
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Event Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !submitting && setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '16px',
            maxHeight: '90vh',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Create New Event
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Schedule a meeting, call, or appointment
            </Typography>
          </Box>
          <IconButton
            onClick={() => !submitting && setAddDialogOpen(false)}
            disabled={submitting}
            size="small"
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Event Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
              required
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
              }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <FormControl 
                fullWidth 
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              >
                <InputLabel>Event Type *</InputLabel>
                <Select
                  value={formData.type}
                  label="Event Type *"
                  onChange={handleFormTypeChange}
                >
                  {EVENT_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{type.emoji}</span>
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl 
                fullWidth 
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              >
                <InputLabel>All Day</InputLabel>
                <Select
                  value={formData.allDay.toString()}
                  label="All Day"
                  onChange={handleFormAllDayChange}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Start Date & Time *"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                error={!!validationErrors.startDateTime}
                helperText={validationErrors.startDateTime}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              />
              <TextField
                fullWidth
                label="End Date & Time *"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                error={!!validationErrors.endDateTime}
                helperText={validationErrors.endDateTime}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <FormControl 
                fullWidth 
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              >
                <InputLabel>Virtual Event</InputLabel>
                <Select
                  value={formData.isVirtual.toString()}
                  label="Virtual Event"
                  onChange={handleFormVirtualChange}
                >
                  <MenuItem value="false">In Person</MenuItem>
                  <MenuItem value="true">Virtual</MenuItem>
                </Select>
              </FormControl>

              {!formData.isVirtual ? (
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    },
                  }}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Meeting Link *"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  error={!!validationErrors.meetingLink}
                  helperText={validationErrors.meetingLink}
                  placeholder="https://meet.google.com/..."
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    },
                  }}
                />
              )}
            </Box>

            <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Attendees
            </Typography>

            <TextField
              fullWidth
              label="Attendee Emails"
              placeholder="email1@example.com, email2@example.com"
              value={formData.attendeeEmails}
              onChange={(e) => setFormData({ ...formData, attendeeEmails: e.target.value })}
              error={!!validationErrors.attendeeEmails}
              helperText={validationErrors.attendeeEmails || "Separate multiple emails with commas"}
              size="small"
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          gap: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={submitting}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={addEvent}
            disabled={submitting}
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              minWidth: 120,
              backgroundColor: '#4285f4',
              '&:hover': { backgroundColor: '#3367d6' }
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Event"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '16px',
            maxHeight: '90vh',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(getEventType(selectedEvent.type).color, 0.1),
                    color: getEventType(selectedEvent.type).color,
                    width: 48,
                    height: 48
                  }}
                >
                  {getEventType(selectedEvent.type).emoji}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {selectedEvent.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Organized by {selectedEvent.organizerName}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setDetailDialogOpen(false)} size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Event Status */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={getEventType(selectedEvent.type).label}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getEventType(selectedEvent.type).color, 0.1),
                      color: getEventType(selectedEvent.type).color,
                    }}
                  />
                  <Chip
                    label={getEventStatus(selectedEvent.status).label}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getEventStatus(selectedEvent.status).color, 0.1),
                      color: getEventStatus(selectedEvent.status).color,
                    }}
                  />
                  {selectedEvent.allDay && (
                    <Chip
                      label="All Day"
                      size="small"
                      sx={{
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    />
                  )}
                </Box>

                {/* Event Details */}
                <Card sx={{ 
                  p: 2, 
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                    Event Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {formatEventDate(selectedEvent)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {selectedEvent.isVirtual ? (
                        <VideoIcon sx={{ fontSize: 18, color: '#ea4335' }} />
                      ) : (
                        <LocationIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      )}
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedEvent.isVirtual ? 'Virtual Meeting' : selectedEvent.location || 'No location specified'}
                      </Typography>
                    </Box>

                    {selectedEvent.isVirtual && selectedEvent.meetingLink && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon sx={{ fontSize: 18, color: '#4285f4' }} />
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={selectedEvent.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: '#4285f4',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Join Meeting
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => navigator.clipboard.writeText(selectedEvent.meetingLink || '')}
                          sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                        >
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}

                    {selectedEvent.description && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'pre-wrap' }}>
                          {selectedEvent.description}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>

                {/* Attendees */}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <Card sx={{ 
                    p: 2, 
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                      Attendees ({selectedEvent.attendees.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {selectedEvent.attendees.map((attendee, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#4285f4', 0.1), color: '#4285f4' }}>
                              {attendee.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {attendee.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {attendee.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={attendee.status}
                            size="small"
                            sx={{
                              backgroundColor: attendee.status === 'accepted' ? alpha('#34a853', 0.1) :
                                             attendee.status === 'declined' ? alpha('#ea4335', 0.1) :
                                             alpha('#fbbc04', 0.1),
                              color: attendee.status === 'accepted' ? '#34a853' :
                                    attendee.status === 'declined' ? '#ea4335' :
                                    '#fbbc04',
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Card>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ 
              p: 3, 
              gap: 2,
              borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => deleteEvent(selectedEvent._id)}
                  disabled={submitting}
                  sx={{ 
                    borderRadius: '8px',
                    borderColor: '#ea4335',
                    color: '#ea4335',
                    '&:hover': {
                      borderColor: '#d93025',
                      backgroundColor: alpha('#ea4335', 0.1),
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedEvent.status === 'scheduled' && (
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => updateStatus(selectedEvent._id, 'completed')}
                    disabled={submitting}
                    sx={{ 
                      borderRadius: '8px',
                      backgroundColor: '#34a853',
                      '&:hover': { backgroundColor: '#2d9248' }
                    }}
                  >
                    Mark Completed
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => setDetailDialogOpen(false)}
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: '#4285f4',
                    '&:hover': { backgroundColor: '#3367d6' }
                  }}
                >
                  Close
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            setAnchorEl(null);
            setDetailDialogOpen(true);
          }}
          sx={{ gap: 1, py: 1.5, color: darkMode ? '#e8eaed' : '#202124' }}
        >
          <ViewIcon fontSize="small" />
          View Details
        </MenuItem>
        {selectedEvent?.status === 'scheduled' && (
          <MenuItem 
            onClick={() => {
              updateStatus(selectedEvent._id, 'completed');
              setAnchorEl(null);
            }}
            sx={{ gap: 1, py: 1.5, color: darkMode ? '#e8eaed' : '#202124' }}
          >
            <CheckCircleIcon fontSize="small" />
            Mark Completed
          </MenuItem>
        )}
        {selectedEvent?.status === 'scheduled' && (
          <MenuItem 
            onClick={() => {
              updateStatus(selectedEvent._id, 'cancelled');
              setAnchorEl(null);
            }}
            sx={{ gap: 1, py: 1.5, color: '#ea4335' }}
          >
            <CancelIcon fontSize="small" />
            Cancel Event
          </MenuItem>
        )}
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
        <MenuItem 
          onClick={() => {
            deleteEvent(selectedEvent?._id || '');
            setAnchorEl(null);
          }}
          sx={{ gap: 1, py: 1.5, color: '#ea4335' }}
        >
          <DeleteIcon fontSize="small" />
          Delete Event
        </MenuItem>
      </Menu>
    </MainLayout>
  );
}