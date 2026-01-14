import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Folder,
  Label,
  Star,
  Archive,
  Delete,
  Share,
  Public,
  ExpandMore,
  ExpandLess,
  Add,
  Settings,
} from '@mui/icons-material';
import { NoteStats } from './types';

interface NoteSidebarProps {
  stats: NoteStats | null;
  selectedCategory: string;
  selectedTag: string;
  onCategorySelect: (category: string) => void;
  onTagSelect: (tag: string) => void;
  onShowAll: () => void;
  onShowArchived: () => void;
  onShowDeleted: () => void;
  onShowShared: () => void;
  onShowPublic: () => void;
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  stats,
  selectedCategory,
  selectedTag,
  onCategorySelect,
  onTagSelect,
  onShowAll,
  onShowArchived,
  onShowDeleted,
  onShowShared,
  onShowPublic,
}) => {
  const theme = useTheme();
  const [categoriesExpanded, setCategoriesExpanded] = React.useState(true);
  const [tagsExpanded, setTagsExpanded] = React.useState(true);

  const getCategoryCount = (categoryName: string) => {
    if (!stats?.categories) return 0;
    const category = stats.categories.find(c => c._id === categoryName);
    return category?.count || 0;
  };

  return (
    <Box sx={{ width: 280, height: '100%', overflowY: 'auto' }}>
      {/* Quick Stats */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 100%)`,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Stats
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Total Notes
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stats?.totalNotes || 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Total Words
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stats?.totalWords?.toLocaleString() || 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Avg Words
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stats?.avgWords || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List dense>
        <ListItem
          button
          selected={!selectedCategory && !selectedTag}
          onClick={onShowAll}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary="All Notes" />
          <Chip label={stats?.totalNotes || 0} size="small" />
        </ListItem>

        <ListItem
          button
          onClick={onShowArchived}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Archive />
          </ListItemIcon>
          <ListItemText primary="Archived" />
          <Chip
            label={stats?.statuses?.find(s => s._id === 'archived')?.count || 0}
            size="small"
            color="default"
          />
        </ListItem>

        <ListItem
          button
          onClick={onShowShared}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText primary="Shared with me" />
        </ListItem>

        <ListItem
          button
          onClick={onShowPublic}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Public />
          </ListItemIcon>
          <ListItemText primary="Public Notes" />
        </ListItem>

        <Divider sx={{ my: 2 }} />

        {/* Categories Section */}
        <ListItem
          button
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          sx={{ borderRadius: 1 }}
        >
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary="Categories" />
          {categoriesExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={categoriesExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {stats?.categories?.map((category) => (
              <ListItem
                key={category._id}
                button
                selected={selectedCategory === category._id}
                onClick={() => onCategorySelect(category._id)}
                sx={{ pl: 4, borderRadius: 1, mb: 0.5 }}
              >
                <ListItemText
                  primary={category._id}
                  sx={{ textTransform: 'capitalize' }}
                />
                <Chip label={category.count} size="small" />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <Divider sx={{ my: 2 }} />

        {/* Tags Section */}
        <ListItem
          button
          onClick={() => setTagsExpanded(!tagsExpanded)}
          sx={{ borderRadius: 1 }}
        >
          <ListItemIcon>
            <Label />
          </ListItemIcon>
          <ListItemText primary="Tags" />
          {tagsExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={tagsExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {stats?.categories?.slice(0, 10).map((category) => (
              <Chip
                key={category._id}
                label={category._id}
                size="small"
                clickable
                onClick={() => onTagSelect(category._id)}
                color={selectedTag === category._id ? 'primary' : 'default'}
                variant={selectedTag === category._id ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Collapse>
      </List>

      {/* Recent Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            <List dense>
              {stats.recentActivity.slice(0, 5).map((note) => (
                <ListItem
                  key={note._id}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.action.hover, 0.5),
                    },
                  }}
                >
                  <ListItemText
                    primary={note.title}
                    secondary={new Date(note.updatedAt).toLocaleDateString()}
                    primaryTypographyProps={{
                      variant: 'caption',
                      fontWeight: 500,
                      sx: { wordBreak: 'break-word' },
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
};