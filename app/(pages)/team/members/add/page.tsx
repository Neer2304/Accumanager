'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useRouter } from 'next/navigation';

export default function AddTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'engineering',
    phone: '',
    location: '',
    status: 'active',
    skills: '',
    bio: '',
  });

  const departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/team/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/team/members');
      } else {
        setError(data.error || 'Failed to add team member');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      setError('Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add Team Member">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/team/members')}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Team Members
          </Button>

          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <MuiLink
              component={Link}
              href="/team/members"
              sx={{ 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Team Members
            </MuiLink>
            <Typography color="text.primary">Add Member</Typography>
          </Breadcrumbs>

          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Add New Team Member
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add a new member to your team and assign them to projects
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Basic Information */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon />
                    Basic Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <TextField
                        fullWidth
                        label="Email Address *"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>

                {/* Role and Department */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon />
                    Role & Department
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Job Role *"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="e.g., Senior Developer, Product Designer"
                      />
                      <FormControl fullWidth required>
                        <InputLabel>Department *</InputLabel>
                        <Select
                          name="department"
                          value={formData.department}
                          label="Department *"
                          onChange={handleSelectChange}
                          disabled={loading}
                        >
                          {departments.map((dept) => (
                            <MenuItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Paper>
                </Box>

                {/* Contact Information */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon />
                    Contact Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>

                {/* Skills and Bio */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon />
                    Skills & Bio
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Skills (comma-separated)"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="e.g., JavaScript, React, UI/UX Design"
                        helperText="Separate multiple skills with commas"
                      />
                      <TextField
                        fullWidth
                        label="Bio / Description"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={loading}
                        multiline
                        rows={4}
                        placeholder="Brief description about the team member..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mt: 1, alignItems: 'flex-start' }}>
                              <DescriptionIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>

                {/* Status */}
                <Box sx={{ maxWidth: 300 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      label="Status"
                      onChange={handleSelectChange}
                      disabled={loading}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="away">Away</MenuItem>
                      <MenuItem value="offline">Offline</MenuItem>
                      <MenuItem value="on_leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Form Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/team/members')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                >
                  {loading ? 'Adding...' : 'Add Team Member'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}