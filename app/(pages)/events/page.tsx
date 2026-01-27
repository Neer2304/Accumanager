"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import {
  EventGrid,
  EventSearch,
  EventMenu,
  useEvents,
} from "@/components/events";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const { events, loading, deleteEvent, refetch } = useEvents();

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.type.toLowerCase().includes(search.toLowerCase())
  );

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
      refetch(); // Refresh the events list
    } else {
      alert("Failed to delete event");
    }
    handleMenuClose();
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <MainLayout title="Event Management">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header - Same style as other pages */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Dashboard
          </Button>

          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Events</Typography>
          </Breadcrumbs>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Event Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage all your events and expenses in one place
              </Typography>
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {!isOnline && (
                <Chip 
                  label="Offline Mode" 
                  size="small" 
                  color="warning" 
                  variant="outlined"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              )}
              {/* Add other chips if needed */}
            </Stack>
          </Box>
        </Box>

        {/* Your existing components */}
        <EventSearch 
          search={search} 
          onSearchChange={setSearch} 
        />

        <EventGrid
          events={filteredEvents}
          loading={loading}
          search={search}
          onMenuOpen={handleMenuOpen}
        />

        <EventMenu
          anchorEl={menuAnchor}
          selectedEvent={selectedEvent}
          onClose={handleMenuClose}
          onDelete={handleDeleteEvent}
        />
      </Container>
    </MainLayout>
  );
}