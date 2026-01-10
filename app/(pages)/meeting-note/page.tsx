"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Stack,
  LinearProgress,
  Slider,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Container,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  HealthAndSafety,
  Balance,
  Analytics,
  Timeline,
  Mood,
  SentimentSatisfied,
  SentimentDissatisfied,
  Calculate,
  ThumbUp,
  Groups,
  FitnessCenter,
  SelfImprovement,
  Coffee,
  Timer,
  Lock,
  Logout,
  Dashboard,
  Rocket,
  Science,
  Security,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

// Interface definitions
interface MeetingDNA {
  communicationStyle: 'collaborative' | 'directive' | 'analytical' | 'creative';
  decisionSpeed: number;
  participationBalance: number;
  outcomeEfficiency: number;
  conflictFrequency: number;
  innovationScore: number;
  pattern: string[];
  recommendations: string[];
}

interface EmotionalState {
  participant: string;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  attention: number;
  stressLevel: number;
  suggestions: string[];
}

export default function ProtectedMeetingNotesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authToken = sessionStorage.getItem('meeting_note_auth_token');
      const email = sessionStorage.getItem('meeting_note_user');
      const timestamp = sessionStorage.getItem('meeting_note_timestamp');

      if (authToken === 'verified_access_2024' && email && timestamp) {
        // Check if session is less than 8 hours old
        const sessionAge = Date.now() - parseInt(timestamp);
        const eightHours = 8 * 60 * 60 * 1000;
        
        if (sessionAge < eightHours) {
          setAuthenticated(true);
          setUserEmail(email);
        } else {
          // Session expired
          sessionStorage.clear();
          router.push('/check/meeting-note');
        }
      } else {
        // Not authenticated, redirect to login
        router.push('/check/meeting-note');
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/check/meeting-note');
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#667eea', mb: 3 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Securing access...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!authenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <MainLayout title="Meeting Intelligence">
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        minHeight: '100vh',
      }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Security Header */}
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            borderRadius: 3,
            background: 'rgba(20, 20, 20, 0.9)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}>
                    <Rocket sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" component="h1" fontWeight="bold" sx={{ 
                      color: 'white',
                      background: 'linear-gradient(90deg, #667eea, #ec4899)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      MEETING INTELLIGENCE
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                      Advanced AI-Powered Analytics Platform
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  icon={<Security />}
                  label="SECURE SESSION"
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(34, 197, 94, 0.1)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                />
                <IconButton
                  onClick={() => setShowLogoutDialog(true)}
                  sx={{
                    color: '#94a3b8',
                    '&:hover': {
                      color: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.1)',
                    }
                  }}
                >
                  <Logout />
                </IconButton>
              </Box>
            </Box>
            
            <Divider sx={{ mt: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                🔐 Authenticated User: {userEmail}
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569' }}>
                Session Active • All Activities Logged
              </Typography>
            </Box>
          </Paper>

          {/* Dashboard Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Meeting DNA Analysis */}
            <Card sx={{ 
              borderRadius: 3,
              background: 'rgba(20, 20, 20, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Psychology sx={{ fontSize: 32, color: '#667eea' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                      Meeting DNA Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      AI-Powered Behavioral Patterns & Optimization
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                      Team Performance Radar
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <RadarChart 
                        data={[
                          { subject: 'Decision Speed', A: 7, fullMark: 10 },
                          { subject: 'Participation', A: 6, fullMark: 10 },
                          { subject: 'Efficiency', A: 8, fullMark: 10 },
                          { subject: 'Innovation', A: 9, fullMark: 10 },
                          { subject: 'Conflict Mgmt', A: 7, fullMark: 10 },
                        ]} 
                        width={300} 
                        height={250}
                      >
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={12} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#94a3b8" />
                        <Radar
                          name="Team Performance"
                          dataKey="A"
                          stroke="#667eea"
                          fill="#667eea"
                          fillOpacity={0.3}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(30, 41, 59, 0.9)',
                            border: '1px solid #475569',
                            borderRadius: 8,
                            color: 'white'
                          }}
                        />
                        <Legend />
                      </RadarChart>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
                      AI Insights & Recommendations
                    </Typography>
                    <Stack spacing={2}>
                      <Card variant="outlined" sx={{ 
                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                        borderColor: '#374151',
                      }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ color: '#667eea', mb: 1 }}>
                            🎯 Key Pattern
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Most decisions happen in first 15 minutes. Creative brainstorming peaks at 30-minute mark.
                          </Typography>
                        </CardContent>
                      </Card>
                      
                      <Card variant="outlined" sx={{ 
                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                        borderColor: '#374151',
                      }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ color: '#667eea', mb: 1 }}>
                            ⚡ Optimization Tips
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            • Schedule shorter, focused meetings (25 mins)
                            • Include 5-min silent brainstorming
                            • Rotate meeting facilitators weekly
                          </Typography>
                        </CardContent>
                      </Card>
                      
                      <Button
                        variant="contained"
                        startIcon={<TrendingUp />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: 2,
                          py: 1,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          }
                        }}
                      >
                        Generate Detailed Report
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Emotional Intelligence Dashboard */}
            <Card sx={{ 
              borderRadius: 3,
              background: 'rgba(20, 20, 20, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Psychology sx={{ fontSize: 32, color: '#10b981' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                      Emotional Intelligence Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Real-time participant sentiment & engagement tracking
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                  },
                  gap: 2
                }}>
                  {[
                    { name: "You", engagement: 85, sentiment: "positive" as const },
                    { name: "John Doe", engagement: 45, sentiment: "neutral" as const },
                    { name: "Sarah Smith", engagement: 95, sentiment: "positive" as const },
                  ].map((person, index) => (
                    <Card 
                      key={index} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2,
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderColor: '#374151',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: person.sentiment === 'positive' ? '#10b98120' :
                                     person.sentiment === 'neutral' ? '#ef444420' : '#f59e0b20',
                            color: person.sentiment === 'positive' ? '#10b981' :
                                   person.sentiment === 'neutral' ? '#ef4444' : '#f59e0b',
                          }}>
                            {person.sentiment === 'positive' ? <SentimentSatisfied /> : <Mood />}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium" sx={{ color: 'white' }}>
                              {person.name}
                            </Typography>
                            <Chip 
                              label={person.sentiment} 
                              size="small"
                              sx={{
                                bgcolor: person.sentiment === 'positive' ? '#10b98120' :
                                         person.sentiment === 'neutral' ? '#ef444420' : '#f59e0b20',
                                color: person.sentiment === 'positive' ? '#10b981' :
                                       person.sentiment === 'neutral' ? '#ef4444' : '#f59e0b',
                                border: 'none',
                                fontWeight: 'medium',
                              }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                              Engagement Level
                            </Typography>
                            <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>
                              {person.engagement}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={person.engagement} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: '#1e293b',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: person.engagement > 70 ? '#10b981' : 
                                        person.engagement > 40 ? '#f59e0b' : '#ef4444',
                              }
                            }}
                          />
                        </Box>

                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {person.engagement > 70 ? 'Highly engaged and contributing' :
                           person.engagement > 40 ? 'Moderate engagement' : 'Needs attention'}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Security Status Card */}
            <Card sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              overflow: 'hidden',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Security sx={{ fontSize: 32, color: '#667eea' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                      Session Security Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      All activities are encrypted and monitored
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={100} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: '#1e293b',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#10b981',
                        }
                      }}
                    />
                  </Box>
                  <Chip 
                    label="ACTIVE & SECURE" 
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ade80',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Logout Dialog */}
      <Dialog 
        open={showLogoutDialog} 
        onClose={() => setShowLogoutDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: 3,
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock color="error" />
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#94a3b8', mb: 2 }}>
            Are you sure you want to end your secure session? All meeting analytics will be saved.
          </Typography>
          <Alert severity="warning" sx={{ 
            bgcolor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
          }}>
            You will need to re-authenticate to access this platform again.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowLogoutDialog(false)}
            sx={{ color: '#94a3b8' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogout}
            variant="contained"
            color="error"
            startIcon={<Logout />}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              }
            }}
          >
            Logout & Secure
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}