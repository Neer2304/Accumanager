import { Box, TextField, Button } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import Link from "next/link";

interface EventSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const EventSearch: React.FC<EventSearchProps> = ({ 
  search, 
  onSearchChange 
}) => {
  return (
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
        onChange={(e) => onSearchChange(e.target.value)}
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
  );
};