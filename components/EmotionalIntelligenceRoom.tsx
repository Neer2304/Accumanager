// app/components/EmotionalIntelligenceRoom.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Chip,
  LinearProgress, Alert, Stack
} from '@mui/material';
import { Mood, SentimentSatisfied, SentimentDissatisfied, Psychology } from '@mui/icons-material';

interface EmotionalState {
  participant: string;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  attention: number;
  stressLevel: number;
  suggestions: string[];
}

function EmotionalIntelligenceRoom() {
  const [emotionalStates, setEmotionalStates] = useState<EmotionalState[]>([]);

  useEffect(() => {
    // Simulate emotional intelligence analysis
    const states: EmotionalState[] = [
      {
        participant: "You",
        engagement: 85,
        sentiment: "positive",
        attention: 90,
        stressLevel: 20,
        suggestions: ["Take a 2-min break", "Drink water"]
      },
      {
        participant: "John Doe",
        engagement: 45,
        sentiment: "neutral",
        attention: 60,
        stressLevel: 65,
        suggestions: ["Ask for their opinion", "Check if they need clarification"]
      },
      {
        participant: "Sarah Smith",
        engagement: 95,
        sentiment: "positive",
        attention: 85,
        stressLevel: 15,
        suggestions: ["Leverage their energy", "Assign leadership role"]
      }
    ];
    setEmotionalStates(states);
  }, []);

  return (
    <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Psychology color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Emotional Intelligence Dashboard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {emotionalStates.map((state, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 
                      state.sentiment === 'positive' ? 'success.main' :
                      state.sentiment === 'negative' ? 'error.main' : 'warning.main'
                    }}>
                      {state.sentiment === 'positive' ? <SentimentSatisfied /> :
                       state.sentiment === 'negative' ? <SentimentDissatisfied /> : <Mood />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{state.participant}</Typography>
                      <Chip 
                        label={state.sentiment} 
                        size="small"
                        color={
                          state.sentiment === 'positive' ? 'success' :
                          state.sentiment === 'negative' ? 'error' : 'warning'
                        }
                      />
                    </Box>
                  </Box>

                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption">Engagement</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={state.engagement} 
                        color={state.engagement > 70 ? "success" : state.engagement > 40 ? "warning" : "error"}
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption">Attention</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={state.attention} 
                        color={state.attention > 70 ? "success" : state.attention > 40 ? "warning" : "error"}
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption">Stress Level</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={state.stressLevel} 
                        color={state.stressLevel > 60 ? "error" : state.stressLevel > 30 ? "warning" : "success"}
                      />
                    </Box>
                  </Stack>

                  {state.suggestions.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Suggestions:</Typography>
                      {state.suggestions.map((suggestion, idx) => (
                        <Typography key={idx} variant="body2">• {suggestion}</Typography>
                      ))}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}