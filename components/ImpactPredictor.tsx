// app/components/ImpactPredictor.tsx
"use client";

import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Slider, FormControl,
  InputLabel, Select, MenuItem, Button, Stack, Chip, Alert
} from '@mui/material';
import { TrendingUp, Analytics, Calculate } from '@mui/icons-material';

function MeetingImpactPredictor() {
  const [meetingParams, setMeetingParams] = useState({
    duration: 60,
    participants: 5,
    complexity: 5,
    preparation: 5,
    followUp: 5
  });

  const [prediction, setPrediction] = useState<{
    roi: number;
    successProbability: number;
    timeValue: number;
    recommendations: string[];
  } | null>(null);

  const calculateImpact = () => {
    // Advanced impact calculation algorithm
    const baseROI = (meetingParams.participants * meetingParams.complexity * meetingParams.followUp) / 10;
    const successProb = (meetingParams.preparation * meetingParams.followUp * 2) + 40;
    const timeValue = (meetingParams.duration * meetingParams.participants * 50) / 60; // $50/hour assumption

    const recommendations = [];
    if (meetingParams.duration > 90) recommendations.push("Consider splitting into two shorter meetings");
    if (meetingParams.preparation < 6) recommendations.push("Increase preparation time for better outcomes");
    if (meetingParams.participants > 8) recommendations.push("Reduce participants for faster decisions");

    setPrediction({
      roi: Math.round(baseROI * 100) / 100,
      successProbability: Math.min(95, Math.round(successProb)),
      timeValue: Math.round(timeValue),
      recommendations
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Analytics color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Meeting Impact Predictor
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Meeting Parameters</Typography>
            <Stack spacing={3}>
              <Box>
                <Typography gutterBottom>Duration: {meetingParams.duration} mins</Typography>
                <Slider
                  value={meetingParams.duration}
                  onChange={(_, value) => setMeetingParams(prev => ({ ...prev, duration: value as number }))}
                  min={15}
                  max={240}
                  step={15}
                />
              </Box>

              <Box>
                <Typography gutterBottom>Participants: {meetingParams.participants}</Typography>
                <Slider
                  value={meetingParams.participants}
                  onChange={(_, value) => setMeetingParams(prev => ({ ...prev, participants: value as number }))}
                  min={2}
                  max={20}
                />
              </Box>

              <Box>
                <Typography gutterBottom>Complexity: {meetingParams.complexity}/10</Typography>
                <Slider
                  value={meetingParams.complexity}
                  onChange={(_, value) => setMeetingParams(prev => ({ ...prev, complexity: value as number }))}
                  min={1}
                  max={10}
                />
              </Box>

              <Box>
                <Typography gutterBottom>Preparation: {meetingParams.preparation}/10</Typography>
                <Slider
                  value={meetingParams.preparation}
                  onChange={(_, value) => setMeetingParams(prev => ({ ...prev, preparation: value as number }))}
                  min={1}
                  max={10}
                />
              </Box>

              <Button
                variant="contained"
                startIcon={<Calculate />}
                onClick={calculateImpact}
                size="large"
              >
                Predict Impact
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            {prediction && (
              <>
                <Typography variant="h6" gutterBottom>Predicted Impact</Typography>
                <Stack spacing={2}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="primary.main" variant="h4" fontWeight="bold">
                        {prediction.roi}x ROI
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expected Return on Investment
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="success.main" variant="h4" fontWeight="bold">
                        {prediction.successProbability}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Success Probability
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="info.main" variant="h4" fontWeight="bold">
                        ${prediction.timeValue}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time Value Investment
                      </Typography>
                    </CardContent>
                  </Card>

                  {prediction.recommendations.length > 0 && (
                    <Alert severity="warning">
                      <Typography variant="subtitle2" gutterBottom>Optimization Tips:</Typography>
                      {prediction.recommendations.map((rec, index) => (
                        <Typography key={index} variant="body2">• {rec}</Typography>
                      ))}
                    </Alert>
                  )}
                </Stack>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}