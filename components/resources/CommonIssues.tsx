// components/resources/CommonIssues.tsx - SIMPLE UNCONTROLLED VERSION
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { commonIssuesData } from './data/moduleGuides';

interface CommonIssuesProps {
  module?: string;
  defaultExpanded?: boolean; // Optional prop to control expansion
}

export const CommonIssues: React.FC<CommonIssuesProps> = ({ 
  module, 
  defaultExpanded = false // Default to collapsed
}) => {
  const theme = useTheme();
  
  // Filter by module if specified
  const filteredIssues = module
    ? commonIssuesData.filter(item => item.module === module)
    : commonIssuesData;

  if (filteredIssues.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        mb: 6,
        bgcolor: alpha(theme.palette.warning.main, 0.05),
        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
      }}
    >
      <Typography 
        variant="h5" 
        fontWeight="bold" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          color: theme.palette.warning.dark 
        }}
      >
        <ErrorIcon />
        {module ? `${module} Common Issues` : 'Common Issues & Solutions'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Quick solutions to frequently encountered problems
      </Typography>

      {filteredIssues.map((moduleIssues) => (
        <Accordion
          key={moduleIssues.module}
          defaultExpanded={defaultExpanded}
          sx={{
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              borderColor: theme.palette.warning.main,
              boxShadow: `0 0 0 1px ${alpha(theme.palette.warning.main, 0.2)}`,
            },
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />} 
            sx={{ 
              py: 2,
              px: 3,
              '&:hover': {
                bgcolor: alpha(theme.palette.warning.main, 0.05),
              },
              '&.Mui-expanded': {
                bgcolor: alpha(theme.palette.warning.main, 0.08),
              },
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
              {moduleIssues.module} Module
            </Typography>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 3, pt: 2 }}>
            <Box sx={{ mt: 1 }}>
              {moduleIssues.issues.map((issue, issueIndex) => (
                <Box key={issueIndex} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 1, 
                    mb: 1 
                  }}>
                    <Box sx={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.warning.main,
                      mt: 1,
                      flexShrink: 0 
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight="medium" 
                        color="text.primary" 
                        gutterBottom
                        sx={{ lineHeight: 1.4 }}
                      >
                        {issue.issue}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          pl: 1,
                          lineHeight: 1.6,
                          bgcolor: alpha(theme.palette.warning.main, 0.03),
                          p: 1.5,
                          borderRadius: 1,
                          borderLeft: `3px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                        }}
                      >
                        {issue.solution}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {issueIndex < moduleIssues.issues.length - 1 && (
                    <Divider sx={{ 
                      mt: 3, 
                      mb: 2, 
                      borderColor: alpha(theme.palette.divider, 0.3) 
                    }} />
                  )}
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};