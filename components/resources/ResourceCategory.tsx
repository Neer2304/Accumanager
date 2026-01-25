// components/resources/ResourceCategory.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { ResourceCategory as ResourceCategoryType } from './data/resourcesData';
import { ResourceItem } from './ResourceItem';

interface ResourceCategoryProps {
  category: ResourceCategoryType;
  expanded: boolean;
  onToggle: (categoryId: string) => void;
}

export const ResourceCategory: React.FC<ResourceCategoryProps> = ({
  category,
  expanded,
  onToggle,
}) => {
  const theme = useTheme();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => onToggle(category.id)}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        '&:before': { display: 'none' },
        '&.Mui-expanded': {
          borderColor: category.color,
          boxShadow: `0 0 0 1px ${alpha(category.color, 0.3)}`,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: expanded ? alpha(category.color, 0.05) : 'background.paper',
          py: 2,
          px: 3,
          '&:hover': {
            bgcolor: alpha(category.color, 0.03),
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(category.color, 0.1),
              color: category.color,
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            {category.module.charAt(0)}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" fontWeight="bold">
                {category.title}
              </Typography>
              <Chip
                label={category.module}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: alpha(category.color, 0.1),
                  color: category.color,
                  fontWeight: 'bold',
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {category.description}
            </Typography>
          </Box>
          <Chip
            label={`${category.items.length} resources`}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          {category.items.map((item, index) => (
            <ResourceItem
              key={item.id}
              item={item}
              isLast={index === category.items.length - 1}
              categoryColor={category.color}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};