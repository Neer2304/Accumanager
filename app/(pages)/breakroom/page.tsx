'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Fade } from '@mui/material';
import { triggerCelebration } from '@/utils/rewardService';
import { getDailySpark } from '@/data/entertainmentData';
import { MainLayout } from '@/components/Layout/MainLayout';
import { SelfImprovement, Celebration, Psychology } from '@mui/icons-material';

export default function BreakroomPage() {
  const [spark, setSpark] = useState<any>(null);

  useEffect(() => {
    setSpark(getDailySpark());
  }, []);

  return (
    <MainLayout title="Employee Breakroom">
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Take a Moment. ☕
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={6}>
          A quick break boosts productivity by up to 20%. Enjoy a daily insight or a small celebration.
        </Typography>

        <Stack spacing={4}>
          {/* Daily Spark Card */}
          {spark && (
            <Fade in timeout={1000}>
              <Card sx={{ bgcolor: 'primary.dark', color: 'white', borderRadius: 4, p: 2 }}>
                <CardContent>
                  <Psychology sx={{ fontSize: 40, mb: 2, opacity: 0.8 }} />
                  <Typography variant="h5" italic sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{spark.content}"
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    — {spark.author}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Interactive Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<Celebration />}
              onClick={triggerCelebration}
              sx={{ borderRadius: 3, py: 2, px: 4, bgcolor: '#ff4757', '&:hover': { bgcolor: '#ff6b81' } }}
            >
              Celebrate Success
            </Button>
            
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<SelfImprovement />}
              sx={{ borderRadius: 3, py: 2, px: 4 }}
              onClick={() => alert("Deep breath in... and out. You're doing great!")}
            >
              Start Zen Minute
            </Button>
          </Stack>
        </Stack>
      </Box>
    </MainLayout>
  );
}