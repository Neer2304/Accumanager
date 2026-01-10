// app/components/WellnessCoach.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Alert,
  Stack, Chip, LinearProgress, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { FitnessCenter, SelfImprovement, Coffee, Timer, HealthAndSafety } from '@mui/icons-material';

function MeetingWellnessCoach() {
  const [wellnessState, setWellnessState] = useState({
    meetingDuration: 45,
    breakReminder: false,
    postureScore: 75,
    hydrationReminder: false,
    stressLevel: 30
  });

  const [breakDialog, setBreakDialog] = useState(false);

  useEffect(() => {
    // Simulate wellness monitoring
    const interval = setInterval(() => {
      setWellnessState(prev => ({
        ...prev,
        meetingDuration: prev.meetingDuration + 1,
        breakReminder: prev.meetingDuration % 50 === 0,
        hydrationReminder: prev.meetingDuration % 30 === 0,
        postureScore: Math.max(50, prev.postureScore - 0.5),
        stressLevel: Math.min(100, prev.stressLevel + 0.2)
      }));

      if (wellnessState.meetingDuration % 50 === 0) {
        setBreakDialog(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const takeBreak = () => {
    setWellnessState(prev => ({
      ...prev,
      meetingDuration: 0,
      breakReminder: false,
      postureScore: 95,
      stressLevel: 20
    }));
    setBreakDialog(false);
  };

  return (
    <>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <HealthAndSafety sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Meeting Wellness Coach
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Your AI-powered health companion
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Timer />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">Continuous Meeting Time</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(wellnessState.meetingDuration / 60) * 100}
                      color={wellnessState.meetingDuration > 45 ? "error" : "primary"}
                    />
                    <Typography variant="h6">{wellnessState.meetingDuration} mins</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FitnessCenter />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">Posture Score</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={wellnessState.postureScore}
                      color={wellnessState.postureScore > 80 ? "success" : "warning"}
                    />
                    <Typography variant="h6">{wellnessState.postureScore}%</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SelfImprovement />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">Stress Level</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={wellnessState.stressLevel}
                      color={wellnessState.stressLevel > 60 ? "error" : "success"}
                    />
                    <Typography variant="h6">{wellnessState.stressLevel}%</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Wellness Recommendations</Typography>
              <Stack spacing={1}>
                {wellnessState.breakReminder && (
                  <Alert severity="warning" icon={<Coffee />}>
                    Time for a 5-minute break! Stretch and hydrate.
                  </Alert>
                )}
                {wellnessState.hydrationReminder && (
                  <Alert severity="info" icon={<Coffee />}>
                    Stay hydrated! Drink some water.
                  </Alert>
                )}
                {wellnessState.postureScore < 70 && (
                  <Alert severity="info">
                    Adjust your posture. Sit straight and relax your shoulders.
                  </Alert>
                )}
                {wellnessState.stressLevel > 50 && (
                  <Alert severity="info">
                    Take a deep breath. Practice 4-7-8 breathing technique.
                  </Alert>
                )}

                <Button
                  variant="contained"
                  startIcon={<SelfImprovement />}
                  onClick={() => setBreakDialog(true)}
                  sx={{ background: 'white', color: '#4CAF50' }}
                >
                  Take Wellness Break
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Break Dialog */}
      <Dialog open={breakDialog} onClose={() => setBreakDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SelfImprovement color="primary" />
            Wellness Break Recommended
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            You've been in meetings for {wellnessState.meetingDuration} minutes continuously. 
            Research shows that taking regular breaks improves focus and productivity by up to 40%.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Suggested Break Activities:</Typography>
            • Stand up and stretch for 2 minutes<br/>
            • Look away from screen for 20 seconds<br/>
            • Drink a glass of water<br/>
            • Practice deep breathing
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBreakDialog(false)}>Skip Break</Button>
          <Button variant="contained" onClick={takeBreak}>
            Take 5-min Break
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}