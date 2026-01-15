import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  NoteAdd,
  AccessTime,
  Category,
  TrendingUp,
  Numbers,
  Timeline,
} from "@mui/icons-material";
import { NoteStats as NoteStatsType } from "./types";
import { getPriorityColor, getCategoryColor } from "./utils";

interface NoteStatsProps {
  stats: NoteStatsType | null;
  loading?: boolean;
}

export const NotesStats: React.FC<NoteStatsProps> = ({
  stats,
  loading = false,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) return null;

  // Inside your NotesStats component, update the statCards array:

  const statCards = [
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: <NoteAdd />,
      color: "#3b82f6", // Blue 500
      progress: 100,
    },
    {
      title: "Total Words",
      value: stats.totalWords?.toLocaleString() || "0",
      icon: <Numbers />,
      color: "#10b981", // Green 500
      progress: 100,
    },
    {
      title: "Avg. Words",
      value: stats.avgWords,
      icon: <AccessTime />,
      color: "#f59e0b", // Yellow 500
      progress: 100,
    },
    {
      title: "Categories",
      value: stats.categories?.length || 0,
      icon: <Category />,
      color: "#8b5cf6", // Violet 500
      progress: 100,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        📊 Note Statistics
      </Typography>

      {/* Main Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 2,
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${alpha(
                  card.color,
                  0.1
                )} 0%, ${alpha(card.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(card.color, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    mr: 2,
                    borderRadius: 2,
                    bgcolor: alpha(card.color, 0.2),
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={card.progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: alpha(card.color, 0.1),
                  "& .MuiLinearProgress-bar": {
                    bgcolor: card.color,
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Stats */}
      <Grid container spacing={3}>
        {/* Categories Distribution */}
        {stats.categories && stats.categories.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Categories
              </Typography>
              <Box sx={{ mt: 2 }}>
                {stats.categories.map((category) => (
                  <Box
                    key={category._id}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2">
                          {category._id.charAt(0).toUpperCase() +
                            category._id.slice(1)}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {category.count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(category.count / stats.totalNotes) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(getCategoryColor(category._id), 0.1),
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getCategoryColor(category._id),
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Priority Distribution */}
        {stats.priorities && stats.priorities.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Priority Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {stats.priorities.map((priority) => (
                  <Box
                    key={priority._id}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2">
                          {priority._id.charAt(0).toUpperCase() +
                            priority._id.slice(1)}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {priority.count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(priority.count / stats.totalNotes) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(getPriorityColor(priority._id), 0.1),
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPriorityColor(priority._id),
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Recent Activity */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {stats.recentActivity.slice(0, 4).map((note) => (
                    <Grid item xs={12} sm={6} md={3} key={note._id}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.action.hover, 0.5),
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          gutterBottom
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {note.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Updated:{" "}
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
