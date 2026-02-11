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
  darkMode?: boolean;
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
  darkMode = false,
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

  const getIconColor = (color?: string) => {
    switch (color) {
      case 'primary': return darkMode ? '#8ab4f8' : '#1a73e8';
      case 'error': return darkMode ? '#ea4335' : '#ea4335';
      case 'warning': return darkMode ? '#fbbc04' : '#fbbc04';
      case 'success': return darkMode ? '#34a853' : '#34a853';
      case 'info': return darkMode ? '#5f6368' : '#5f6368';
      default: return darkMode ? '#9aa0a6' : '#5f6368';
    }
  };

  if (variant === 'icon') {
    return (
      <>
        {onView && (
          <IconButton 
            size={size} 
            onClick={onView} 
            title="View Details"
            sx={{
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              },
            }}
          >
            <Visibility fontSize={size} />
          </IconButton>
        )}
        {onEdit && (
          <IconButton 
            size={size} 
            onClick={onEdit} 
            title="Edit"
            sx={{
              color: darkMode ? '#fbbc04' : '#f57c00',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
              },
            }}
          >
            <Edit fontSize={size} />
          </IconButton>
        )}
        {(onDelete || defaultActions.length > 2) && (
          <IconButton 
            size={size} 
            onClick={handleClick} 
            title="More actions"
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
              },
            }}
          >
            <MoreVert fontSize={size} />
          </IconButton>
        )}
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            sx: {
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '8px',
              mt: 1,
            }
          }}
        >
          {defaultActions.slice(2).map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleClose();
                action.onClick();
              }}
              disabled={action.disabled}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                },
              }}
            >
              <ListItemIcon sx={{ color: getIconColor(action.color) }}>
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
            sx={{
              color: getIconColor(action.color),
              '&:hover': {
                backgroundColor: `${getIconColor(action.color)}20`,
              },
            }}
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
        sx={{
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
          },
        }}
      >
        <MoreVert fontSize={size} />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '8px',
            mt: 1,
          }
        }}
      >
        {defaultActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose();
              action.onClick();
            }}
            disabled={action.disabled}
            sx={{
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
              },
            }}
          >
            <ListItemIcon sx={{ color: getIconColor(action.color) }}>
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