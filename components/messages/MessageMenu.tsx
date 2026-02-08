"use client";

import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  MarkEmailRead as ReadIcon,
} from '@mui/icons-material';
import { Message } from '@/types/messages';

interface MessageMenuProps {
  anchorEl: HTMLElement | null;
  selectedMessage: Message | null;
  onClose: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onStar?: () => void;
}

export const MessageMenu: React.FC<MessageMenuProps> = ({
  anchorEl,
  selectedMessage,
  onClose,
  onDelete,
  onArchive,
  onStar,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: '180px',
        },
      }}
    >
      {selectedMessage?.status === 'unread' && (
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <ReadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Read</ListItemText>
        </MenuItem>
      )}

      <MenuItem onClick={() => {
        onStar?.();
        onClose();
      }}>
        <ListItemIcon>
          {selectedMessage?.isStarred ? (
            <StarBorderIcon fontSize="small" />
          ) : (
            <StarIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>
          {selectedMessage?.isStarred ? 'Unstar' : 'Star'}
        </ListItemText>
      </MenuItem>

      <MenuItem onClick={onClose}>
        <ListItemIcon>
          <ReplyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Reply</ListItemText>
      </MenuItem>

      <MenuItem onClick={onClose}>
        <ListItemIcon>
          <ForwardIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Forward</ListItemText>
      </MenuItem>

      {onArchive && (
        <MenuItem onClick={() => {
          onArchive();
          onClose();
        }}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
        sx={{ color: '#ea4335' }}
      >
        <ListItemIcon sx={{ color: '#ea4335' }}>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
};