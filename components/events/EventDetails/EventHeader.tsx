import { Box, Typography, Button, Chip, Stack, Avatar, LinearProgress, useTheme, alpha } from "@mui/material";
import { ArrowBack as ArrowBackIcon, CalendarMonth, AccountBalanceWallet } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Event } from "../types";
import { getEventTypeColor, getEventAvatar, formatDate, formatCurrency, calculateBudgetPercentage } from "../utils";
import { AddIcon } from "@/assets/icons/InventoryIcons";
import { FolderIcon } from "lucide-react";

interface EventHeaderProps {
  event: Event;
  isMobile: boolean;
  onAddSubEvent: () => void;
  onAddExpense: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ 
  event, 
  isMobile, 
  onAddSubEvent, 
  onAddExpense 
}) => {
  const router = useRouter();
  const theme = useTheme();
  const budgetPercentage = calculateBudgetPercentage(event.totalSpent, event.totalBudget);

  return (
    <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
      {isMobile && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/events")}
          sx={{ mb: 2 }}
          size="small"
          fullWidth
        >
          Back to Events
        </Button>
      )}

      {!isMobile && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/events")}
          sx={{ mb: 2 }}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: getEventTypeColor(event.type),
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                fontSize: { xs: '1.5rem', sm: '2rem' },
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
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {event.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
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
              mb: 2,
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
              }}
            />
            <Chip
              label={event.status}
              variant="outlined"
              color={
                event.status === "completed"
                  ? "success"
                  : event.status === "active"
                  ? "primary"
                  : event.status === "cancelled"
                  ? "error"
                  : "default"
              }
              sx={{ height: { xs: 24, sm: 32 } }}
            />
          </Stack>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 3 },
            alignItems: { xs: 'flex-start', sm: 'center' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 20 } }} />
              <Typography variant={isMobile ? "body2" : "body1"}>
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceWallet sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 20 } }} />
              <Typography variant={isMobile ? "body2" : "body1"}>
                Spent: <strong>{formatCurrency(event.totalSpent)}</strong>
                {event.totalBudget > 0 &&
                  ` / ${formatCurrency(event.totalBudget)}`}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          width: { xs: '100%', sm: 'auto' }
        }}>
          {!isMobile && (
            <>
              <Button
                variant="outlined"
                startIcon={<FolderIcon />}
                onClick={onAddSubEvent}
                size={isMobile ? "small" : "medium"}
              >
                Add Sub-Event
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddExpense}
                size={isMobile ? "small" : "medium"}
              >
                Add Expense
              </Button>
            </>
          )}
        </Box>
      </Box>

      {event.totalBudget > 0 && (
        <Box sx={{ 
          mt: 3, 
          p: { xs: 2, sm: 3 }, 
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Budget Progress
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              color={budgetPercentage > 100 ? "error.main" : "primary.main"}
            >
              {budgetPercentage}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formatCurrency(event.totalSpent)} / {formatCurrency(event.totalBudget)}
            </Typography>
            <Typography 
              variant="caption" 
              fontWeight="bold"
              color={event.totalBudget - event.totalSpent < 0 ? "error.main" : "success.main"}
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
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                backgroundColor: budgetPercentage > 100 ? theme.palette.error.main : theme.palette.primary.main,
                borderRadius: 4,
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};