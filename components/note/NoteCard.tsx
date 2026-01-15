import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit,
  Delete,
  Archive,
  Unarchive,
  Share,
  MoreVert,
  Lock,
  Public,
  Schedule,
  Category,
} from '@mui/icons-material';
import { Note } from './types';
import { getPriorityColor, getCategoryColor } from './utils';
import { useThemeColors } from '@/hooks/useThemeColors';

interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
  onSelect?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onArchive?: (note: Note) => void;
  onShare?: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onArchive,
  onShare,
}) => {
  const theme = useTheme();
  const { getColorWithContrast } = useThemeColors();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Use the theme hook to get proper contrast
  const { backgroundColor, color: textColor } = getColorWithContrast(note.color || '#ffffff');

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      onClick={() => onSelect?.(note)}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 3,
        border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
        backgroundColor,
        color: textColor,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          '& .note-actions': {
            opacity: 1,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(
            getPriorityColor(note.priority),
            0.8
          )} 100%)`,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
      }}
    >
      {/* Note Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          fontSize: 24,
          opacity: 0.7,
        }}
      >
        {note.icon || '📝'}
      </Box>

      {/* Privacy Badges */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 0.5 }}>
        {note.passwordProtected && (
          <Tooltip title="Password protected">
            <Lock sx={{ fontSize: 16, color: textColor, opacity: 0.8 }} />
          </Tooltip>
        )}
        {note.isPublic && (
          <Tooltip title="Public note">
            <Public sx={{ fontSize: 16, color: textColor, opacity: 0.8 }} />
          </Tooltip>
        )}
      </Box>

      <CardContent sx={{ flex: 1, pt: 4, pb: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            mb: 1,
          }}
        >
          {note.title}
        </Typography>

        {/* Summary */}
        {note.summary && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {note.summary}
          </Typography>
        )}

        {/* Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, opacity: 0.7 }}>
          <Schedule sx={{ fontSize: 14 }} />
          <Typography variant="caption">
            {note.readTime} min • {note.wordCount} words
          </Typography>
        </Box>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {note.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.6rem',
                  height: 20,
                  backgroundColor: alpha(textColor, 0.1),
                  color: textColor,
                  border: `1px solid ${alpha(textColor, 0.2)}`,
                }}
              />
            ))}
            {note.tags.length > 3 && (
              <Chip
                label={`+${note.tags.length - 3}`}
                size="small"
                sx={{
                  fontSize: '0.6rem',
                  height: 20,
                  backgroundColor: alpha(textColor, 0.1),
                  color: textColor,
                  border: `1px solid ${alpha(textColor, 0.2)}`,
                }}
              />
            )}
          </Box>
        )}

        {/* Category & Priority */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<Category sx={{ fontSize: 14 }} />}
            label={note.category}
            size="small"
            sx={{
              fontSize: '0.7rem',
              backgroundColor: alpha(getCategoryColor(note.category), 0.2),
              color: getCategoryColor(note.category),
              fontWeight: 'medium',
            }}
          />
          <Chip
            label={note.priority}
            size="small"
            sx={{
              fontSize: '0.7rem',
              backgroundColor: alpha(getPriorityColor(note.priority), 0.2),
              color: getPriorityColor(note.priority),
              fontWeight: 'bold',
            }}
          />
        </Box>
      </CardContent>

      {/* Footer */}
      <CardActions
        sx={{
          pt: 0,
          pb: 2,
          px: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {formatDate(note.updatedAt)}
        </Typography>

        <Box className="note-actions" sx={{ opacity: 0, transition: 'opacity 0.2s ease' }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(note);
              }}
              sx={{
                backgroundColor: alpha(textColor, 0.1),
                color: textColor,
                '&:hover': {
                  backgroundColor: alpha(textColor, 0.2),
                },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="More actions">
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                backgroundColor: alpha(textColor, 0.1),
                color: textColor,
                '&:hover': {
                  backgroundColor: alpha(textColor, 0.2),
                },
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={() => {
            onEdit?.(note);
            handleMenuClose();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onArchive?.(note);
            handleMenuClose();
          }}
        >
          {note.status === 'archived' ? (
            <>
              <Unarchive fontSize="small" sx={{ mr: 1 }} />
              Restore
            </>
          ) : (
            <>
              <Archive fontSize="small" sx={{ mr: 1 }} />
              Archive
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onShare?.(note);
            handleMenuClose();
          }}
        >
          <Share fontSize="small" sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete?.(note);
            handleMenuClose();
          }}
          sx={{ color: theme.palette.error.main }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};