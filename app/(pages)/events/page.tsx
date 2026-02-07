// app/events/page.tsx - UPDATED FOR YOUR INTERFACE
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Breadcrumbs,
  CircularProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  EventGrid,
  EventSearch,
  EventMenu,
  useEvents,
} from "@/components/events";

export default function EventsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [search, setSearch] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Using your existing hook
  const { events, loading, deleteEvent, refetch } = useEvents();

  // Filter logic - UPDATED FOR YOUR INTERFACE
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.type.toLowerCase().includes(search.toLowerCase())
  );

  // Event handlers - KEEPING EXISTING
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    eventId: string
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEvent(eventId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    const success = await deleteEvent(selectedEvent);
    if (success) {
      refetch();
    } else {
      alert("Failed to delete event");
    }
    handleMenuClose();
  };

  const handleRefresh = () => {
    refetch();
  };

  // Stats calculation - UPDATED FOR YOUR INTERFACE
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const ongoingEvents = events.filter(e => e.status === 'ongoing').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalBudget = events.reduce((sum, event) => sum + (event.totalBudget || 0), 0);
  const totalSpent = events.reduce((sum, event) => sum + (event.totalSpent || 0), 0);
  const remainingBudget = totalBudget - totalSpent;

  if (loading) {
    return (
      <MainLayout title="Event Management">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading events...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
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
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
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
              Track and manage all your events and expenses in one place
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label={`${totalEvents} Total Events`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <Chip
              label={`₹${totalBudget.toLocaleString('en-IN')} Budget`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
            {!isOnline && (
              <Chip
                label="Offline Mode"
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                  borderColor: alpha('#fbbc04', 0.3),
                  color: darkMode ? '#fdd663' : '#fbbc04',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header Controls - UPDATED */}
          <Card
            title="Event Management"
            subtitle={`${filteredEvents.length} events • ₹${totalBudget.toLocaleString('en-IN')} total budget`}
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  onClick={() => window.location.href = "/events/add"}
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  Create New Event
                </Button>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            {/* Using your existing EventSearch component */}
            <Box sx={{ mt: 2 }}>
              <EventSearch 
                search={search} 
                onSearchChange={setSearch} 
              />
            </Box>
          </Card>

          {/* Stats Overview - UPDATED FOR YOUR INTERFACE */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Total Events', 
                value: totalEvents, 
                icon: '📅', 
                color: '#4285f4',
                description: 'All events' 
              },
              { 
                title: 'Total Budget', 
                value: `₹${totalBudget.toLocaleString('en-IN')}`, 
                icon: '💰', 
                color: '#34a853',
                description: 'Total allocated' 
              },
              { 
                title: 'Total Spent', 
                value: `₹${totalSpent.toLocaleString('en-IN')}`, 
                icon: '💸', 
                color: '#ea4335',
                description: 'Actual spending' 
              },
              { 
                title: 'Remaining', 
                value: `₹${remainingBudget.toLocaleString('en-IN')}`, 
                icon: '📊', 
                color: '#fbbc04',
                description: 'Budget left' 
              },
              { 
                title: 'Upcoming', 
                value: upcomingEvents, 
                icon: '⏳', 
                color: '#8ab4f8',
                description: 'Scheduled events' 
              },
              { 
                title: 'Ongoing', 
                value: ongoingEvents, 
                icon: '⚡', 
                color: '#81c995',
                description: 'Current events' 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(33.333% - 16px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  borderRadius: '16px', 
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  background: darkMode 
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant="h4"
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 }, 
                      borderRadius: '10px', 
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Using your existing EventGrid component */}
          <EventGrid
            events={filteredEvents}
            loading={loading}
            search={search}
            onMenuOpen={handleMenuOpen}
          />

          {/* Using your existing EventMenu component */}
          <EventMenu
            anchorEl={menuAnchor}
            selectedEvent={selectedEvent}
            onClose={handleMenuClose}
            onDelete={handleDeleteEvent}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}