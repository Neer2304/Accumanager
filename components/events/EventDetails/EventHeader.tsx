"use client";

import { Box, Typography, Chip, Stack, Avatar, LinearProgress, useTheme, alpha } from "@mui/material";
import { ArrowBack as ArrowBackIcon, CalendarMonth, AccountBalanceWallet } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Event } from "../types";
import { getEventTypeColor, getEventAvatar, formatDate, formatCurrency, calculateBudgetPercentage } from "../utils";
import { AddIcon } from "@/assets/icons/InventoryIcons";
import { FolderIcon } from "lucide-react";

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Button } from "@/components/ui/Button";

interface EventHeaderProps {
  event: Event;
  isMobile: boolean;
  onAddSubEvent: () => void;
  onAddExpense: () => void;
  darkMode?: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ 
  event, 
  isMobile, 
  onAddSubEvent, 
  onAddExpense,
  darkMode = false,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const budgetPercentage = calculateBudgetPercentage(event.totalSpent, event.totalBudget);

  return (
    <Card
      hover
      sx={{ 
        mb: { xs: 2, sm: 3, md: 4 },
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {isMobile ? (
          <Button
            variant="outlined"
            onClick={() => router.push("/events")}
            iconLeft={<ArrowBackIcon />}
            size="small"
            fullWidth
            sx={{ 
              mb: 3,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
              }
            }}
          >
            Back to Events
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => router.push("/events")}
            iconLeft={<ArrowBackIcon />}
            size="small"
            sx={{ 
              mb: 3,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
              }
            }}
          >
            Back to Events
          </Button>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 3 }
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: getEventTypeColor(event.type),
                  width: { xs: 48, sm: 56, md: 64 },
                  height: { xs: 48, sm: 56, md: 64 },
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 'bold',
                }}
              >
                {getEventAvatar(event.type)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  component="h1" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  }}
                >
                  {event.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2,
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  {event.description}
                </Typography>
              </Box>
            </Box>

            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mb: 3,
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Chip
                label={event.type}
                sx={{
                  bgcolor: getEventTypeColor(event.type),
                  color: 'white',
                  textTransform: 'capitalize',
                  height: { xs: 24, sm: 32 },
                  fontWeight: 500,
                  borderRadius: '8px',
                }}
              />
              <Chip
                label={event.status}
                variant="outlined"
                sx={{ 
                  height: { xs: 24, sm: 32 },
                  fontWeight: 500,
                  borderRadius: '8px',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '& .MuiChip-label': {
                    textTransform: 'capitalize',
                  }
                }}
              />
            </Stack>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              alignItems: { xs: 'flex-start', sm: 'center' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368', 
                  fontSize: { xs: 16, sm: 20 } 
                }} />
                <Typography 
                  variant={isMobile ? "body2" : "body1"}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWallet sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368', 
                  fontSize: { xs: 16, sm: 20 } 
                }} />
                <Typography 
                  variant={isMobile ? "body2" : "body1"}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Spent: <strong>{formatCurrency(event.totalSpent)}</strong>
                  {event.totalBudget > 0 &&
                    ` / ${formatCurrency(event.totalBudget)}`}
                </Typography>
              </Box>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexShrink: 0
            }}>
              <Button
                variant="outlined"
                onClick={onAddSubEvent}
                size="medium"
                sx={{ 
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
                  }
                }}
              >
                <FolderIcon style={{ marginRight: 8, fontSize: 18 }} />
                Add Sub-Event
              </Button>
              <Button
                variant="contained"
                onClick={onAddExpense}
                size="medium"
                sx={{ 
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' }
                }}
              >
                <AddIcon/>
                Add Expense
              </Button>
            </Box>
          )}
        </Box>

        {event.totalBudget > 0 && (
          <Box sx={{ 
            mt: 4, 
            p: { xs: 2, sm: 3 }, 
            bgcolor: darkMode ? 'rgba(66, 133, 244, 0.08)' : 'rgba(66, 133, 244, 0.05)',
            borderRadius: '12px',
            border: `1px solid ${darkMode ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.15)'}`
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="medium"
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                Budget Progress
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                color={budgetPercentage > 100 ? "#ea4335" : "#34a853"}
              >
                {budgetPercentage}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                {formatCurrency(event.totalSpent)} / {formatCurrency(event.totalBudget)}
              </Typography>
              <Typography 
                variant="caption" 
                fontWeight="bold"
                color={event.totalBudget - event.totalSpent < 0 ? "#ea4335" : "#34a853"}
              >
                {formatCurrency(event.totalBudget - event.totalSpent)} remaining
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(budgetPercentage, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: budgetPercentage > 100 ? "#ea4335" : "#34a853",
                  borderRadius: 4,
                }
              }}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};