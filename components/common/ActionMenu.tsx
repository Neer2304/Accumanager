import React from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Visibility,
  FileCopy,
} from '@mui/icons-material';

interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  disabled = false,
  size = 'medium',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    handleClose();
  };

  return (
    <Box>
      <Tooltip title="Actions">
        <IconButton
          size={size}
          onClick={handleClick}
          disabled={disabled}
          sx={{ border: 1, borderColor: 'divider' }}
        >
          <MoreVert fontSize={size} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleItemClick(item.onClick)}
            disabled={item.disabled}
            sx={{ color: item.color }}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};