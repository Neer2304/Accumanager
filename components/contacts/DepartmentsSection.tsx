// components/contacts/DepartmentsSection.tsx
"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const departments = [
  { name: 'Sales', email: 'sales@accumanage.com', desc: 'Get pricing & product info' },
  { name: 'Support', email: 'support@accumanage.com', desc: 'Technical help & troubleshooting' },
  { name: 'Partnerships', email: 'partners@accumanage.com', desc: 'Business collaborations' },
  { name: 'Careers', email: 'careers@accumanage.com', desc: 'Join our team' },
];

export const DepartmentsSection: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mt: { xs: 6, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Contact Specific Departments
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            fontSize: '1.125rem',
            lineHeight: 1.7,
          }}
        >
          Need to reach a specific team? Here&apos;s who to contact for different inquiries.
        </Typography>
      </Box>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {departments.map((dept, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: 3,
              height: '100%',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:hover': {
                transform: 'translateY(-12px)',
                boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            }}
          >
            <CardContent
              sx={{
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                gutterBottom
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                {dept.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  flex: 1,
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: '0.9375rem',
                }}
              >
                {dept.desc}
              </Typography>
              <Button
                component="a"
                href={`mailto:${dept.email}`}
                variant="outlined"
                size="medium"
                endIcon={<ArrowForward />}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: 2,
                  fontWeight: 600,
                  borderWidth: '1.5px',
                  '&:hover': {
                    borderWidth: '1.5px',
                  },
                }}
              >
                {dept.email}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};