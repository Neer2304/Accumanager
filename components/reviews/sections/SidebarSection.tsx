import React from 'react';
import { Card, CardContent, Typography, Stack, Box, Chip } from '@mui/material';
import { ReviewIcon } from '../ReviewsIcons';
import { REVIEWS_CONTENT } from '../ReviewsContent';

export const SidebarSection = () => {
  const { guidelines, importance, features } = REVIEWS_CONTENT;

  return (
    <Stack spacing={3}>
      {/* Review Guidelines */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <ReviewIcon name="Lightbulb" size="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
            {guidelines.title}
          </Typography>
          <Stack spacing={1}>
            {guidelines.items.map((item, index) => (
              <Typography key={index} variant="body2">
                • {item}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Why Review Matters */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <ReviewIcon name="Star" size="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
            {importance.title}
          </Typography>
          <Typography variant="body2" paragraph>
            {importance.description}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <ReviewIcon name="Business" size="small" color="primary" />
            <Typography variant="body2" fontWeight="medium">
              {importance.trustedBy}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Features to Mention */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <ReviewIcon name="Rocket" size="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
            {features.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {features.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};