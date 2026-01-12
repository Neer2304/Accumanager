import React from 'react';
import {
  IconButton,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  MoreVert,
  Inventory,
  LocalOffer,
  ContentCopy,
} from '@mui/icons-material';

interface ProductAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
}

interface ProductActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onManageInventory?: () => void;
  onManagePricing?: () => void;
  customActions?: ProductAction[];
  variant?: 'icon' | 'menu' | 'buttons';
  size?: 'small' | 'medium';
}

const ProductActions: React.FC<ProductActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onManageInventory,
  onManagePricing,
  customActions = [],
  variant = 'icon',
  size = 'small',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const defaultActions: ProductAction[] = [
    ...(onView ? [{
      label: 'View Details',
      icon: <Visibility fontSize={size} />,
      onClick: onView,
      color: 'primary' as const,
    }] : []),
    ...(onEdit ? [{
      label: 'Edit',
      icon: <Edit fontSize={size} />,
      onClick: onEdit,
      color: 'primary' as const,
    }] : []),
    ...(onDuplicate ? [{
      label: 'Duplicate',
      icon: <ContentCopy fontSize={size} />,
      onClick: onDuplicate,
      color: 'info' as const,
    }] : []),
    ...(onManageInventory ? [{
      label: 'Manage Inventory',
      icon: <Inventory fontSize={size} />,
      onClick: onManageInventory,
      color: 'info' as const,
    }] : []),
    ...(onManagePricing ? [{
      label: 'Manage Pricing',
      icon: <LocalOffer fontSize={size} />,
      onClick: onManagePricing,
      color: 'info' as const,
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      icon: <Delete fontSize={size} />,
      onClick: onDelete,
      color: 'error' as const,
    }] : []),
    ...customActions,
  ];

  if (variant === 'icon') {
    return (
      <>
        {onView && (
          <IconButton size={size} onClick={onView} title="View Details">
            <Visibility fontSize={size} />
          </IconButton>
        )}
        {onEdit && (
          <IconButton size={size} onClick={onEdit} title="Edit">
            <Edit fontSize={size} />
          </IconButton>
        )}
        {(onDelete || defaultActions.length > 2) && (
          <IconButton size={size} onClick={handleClick} title="More actions">
            <MoreVert fontSize={size} />
          </IconButton>
        )}
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          {defaultActions.slice(2).map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleClose();
                action.onClick();
              }}
              disabled={action.disabled}
            >
              <ListItemIcon sx={{ color: action.color }}>
                {action.icon}
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  if (variant === 'buttons') {
    return (
      <ButtonGroup size={size} variant="outlined">
        {defaultActions.map((action, index) => (
          <IconButton
            key={index}
            onClick={action.onClick}
            title={action.label}
            color={action.color}
            disabled={action.disabled}
          >
            {action.icon}
          </IconButton>
        ))}
      </ButtonGroup>
    );
  }

  // Menu variant (default)
  return (
    <>
      <IconButton
        size={size}
        onClick={handleClick}
        title="Actions"
      >
        <MoreVert fontSize={size} />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        {defaultActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose();
              action.onClick();
            }}
            disabled={action.disabled}
          >
            <ListItemIcon sx={{ color: action.color }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ProductActions;