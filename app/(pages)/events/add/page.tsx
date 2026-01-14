"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Alert } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { EventForm } from "@/components/events";

export default function AddEventPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/events");
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
      <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Back to Events
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom color="primary">
            Create New Event
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set up a new event to start tracking your expenses
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <EventForm onSubmit={handleSubmit} />
      </Box>
    </MainLayout>
  );
}