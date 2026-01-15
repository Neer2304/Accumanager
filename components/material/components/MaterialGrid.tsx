import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';
import { Add, Inventory, SearchOff } from '@mui/icons-material';
import { MaterialCard } from './MaterialCard';
import { Material } from '../types/material.types';

interface MaterialGridProps {
  materials?: Material[];
  loading: boolean;
  selectedMaterials?: string[];
  viewMode?: 'grid' | 'list';
  emptyMessage?: string;
  onMaterialSelect?: (material: Material) => void;
  onMaterialEdit?: (material: Material) => void;
  onMaterialDelete?: (material: Material) => void;
  onMaterialUse?: (material: Material) => void;
  onMaterialRestock?: (material: Material) => void;
  onCreateMaterial?: () => void;
  onViewDetails?: (material: Material) => void;
}

export const MaterialGrid: React.FC<MaterialGridProps> = ({
  materials = [],
  loading,
  selectedMaterials = [],
  viewMode = 'grid',
  emptyMessage = 'No materials found',
  onMaterialSelect,
  onMaterialEdit,
  onMaterialDelete,
  onMaterialUse,
  onMaterialRestock,
  onCreateMaterial,
  onViewDetails,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Loading materials...
        </Typography>
      </Box>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
        }}
      >
        <Paper
          sx={{
            p: 6,
            maxWidth: 500,
            mx: 'auto',
            background: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Inventory
            sx={{
              fontSize: 64,
              color: theme.palette.text.secondary,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {emptyMessage}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Add your first material to start tracking inventory, usage, and costs.
          </Typography>
          {onCreateMaterial && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={onCreateMaterial}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              Add New Material
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  // List view
  if (viewMode === 'list') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {materials.map((material) => (
          <MaterialCard
            key={material._id}
            material={material}
            isSelected={selectedMaterials.includes(material._id)}
            onSelect={onMaterialSelect}
            onEdit={onMaterialEdit}
            onDelete={onMaterialDelete}
            onUse={onMaterialUse}
            onRestock={onMaterialRestock}
            onViewDetails={onViewDetails}
          />
        ))}
      </Box>
    );
  }

  // Grid view (default)
  return (
    <Grid container spacing={3}>
      {materials.map((material) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={material._id}>
          <MaterialCard
            material={material}
            isSelected={selectedMaterials.includes(material._id)}
            onSelect={onMaterialSelect}
            onEdit={onMaterialEdit}
            onDelete={onMaterialDelete}
            onUse={onMaterialUse}
            onRestock={onMaterialRestock}
            onViewDetails={onViewDetails}
          />
        </Grid>
      ))}
    </Grid>
  );
};

MaterialGrid.defaultProps = {
  materials: [],
  selectedMaterials: [],
  viewMode: 'grid',
  emptyMessage: 'No materials found',
};