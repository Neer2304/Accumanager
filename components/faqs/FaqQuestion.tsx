// components/faqs/FaqQuestion.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { FaqIcons } from './icons/FaqIcons';
import { FaqQuestion as FaqQuestionType } from './content/FaqContent';

interface FaqQuestionProps {
  question: FaqQuestionType;
  isLast: boolean;
}

export const FaqQuestion: React.FC<FaqQuestionProps> = ({ question, isLast }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  const ExpandMoreIcon = FaqIcons.expandMore;
  const ExpandLessIcon = FaqIcons.expandLess;
  const LightbulbIcon = FaqIcons.lightbulb;

  return (
    <>
      <Box
        sx={{
          py: 2,
          ...(isLast ? {} : { borderBottom: `1px solid ${theme.palette.divider}` }),
        }}
      >
        <Box
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            cursor: 'pointer',
            '&:hover': {
              '& .question-text': {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              className="question-text"
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{
                transition: 'color 0.2s',
              }}
            >
              {question.question}
            </Typography>
            {question.tags && question.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {question.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
          <IconButton size="small" sx={{ ml: 2 }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              borderRadius: 1,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {question.answer}
            </Typography>
            {question.id.includes('gs-1') && (
              <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                <Typography variant="caption" fontWeight="bold" color="info.main" display="flex" alignItems="center" gap={0.5}>
                  <LightbulbIcon fontSize="small" />
                  Pro Tip:
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1.5 }}>
                  Complete your profile setup within 24 hours to unlock all features.
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    </>
  );
};