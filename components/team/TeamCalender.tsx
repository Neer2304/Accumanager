"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Add,
  Today,
  CalendarMonth,
  Event,
  VideoCall,
  Group,
  ArrowBack,
  ArrowForward,
  FilterList,
  Search,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

export default function TeamCalendarPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const darkMode = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("month");

  const fetchEvents = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const createEvent = () => {
    console.log("Creating new event");
  };

  return (
    <MainLayout title="Team Calendar">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Team Calendar
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Schedule meetings, track events, and manage team availability
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Today />}
                onClick={() => setView('day')}
                color={view === 'day' ? 'primary' : 'inherit'}
              >
                Day
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarMonth />}
                onClick={() => setView('week')}
                color={view === 'week' ? 'primary' : 'inherit'}
              >
                Week
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarMonth />}
                onClick={() => setView('month')}
                color={view === 'month' ? 'primary' : 'inherit'}
              >
                Month
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={createEvent}
              >
                New Event
              </Button>
            </Box>
          </Box>

          {/* Calendar Controls */}
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                  <Button variant="outlined" startIcon={<Today />}>
                    Today
                  </Button>
                  <IconButton>
                    <ArrowForward />
                  </IconButton>
                </Box>
                
                <Box sx={{ 
                  flex: 1,
                  textAlign: { xs: 'center', sm: 'center' }
                }}>
                  <Typography variant="h6">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  justifyContent: { xs: 'center', sm: 'flex-end' }
                }}>
                  <TextField
                    size="small"
                    placeholder="Search events..."
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: <Search fontSize="small" />,
                    }}
                  />
                  <IconButton>
                    <FilterList />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Calendar Content */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 400,
                flexDirection: 'column',
                gap: 2
              }}>
                <CircularProgress />
                <Typography color="text.secondary">
                  Loading calendar events...
                </Typography>
              </Box>
            ) : (
              <>
                <Alert severity="info" sx={{ m: 2 }}>
                  Calendar API integration is required to display events. Connect to your backend to enable calendar features.
                </Alert>

                <Box sx={{ p: 2 }}>
                  {/* Calendar Header */}
                  <Paper sx={{ 
                    p: 2, 
                    mb: 2,
                    bgcolor: darkMode ? '#303134' : '#f8f9fa' 
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <Box key={day} sx={{ 
                          flex: 1, 
                          textAlign: 'center', 
                          p: 1 
                        }}>
                          <Typography variant="body2" fontWeight={600}>
                            {day}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>

                  {/* Calendar Days Placeholder */}
                  <Box sx={{ 
                    height: 400, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    borderRadius: 1
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CalendarMonth sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Calendar View
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Connect to calendar API to view events
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={createEvent}
                      >
                        Create First Event
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              <Event sx={{ verticalAlign: 'middle', mr: 1 }} />
              Upcoming Events
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Events will appear here after calendar API integration
            </Alert>

            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ 
                flex: '1 1 250px',
                minWidth: { xs: '100%', sm: '250px' }
              }}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <VideoCall sx={{ fontSize: 40, color: '#4285f4', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Team Meetings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Schedule and join team meetings
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ 
                flex: '1 1 250px',
                minWidth: { xs: '100%', sm: '250px' }
              }}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Group sx={{ fontSize: 40, color: '#34a853', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Team Events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Company events and celebrations
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ 
                flex: '1 1 250px',
                minWidth: { xs: '100%', sm: '250px' }
              }}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <CalendarMonth sx={{ fontSize: 40, color: '#fbbc05', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Deadlines
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Project deadlines and milestones
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}