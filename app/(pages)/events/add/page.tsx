"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Breadcrumbs, Link as MuiLink, Container, useTheme, useMediaQuery } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Home as HomeIcon } from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { EventForm } from "@/components/events";
import Link from "next/link";

// Import Google-themed components
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AddEventPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Event created successfully!");
        setTimeout(() => {
          router.push("/events");
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create event");
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  return (
    <MainLayout title="Create New Event">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <MuiLink 
              component={Link} 
              href="/dashboard" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300, 
                "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </MuiLink>
            <MuiLink 
              component={Link} 
              href="/events" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300, 
                "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
              }}
            >
              Events
            </MuiLink>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              New Event
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Create New Event
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Set up a new event to start tracking your expenses
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Alerts */}
          <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            {error && (
              <Alert 
                severity="error"
                title="Error"
                message={error}
                dismissible
                onDismiss={() => setError("")}
              />
            )}
            {success && (
              <Alert 
                severity="success"
                title="Success"
                message={success}
                dismissible
                onDismiss={() => setSuccess("")}
              />
            )}
          </Box>

          <Card
            title="Event Details"
            subtitle="Fill in the event information to get started"
            action={
              <Button
                variant="outlined"
                onClick={() => router.back()}
                iconLeft={<ArrowBackIcon />}
                size="medium"
                sx={{ 
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
                  }
                }}
              >
                Back
              </Button>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}
          >
            <EventForm 
              onSubmit={handleSubmit}
              darkMode={darkMode}
            />
          </Card>
        </Container>
      </Box>
    </MainLayout>
  );
}