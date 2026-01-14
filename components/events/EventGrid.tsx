import { Box } from "@mui/material";
import { EventCard } from "./EventCard";
import { EventSkeleton } from "./EventSkeleton";
import { EmptyState } from "./EmptyState";
import { Event } from "./EventTypes";

interface EventGridProps {
  events: Event[];
  loading: boolean;
  search: string;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, eventId: string) => void;
}

export const EventGrid: React.FC<EventGridProps> = ({ 
  events, 
  loading, 
  search, 
  onMenuOpen 
}) => {
  if (loading) {
    return <EventSkeleton />;
  }

  if (events.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
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
      {events.map((event) => (
        <EventCard 
          key={event._id} 
          event={event} 
          onMenuOpen={onMenuOpen} 
        />
      ))}
    </Box>
  );
};