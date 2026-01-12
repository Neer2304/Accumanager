import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

export const HeaderSection = () => {
  const { header, page } = HELP_SUPPORT_CONTENT;

  return (
    <Paper
      sx={{
        p: { xs: 2.5, sm: 4, md: 6 },
        mb: { xs: 3, sm: 5, md: 6 },
        textAlign: "center",
        background: header.gradient,
        color: "white",
        borderRadius: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <HelpSupportIcon
          name="Support"
          size="extraLarge"
          sx={{
            fontSize: { xs: 40, sm: 60, md: 80 },
          }}
        />

        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "2rem",
                md: "2.5rem",
                lg: "3rem",
              },
              fontWeight: "bold",
              lineHeight: 1.2,
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            {header.title}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
                md: "1.125rem",
              },
              opacity: 0.9,
              lineHeight: 1.4,
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            {page.description}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.875rem",
                md: "1rem",
              },
              opacity: 0.8,
              lineHeight: 1.5,
              maxWidth: { xs: "100%", sm: 450, md: 600 },
              mx: "auto",
              px: { xs: 1, sm: 0 },
            }}
          >
            {page.tagline}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};