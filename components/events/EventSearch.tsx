// components/events/EventSearch.tsx - UPDATED DESIGN
import { Box, TextField, Button } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

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
        gap: 2,
      }}
    >
      <Input
        placeholder="Search events..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        startIcon={<SearchIcon />}
        size="small"
        sx={{
          flex: 1,
          maxWidth: 400,
        }}
        clearable={!!search}
        onClear={() => onSearchChange('')}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        component={Link}
        href="/events/add"
        sx={{ 
          borderRadius: 2,
          backgroundColor: '#34a853',
          '&:hover': { backgroundColor: '#2d9248' }
        }}
      >
        Create New Event
      </Button>
    </Box>
  );
};