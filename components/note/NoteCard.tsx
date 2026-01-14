import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  MoreVert,
  Lock,
  Public,
  Share,
  Edit,
  Delete,
  Archive,
  Schedule,
  AccessTime,
  Folder,
  Label,
} from '@mui/icons-material';
import { Note } from './types';
import {
  getPriorityColor,
  getStatusColor,
  getCategoryColor,
  formatDate,
  truncateText,
  calculateReadTime,
  getNoteIcon,
} from './utils';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onArchive?: (note: Note) => void;
  onShare?: (note: Note) => void;
  onSelect?: (note: Note) => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onArchive,
  onShare,
  onSelect,
  isSelected = false,
  showCheckbox = false,
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAction = (action: string) => {
    handleMenuClose();
    switch (action) {
      case 'edit':
        onEdit?.(note);
        break;
      case 'delete':
        onDelete?.(note);
        break;
      case 'archive':
        onArchive?.(note);
        break;
      case 'share':
        onShare?.(note);
        break;
    }
  };

  const cardStyle = {
    height: '100%',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    backgroundColor: note.color || '#ffffff',
    border: isSelected
      ? `2px solid ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.divider}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
      borderColor: theme.palette.primary.main,
    },
  };

  return (
    <Card
      sx={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect?.(note)}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          opacity: 0.1,
          background: `linear-gradient(45deg, ${getPriorityColor(note.priority)} 25%, transparent 25%)`,
          backgroundSize: '10px 10px',
        }}
      />

      <CardContent sx={{ p: 2.5, position: 'relative' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(getCategoryColor(note.category), 0.2),
              color: getCategoryColor(note.category),
              width: 40,
              height: 40,
              fontSize: '1.2rem',
              mr: 1.5,
            }}
          >
            {getNoteIcon(note.category)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                color: theme.palette.text.primary,
              }}
            >
              {note.title}
            </Typography>

            {/* Tags and Status */}
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                label={note.category}
                size="small"
                sx={{
                  bgcolor: alpha(getCategoryColor(note.category), 0.1),
                  color: getCategoryColor(note.category),
                  fontWeight: 500,
                  height: 24,
                }}
              />
              <Chip
                label={note.priority}
                size="small"
                sx={{
                  bgcolor: alpha(getPriorityColor(note.priority), 0.1),
                  color: getPriorityColor(note.priority),
                  height: 24,
                }}
              />
              {note.passwordProtected && (
                <Tooltip title="Password Protected">
                  <Lock fontSize="small" sx={{ color: theme.palette.warning.main, ml: 0.5 }} />
                </Tooltip>
              )}
              {note.isPublic && (
                <Tooltip title="Public Note">
                  <Public fontSize="small" sx={{ color: theme.palette.info.main, ml: 0.5 }} />
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Action Menu */}
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              opacity: hovered ? 1 : 0.7,
              transition: 'opacity 0.2s',
            }}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={() => handleAction('edit')}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleAction('share')}>
              <Share fontSize="small" sx={{ mr: 1 }} />
              Share
            </MenuItem>
            <MenuItem onClick={() => handleAction('archive')}>
              <Archive fontSize="small" sx={{ mr: 1 }} />
              {note.status === 'archived' ? 'Unarchive' : 'Archive'}
            </MenuItem>
            <MenuItem
              onClick={() => handleAction('delete')}
              sx={{ color: theme.palette.error.main }}
            >
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>

        {/* Content Preview */}
        {note.summary && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {note.summary}
          </Typography>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {note.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                icon={<Label fontSize="small" />}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            ))}
            {note.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{note.tags.length - 3} more
              </Typography>
            )}
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime fontSize="small" sx={{ color: 'text.secondary', fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary">
                {calculateReadTime(note.wordCount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule fontSize="small" sx={{ color: 'text.secondary', fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(note.updatedAt)}
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {note.readCount > 0 && (
              <Tooltip title="Read count">
                <Typography variant="caption" color="text.secondary">
                  👁️ {note.readCount}
                </Typography>
              </Tooltip>
            )}
            {note.editCount > 0 && (
              <Tooltip title="Edit count">
                <Typography variant="caption" color="text.secondary">
                  ✏️ {note.editCount}
                </Typography>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};