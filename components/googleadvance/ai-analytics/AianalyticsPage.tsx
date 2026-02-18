// app/(pages)/advance/ai-analytics/page.tsx

'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  useMediaQuery,
} from '@mui/material'
import {
  Psychology,
  Refresh,
  ModelTraining,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import {
  googleColors,
  getCurrentColors,
  getButtonColor,
  PageHeader,
  UnderDevelopmentBanner,
  StatsCard,
  TabPanel,
  PredictionCard,
  InsightCard,
  AIQuerySection,
  ConfidenceSlider,
  Prediction,
  Insight,
} from '@/components/googleadvance'

export default function AIAnalyticsPage() {
  const { mode } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [tabValue, setTabValue] = useState(0);
  const [confidence, setConfidence] = useState(85);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  const currentColors = getCurrentColors(mode);
  const buttonColor = getButtonColor(mode);

  // Fetch data (same as before)
  useEffect(() => {
    // ... fetch logic
  }, []);

  const breadcrumbs = [
    { label: 'Advance', href: '/advance' },
    { label: 'AI Analytics' }
  ];

  const headerActions = (
    <>
      <Button
        variant="outlined"
        startIcon={<Refresh />}
        disabled
        sx={{
          border: `1px solid ${currentColors.border}`,
          color: buttonColor,
        }}
      >
        {isMobile ? '' : 'Refresh'}
      </Button>
      <Button
        variant="outlined"
        startIcon={<ModelTraining />}
        disabled
        sx={{
          border: `1px solid ${currentColors.border}`,
          color: buttonColor,
        }}
      >
        {isMobile ? '' : 'Train AI'}
      </Button>
    </>
  );

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 2,
      backgroundColor: currentColors.background,
      minHeight: '100vh',
    }}>
      <UnderDevelopmentBanner 
        currentColors={currentColors}
        mode={mode}
        isMobile={isMobile}
      />

      <PageHeader
        title="🤖 AI Analytics Dashboard"
        subtitle="Real-time predictions, smart insights, and actionable recommendations"
        icon={<Psychology />}
        actions={headerActions}
        breadcrumbs={breadcrumbs}
        currentColors={currentColors}
        isMobile={isMobile}
      />

      {/* Stats Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <StatsCard
          label="Prediction Accuracy"
          value="94.7%"
          icon={<Psychology />}
          currentColors={currentColors}
          isMobile={isMobile}
        />
        <StatsCard
          label="Active Insights"
          value={insights.length}
          icon={<Psychology />}
          currentColors={currentColors}
          isMobile={isMobile}
        />
        <StatsCard
          label="AI Confidence"
          value={`${confidence}%`}
          icon={<Psychology />}
          currentColors={currentColors}
          isMobile={isMobile}
        />
      </Box>

      {/* AI Query Section */}
      <AIQuerySection
        currentColors={currentColors}
        buttonColor={buttonColor}
        isMobile={isMobile}
      />

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Predictions" />
        <Tab label="Insights" />
        <Tab label="Analytics" />
      </Tabs>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {/* Predictions content */}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Insights content */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ConfidenceSlider
          value={confidence}
          onChange={setConfidence}
          currentColors={currentColors}
          isMobile={isMobile}
        />
      </TabPanel>
    </Box>
  );
}