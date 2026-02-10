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
  darkMode?: boolean; // Added from page
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
  darkMode = false,
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
        borderRadius: '12px',
        background: darkMode
          ? `linear-gradient(135deg, ${alpha('#4285f4', 0.1)} 0%, ${alpha('#4285f4', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#4285f4', 0.08)} 0%, ${alpha('#4285f4', 0.03)} 100%)`,
        border: `2px solid ${darkMode ? '#4285f4' : '#4285f4'}`,
        position: 'sticky',
        top: 16,
        zIndex: 10,
        boxShadow: darkMode
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(66, 133, 244, 0.15)',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${selectedCount} selected`}
            size="small"
            sx={{ 
              fontWeight: 'bold',
              backgroundColor: '#4285f4',
              color: '#ffffff',
            }}
          />
          <Typography 
            variant="body1" 
            fontWeight="medium"
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
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
              sx={{ 
                borderRadius: '8px',
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#4285f4' : '#4285f4',
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                },
              }}
            >
              Archive
            </Button>
          </Tooltip>

          <Tooltip title="Delete selected">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Delete />}
              onClick={onBulkDelete}
              sx={{ 
                borderRadius: '8px',
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                color: '#ea4335',
                '&:hover': {
                  borderColor: '#ea4335',
                  backgroundColor: alpha('#ea4335', 0.08),
                },
              }}
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
              sx={{ 
                borderRadius: '8px',
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#4285f4' : '#4285f4',
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                },
              }}
            >
              Share
            </Button>
          </Tooltip>

          {/* More Actions Menu */}
          <Tooltip title="More actions">
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ 
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  borderColor: darkMode ? '#5f6368' : '#5f6368',
                },
              }}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '8px',
                mt: 1,
              },
            }}
          >
            {onBulkExport && (
              <MenuItem 
                onClick={() => handleAction('export')}
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <Download fontSize="small" sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                Export
              </MenuItem>
            )}
            {onBulkImport && (
              <MenuItem 
                onClick={() => handleAction('import')}
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <Upload fontSize="small" sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                Import
              </MenuItem>
            )}
            {onChangeCategory && (
              <MenuItem 
                onClick={() => handleAction('category')}
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <Category fontSize="small" sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                Change Category
              </MenuItem>
            )}
            {onChangePriority && (
              <MenuItem 
                onClick={() => handleAction('priority')}
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <TrendingUp fontSize="small" sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                Change Priority
              </MenuItem>
            )}
            {onAddTags && (
              <MenuItem 
                onClick={() => handleAction('tags')}
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                <Label fontSize="small" sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                ml: 1,
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  borderColor: darkMode ? '#5f6368' : '#5f6368',
                  color: darkMode ? '#e8eaed' : '#202124',
                },
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