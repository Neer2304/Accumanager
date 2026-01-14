import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Delete,
  Archive,
  Unarchive,
  Share,
  Label,
  Category,
  TrendingUp,
  Clear,
  MoreVert,
  Download,
  Upload,
} from '@mui/icons-material';

interface NoteBulkActionsProps {
  selectedCount: number;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkShare: () => void;
  onBulkExport?: () => void;
  onBulkImport?: () => void;
  onChangeCategory?: () => void;
  onChangePriority?: () => void;
  onAddTags?: () => void;
  onClearSelection: () => void;
}

export const NoteBulkActions: React.FC<NoteBulkActionsProps> = ({
  selectedCount,
  onBulkArchive,
  onBulkDelete,
  onBulkShare,
  onBulkExport,
  onBulkImport,
  onChangeCategory,
  onChangePriority,
  onAddTags,
  onClearSelection,
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAction = (action: string) => {
    handleMenuClose();
    switch (action) {
      case 'archive':
        onBulkArchive();
        break;
      case 'delete':
        onBulkDelete();
        break;
      case 'share':
        onBulkShare();
        break;
      case 'export':
        onBulkExport?.();
        break;
      case 'import':
        onBulkImport?.();
        break;
      case 'category':
        onChangeCategory?.();
        break;
      case 'priority':
        onChangePriority?.();
        break;
      case 'tags':
        onAddTags?.();
        break;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        border: `2px solid ${theme.palette.primary.main}`,
        position: 'sticky',
        top: 16,
        zIndex: 10,
        boxShadow: theme.shadows[4],
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${selectedCount} selected`}
            color="primary"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Typography variant="body1" fontWeight="medium">
            Bulk Actions
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Main Actions */}
          <Tooltip title="Archive selected">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Archive />}
              onClick={onBulkArchive}
              sx={{ borderRadius: 2 }}
            >
              Archive
            </Button>
          </Tooltip>

          <Tooltip title="Delete selected">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={onBulkDelete}
              sx={{ borderRadius: 2 }}
            >
              Delete
            </Button>
          </Tooltip>

          <Tooltip title="Share selected">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Share />}
              onClick={onBulkShare}
              sx={{ borderRadius: 2 }}
            >
              Share
            </Button>
          </Tooltip>

          {/* More Actions Menu */}
          <Tooltip title="More actions">
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            {onBulkExport && (
              <MenuItem onClick={() => handleAction('export')}>
                <Download fontSize="small" sx={{ mr: 1 }} />
                Export
              </MenuItem>
            )}
            {onBulkImport && (
              <MenuItem onClick={() => handleAction('import')}>
                <Upload fontSize="small" sx={{ mr: 1 }} />
                Import
              </MenuItem>
            )}
            {onChangeCategory && (
              <MenuItem onClick={() => handleAction('category')}>
                <Category fontSize="small" sx={{ mr: 1 }} />
                Change Category
              </MenuItem>
            )}
            {onChangePriority && (
              <MenuItem onClick={() => handleAction('priority')}>
                <TrendingUp fontSize="small" sx={{ mr: 1 }} />
                Change Priority
              </MenuItem>
            )}
            {onAddTags && (
              <MenuItem onClick={() => handleAction('tags')}>
                <Label fontSize="small" sx={{ mr: 1 }} />
                Add Tags
              </MenuItem>
            )}
          </Menu>

          {/* Clear Selection */}
          <Tooltip title="Clear selection">
            <IconButton
              size="small"
              onClick={onClearSelection}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                ml: 1,
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};