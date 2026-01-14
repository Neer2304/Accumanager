"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";
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

  return (
    <MainLayout title="Event Management">
      <Container maxWidth="lg" sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Event Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your events and expenses in one place
          </Typography>
        </Box>

        {/* Search and Add Button */}
        <EventSearch 
          search={search} 
          onSearchChange={setSearch} 
        />

        {/* Events Grid */}
        <EventGrid
          events={filteredEvents}
          loading={loading}
          search={search}
          onMenuOpen={handleMenuOpen}
        />

        {/* Context Menu */}
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