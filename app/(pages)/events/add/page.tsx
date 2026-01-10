// app/events/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

const eventTypes = [
  { value: "marriage", label: "Marriage" },
  { value: "business", label: "Business Event" },
  { value: "personal", label: "Personal" },
  { value: "travel", label: "Travel" },
  { value: "festival", label: "Festival" },
  { value: "other", label: "Other" },
];

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "marriage",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalBudget: 0,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/events");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Create New Event">
      <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
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

        {/* Form */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error">{error}</Alert>
                )}

                <TextField
                  label="Event Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Sister's Wedding, Business Conference"
                  required
                  fullWidth
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the event"
                  multiline
                  rows={3}
                  fullWidth
                />

                <TextField
                  select
                  label="Event Type *"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  required
                  fullWidth
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Start Date *"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <TextField
                    label="End Date *"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <TextField
                  label="Total Budget (₹)"
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => handleInputChange("totalBudget", parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  fullWidth
                  InputProps={{ startAdornment: "₹" }}
                />

                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading || !formData.name}
                  >
                    {loading ? "Creating..." : "Create Event"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}