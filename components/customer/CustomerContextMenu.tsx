import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import {
  Edit,
  Delete,
  Phone,
  Email,
  Receipt,
  LocationOn,
  Business,
  CopyAll,
  Visibility,
} from '@mui/icons-material';

interface CustomerContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewOrders?: () => void;
  onCopyDetails?: () => void;
  customerDetails?: {
    name?: string;
    phone?: string;
    email?: string;
    company?: string;
    orders?: number;
    location?: string;
  };
}

export const CustomerContextMenu: React.FC<CustomerContextMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onEdit,
  onDelete,
  onViewOrders,
  onCopyDetails,
  customerDetails,
}) => {
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 320,
          maxWidth: '90vw',
          borderRadius: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Customer Info Section */}
      {customerDetails && (
        <>
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {customerDetails.name || 'Customer'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {customerDetails.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2">{customerDetails.phone}</Typography>
                </Box>
              )}
              
              {customerDetails.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2">{customerDetails.email}</Typography>
                </Box>
              )}
              
              {customerDetails.company && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2">{customerDetails.company}</Typography>
                </Box>
              )}
              
              {customerDetails.orders !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2">{customerDetails.orders} orders</Typography>
                </Box>
              )}
              
              {customerDetails.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2">{customerDetails.location}</Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Primary Actions */}
      <MenuItem
        onClick={() => {
          onEdit();
          onClose();
        }}
        sx={{ py: 1.5 }}
      >
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit Customer</ListItemText>
      </MenuItem>

      {onViewOrders && (
        <MenuItem
          onClick={() => {
            onViewOrders();
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Orders</ListItemText>
          {customerDetails?.orders !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {customerDetails.orders}
            </Typography>
          )}
        </MenuItem>
      )}

      {/* Copy Actions */}
      {customerDetails && (
        <MenuItem
          onClick={() => {
            if (customerDetails.phone) {
              handleCopyToClipboard(customerDetails.phone);
            }
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <CopyAll fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Phone Number</ListItemText>
        </MenuItem>
      )}

      {onCopyDetails && (
        <MenuItem
          onClick={() => {
            onCopyDetails();
            onClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <CopyAll fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy All Details</ListItemText>
        </MenuItem>
      )}

      <Divider />

      {/* Dangerous Actions */}
      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
        sx={{ 
          py: 1.5,
          color: 'error.main',
          '&:hover': {
            backgroundColor: 'error.light',
          }
        }}
      >
        <ListItemIcon sx={{ color: 'error.main' }}>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Customer</ListItemText>
      </MenuItem>

      {/* Quick Actions Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <strong>Tip:</strong> Right-click on customer row for quick actions
        </Typography>
      </Box>
    </Menu>
  );
};

// Optional: Simple version without customer details
export const SimpleCustomerContextMenu: React.FC<{
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ anchorEl, open, onClose, onEdit, onDelete }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit Customer</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon sx={{ color: 'error.main' }}>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Customer</ListItemText>
      </MenuItem>
    </Menu>
  );
};