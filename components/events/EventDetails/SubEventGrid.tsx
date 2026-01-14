import { Card, CardContent, Typography, Box, Chip, LinearProgress, useTheme, alpha, Button } from "@mui/material";
// import { FolderIcon, AddIcon } from "@mui/icons-material";
import { SubEvent } from "../types";
import { formatCurrency, calculateBudgetPercentage } from "../utils";
import { FolderIcon } from "lucide-react";
import { AddIcon } from "@/assets/icons/InventoryIcons";

interface SubEventGridProps {
  subEvents: SubEvent[];
  isMobile: boolean;
  onAddSubEvent: () => void;
}

export const SubEventGrid: React.FC<SubEventGridProps> = ({
  subEvents,
  isMobile,
  onAddSubEvent,
}) => {
  const theme = useTheme();

  if (subEvents.length === 0) {
    return (
      <Card sx={{ 
        gridColumn: '1 / -1', 
        textAlign: 'center', 
        py: 6,
        px: 2 
      }}>
        <FolderIcon
        //   sx={{
        //     fontSize: { xs: 48, sm: 64 },
        //     color: 'text.secondary',
        //     mb: 2,
        //     opacity: 0.5
        //   }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No sub-events created yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Organize your event into smaller sub-events
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddSubEvent}
          size={isMobile ? "medium" : "large"}
        >
          Create Sub-Event
        </Button>
      </Card>
    );
  }

  return (
    <>
      {subEvents.map((subEvent) => {
        const subEventPercentage = calculateBudgetPercentage(subEvent.spentAmount, subEvent.budget);

        return (
          <Card 
            key={subEvent._id}
            sx={{ 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease',
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FolderIcon color="primary" />
                <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                  {subEvent.name}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  mb: 2,
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {subEvent.description}
              </Typography>

              {subEvent.budget > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Budget
                    </Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={subEventPercentage > 100 ? "error.main" : "primary.main"}
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
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: subEventPercentage > 100 ? theme.palette.error.main : theme.palette.primary.main,
                        borderRadius: 3,
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(subEvent.spentAmount)} / {formatCurrency(subEvent.budget)}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Chip
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