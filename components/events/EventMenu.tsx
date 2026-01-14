import { Menu, MenuItem } from "@mui/material";
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
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem
        component={Link}
        href={`/events/${selectedEvent}/edit`}
        onClick={onClose}
      >
        Edit Event
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
        Delete Event
      </MenuItem>
    </Menu>
  );
};