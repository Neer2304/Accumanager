// components/notes/NotesStats.tsx - Fixed with simpler layout
import React from "react";
import {
  Box,
  Typography,
  Paper,
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
} from "@mui/icons-material";
import { NoteStats as NoteStatsType } from "@/components/note/types";

interface NoteStatsProps {
  stats: NoteStatsType | null;
  loading?: boolean;
}

// Helper functions (since they might be missing from utils)
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'general': '#4285f4',
    'personal': '#34a853',
    'work': '#fbbc04',
    'ideas': '#ea4335',
    'todo': '#8b5cf6',
    'reference': '#0ea5e9',
    'journal': '#f97316',
    'meeting': '#06b6d4',
    'project': '#8b5cf6',
    'learning': '#10b981',
    'research': '#3b82f6',
    'temporary': '#94a3b8',
    'archive': '#64748b',
  };
  return colors[category] || '#9ca3af';
};

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'critical': '#dc2626',
    'high': '#ea580c',
    'medium': '#d97706',
    'low': '#059669',
  };
  return colors[priority] || '#6b7280';
};

export const NotesStats: React.FC<NoteStatsProps> = ({
  stats,
  loading = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: '#1a73e8' }} />
      </Box>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: <NoteAdd />,
      color: "#4285f4",
      progress: 100,
    },
    {
      title: "Total Words",
      value: stats.totalWords?.toLocaleString() || "0",
      icon: <Numbers />,
      color: "#34a853",
      progress: 100,
    },
    {
      title: "Avg. Words",
      value: stats.avgWords,
      icon: <AccessTime />,
      color: "#fbbc04",
      progress: 100,
    },
    {
      title: "Categories",
      value: stats.categories?.length || 0,
      icon: <Category />,
      color: "#ea4335",
      progress: 100,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h5" 
        fontWeight={500} 
        gutterBottom 
        sx={{ 
          color: isDark ? '#e8eaed' : '#202124',
          fontSize: '1.5rem',
          letterSpacing: '-0.25px',
        }}
      >
        📊 Note Statistics
      </Typography>

      {/* Main Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 2, 
        mb: 3 
      }}>
        {statCards.map((card, index) => (
          <Paper
            key={index}
            sx={{
              p: 2.5,
              borderRadius: '12px',
              border: '1px solid #dadce0',
              backgroundColor: isDark ? '#303134' : '#ffffff',
              boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  p: 1,
                  mr: 2,
                  borderRadius: '8px',
                  bgcolor: alpha(card.color, 0.1),
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color={isDark ? '#9aa0a6' : '#5f6368'}>
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight={600} color={isDark ? '#e8eaed' : '#202124'}>
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
                '& .MuiLinearProgress-bar': {
                  bgcolor: card.color,
                  borderRadius: 2,
                },
              }}
            />
          </Paper>
        ))}
      </Box>

      {/* Detailed Stats */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
        gap: 3 
      }}>
        {/* Categories Distribution */}
        {stats.categories && stats.categories.length > 0 && (
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              border: '1px solid #dadce0',
              backgroundColor: isDark ? '#303134' : '#ffffff',
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} gutterBottom color={isDark ? '#e8eaed' : '#202124'}>
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
                      <Typography variant="body2" color={isDark ? '#e8eaed' : '#202124'}>
                        {category._id.charAt(0).toUpperCase() + category._id.slice(1)}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color={isDark ? '#e8eaed' : '#202124'}>
                        {category.count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(category.count / stats.totalNotes) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(getCategoryColor(category._id), 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getCategoryColor(category._id),
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Priority Distribution - Fixed type issue */}
        {stats.priorities && stats.priorities.length > 0 && (
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              border: '1px solid #dadce0',
              backgroundColor: isDark ? '#303134' : '#ffffff',
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} gutterBottom color={isDark ? '#e8eaed' : '#202124'}>
              Priority Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              {stats.priorities.map((priority) => {
                // Handle type mismatch - convert string to NotePriority if needed
                const priorityId = priority._id as any;
                return (
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
                        <Typography variant="body2" color={isDark ? '#e8eaed' : '#202124'}>
                          {priorityId.charAt(0).toUpperCase() + priorityId.slice(1)}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={isDark ? '#e8eaed' : '#202124'}>
                          {priority.count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(priority.count / stats.totalNotes) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(getPriorityColor(priorityId), 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getPriorityColor(priorityId),
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};