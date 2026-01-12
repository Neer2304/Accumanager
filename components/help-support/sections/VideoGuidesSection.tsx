import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

export const VideoGuidesSection = () => {
  const { videoGuides } = HELP_SUPPORT_CONTENT;

  return (
    <>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        {videoGuides.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          "& > *": {
            flex: "1 1 calc(33.333% - 16px)",
            minWidth: 250,
          },
        }}
      >
        {videoGuides.videos.map((video, index) => (
          <Card
            key={index}
            sx={{
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <HelpSupportIcon
                name="Video"
                size="large"
                sx={{ color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {video.title}
              </Typography>
              <Chip label={video.duration} size="small" sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {video.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
};