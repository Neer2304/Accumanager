import { Card, CardContent, Typography, Box, useTheme, alpha } from "@mui/material";
import { Event } from "../types";
import { formatCurrency } from "../utils";

interface EventSummaryProps {
  event: Event;
  darkMode?: boolean;
}

export const EventSummary: React.FC<EventSummaryProps> = ({ event, darkMode = false }) => {
  const theme = useTheme();
  const budgetRemaining = event.totalBudget - event.totalSpent;
  const budgetPercentage = event.totalBudget > 0 
    ? Math.round((event.totalSpent / event.totalBudget) * 100) 
    : 0;

  const summaryItems = [
    {
      title: "Total Budget",
      value: formatCurrency(event.totalBudget),
      color: darkMode ? '#8ab4f8' : '#1a73e8',
      bgColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
    },
    {
      title: "Total Spent",
      value: formatCurrency(event.totalSpent),
      color: darkMode ? '#fbbc04' : '#fbbc04',
      bgColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
    },
    {
      title: "Remaining Budget",
      value: formatCurrency(budgetRemaining),
      color: budgetRemaining < 0 
        ? (darkMode ? '#f28b82' : '#d93025')
        : (darkMode ? '#81c995' : '#34a853'),
      bgColor: budgetRemaining < 0 
        ? (darkMode ? 'rgba(242, 139, 130, 0.1)' : 'rgba(217, 48, 37, 0.05)')
        : (darkMode ? 'rgba(129, 201, 149, 0.1)' : 'rgba(52, 168, 83, 0.05)'),
    },
    {
      title: "Budget Used",
      value: `${budgetPercentage}%`,
      color: budgetPercentage > 100 
        ? (darkMode ? '#f28b82' : '#d93025')
        : (darkMode ? '#8ab4f8' : '#1a73e8'),
      bgColor: budgetPercentage > 100 
        ? (darkMode ? 'rgba(242, 139, 130, 0.1)' : 'rgba(217, 48, 37, 0.05)')
        : (darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)'),
    },
    {
      title: "Sub-Events",
      value: event.subEvents.length.toString(),
      color: darkMode ? '#c58af9' : '#a142f4',
      bgColor: darkMode ? 'rgba(197, 138, 249, 0.1)' : 'rgba(161, 66, 244, 0.05)',
    },
    {
      title: "Total Expenses",
      value: event.expenses.length.toString(),
      color: darkMode ? '#8ab4f8' : '#4285f4',
      bgColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(66, 133, 244, 0.05)',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      planning: darkMode ? '#fbbc04' : '#fbbc04',
      active: darkMode ? '#81c995' : '#34a853',
      completed: darkMode ? '#8ab4f8' : '#4285f4',
      cancelled: darkMode ? '#f28b82' : '#ea4335',
      'in-progress': darkMode ? '#8ab4f8' : '#4285f4',
    };
    return colors[status] || (darkMode ? '#9aa0a6' : '#5f6368');
  };

  return (
    <Card sx={{ 
      borderRadius: '16px',
      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          fontWeight="bold"
          sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
        >
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
                borderRadius: '12px',
                border: `1px solid ${alpha(item.color, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode 
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 0.5,
                }}
                gutterBottom
              >
                {item.title}
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                color={item.color}
                sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
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
          bgcolor: darkMode ? alpha('#3c4043', 0.5) : alpha('#f8f9fa', 0.8),
          borderRadius: '12px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0'
        }}>
          <Typography 
            variant="subtitle1" 
            fontWeight="bold" 
            gutterBottom
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Additional Statistics
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 3,
            mt: 2
          }}>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  mb: 0.5,
                }}
              >
                Average Expense
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                {event.expenses.length > 0 
                  ? formatCurrency(event.totalSpent / event.expenses.length)
                  : formatCurrency(0)}
              </Typography>
            </Box>
            
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  mb: 0.5,
                }}
              >
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