import React from 'react';
import {
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
  TrendingUp,
  TextSnippet,
  Download,
  CloudOff,
} from '@mui/icons-material';
import { Note } from '@/components/note/types';
import { getPriorityColor, getCategoryColor } from '@/components/note/utils';

// Import Google-themed components - IMPORTANT: Use the correct import
import { Card } from '@/components/ui/Card';

interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
  onSelect?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onArchive?: (note: Note) => void;
  onShare?: (note: Note) => void;
  darkMode?: boolean;
  isOnline?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onArchive,
  onShare,
  darkMode = false,
  isOnline = true,
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  return (
    <Card
      hover
      onClick={() => onSelect?.(note)}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '16px',
        border: isSelected 
          ? `2px solid #4285f4` 
          : `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode 
            ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
            : '0 12px 40px rgba(66, 133, 244, 0.15)',
          borderColor: darkMode ? '#5f6368' : '#4285f4',
        },
        ...(note.isLocal && !note.isSynced && {
          border: `2px dashed ${darkMode ? '#fbbc04' : '#fbbc04'}`,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { borderColor: darkMode ? 'rgba(251, 188, 4, 0.5)' : 'rgba(251, 188, 4, 0.3)' },
            '50%': { borderColor: darkMode ? '#fbbc04' : '#fbbc04' },
            '100%': { borderColor: darkMode ? 'rgba(251, 188, 4, 0.5)' : 'rgba(251, 188, 4, 0.3)' },
          },
        }),
      }}
    >
      {/* Top Bar - Priority Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${getPriorityColor(note.priority)} 0%, ${alpha(getPriorityColor(note.priority), 0.5)} 100%)`,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      />

      {/* Offline Indicator */}
      {!isOnline && (
        <Tooltip title="Offline - changes will sync when online">
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: '#fbbc04',
              color: '#202124',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <CloudOff sx={{ fontSize: 14 }} />
          </Box>
        </Tooltip>
      )}

      {/* Note Icon & Privacy */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
          zIndex: 1,
        }}
      >
        {note.passwordProtected && (
          <Tooltip title="Password protected">
            <Box
              sx={{
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
              }}
            >
              <Lock sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            </Box>
          </Tooltip>
        )}
        {note.isPublic && (
          <Tooltip title="Public note">
            <Box
              sx={{
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
              }}
            >
              <Public sx={{ fontSize: 14, color: '#34a853' }} />
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Card Content */}
      <Box sx={{ flex: 1, pt: 4, pb: 2, px: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight="500"
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            mb: 1.5,
            color: darkMode ? '#e8eaed' : '#202124',
            fontSize: '1.125rem',
          }}
        >
          {note.title}
        </Typography>

        {/* Summary/Content Preview */}
        {(note.summary || note.content) && (
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: '0.875rem',
            }}
          >
            {note.summary || note.content?.substring(0, 150)}
            {!note.summary && note.content && note.content.length > 150 && '...'}
          </Typography>
        )}

        {/* Stats */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2, 
          color: darkMode ? '#9aa0a6' : '#5f6368',
          fontSize: '0.75rem',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule sx={{ fontSize: 14 }} />
            <Typography variant="caption">
              {note.readTime || 5} min read
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TextSnippet sx={{ fontSize: 14 }} />
            <Typography variant="caption">
              {note.wordCount?.toLocaleString() || '0'} words
            </Typography>
          </Box>
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
                  fontSize: '0.65rem',
                  height: 22,
                  backgroundColor: darkMode ? alpha('#4285f4', 0.15) : alpha('#4285f4', 0.1),
                  color: darkMode ? '#8ab4f8' : '#4285f4',
                  border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`,
                  borderRadius: '6px',
                  fontWeight: 400,
                }}
              />
            ))}
            {note.tags.length > 3 && (
              <Chip
                label={`+${note.tags.length - 3}`}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 22,
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  border: `1px solid ${darkMode ? '#5f6368' : '#dadce0'}`,
                  borderRadius: '6px',
                }}
              />
            )}
          </Box>
        )}

        {/* Category & Priority */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            icon={<Category sx={{ fontSize: 12, ml: 0.5 }} />}
            label={note.category}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: 24,
              backgroundColor: darkMode ? alpha(getCategoryColor(note.category), 0.15) : alpha(getCategoryColor(note.category), 0.1),
              color: getCategoryColor(note.category),
              fontWeight: 500,
              borderRadius: '8px',
              '& .MuiChip-icon': {
                marginLeft: '4px',
                marginRight: '-4px',
              },
            }}
          />
          <Chip
            icon={<TrendingUp sx={{ fontSize: 12, ml: 0.5 }} />}
            label={note.priority}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: 24,
              backgroundColor: darkMode ? alpha(getPriorityColor(note.priority), 0.15) : alpha(getPriorityColor(note.priority), 0.1),
              color: getPriorityColor(note.priority),
              fontWeight: 600,
              borderRadius: '8px',
              '& .MuiChip-icon': {
                marginLeft: '4px',
                marginRight: '-4px',
              },
            }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          pt: 0,
          pb: 2,
          px: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          mt: 'auto',
          display: 'flex',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: '0.7rem',
          }}>
            {formatRelativeTime(note.updatedAt)}
          </Typography>
          <Typography variant="caption" sx={{ 
            display: 'block',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: '0.7rem',
          }}>
            Updated {formatDate(note.updatedAt)}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 0.5,
          opacity: 1,
          transition: 'all 0.2s ease',
        }}>
          <Tooltip title="Edit note">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(note);
              }}
              sx={{
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: darkMode ? '#5f6368' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
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
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: darkMode ? '#5f6368' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '8px',
            mt: 1,
            minWidth: 160,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit?.(note);
            handleMenuClose();
          }}
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontSize: '0.875rem',
            py: 1,
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onArchive?.(note);
            handleMenuClose();
          }}
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontSize: '0.875rem',
            py: 1,
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
          }}
        >
          {note.status === 'archived' ? (
            <>
              <Unarchive fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              Restore
            </>
          ) : (
            <>
              <Archive fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              Archive
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onShare?.(note);
            handleMenuClose();
          }}
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontSize: '0.875rem',
            py: 1,
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
          }}
        >
          <Share fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          Share
        </MenuItem>
        {note.attachments && note.attachments.length > 0 && (
          <MenuItem
            onClick={() => {
              // Handle download attachments
              handleMenuClose();
            }}
            sx={{ 
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: '0.875rem',
              py: 1,
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
            }}
          >
            <Download fontSize="small" sx={{ mr: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            Download Files
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            onDelete?.(note);
            handleMenuClose();
          }}
          sx={{ 
            color: '#ea4335',
            fontSize: '0.875rem',
            py: 1,
            '&:hover': {
              backgroundColor: alpha('#ea4335', 0.1),
            },
          }}
        >
          <Delete fontSize="small" sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};