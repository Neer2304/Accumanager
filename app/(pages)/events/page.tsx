// app/events/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

interface Event {
  _id: string;
  name: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalSpent: number;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/events", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

    try {
      const res = await fetch(`/api/events/${selectedEvent}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setEvents(events.filter((event) => event._id !== selectedEvent));
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    } finally {
      handleMenuClose();
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      marriage: "#ff6b6b",
      business: "#4ecdc4",
      personal: "#45b7d1",
      travel: "#96ceb4",
      festival: "#feca57",
      other: "#778ca3",
    };
    return colors[type] || "#778ca3";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      planning: "#ff9f43",
      active: "#2ecc71",
      completed: "#3498db",
      cancelled: "#e74c3c",
    };
    return colors[status] || "#95a5a6";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <MainLayout title="Event Management">
      <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            sx={{
              flex: 1,
              maxWidth: 400,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            size="small"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/events/add"
            sx={{ borderRadius: 2 }}
          >
            Create New Event
          </Button>
        </Box>

        {/* Events Grid */}
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
              gap: 3,
            }}
          >
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Card
                  key={index}
                  sx={{ borderRadius: 2, animation: "pulse 2s infinite" }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        height: 24,
                        bgcolor: "grey.300",
                        borderRadius: 1,
                        mb: 2,
                      }}
                    />
                    <Box
                      sx={{
                        height: 16,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        mb: 1,
                        width: "80%",
                      }}
                    />
                    <Box
                      sx={{
                        height: 16,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        width: "60%",
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
              gap: 3,
            }}
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card
                  key={event._id}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, position: "relative" }}>
                    {/* Menu Button */}
                    <IconButton
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={(e) => handleMenuOpen(e, event._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>

                    {/* Event Type Chip */}
                    <Chip
                      label={event.type}
                      size="small"
                      sx={{
                        bgcolor: getEventTypeColor(event.type),
                        color: "white",
                        mb: 2,
                        textTransform: "capitalize",
                      }}
                    />

                    {/* Event Name */}
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {event.name}
                    </Typography>

                    {/* Event Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, minHeight: 40 }}
                    >
                      {event.description || "No description"}
                    </Typography>

                    {/* Date */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.startDate)} -{" "}
                        {formatDate(event.endDate)}
                      </Typography>
                    </Box>

                    {/* Budget and Spent */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <WalletIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        Spent:{" "}
                        <strong>₹{event.totalSpent.toLocaleString()}</strong>
                        {event.totalBudget > 0 &&
                          ` / Budget: ₹${event.totalBudget.toLocaleString()}`}
                      </Typography>
                    </Box>

                    {/* Progress Bar */}
                    {event.totalBudget > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="caption">
                            {Math.round(
                              (event.totalSpent / event.totalBudget) * 100
                            )}
                            %
                          </Typography>
                          <Typography variant="caption">
                            ₹{event.totalSpent.toLocaleString()} / ₹
                            {event.totalBudget.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: 6,
                            bgcolor: "grey.200",
                            borderRadius: 3,
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min(
                                (event.totalSpent / event.totalBudget) * 100,
                                100
                              )}%`,
                              height: "100%",
                              bgcolor:
                                event.totalSpent > event.totalBudget
                                  ? "error.main"
                                  : "primary.main",
                              borderRadius: 3,
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Status and View Button */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={event.status}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: getStatusColor(event.status),
                          color: getStatusColor(event.status),
                          textTransform: "capitalize",
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        href={`/events/${event._id}`}
                        sx={{ textDecoration: "none" }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No events found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {search
                    ? "Try adjusting your search terms"
                    : "Create your first event to get started"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/events/add"
                >
                  Create New Event
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
            component={Link}
            href={`/events/${selectedEvent}/edit`}
            onClick={handleMenuClose}
          >
            Edit Event
          </MenuItem>
          <MenuItem onClick={handleDeleteEvent} sx={{ color: "error.main" }}>
            Delete Event
          </MenuItem>
        </Menu>
      </Box>
    </MainLayout>
  );
}
