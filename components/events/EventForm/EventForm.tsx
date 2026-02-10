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
  useTheme,
  alpha,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { eventTypes } from "../types";

// Import Google-themed components
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

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
  darkMode?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Create Event",
  darkMode = false,
}) => {
  const theme = useTheme();
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
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      borderRadius: '16px',
      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
    }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Input
            label="Event Name *"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Sister's Wedding, Business Conference"
            required
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }
            }}
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Brief description of the event"
            multiline
            rows={3}
            fullWidth
            disabled={loading}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }
            }}
          />

          <Select
            label="Event Type *"
            value={formData.type}
            onChange={(e: any) => handleInputChange("type", e.target.value)}
            required
            fullWidth
            disabled={loading}
            options={eventTypes.map(type => ({
              value: type.value,
              label: type.label
            }))}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }
            }}
          />

          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <Input
              label="Start Date *"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
              fullWidth
              error={!!errors.startDate}
              helperText={errors.startDate}
              disabled={loading}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }
              }}
            />
            
            <Input
              label="End Date *"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              required
              fullWidth
              error={!!errors.endDate}
              helperText={errors.endDate}
              disabled={loading}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }
              }}
            />
          </Box>

          <Input
            label="Total Budget (₹)"
            type="number"
            value={formData.totalBudget}
            onChange={(e) => handleInputChange("totalBudget", parseFloat(e.target.value) || 0)}
            placeholder="0"
            fullWidth
            error={!!errors.totalBudget}
            helperText={errors.totalBudget}
            disabled={loading}
            // startAdornment={<Box sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Box>}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }
            }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
              disabled={loading}
              sx={{ 
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading || !formData.name}
              sx={{ 
                backgroundColor: '#34a853',
                '&:hover': { backgroundColor: '#2d9248' },
                '&.Mui-disabled': {
                  backgroundColor: darkMode ? '#3c4043' : '#f0f0f0',
                  color: darkMode ? '#9aa0a6' : '#a0a0a0',
                }
              }}
            >
              {loading ? "Saving..." : submitLabel}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};