import { Card, CardContent, Typography, Box, useTheme, alpha } from "@mui/material";
import { Event } from "../types";
import { formatCurrency } from "../utils";

interface EventSummaryProps {
  event: Event;
}

export const EventSummary: React.FC<EventSummaryProps> = ({ event }) => {
  const theme = useTheme();
  const budgetRemaining = event.totalBudget - event.totalSpent;
  const budgetPercentage = event.totalBudget > 0 
    ? Math.round((event.totalSpent / event.totalBudget) * 100) 
    : 0;

  const summaryItems = [
    {
      title: "Total Budget",
      value: formatCurrency(event.totalBudget),
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.05),
    },
    {
      title: "Total Spent",
      value: formatCurrency(event.totalSpent),
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.05),
    },
    {
      title: "Remaining Budget",
      value: formatCurrency(budgetRemaining),
      color: budgetRemaining < 0 ? theme.palette.error.main : theme.palette.success.main,
      bgColor: budgetRemaining < 0 
        ? alpha(theme.palette.error.main, 0.05) 
        : alpha(theme.palette.success.main, 0.05),
    },
    {
      title: "Budget Used",
      value: `${budgetPercentage}%`,
      color: budgetPercentage > 100 ? theme.palette.error.main : theme.palette.primary.main,
      bgColor: budgetPercentage > 100 
        ? alpha(theme.palette.error.main, 0.05) 
        : alpha(theme.palette.primary.main, 0.05),
    },
    {
      title: "Sub-Events",
      value: event.subEvents.length.toString(),
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.05),
    },
    {
      title: "Total Expenses",
      value: event.expenses.length.toString(),
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.05),
    },
  ];

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Event Summary
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mt: 2
        }}>
          {summaryItems.map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                p: 2, 
                bgcolor: item.bgColor,
                borderRadius: 2,
                border: `1px solid ${alpha(item.color, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                }
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {item.title}
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                color={item.color}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Additional Stats */}
        <Box sx={{ 
          mt: 4,
          p: 3,
          bgcolor: alpha(theme.palette.grey[100], 0.5),
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Additional Statistics
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 2,
            mt: 2
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Average Expense
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {event.expenses.length > 0 
                  ? formatCurrency(event.totalSpent / event.expenses.length)
                  : formatCurrency(0)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Events Status
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                color={getStatusColor(event.status)}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    planning: "#ff9f43",
    active: "#2ecc71",
    completed: "#3498db",
    cancelled: "#e74c3c",
    'in-progress': "#3498db",
  };
  return colors[status] || "#95a5a6";
};