// components/googlepipelinestages/hooks/useStageDialogs.ts
import { useState } from 'react';
import { PipelineStage } from '../types';

export function useStageDialogs() {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, stage: PipelineStage) => {
    setAnchorEl(event.currentTarget);
    setSelectedStage(stage);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (stage: PipelineStage) => {
    setSelectedStage(stage);
    setDetailDialogOpen(true);
  };

  const handleEdit = (stage: PipelineStage) => {
    setSelectedStage(stage);
    setEditDialogOpen(true);
  };

  const handleDelete = (stage: PipelineStage) => {
    setSelectedStage(stage);
    setDeleteDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setDetailDialogOpen(false);
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setColorPickerOpen(false);
    setSelectedStage(null);
  };

  return {
    // Dialog states
    detailDialogOpen,
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    colorPickerOpen,
    anchorEl,
    selectedStage,
    
    // Setters
    setDetailDialogOpen,
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setColorPickerOpen,
    setAnchorEl,
    setSelectedStage,
    
    // Handlers
    handleMenuOpen,
    handleMenuClose,
    handleViewDetails,
    handleEdit,
    handleDelete,
    closeAllDialogs
  };
}