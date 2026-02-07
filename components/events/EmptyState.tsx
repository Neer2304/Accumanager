// components/events/EmptyState.tsx - UPDATED DESIGN
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import Link from "next/link";

interface EmptyStateProps {
  search: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ search }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
        border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: 2,
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      }}
    >
      {search ? (
        <>
          <SearchIcon
            sx={{
              fontSize: 64,
              color: darkMode ? '#5f6368' : '#9aa0a6',
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search terms
          </Typography>
        </>
      ) : (
        <>
          <AddIcon
            sx={{
              fontSize: 64,
              color: darkMode ? '#5f6368' : '#9aa0a6',
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No events yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first event to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/events/add"
            sx={{ 
              backgroundColor: '#4285f4',
              '&:hover': { backgroundColor: '#3367d6' }
            }}
          >
            Create First Event
          </Button>
        </>
      )}
    </Box>
  );
};