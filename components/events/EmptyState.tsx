import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Link from "next/link";

interface EmptyStateProps {
  search: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ search }) => {
  return (
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
  );
};