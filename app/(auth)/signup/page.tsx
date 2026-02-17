// app/register/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Button,
  TextField,
  InputAdornment,
  Link as MuiLink,
  CircularProgress,
  Paper,
  Chip,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  SelectChangeEvent,
  Collapse,
  Slider,
  Switch,
} from '@mui/material';
import {
  ArrowBack,
  Security,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Dashboard,
  VerifiedUser,
  Shield,
  PersonAdd,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Analytics,
  Inventory,
  People,
  Smartphone,
  CheckCircle,
  Speed,
  WorkspacePremium,
  CloudSync,
  BusinessCenter,
  TrendingUp,
  Business,
  ExpandMore,
  ExpandLess,
  Info,
  Cake,
  Wc,
  LocationOn,
  Work,
  Interests,
  Language,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  // Required fields
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  
  // Optional business fields
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessSize: z.string().optional(),
  
  // Optional demographic fields
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Invalid age").optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  interests: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  
  // Optional preferences
  marketingConsent: z.boolean().optional(),
  dataSharingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Options for select fields
const businessTypes = [
  'Technology',
  'Retail',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Construction',
  'Real Estate',
  'Transportation',
  'Hospitality',
  'Media',
  'Consulting',
  'Agency',
  'E-commerce',
  'Other',
];

const businessSizes = [
  'Just me (1 employee)',
  'Micro (2-9 employees)',
  'Small (10-49 employees)',
  'Medium (50-249 employees)',
  'Large (250+ employees)',
];

const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Portuguese',
  'Russian',
  'Arabic',
  'Hindi',
  'Other',
];

const timezones = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
  'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
  'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00',
];

const occupations = [
  'Software Developer',
  'Business Owner',
  'Marketing Professional',
  'Sales Professional',
  'Consultant',
  'Manager',
  'Executive',
  'Freelancer',
  'Student',
  'Educator',
  'Healthcare Professional',
  'Other',
];

