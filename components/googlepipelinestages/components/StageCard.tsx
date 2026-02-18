// components/googlepipelinestages/components/StageCard.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip as MuiChip,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import {
  DragIndicator as DragIndicatorIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  Percent as PercentIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { PipelineStage } from '../types';
import { STAGE_CATEGORIES, GOOGLE_COLORS } from '../constants';
import { ViewIcon } from '@/components/common';

interface StageCardProps {
  stage: PipelineStage;
  index: number;
  isDragging: boolean;
  provided: any;
  onViewDetails: (stage: PipelineStage) => void;
  onEdit: (stage: PipelineStage) => void;
  onToggleStatus: (stage: PipelineStage) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, stage: PipelineStage) => void;
}

export const StageCard: React.FC<StageCardProps> = ({
  stage,
  index,
  isDragging,
  provided,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onMenuOpen
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const CategoryIcon = STAGE_CATEGORIES.find(c => c.value === stage.category)?.icon || AssignmentIcon;
  const categoryColor = STAGE_CATEGORIES.find(c => c.value === stage.category)?.color || GOOGLE_COLORS.grey;

  return (
    <Paper
      ref={provided.innerRef}
      {...provided.draggableProps}
      sx={{
        bgcolor: darkMode ? '#2d2e30' : '#fff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '16px',
        opacity: stage.isActive ? 1 : 0.6,
        transform: isDragging ? 'scale(1.02)' : 'none',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          borderColor: stage.color
        },
        mb: 2
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Drag Handle */}
          {!stage.isDefault && (
            <Box {...provided.dragHandleProps} sx={{ cursor: 'grab' }}>
              <DragIndicatorIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            </Box>
          )}

          {/* Color Indicator */}
          <Box
            sx={{
              width: 8,
              height: 40,
              bgcolor: stage.color,
              borderRadius: '4px'
            }}
          />

          {/* Stage Info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {stage.name}
              </Typography>
              <MuiChip
                icon={<CategoryIcon />}
                label={STAGE_CATEGORIES.find(c => c.value === stage.category)?.label}
                size="small"
                sx={{
                  bgcolor: alpha(categoryColor, 0.1),
                  color: categoryColor,
                }}
              />
              {stage.isDefault && (
                <MuiChip
                  label="Default"
                  size="small"
                  sx={{
                    bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                    color: GOOGLE_COLORS.blue,
                  }}
                />
              )}
              {!stage.isActive && (
                <MuiChip
                  label="Inactive"
                  size="small"
                  sx={{
                    bgcolor: alpha(GOOGLE_COLORS.grey, 0.1),
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              {/* Probability */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PercentIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {stage.probability}% Probability
                </Typography>
              </Box>

              {/* Deal Count */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {stage.dealCount || 0} Deals
                </Typography>
              </Box>

              {/* Deal Value */}
              {stage.totalValue ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    ${stage.totalValue.toLocaleString()}
                  </Typography>
                </Box>
              ) : null}

              {/* Auto Advance */}
              {stage.autoAdvance && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 16, color: GOOGLE_COLORS.purple }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Auto-advance in {stage.autoAdvanceDays} days
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!stage.isDefault && (
              <Tooltip title={stage.isActive ? 'Deactivate' : 'Activate'}>
                <IconButton
                  size="small"
                  onClick={() => onToggleStatus(stage)}
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                >
                  {stage.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              size="small"
              onClick={() => onViewDetails(stage)}
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
            >
              <ViewIcon />
            </IconButton>
            {!stage.isDefault && (
              <IconButton
                size="small"
                onClick={() => onEdit(stage)}
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={(e) => onMenuOpen(e, stage)}
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};