'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
} from '@mui/material';
import {
  Groups,
  People,
  PersonAdd,
  Timeline,
  Assessment,
  Settings,
  TrendingUp,
  CalendarToday,
  ArrowForward,
  Engineering,
  DesignServices,
  AttachMoney,
  SupportAgent,
} from '@mui/icons-material';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { MainLayout } from '@/components/Layout/MainLayout';

const teamFeatures = [
  {
    icon: <Groups />,
    title: 'Team Dashboard',
    description: 'Overview of team performance and activities',
    path: '/team/dashboard',
    status: 'coming-soon',
    color: '#4285f4',
  },
  {
    icon: <People />,
    title: 'Team Members',
    description: 'Manage team members and their roles',
    path: '/team/members',
    status: 'under-development',
    color: '#34a853',
  },
  {
    icon: <PersonAdd />,
    title: 'Add Members',
    description: 'Invite and add new team members',
    path: '/team/members/add',
    status: 'coming-soon',
    color: '#fbbc04',
  },
  {
    icon: <Timeline />,
    title: 'Activities',
    description: 'Track team activities and updates',
    path: '/team/activities',
    status: 'coming-soon',
    color: '#ea4335',
  },
  {
    icon: <Assessment />,
    title: 'Reports',
    description: 'Generate team performance reports',
    path: '/team/reports',
    status: 'coming-soon',
    color: '#4285f4',
  },
  {
    icon: <CalendarToday />,
    title: 'Calendar',
    description: 'Team schedule and meetings',
    path: '/team/calendar',
    status: 'coming-soon',
    color: '#34a853',
  },
  {
    icon: <Settings />,
    title: 'Team Settings',
    description: 'Configure team preferences',
    path: '/team/settings',
    status: 'coming-soon',
    color: '#fbbc04',
  },
  {
    icon: <TrendingUp />,
    title: 'Performance',
    description: 'Team performance analytics',
    path: '/team/performance',
    status: 'coming-soon',
    color: '#ea4335',
  },
];

export default function TeamPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const darkMode = theme.palette.mode === 'dark';

  return (
    <MainLayout title="Team Management">
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Header with Alert */}
        <Box sx={{ mb: 4 }}>
          <Alert
            title="Team Management - Under Development"
            message="Team management features are currently being developed. You can explore the available sections below. Real-time collaboration tools will be available soon."
            severity="info"
            variant="outlined"
            dismissible
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: isMobile ? '1.75rem' : '2.25rem',
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              Team Management
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                maxWidth: 600,
              }}
            >
              Comprehensive team collaboration and management tools. 
              All features are being developed and will be available soon.
            </Typography>
          </Box>
        </Box>

        {/* Quick Stats - Using Flexbox */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 3, 
          mb: 4,
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Team Features', value: '8', color: '#4285f4' },
            { label: 'In Development', value: '7', color: '#fbbc04' },
            { label: 'Coming Soon', value: '6', color: '#34a853' },
            { label: 'Planned Updates', value: '4', color: '#ea4335' },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: isMobile ? '100%' : '180px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                borderRadius: '12px',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    color: stat.color,
                    fontSize: isMobile ? '2rem' : '2.25rem',
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
                >
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Team Features - Using Flexbox */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            sx={{ mb: 3 }}
          >
            Available Team Features
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: 3,
          }}>
            {teamFeatures.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  flex: '1 1 calc(25% - 24px)',
                  minWidth: isMobile ? '100%' : '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode
                      ? '0 8px 24px rgba(0,0,0,0.3)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor:
                              feature.status === 'under-development'
                                ? '#fbbc04'
                                : '#34a853',
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              feature.status === 'under-development'
                                ? '#fbbc04'
                                : '#34a853',
                            fontWeight: 500,
                          }}
                        >
                          {feature.status === 'under-development'
                            ? 'Under Development'
                            : 'Coming Soon'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    href={feature.path}
                    endIcon={<ArrowForward />}
                    disabled={feature.status === 'coming-soon'}
                    sx={{
                      borderRadius: '8px',
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      '&:hover': {
                        borderColor: feature.color,
                        backgroundColor: `${feature.color}10`,
                      },
                    }}
                  >
                    {feature.status === 'under-development'
                      ? 'View Progress'
                      : 'Coming Soon'}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Department Overview */}
        <Card
          sx={{
            mb: 4,
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            borderRadius: '12px',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Team Department Overview
            </Typography>

            <Alert
              title="Department Management"
              message="Team department structure and management tools will be available in the next update."
              severity="info"
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: 3,
              flexWrap: 'wrap'
            }}>
              {[
                {
                  icon: <Engineering />,
                  name: 'Engineering',
                  members: 12,
                  color: '#4285f4',
                },
                {
                  icon: <DesignServices />,
                  name: 'Design',
                  members: 8,
                  color: '#ea4335',
                },
                {
                  icon: <AttachMoney />,
                  name: 'Marketing',
                  members: 6,
                  color: '#34a853',
                },
                {
                  icon: <SupportAgent />,
                  name: 'Support',
                  members: 4,
                  color: '#fbbc04',
                },
              ].map((dept, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    minWidth: isMobile ? '100%' : '200px',
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      backgroundColor: `${dept.color}20`,
                      color: dept.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                    }}
                  >
                    {dept.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {dept.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dept.members} members
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Getting Started Guide */}
        <Card
          sx={{
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            borderRadius: '12px',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Getting Started with Team Management
            </Typography>

            <Alert
              title="Beta Access"
              message="Team management is in beta. Some features may be limited during initial rollout."
              severity="warning"
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Stack spacing={2}>
              {[
                {
                  step: 1,
                  title: 'Invite Team Members',
                  description: 'Start by inviting your team members to collaborate',
                },
                {
                  step: 2,
                  title: 'Set Up Departments',
                  description: 'Organize team members into departments and groups',
                },
                {
                  step: 3,
                  title: 'Configure Permissions',
                  description: 'Set role-based access controls and permissions',
                },
                {
                  step: 4,
                  title: 'Monitor Activities',
                  description: 'Track team performance and activities in real-time',
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: '#4285f4',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Need help setting up your team?
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#4285f4',
                  color: 'white',
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#3367d6',
                  },
                }}
                // onClick={() => window.location.href = '/contact/support'}
              >
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}