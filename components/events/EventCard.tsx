import { Card, CardContent, Typography, Box, Chip, Button, IconButton } from "@mui/material";
import { CalendarMonth as CalendarIcon, AccountBalanceWallet as WalletIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import Link from "next/link";
import { Event } from "./EventTypes";

interface EventCardProps {
  event: Event;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, eventId: string) => void;
}

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

export const EventCard: React.FC<EventCardProps> = ({ event, onMenuOpen }) => {
  const budgetPercentage = event.totalBudget > 0 
    ? Math.round((event.totalSpent / event.totalBudget) * 100)
    : 0;

  return (
    <Card
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
          onClick={(e) => onMenuOpen(e, event._id)}
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
                {budgetPercentage}%
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
                  width: `${Math.min(budgetPercentage, 100)}%`,
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
  );
};