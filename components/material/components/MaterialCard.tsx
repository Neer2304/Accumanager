import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Checkbox,
  alpha,
  useTheme,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  Inventory,
  AddShoppingCart,
  RemoveShoppingCart,
  Visibility,
  LocationOn,
  AttachMoney,
  Category,
  Security,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { Material, getStatusColor, getStatusLabel, getCategoryLabel, getUnitLabel } from '../types/material.types';

interface MaterialCardProps {
  material: Material;
  isSelected?: boolean;
  onSelect?: (material: Material) => void;
  onEdit?: (material: Material) => void;
  onDelete?: (material: Material) => void;
  onUse?: (material: Material) => void;
  onRestock?: (material: Material) => void;
  onViewDetails?: (material: Material) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onUse,
  onRestock,
  onViewDetails,
}) => {
  const theme = useTheme();

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(material);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(material);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(material);
    }
  };

  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUse) {
      onUse(material);
    }
  };

  const handleRestock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRestock) {
      onRestock(material);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(material);
    }
  };

  const getStockPercentage = () => {
    if (!material.maximumStock || material.maximumStock <= 0) {
      if (material.currentStock <= material.minimumStock) return 30;
      return 70;
    }
    return (material.currentStock / material.maximumStock) * 100;
  };

  const getStockColor = () => {
    if (material.currentStock === 0) return theme.palette.error.main;
    if (material.currentStock <= material.minimumStock) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getStatusIcon = () => {
    switch (material.status) {
      case 'in-stock':
        return <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />;
      case 'low-stock':
        return <Warning fontSize="small" sx={{ color: theme.palette.warning.main }} />;
      case 'out-of-stock':
        return <Error fontSize="small" sx={{ color: theme.palette.error.main }} />;
      default:
        return <Security fontSize="small" sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
        ...(isSelected && {
          border: `2px solid ${theme.palette.primary.main}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        }),
      }}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <Checkbox
          checked={isSelected}
          onChange={handleSelect}
          onClick={handleSelect}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            '&:hover': {
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
            },
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, pt: 4 }}>
        {/* SKU and Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={material.sku}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getStatusIcon()}
            <Typography variant="caption" sx={{ color: getStatusColor(material.status), fontWeight: 600 }}>
              {getStatusLabel(material.status)}
            </Typography>
          </Box>
        </Box>

        {/* Material Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3em',
            mb: 1,
          }}
        >
          {material.name}
        </Typography>

        {/* Description */}
        {material.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3em',
            }}
          >
            {material.description}
          </Typography>
        )}

        {/* Stock Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Stock Level
            </Typography>
            <Typography variant="caption" fontWeight={600} color={getStockColor()}>
              {material.currentStock} {getUnitLabel(material.unit)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getStockPercentage()}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.grey[300], 0.5),
              '& .MuiLinearProgress-bar': {
                backgroundColor: getStockColor(),
                borderRadius: 3,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Min: {material.minimumStock}
            </Typography>
            {material.maximumStock && (
              <Typography variant="caption" color="text.secondary">
                Max: {material.maximumStock}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            mb: 2,
            p: 1,
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.grey[50], 0.5),
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Unit Cost
            </Typography>
            <Typography variant="body2" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
              <AttachMoney fontSize="inherit" />
              {material.unitCost.toFixed(2)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Total Value
            </Typography>
            <Typography variant="body2" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
              <AttachMoney fontSize="inherit" />
              {(material.currentStock * material.unitCost).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Tags/Categories */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip
            icon={<Category fontSize="small" />}
            label={getCategoryLabel(material.category)}
            size="small"
            sx={{
              fontSize: '0.7rem',
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
            }}
          />
          {material.supplierName && (
            <Chip
              label={material.supplierName}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>

        {/* Location */}
        {material.storageLocation && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn fontSize="small" sx={{ color: theme.palette.text.secondary }} />
            <Typography variant="caption" color="text.secondary">
              {material.storageLocation}
              {material.shelf && ` • Shelf ${material.shelf}`}
              {material.bin && ` • Bin ${material.bin}`}
            </Typography>
          </Box>
        )}

        {/* Last Activity */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="caption" color="text.secondary">
            {material.lastRestocked 
              ? `Restocked: ${new Date(material.lastRestocked).toLocaleDateString()}`
              : 'Never restocked'
            }
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Used: {material.totalQuantityUsed}
          </Typography>
        </Box>
      </CardContent>

      {/* Action buttons */}
      <CardActions
        sx={{
          pt: 0,
          pb: 2,
          px: 2,
          justifyContent: 'space-between',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mt: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onViewDetails && (
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={handleViewDetails}
                sx={{
                  color: theme.palette.info.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                  },
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {onEdit && (
            <Tooltip title="Edit Material">
              <IconButton
                size="small"
                onClick={handleEdit}
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onUse && (
            <Tooltip title="Use Material">
              <IconButton
                size="small"
                onClick={handleUse}
                disabled={material.currentStock === 0}
                sx={{
                  color: material.currentStock === 0 ? theme.palette.grey[400] : theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: material.currentStock === 0 ? 'transparent' : alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <RemoveShoppingCart fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {onRestock && (
            <Tooltip title="Restock Material">
              <IconButton
                size="small"
                onClick={handleRestock}
                sx={{
                  color: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                  },
                }}
              >
                <AddShoppingCart fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {onDelete && (
            <Tooltip title="Delete Material">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={{
                  color: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

MaterialCard.defaultProps = {
  isSelected: false,
};