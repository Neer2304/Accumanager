"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  Box,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { eventTypes } from "../types";

interface EventFormProps {
  initialData?: {
    name: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string;
    totalBudget: number;
  };
  onSubmit: (formData: any) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Create Event",
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "marriage",
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || new Date().toISOString().split('T')[0],
    totalBudget: initialData?.totalBudget || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    if (formData.totalBudget < 0) {
      newErrors.totalBudget = "Budget cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Event Name *"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Sister's Wedding, Business Conference"
              required
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the event"
              multiline
              rows={3}
              fullWidth
              disabled={loading}
            />

            <TextField
              select
              label="Event Type *"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              required
              fullWidth
              disabled={loading}
            >
              {eventTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={errors.startDate}
                disabled={loading}
              />
              
              <TextField
                label="End Date *"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDate}
                helperText={errors.endDate}
                disabled={loading}
              />
            </Box>

            <TextField
              label="Total Budget (₹)"
              type="number"
              value={formData.totalBudget}
              onChange={(e) => handleInputChange("totalBudget", parseFloat(e.target.value) || 0)}
              placeholder="0"
              fullWidth
              error={!!errors.totalBudget}
              helperText={errors.totalBudget}
              disabled={loading}
              InputProps={{ 
                startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>,
              }}
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
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
                {loading ? "Saving..." : submitLabel}
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};