// components/googlepipelinestages/components/StagesList.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import {
  DragDropContext,
  Droppable,
  DropResult
} from '@hello-pangea/dnd';
import { StageCard } from './StageCard';
import { PipelineStage } from '../types';
import { GOOGLE_COLORS } from '../constants';

interface StagesListProps {
  stages: PipelineStage[];
  loading: boolean;
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
  onDragEnd: (result: DropResult) => void;
  onViewDetails: (stage: PipelineStage) => void;
  onEdit: (stage: PipelineStage) => void;
  onToggleStatus: (stage: PipelineStage) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, stage: PipelineStage) => void;
  onAddClick: () => void;
}

export const StagesList: React.FC<StagesListProps> = ({
  stages,
  loading,
  searchQuery,
  categoryFilter,
  statusFilter,
  onDragEnd,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onMenuOpen,
  onAddClick
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  if (loading) {
    return (
      <Paper sx={{
        p: 8,
        textAlign: 'center',
        bgcolor: darkMode ? '#2d2e30' : '#fff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '16px'
      }}>
        <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
        <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Loading pipeline stages...
        </Typography>
      </Paper>
    );
  }

  if (stages.length === 0) {
    return (
      <Paper sx={{
        p: 8,
        textAlign: 'center',
        bgcolor: darkMode ? '#2d2e30' : '#fff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '16px'
      }}>
        <TimelineIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
        <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          No Pipeline Stages Found
        </Typography>
        <Typography sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
            ? "No stages match your current filters. Try adjusting your search criteria."
            : "Start configuring your sales pipeline by adding your first stage."}
        </Typography>
        {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.green,
              '&:hover': { bgcolor: '#2d9248' },
              px: 4
            }}
          >
            Add Your First Stage
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="stages">
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            {stages.map((stage, index) => (
              <StageCard
                key={stage._id}
                stage={stage}
                index={index}
                isDragging={false}
                provided={provided}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onMenuOpen={onMenuOpen}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};