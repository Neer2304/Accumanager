import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

interface QuickHelpSectionProps {
  onAIClick: () => void;
  onTabChange: (index: number) => void;
}

export const QuickHelpSection = ({ onAIClick, onTabChange }: QuickHelpSectionProps) => {
  const { quickHelp } = HELP_SUPPORT_CONTENT;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          mb: 4,
          "& > *": {
            flex: "1 1 calc(50% - 16px)",
            minWidth: 300,
          },
        }}
      >
        {/* AI Assistant Card */}
        <Card sx={{ height: "100%", position: "relative", overflow: "visible" }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <HelpSupportIcon name="AI" size="extraLarge" sx={{ color: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {quickHelp.aiAssistant.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {quickHelp.aiAssistant.description}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<HelpSupportIcon name="AI" />}
              onClick={onAIClick}
              sx={{ borderRadius: "25px", px: 4 }}
            >
              {quickHelp.aiAssistant.buttonText}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {quickHelp.quickActions.title}
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<HelpSupportIcon name="Article" />}
                onClick={() => onTabChange(1)}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                {quickHelp.quickActions.browseDocumentation}
              </Button>
              <Button
                variant="outlined"
                startIcon={<HelpSupportIcon name="Video" />}
                onClick={() => onTabChange(3)}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                {quickHelp.quickActions.watchTutorials}
              </Button>
              <Button
                variant="outlined"
                startIcon={<HelpSupportIcon name="Message" />}
                onClick={() => onTabChange(2)}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                {quickHelp.quickActions.contactSupport}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Start Guides */}
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        {quickHelp.quickStartGuides.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
          "& > *": {
            flex: "1 1 calc(33.333% - 16px)",
            minWidth: 300,
          },
        }}
      >
        {/* First Time Setup */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box sx={{ mr: 2 }}>
                <HelpSupportIcon name="Business" color="primary" />
              </Box>
              <Typography variant="h6" fontWeight="600">
                {quickHelp.quickStartGuides.firstTimeSetup.title}
              </Typography>
            </Box>
            <Stack spacing={1}>
              {quickHelp.quickStartGuides.firstTimeSetup.steps.map((step, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <HelpSupportIcon name="CheckCircle" size="small" sx={{ color: "success.main", mt: 0.25 }} />
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Daily Operations */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box sx={{ mr: 2 }}>
                <HelpSupportIcon name="Inventory" color="primary" />
              </Box>
              <Typography variant="h6" fontWeight="600">
                {quickHelp.quickStartGuides.dailyOperations.title}
              </Typography>
            </Box>
            <Stack spacing={1}>
              {quickHelp.quickStartGuides.dailyOperations.steps.map((step, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <HelpSupportIcon name="CheckCircle" size="small" sx={{ color: "success.main", mt: 0.25 }} />
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Monthly Closing */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box sx={{ mr: 2 }}>
                <HelpSupportIcon name="Analytics" color="primary" />
              </Box>
              <Typography variant="h6" fontWeight="600">
                {quickHelp.quickStartGuides.monthlyClosing.title}
              </Typography>
            </Box>
            <Stack spacing={1}>
              {quickHelp.quickStartGuides.monthlyClosing.steps.map((step, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <HelpSupportIcon name="CheckCircle" size="small" sx={{ color: "success.main", mt: 0.25 }} />
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};