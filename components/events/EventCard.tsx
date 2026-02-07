// components/events/EventCard.tsx - UPDATED WITH CORRECT ROUTING
import { Card, CardContent, Box, Typography, IconButton, Chip, Avatar, useTheme, alpha, Button } from "@mui/material";
import { MoreVert as MoreVertIcon, CalendarToday, AttachMoney, AccountBalance, ArrowForward } from "@mui/icons-material";
import Link from "next/link";
import { Event } from "./EventTypes";

interface EventCardProps {
  event: Event;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onMenuOpen }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getAvatarColor = (name: string) => {
    const colors = [
      '#4285f4', '#34a853', '#ea4335', '#fbbc04', '#8ab4f8',
      '#81c995', '#f28b82', '#fdd663', '#5f6368', '#9aa0a6',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming': return '#4285f4';
      case 'ongoing': return '#fbbc04';
      case 'completed': return '#34a853';
      case 'cancelled': return '#ea4335';
      case 'planned': return '#8ab4f8';
      case 'planning': return '#fbbc04';
      case 'active': return '#34a853';
      default: return '#9aa0a6';
    }
  };

  // Calculate budget usage percentage
  const budgetUsage = event.totalBudget > 0 
    ? Math.round((event.totalSpent / event.totalBudget) * 100) 
    : 0;
  const remainingBudget = event.totalBudget - event.totalSpent;

  // Check what type of events you have in your app
  const eventTypeColors: { [key: string]: string } = {
    marriage: '#ff6b6b',
    business: '#4ecdc4', 
    personal: '#45b7d1',
    travel: '#96ceb4',
    festival: '#feca57',
    conference: '#4285f4',
    workshop: '#34a853',
    training: '#fbbc04',
    other: '#9aa0a6',
  };

  const eventTypeColor = eventTypeColors[event.type?.toLowerCase()] || '#4285f4';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode ? 8 : 4,
        },
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        position: 'relative',
      }}
    >
      {/* Status Indicator */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: getStatusColor(event.status),
      }} />
      
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: getAvatarColor(event.name),
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {event.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {event.name}
              </Typography>
              <Chip
                label={event.type}
                size="small"
                sx={{
                  backgroundColor: darkMode ? alpha(eventTypeColor, 0.1) : alpha(eventTypeColor, 0.08),
                  color: eventTypeColor,
                  borderColor: alpha(eventTypeColor, 0.3),
                }}
              />
            </Box>
          </Box>
          
          <IconButton
            size="small"
            onClick={(e) => onMenuOpen(e, event._id)}
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Event Details */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <CalendarToday sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </Typography>
          </Box>
          
          {event.description && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: '0.875rem',
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {event.description}
            </Typography>
          )}
        </Box>

        {/* Budget Stats Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 1.5,
          mb: 2.5,
          p: 1.5,
          borderRadius: '12px',
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 0.5 }}>
              Total Budget
            </Typography>
            <Typography variant="body2" fontWeight={600} color="#34a853">
              ₹{(event.totalBudget || 0).toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 0.5 }}>
              Spent
            </Typography>
            <Typography variant="body2" fontWeight={600} color="#ea4335">
              ₹{(event.totalSpent || 0).toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 0.5 }}>
              Remaining
            </Typography>
            <Typography variant="body2" fontWeight={600} color="#4285f4">
              ₹{remainingBudget.toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block', mb: 0.5 }}>
              Status
            </Typography>
            <Chip
              label={event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Unknown'}
              size="small"
              sx={{
                backgroundColor: darkMode ? alpha(getStatusColor(event.status), 0.1) : alpha(getStatusColor(event.status), 0.08),
                color: getStatusColor(event.status),
                borderColor: alpha(getStatusColor(event.status), 0.3),
              }}
            />
          </Box>
        </Box>

        {/* Budget Usage Progress */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Budget Usage
            </Typography>
            <Typography variant="caption" fontWeight={600} sx={{ color: budgetUsage > 80 ? '#ea4335' : budgetUsage > 60 ? '#fbbc04' : '#34a853' }}>
              {budgetUsage}%
            </Typography>
          </Box>
          <Box sx={{ 
            height: 6, 
            backgroundColor: darkMode ? '#3c4043' : '#e0e0e0',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <Box 
              sx={{ 
                height: '100%',
                width: `${Math.min(budgetUsage, 100)}%`,
                backgroundColor: budgetUsage > 80 ? '#ea4335' : budgetUsage > 60 ? '#fbbc04' : '#34a853',
                borderRadius: 3,
              }} 
            />
          </Box>
        </Box>

        {/* View Details Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 1.5,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          mt: 'auto',
        }}>
          <Button
            variant="text"
            size="small"
            component={Link}
            href={`/events/${event._id}`}
            endIcon={<ArrowForward fontSize="small" />}
            sx={{ 
              color: darkMode ? '#e8eaed' : '#202124',
              textDecoration: 'none',
              '&:hover': {
                color: '#4285f4',
              }
            }}
          >
            View Details
          </Button>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontStyle: 'italic',
            }}
          >
            {budgetUsage > 100 ? 'Over Budget!' : budgetUsage > 80 ? 'High Spending' : 'On Track'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};