export default function RegisterPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [ageValue, setAgeValue] = useState<number>(30);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      age: 30,
      gender: 'prefer-not-to-say',
      marketingConsent: false,
      dataSharingConsent: false,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: RegisterFormData) => {
    clearError();
    const { confirmPassword, ...userData } = data;
    // Filter out empty optional fields
    const filteredData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== '' && v !== undefined)
    );
    registerUser(filteredData);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleGoogleRedirect = () => router.push("/google-register");
  const handleGithubRedirect = () => router.push("/github-register");

  const handleAgeChange = (_event: Event, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setAgeValue(newValue);
    setValue('age', newValue);
  };

  // Features data
  const features = [
    { icon: <Speed />, title: 'Lightning Fast', description: 'Optimized for speed and performance' },
    { icon: <WorkspacePremium />, title: 'Premium Features', description: 'All premium features included' },
    { icon: <CloudSync />, title: 'Cloud Sync', description: 'Real-time data synchronization' },
    { icon: <BusinessCenter />, title: 'Business Tools', description: 'Complete business management suite' },
    { icon: <TrendingUp />, title: 'Analytics', description: 'Advanced reporting and insights' },
    { icon: <Security />, title: 'Bank-Level Security', description: 'Enterprise-grade encryption' },
  ];

  // Trust badges
  const trustBadges = [
    { icon: '🔐', label: '256-bit SSL' },
    { icon: '✓', label: 'GDPR Compliant' },
    { icon: '⭐', label: '4.9/5 Rating' },
    { icon: '🏆', label: 'Award Winning' },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode
        ? 'radial-gradient(circle at 10% 30%, rgba(138, 180, 248, 0.05) 0%, transparent 30%), radial-gradient(circle at 90% 70%, rgba(52, 168, 83, 0.05) 0%, transparent 30%), #1a1c1e'
        : 'radial-gradient(circle at 10% 30%, rgba(26, 115, 232, 0.03) 0%, transparent 30%), radial-gradient(circle at 90% 70%, rgba(52, 168, 83, 0.03) 0%, transparent 30%), #f8f9fa',
      position: 'relative',
      overflow: 'hidden',
      p: { xs: 2, sm: 3, md: 0 },
    }}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 4 : 8,
        }}
      >
        {/* Left Side - Hero Section (Hidden on mobile) */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              maxWidth: 550,
            }}
          >
            {/* Trial Badge */}
            <Paper
              elevation={0}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                mb: 3,
                borderRadius: '30px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
              }}
            >
              <WorkspacePremium sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="600">
                14-Day Free Trial • No Credit Card Required
              </Typography>
            </Paper>

            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                fontWeight="800"
                gutterBottom
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: {
                    xs: '2rem',
                    sm: '2.5rem',
                    md: '3rem',
                  },
                  lineHeight: 1.2,
                }}
              >
                Start Your Journey with AccuManage
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  fontSize: {
                    xs: '1rem',
                    md: '1.1rem',
                  },
                  lineHeight: 1.6,
                  maxWidth: '90%',
                }}
              >
                Get started with AccuManage and transform your business operations. 
                No credit card required for the 14-day free trial.
              </Typography>
            </Box>

            {/* Features Grid */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
              width: '100%',
              mb: 4,
            }}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(48, 49, 52, 0.5)' : 'rgba(248, 249, 250, 0.8)',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode
                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>

            {/* Trust Badges */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {trustBadges.map((badge, index) => (
                <Chip
                  key={index}
                  icon={<Box component="span" sx={{ fontSize: '1rem' }}>{badge.icon}</Box>}
                  label={badge.label}
                  size="small"
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: darkMode ? 'rgba(60, 64, 67, 0.5)' : 'rgba(248, 249, 250, 0.8)',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '& .MuiChip-icon': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Right Side - Registration Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isMobile ? '100%' : 550,
            width: '100%',
          }}
        >
          <Card sx={{
            borderRadius: '28px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            maxHeight: isMobile ? 'none' : '90vh',
            overflowY: isMobile ? 'visible' : 'auto',
            '&:hover': {
              boxShadow: darkMode
                ? '0 16px 48px rgba(0, 0, 0, 0.6)'
                : '0 16px 48px rgba(0, 0, 0, 0.12)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1a73e8, #8ab4f8, #34a853)',
              zIndex: 1,
            },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: darkMode ? '#202124' : '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: darkMode ? '#5f6368' : '#9aa0a6',
              borderRadius: '4px',
              '&:hover': {
                background: darkMode ? '#7f8489' : '#7f8489',
              },
            },
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 4.5 } }}>
              {/* Header */}
              <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <Tooltip title="Back to Home">
                    <IconButton
                      component={Link}
                      href="/"
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        backgroundColor: darkMode ? 'rgba(60, 64, 67, 0.5)' : 'rgba(218, 220, 224, 0.5)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#e8eaed',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      }}
                    >
                      <ArrowBack />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                    color: darkMode ? '#34a853' : '#34a853',
                    border: `2px solid ${darkMode ? '#34a853' : '#34a853'}`,
                    boxShadow: darkMode
                      ? '0 0 0 4px rgba(52, 168, 83, 0.1)'
                      : '0 0 0 4px rgba(52, 168, 83, 0.1)',
                  }}
                >
                  <PersonAdd sx={{ fontSize: 44 }} />
                </Avatar>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      color: darkMode ? '#e8eaed' : '#202124',
                      letterSpacing: '-0.5px',
                      mb: 1,
                    }}
                  >
                    Create Account
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    Start your 14-day free trial
                  </Typography>
                </Box>

                {/* Mobile Trial Badge (only visible on mobile) */}
                {isMobile && (
                  <Paper
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: '30px',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                    }}
                  >
                    <WorkspacePremium sx={{ fontSize: 18 }} />
                    <Typography variant="caption" fontWeight="600">
                      14-Day Free Trial
                    </Typography>
                  </Paper>
                )}

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: '20px',
                    backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)',
                    border: `1px solid ${darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)'}`,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 16, color: darkMode ? '#34a853' : '#34a853' }} />
                  <Typography variant="caption" sx={{ color: darkMode ? '#34a853' : '#34a853', fontWeight: 500 }}>
                    No credit card required
                  </Typography>
                </Stack>
              </Stack>

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                    border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
                    color: darkMode ? '#f28b82' : '#c5221f',
                  }}
                  onClose={clearError}
                >
                  {error}
                </Alert>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  {/* Required Fields Section */}
                  <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                    Required Information
                  </Typography>

                  {/* Name Field */}
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonAdd sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&.Mui-focused': {
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? '#e8eaed' : '#202124',
                      },
                    }}
                  />

                  {/* Email Field */}
                  <TextField
                    fullWidth
                    type="email"
                    label="Email Address"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&.Mui-focused': {
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? '#e8eaed' : '#202124',
                      },
                    }}
                  />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              '&:hover': {
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&.Mui-focused': {
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? '#e8eaed' : '#202124',
                      },
                    }}
                  />

                  {/* Confirm Password Field */}
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={isLoading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              '&:hover': {
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                              },
                            }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                        },
                        '&.Mui-focused': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&.Mui-focused': {
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? '#e8eaed' : '#202124',
                      },
                    }}
                  />

                  {/* Terms Checkbox */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      {...register("terms")}
                      id="terms"
                      style={{
                        width: 18,
                        height: 18,
                        cursor: 'pointer',
                        accentColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      I agree to the{' '}
                      <MuiLink
                        href="/terms"
                        target="_blank"
                        sx={{
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Terms of Service
                      </MuiLink>{' '}
                      and{' '}
                      <MuiLink
                        href="/privacy"
                        target="_blank"
                        sx={{
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Privacy Policy
                      </MuiLink>
                    </Typography>
                  </Box>
                  {errors.terms && (
                    <Typography variant="caption" color="error">
                      {errors.terms.message}
                    </Typography>
                  )}

                  {/* Optional Fields Toggle */}
                  <Box>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                      endIcon={showOptionalFields ? <ExpandLess /> : <ExpandMore />}
                      sx={{
                        justifyContent: 'space-between',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {showOptionalFields ? 'Hide Optional Information' : 'Add Optional Information (Business & Demographics)'}
                    </Button>
                  </Box>

                  {/* Optional Fields */}
                  <Collapse in={showOptionalFields}>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                        Business Information (Optional)
                      </Typography>

                      {/* Business Name */}
                      <TextField
                        fullWidth
                        label="Business Name"
                        {...register("businessName")}
                        error={!!errors.businessName}
                        helperText={errors.businessName?.message}
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            '&.Mui-focused': {
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: darkMode ? '#e8eaed' : '#202124',
                          },
                        }}
                      />

                      {/* Business Type */}
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Business Type (Optional)
                        </InputLabel>
                        <Controller
                          name="businessType"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Business Type (Optional)"
                              sx={{
                                borderRadius: '12px',
                                backgroundColor: darkMode ? '#202124' : '#ffffff',
                                color: darkMode ? '#e8eaed' : '#202124',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                  borderWidth: 2,
                                },
                                '& .MuiSelect-icon': {
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                },
                              }}
                            >
                              <MenuItem value="">None</MenuItem>
                              {businessTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>

                      {/* Business Size */}
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Business Size (Optional)
                        </InputLabel>
                        <Controller
                          name="businessSize"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Business Size (Optional)"
                              sx={{
                                borderRadius: '12px',
                                backgroundColor: darkMode ? '#202124' : '#ffffff',
                                color: darkMode ? '#e8eaed' : '#202124',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                  borderWidth: 2,
                                },
                                '& .MuiSelect-icon': {
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                },
                              }}
                            >
                              <MenuItem value="">None</MenuItem>
                              {businessSizes.map((size) => (
                                <MenuItem key={size} value={size}>{size}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>

                      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                        Demographic Information (Optional)
                      </Typography>

                      {/* Age Slider */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Cake sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          <Typography variant="body2" color="text.secondary">
                            Age: {ageValue} years
                          </Typography>
                        </Box>
                        <Controller
                          name="age"
                          control={control}
                          render={({ field }) => (
                            <Slider
                              value={ageValue}
                              onChange={handleAgeChange}
                              min={18}
                              max={100}
                              marks={[
                                { value: 18, label: '18' },
                                { value: 30, label: '30' },
                                { value: 50, label: '50' },
                                { value: 70, label: '70' },
                                { value: 100, label: '100' },
                              ]}
                              sx={{
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                '& .MuiSlider-markLabel': {
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                },
                              }}
                            />
                          )}
                        />
                      </Box>

                      {/* Gender */}
                      <FormControl component="fieldset">
                        <FormLabel 
                          component="legend"
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            mb: 1,
                          }}
                        >
                          Gender (Optional)
                        </FormLabel>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup {...field} row>
                              <FormControlLabel 
                                value="male" 
                                control={
                                  <Radio sx={{
                                    color: darkMode ? '#9aa0a6' : '#5f6368',
                                    '&.Mui-checked': {
                                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    },
                                  }} />
                                } 
                                label="Male" 
                              />
                              <FormControlLabel 
                                value="female" 
                                control={
                                  <Radio sx={{
                                    color: darkMode ? '#9aa0a6' : '#5f6368',
                                    '&.Mui-checked': {
                                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    },
                                  }} />
                                } 
                                label="Female" 
                              />
                              <FormControlLabel 
                                value="other" 
                                control={
                                  <Radio sx={{
                                    color: darkMode ? '#9aa0a6' : '#5f6368',
                                    '&.Mui-checked': {
                                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    },
                                  }} />
                                } 
                                label="Other" 
                              />
                              <FormControlLabel 
                                value="prefer-not-to-say" 
                                control={
                                  <Radio sx={{
                                    color: darkMode ? '#9aa0a6' : '#5f6368',
                                    '&.Mui-checked': {
                                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                                    },
                                  }} />
                                } 
                                label="Prefer not to say" 
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>

                      {/* Location */}
                      <TextField
                        fullWidth
                        label="Location (City, Country)"
                        {...register("location")}
                        error={!!errors.location}
                        helperText={errors.location?.message}
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            '&.Mui-focused': {
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: darkMode ? '#e8eaed' : '#202124',
                          },
                        }}
                      />

                      {/* Occupation */}
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Occupation (Optional)
                        </InputLabel>
                        <Controller
                          name="occupation"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Occupation (Optional)"
                              sx={{
                                borderRadius: '12px',
                                backgroundColor: darkMode ? '#202124' : '#ffffff',
                                color: darkMode ? '#e8eaed' : '#202124',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                  borderWidth: 2,
                                },
                                '& .MuiSelect-icon': {
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                },
                              }}
                            >
                              <MenuItem value="">None</MenuItem>
                              {occupations.map((occ) => (
                                <MenuItem key={occ} value={occ}>{occ}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>

                      {/* Interests */}
                      <TextField
                        fullWidth
                        label="Interests (comma separated)"
                        {...register("interests")}
                        error={!!errors.interests}
                        helperText={errors.interests?.message}
                        disabled={isLoading}
                        placeholder="e.g., Technology, Marketing, Design"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Interests sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            '&.Mui-focused': {
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: darkMode ? '#e8eaed' : '#202124',
                          },
                        }}
                      />

                      {/* Language */}
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Preferred Language (Optional)
                        </InputLabel>
                        <Controller
                          name="language"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Preferred Language (Optional)"
                              sx={{
                                borderRadius: '12px',
                                backgroundColor: darkMode ? '#202124' : '#ffffff',
                                color: darkMode ? '#e8eaed' : '#202124',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                  borderWidth: 2,
                                },
                                '& .MuiSelect-icon': {
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                },
                              }}
                            >
                              <MenuItem value="">None</MenuItem>
                              {languages.map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>

                      {/* Timezone */}
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Timezone (Optional)
                        </InputLabel>
                        <Controller
                          name="timezone"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Timezone (Optional)"
                              sx={{
                                borderRadius: '12px',
                                backgroundColor: darkMode ? '#202124' : '#ffffff',
                                color: darkMode ? '#e8eaed' : '#202124',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                  borderWidth: 2,
                                },
                                '& .MuiSelect-icon': {
                                  color: darkMode ? '#9aa0a6' : '#5f6368',
                                },
                              }}
                            >
                              <MenuItem value="">None</MenuItem>
                              {timezones.map((tz) => (
                                <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>

                      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                        Preferences (Optional)
                      </Typography>

                      {/* Marketing Consent */}
                      <FormControlLabel
                        control={
                          <Controller
                            name="marketingConsent"
                            control={control}
                            render={({ field }) => (
                              <Switch
                                {...field}
                                checked={field.value || false}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                  },
                                }}
                              />
                            )}
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.secondary">
                            I'd like to receive marketing emails about new features and updates
                          </Typography>
                        }
                      />

                      {/* Data Sharing Consent */}
                      <FormControlLabel
                        control={
                          <Controller
                            name="dataSharingConsent"
                            control={control}
                            render={({ field }) => (
                              <Switch
                                {...field}
                                checked={field.value || false}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                                  },
                                }}
                              />
                            )}
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.secondary">
                            Allow us to use my data to improve your experience (GDPR compliant)
                          </Typography>
                        }
                      />
                    </Stack>
                  </Collapse>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                    sx={{
                      py: 1.5,
                      borderRadius: '28px',
                      backgroundColor: darkMode ? '#34a853' : '#34a853',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: darkMode ? '#2e9549' : '#2e9549',
                        boxShadow: darkMode
                          ? '0 4px 12px rgba(52, 168, 83, 0.3)'
                          : '0 4px 12px rgba(52, 168, 83, 0.3)',
                      },
                      '&:disabled': {
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      },
                    }}
                  >
                    {isLoading ? 'Creating Account...' : 'Start Free Trial'}
                  </Button>

                  {/* Divider */}
                  <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                    <Divider sx={{ flex: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ px: 2, fontWeight: 600, fontSize: "0.75rem", letterSpacing: 1 }}
                    >
                      OR SIGN UP WITH
                    </Typography>
                    <Divider sx={{ flex: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                  </Box>

                  {/* Social Sign Up Buttons */}
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      onClick={handleGoogleRedirect}
                      sx={{
                        py: 1.2,
                        borderRadius: '12px',
                        textTransform: "none",
                        fontWeight: 600,
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        '&:hover': {
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      Google
                    </Button>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<GitHubIcon />}
                      onClick={handleGithubRedirect}
                      sx={{
                        py: 1.2,
                        borderRadius: '12px',
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: darkMode ? '#8ab4f8' : '#24292e',
                        color: darkMode ? '#202124' : 'white',
                        '&:hover': {
                          bgcolor: darkMode ? '#aecbfa' : '#1b1f23',
                          transform: "translateY(-1px)",
                          boxShadow: darkMode
                            ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                            : '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      GitHub
                    </Button>
                  </Stack>
                </Stack>
              </form>

              {/* Login Link */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={handleLogin}
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "none",
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      '&:hover': { textDecoration: "underline" },
                    }}
                  >
                    Sign In
                  </MuiLink>
                </Typography>
              </Box>

              {/* Data Privacy Note */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                  <Info sx={{ fontSize: '0.85rem', color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography variant="caption" color="text.secondary">
                    All optional fields are securely stored and never shared with third parties
                  </Typography>
                </Stack>
              </Box>

              {/* Security Features */}
              <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                {[
                  { icon: '🔐', label: '256-bit SSL' },
                  { icon: '✓', label: 'GDPR Ready' },
                  { icon: '⭐', label: '4.9/5 Rating' },
                ].map((feature, index) => (
                  <Stack key={index} alignItems="center" spacing={0.5}>
                    <Typography sx={{ fontSize: '1.2rem' }}>{feature.icon}</Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {feature.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}