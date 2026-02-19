// components/googleanalytics/components/AnalyticsPageContent.tsx
import React from 'react';
import {
  Box,
  Container,
  useTheme
} from '@mui/material';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { AnalyticsGrid } from '@/components/analytics/AnalyticsGrid';
import { AnalyticsData } from '../hooks/useAnalyticsPage';

interface AnalyticsPageContentProps {
  data: AnalyticsData;
  darkMode: boolean;
  onBack: () => void;
  onDownload: () => void;
}

export const AnalyticsPageContent: React.FC<AnalyticsPageContentProps> = ({
  data,
  darkMode,
  onBack,
  onDownload
}) => {
  return (
    <>
      {/* Header Controls */}
      <Card
        title="Analytics Dashboard"
        subtitle={`Data from ${new Date(data.period.startDate).toLocaleDateString()} to ${new Date(data.period.endDate).toLocaleDateString()}`}
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<BackIcon />}
              sx={{
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={onDownload}
              startIcon={<DownloadIcon />}
              sx={{ 
                backgroundColor: '#34a853',
                '&:hover': { backgroundColor: '#2d9248' }
              }}
            >
              Download Report
            </Button>
          </Box>
        }
        hover
        sx={{ 
          mb: { xs: 2, sm: 3, md: 4 },
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}
      />

      {/* Charts Section */}
      <AnalyticsCharts
        monthlyData={data.monthlyData}
        categoryData={data.categoryData}
        darkMode={darkMode}
      />

      {/* Analytics Grid */}
      <AnalyticsGrid
        topProducts={data.topProducts}
        recentInvoices={data.recentInvoices}
        darkMode={darkMode}
      />
    </>
  );
};