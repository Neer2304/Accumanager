// components/faqs/FaqCategory.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { FaqIcons } from './icons/FaqIcons';
import { FaqQuestion } from './FaqQuestion';
import { FaqCategory as FaqCategoryType } from './content/FaqContent';

interface FaqCategoryProps {
  category: FaqCategoryType;
  expanded: boolean;
  onToggle: (categoryId: string) => void;
}

export const FaqCategory: React.FC<FaqCategoryProps> = ({
  category,
  expanded,
  onToggle,
}) => {
  const theme = useTheme();
  const Icon = FaqIcons[category.icon as keyof typeof FaqIcons] || FaqIcons.general;
  const ExpandMoreIcon = FaqIcons.expandMore;
  const ExpandLessIcon = FaqIcons.expandLess;

  return (
    <Paper
      elevation={expanded ? 3 : 1}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: `1px solid ${expanded ? theme.palette.primary.main : theme.palette.divider}`,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Box
        onClick={() => onToggle(category.id)}
        sx={{
          p: 3,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: expanded ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: expanded ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
              color: expanded ? 'white' : theme.palette.primary.main,
            }}
          >
            <Icon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {category.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {category.description}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          {category.questions.map((question, index) => (
            <FaqQuestion
              key={question.id}
              question={question}
              isLast={index === category.questions.length - 1}
            />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};