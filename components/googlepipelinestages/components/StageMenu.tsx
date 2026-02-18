// components/googlepipelinestages/components/StageMenu.tsx
import React from 'react';
import {
  Menu,
  MenuItem,
  Divider,
  Typography,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { PipelineStage } from '../types';
import { GOOGLE_COLORS } from '../constants';

interface StageMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  stage: PipelineStage | null;
  onViewDetails: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export const StageMenu: React.FC<StageMenuProps> = ({
  anchorEl,
  onClose,
  stage,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  if (!stage) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '12px',
          minWidth: 180,
        }
      }}
    >
      {/* View Details - always shown */}
      <MenuItem onClick={onViewDetails} sx={{ py: 1.5 }}>
        <ViewIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
        <Typography variant="body2">View Details</Typography>
      </MenuItem>

      {/* Edit - only for non-default stages */}
      {!stage.isDefault ? (
        <MenuItem onClick={onEdit} sx={{ py: 1.5 }}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          <Typography variant="body2">Edit</Typography>
        </MenuItem>
      ) : null}

      {/* Toggle Active Status - only for non-default stages */}
      {!stage.isDefault ? (
        <MenuItem onClick={onToggleStatus} sx={{ py: 1.5 }}>
          {stage.isActive ? (
            <>
              <VisibilityOffIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              <Typography variant="body2">Deactivate</Typography>
            </>
          ) : (
            <>
              <VisibilityOffIcon fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              <Typography variant="body2">Activate</Typography>
            </>
          )}
        </MenuItem>
      ) : null}

      {/* Divider and Delete - only for non-default stages */}
      {!stage.isDefault ? [
        <Divider key="divider" sx={{ my: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />,
        <MenuItem 
          key="delete"
          onClick={onDelete}
          sx={{ py: 1.5, color: GOOGLE_COLORS.red }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: GOOGLE_COLORS.red }} />
          <Typography variant="body2">Delete</Typography>
        </MenuItem>
      ] : null}
    </Menu>
  );
};