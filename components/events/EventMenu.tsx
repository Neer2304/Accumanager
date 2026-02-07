// components/events/EventMenu.tsx - UPDATED DESIGN
import { Menu, MenuItem, useTheme } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Link from "next/link";

interface EventMenuProps {
  anchorEl: HTMLElement | null;
  selectedEvent: string | null;
  onClose: () => void;
  onDelete: () => void;
}

export const EventMenu: React.FC<EventMenuProps> = ({ 
  anchorEl, 
  selectedEvent, 
  onClose, 
  onDelete 
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <MenuItem
        component={Link}
        href={`/events/${selectedEvent}/edit`}
        onClick={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 1.5,
          px: 2,
        }}
      >
        <EditIcon fontSize="small" />
        Edit Event
      </MenuItem>
      <MenuItem 
        onClick={onDelete} 
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 1.5,
          px: 2,
          color: '#ea4335',
        }}
      >
        <DeleteIcon fontSize="small" />
        Delete Event
      </MenuItem>
    </Menu>
  );
};