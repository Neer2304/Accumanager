import { Card, CardContent, Typography, Box, Chip, LinearProgress, useTheme, alpha, Button } from "@mui/material";
import { SubEvent } from "../types";
import { formatCurrency, calculateBudgetPercentage } from "../utils";
import { FolderIcon } from "lucide-react";

// Import Google-themed components
import { Chip as CustomChip } from '@/components/ui/Chip';

interface SubEventGridProps {
  subEvents: SubEvent[];
  isMobile: boolean;
  onAddSubEvent: () => void;
  darkMode?: boolean;
}

export const SubEventGrid: React.FC<SubEventGridProps> = ({
  subEvents,
  isMobile,
  onAddSubEvent,
  darkMode = false,
}) => {
  const theme = useTheme();

  if (subEvents.length === 0) {
    return (
      <Box sx={{ 
        gridColumn: '1 / -1', 
        textAlign: 'center', 
        py: { xs: 4, sm: 6 },
        px: 2,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        borderRadius: '16px',
        border: `2px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <FolderIcon
          style={{
            fontSize: isMobile ? 48 : 64,
            color: darkMode ? '#5f6368' : '#9aa0a6',
            marginBottom: 16,
            opacity: 0.5
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124', 
            fontWeight: 500,
            mb: 1,
            fontSize: isMobile ? '1rem' : '1.25rem',
          }}
          gutterBottom
        >
          No sub-events created yet
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 3,
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: isMobile ? '0.875rem' : '1rem',
          }}
        >
          Organize your event into smaller sub-events
        </Typography>
        <Button
          variant="contained"
          onClick={onAddSubEvent}
          size={isMobile ? "medium" : "large"}
          sx={{ 
            backgroundColor: '#4285f4',
            '&:hover': { backgroundColor: '#3367d6' }
          }}
        >
          Create Sub-Event
        </Button>
      </Box>
    );
  }

  return (
    <>
      {subEvents.map((subEvent) => {
        const subEventPercentage = calculateBudgetPercentage(subEvent.spentAmount, subEvent.budget);
        const isOverBudget = subEventPercentage > 100;

        return (
          <Card 
            key={subEvent._id}
            sx={{ 
              height: '100%',
              borderRadius: '16px',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              '&:hover': {
                boxShadow: darkMode 
                  ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
                  : theme.shadows[4],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease',
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FolderIcon color="#4285f4" />
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ 
                    flex: 1,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  {subEvent.name}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ 
                  mb: 2,
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                {subEvent.description}
              </Typography>

              {subEvent.budget > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                    >
                      Budget
                    </Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={isOverBudget ? "#ea4335" : "#34a853"}
                    >
                      {subEventPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(subEventPercentage, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: darkMode ? '#3c4043' : alpha('#4285f4', 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isOverBudget ? "#ea4335" : "#34a853",
                        borderRadius: 3,
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      {formatCurrency(subEvent.spentAmount)} / {formatCurrency(subEvent.budget)}
                    </Typography>
                  </Box>
                </Box>
              )}

              <CustomChip
                label={subEvent.status}
                size="small"
                color={
                  subEvent.status === "completed"
                    ? "success"
                    : subEvent.status === "in-progress"
                    ? "primary"
                    : "default"
                }
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};