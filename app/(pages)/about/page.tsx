// app/about/page.tsx - UPDATED with Google-style design
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  Paper,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Chip,
  Alert,
  Rating,
  Fade,
  Skeleton,
  IconButton
} from '@mui/material'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ABOUT_CONTENT } from '@/components/users/about/AboutContent'
import { AboutIcon, ValuesIcon } from '@/components/users/about/AboutIcons'
import { 
  Add, 
  ArrowForward, 
  CheckCircle, 
  RocketLaunch,
  TrendingUp,
  Shield,
  People,
  EmojiEvents,
  HelpCenter,
  Business,
  Verified
} from '@mui/icons-material'
import { LandingHeader } from "@/components/landing/Header"
import { useTheme as useThemeContext } from '@/contexts/ThemeContext'
import { 
  Crown, 
  Package, 
  RefreshCw, 
  Users,
  AlertTriangle,
  Star,
  Award,
  Target,
  HeartHandshake,
  Lightbulb,
  Zap,
  Sparkles
} from 'lucide-react'
import { InnovationIcon } from '@/assets/icons/AboutIcons'

// Custom Hook for About Data
const useAboutData = () => {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/about')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data')
      }

      if (data.success) {
        setReviews(data.data.reviews)
        setSummary(data.data.summary)
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('Error fetching about data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { reviews, summary, loading, error, refetch: fetchAboutData }
}

// Skeleton Components
const AboutSkeleton = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width={120} height={40} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
          <Skeleton variant="rectangular" width={200} height={50} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 6,
          mb: 8
        }}>
          {[1, 2].map((item) => (
            <Box key={item} sx={{ flex: 1 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto', mb: 4 }} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
          mb: 8
        }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
              minWidth: { xs: '100%', sm: 280 }
            }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

// Reviews Component for Home Page
const HomeReviewsSection = ({ reviews, summary, loading, error, isAuthenticated }: any) => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const getResponsiveTypography = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        py: 8,
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 4, 
          maxWidth: 600, 
          mx: 'auto',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          borderRadius: '12px',
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      py: { xs: 8, sm: 10, md: 12 },
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
          <Chip
            icon={<Star />}
            label="Customer Stories"
            sx={{
              mb: 3,
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              color: darkMode ? '#e8eaed' : '#202124',
              fontWeight: 500,
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              '& .MuiChip-icon': { 
                color: darkMode ? '#fbbc04' : '#fbbc04',
                fontSize: 18
              }
            }}
          />
          
          <Typography
            variant={getResponsiveTypography('h4', 'h3', 'h2') as any}
            component="h2"
            fontWeight={500}
            gutterBottom
            color={darkMode ? "#e8eaed" : "#202124"}
            sx={{ 
              fontSize: getResponsiveTypography('1.75rem', '2rem', '2.25rem'),
              letterSpacing: '-0.02em',
              mb: 3
            }}
          >
            {ABOUT_CONTENT.reviews.title}
          </Typography>
          
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color={darkMode ? "#9aa0a6" : "#5f6368"}
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 4,
              fontWeight: 300,
              fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem')
            }}
          >
            {ABOUT_CONTENT.reviews.subtitle}
          </Typography>

          {summary && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 4,
              mb: 6,
              justifyContent: 'center'
            }}>
              <Box sx={{ textAlign: 'center', px: 4 }}>
                <Typography 
                  variant="h2" 
                  fontWeight={500} 
                  color="#fbbc04"
                  sx={{ fontSize: getResponsiveTypography('2rem', '2.5rem', '3rem') }}
                >
                  {summary.averageRating.toFixed(1)}
                </Typography>
                <Rating 
                  value={summary.averageRating} 
                  readOnly 
                  precision={0.5} 
                  sx={{ 
                    mb: 1,
                    '& .MuiRating-icon': {
                      color: '#fbbc04'
                    }
                  }}
                />
                <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  {ABOUT_CONTENT.reviews.labels.averageRating}
                </Typography>
              </Box>
              
              <Divider 
                orientation={isMobile ? "horizontal" : "vertical"} 
                flexItem 
                sx={{ 
                  width: { xs: '100%', sm: 'auto' },
                  height: { xs: 'auto', sm: '100%' },
                  my: { xs: 2, sm: 0 },
                  borderColor: darkMode ? '#3c4043' : '#dadce0'
                }} 
              />
              
              <Box sx={{ textAlign: 'center', px: 4 }}>
                <Typography 
                  variant="h2" 
                  fontWeight={500} 
                  color="#34a853"
                  sx={{ fontSize: getResponsiveTypography('2rem', '2.5rem', '3rem') }}
                >
                  {summary.totalReviews}+
                </Typography>
                <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  {ABOUT_CONTENT.reviews.labels.verifiedReviews}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Reviews Grid */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
          mb: 8
        }}>
          {reviews.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8, 
              width: '100%',
              px: 3
            }}>
              <Box sx={{ 
                display: 'inline-flex',
                p: 3,
                mb: 3,
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                borderRadius: '50%',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              }}>
                <Verified sx={{ fontSize: 48, color: '#4285f4' }} />
              </Box>
              
              <Typography 
                variant="h6" 
                color={darkMode ? "#e8eaed" : "#202124"} 
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                {ABOUT_CONTENT.reviews.noReviews.title}
              </Typography>
              
              <Typography 
                variant="body1" 
                color={darkMode ? "#9aa0a6" : "#5f6368"} 
                sx={{ 
                  mb: 4, 
                  maxWidth: 500, 
                  mx: 'auto',
                  fontWeight: 300
                }}
              >
                {ABOUT_CONTENT.reviews.noReviews.description}
              </Typography>
              
              {isAuthenticated && (
                <Button
                  variant="contained"
                  component={Link}
                  href="/reviews/add"
                  startIcon={<Add />}
                  sx={{
                    backgroundColor: '#34a853',
                    color: 'white',
                    fontWeight: 500,
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#2d9248',
                      boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                    }
                  }}
                >
                  Be the first to review
                </Button>
              )}
            </Box>
          ) : (
            reviews.slice(0, 3).map((review: any) => (
              <Fade in key={review._id}>
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.333% - 16px)' },
                  minWidth: { xs: '100%', sm: 280 }
                }}>
                  <Paper
                    sx={{
                      p: { xs: 3, sm: 4 },
                      height: '100%',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      color: darkMode ? '#e8eaed' : '#202124',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: darkMode 
                          ? '0 8px 24px rgba(0,0,0,0.4)'
                          : '0 8px 24px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#4285f4',
                          mr: 2,
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                          fontWeight: 500
                        }}
                      >
                        {review.userName?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {review.userName}
                        </Typography>
                        <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                          {review.userCompany || review.userRole}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          '& .MuiRating-icon': {
                            color: '#fbbc04'
                          }
                        }}
                      />
                    </Box>

                    <Typography 
                      variant="h6" 
                      fontWeight={500} 
                      gutterBottom
                      sx={{ fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem') }}
                    >
                      {review.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      color={darkMode ? "#9aa0a6" : "#5f6368"}
                      sx={{
                        mb: 3,
                        fontStyle: 'italic',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontWeight: 300,
                        fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem')
                      }}
                    >
                      "{review.comment}"
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={formatDate(review.createdAt)}
                        size="small"
                        variant="outlined"
                        sx={{
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem')
                        }}
                      />
                      {review.featured && (
                        <Chip
                          icon={<Verified sx={{ fontSize: 16 }} />}
                          label={ABOUT_CONTENT.reviews.labels.featured}
                          size="small"
                          sx={{
                            backgroundColor: '#34a853',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem')
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Box>
              </Fade>
            ))
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Button
            variant="contained"
            component={Link}
            href="/reviews"
            endIcon={<ArrowForward />}
            size="large"
            sx={{
              backgroundColor: '#4285f4',
              color: 'white',
              fontWeight: 500,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              minWidth: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#3367d6',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
              }
            }}
          >
            View All Reviews
          </Button>
          
          {isAuthenticated && reviews.length > 0 && (
            <Button
              variant="outlined"
              component={Link}
              href="/reviews/add"
              startIcon={<Add />}
              size="large"
              sx={{ 
                minWidth: { xs: '100%', sm: 'auto' },
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: darkMode ? '#5f6368' : '#202124',
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                }
              }}
            >
              Write a Review
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

// Main About Page Component
export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { reviews, summary, loading, error } = useAboutData();

  const getResponsiveTypography = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  if (loading) {
    return <AboutSkeleton />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      transition: 'all 0.3s ease',
    }}>
      <LandingHeader />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, sm: 14, md: 16 },
          pb: { xs: 6, sm: 8, md: 10 },
          background: darkMode 
            ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
            : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          color: "white",
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              icon={<Sparkles />}
              label={ABOUT_CONTENT.hero.tagline}
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            
            <Typography
              variant="h1"
              component="h1"
              fontWeight={500}
              gutterBottom
              sx={{ 
                color: 'white',
                fontSize: getResponsiveTypography('2rem', '2.5rem', '3rem'),
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                mb: 3,
              }}
            >
              {ABOUT_CONTENT.hero.title}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                opacity: 0.95,
                mb: 4,
                color: 'white',
                fontWeight: 300,
                fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
              }}
            >
              {ABOUT_CONTENT.hero.subtitle}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{ 
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                mb: 4
              }}
            >
              {["Trusted by 10,000+ businesses", "24/7 Customer Support", "99.9% Uptime", "Enterprise Security"].map((feature) => (
                <Box key={feature} sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ fontSize: 16, mr: 1, color: '#34a853' }} />
                  <Typography variant="body2" color="white">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Box sx={{ 
        py: { xs: 8, sm: 10, md: 12 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 6,
            alignItems: 'center' 
          }}>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Fade in>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4, md: 5 },
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderRadius: '16px',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: darkMode 
                        ? '0 8px 24px rgba(0,0,0,0.4)'
                        : '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    mb: 3,
                    backgroundColor: darkMode ? '#0d47a1' : '#e8f0fe',
                    borderRadius: '12px',
                  }}>
                    <Business sx={{ fontSize: 32, color: darkMode ? 'white' : '#4285f4' }} />
                  </Box>
                  
                  <Typography 
                    variant="h4" 
                    fontWeight={500} 
                    gutterBottom
                    sx={{ fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem') }}
                  >
                    {ABOUT_CONTENT.mission.title}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    color={darkMode ? "#9aa0a6" : "#5f6368"} 
                    paragraph
                    sx={{ 
                      fontWeight: 300,
                      fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                      mb: 3
                    }}
                  >
                    {ABOUT_CONTENT.mission.subtitle}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color={darkMode ? "#9aa0a6" : "#5f6368"}
                    sx={{ 
                      fontWeight: 300,
                      fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                      lineHeight: 1.8
                    }}
                  >
                    {ABOUT_CONTENT.mission.description}
                  </Typography>
                </Paper>
              </Fade>
            </Box>
            
            <Box sx={{ flex: 1, width: '100%' }}>
              <Fade in timeout={500}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4, md: 5 },
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderRadius: '16px',
                    border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: darkMode 
                        ? '0 8px 24px rgba(0,0,0,0.4)'
                        : '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    mb: 3,
                    backgroundColor: darkMode ? '#311b92' : '#f3e8ff',
                    borderRadius: '12px',
                  }}>
                    <InnovationIcon sx={{ fontSize: 32, color: darkMode ? 'white' : '#9333ea' }} />
                  </Box>
                  
                  <Typography 
                    variant="h4" 
                    fontWeight={500} 
                    gutterBottom
                    sx={{ fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem') }}
                  >
                    {ABOUT_CONTENT.vision.title}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    color={darkMode ? "#9aa0a6" : "#5f6368"} 
                    paragraph
                    sx={{ 
                      fontWeight: 300,
                      fontSize: getResponsiveTypography('0.95rem', '1rem', '1.1rem'),
                      mb: 3
                    }}
                  >
                    {ABOUT_CONTENT.vision.subtitle}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color={darkMode ? "#9aa0a6" : "#5f6368"}
                    sx={{ 
                      fontWeight: 300,
                      fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                      lineHeight: 1.8
                    }}
                  >
                    {ABOUT_CONTENT.vision.description}
                  </Typography>
                </Paper>
              </Fade>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Company Values */}
      <Box sx={{ 
        py: { xs: 8, sm: 10, md: 12 }, 
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
        borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Chip
              icon={<Award />}
              label="Our Core Values"
              sx={{
                mb: 3,
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 500,
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                '& .MuiChip-icon': { 
                  color: darkMode ? '#fbbc04' : '#fbbc04',
                  fontSize: 18
                }
              }}
            />
            
            <Typography
              variant={getResponsiveTypography('h4', 'h3', 'h2') as any}
              component="h2"
              fontWeight={500}
              gutterBottom
              color={darkMode ? "#e8eaed" : "#202124"}
              sx={{ 
                fontSize: getResponsiveTypography('1.75rem', '2rem', '2.25rem'),
                letterSpacing: '-0.02em',
                mb: 3
              }}
            >
              {ABOUT_CONTENT.values.title}
            </Typography>
            
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color={darkMode ? "#9aa0a6" : "#5f6368"}
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem')
              }}
            >
              {ABOUT_CONTENT.values.subtitle}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center'
          }}>
            {ABOUT_CONTENT.values.items.map((value, index) => (
              <Fade in key={index} timeout={(index + 1) * 100}>
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
                  minWidth: { xs: '100%', sm: 280 }
                }}>
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      color: darkMode ? '#e8eaed' : '#202124',
                      border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: darkMode 
                          ? '0 8px 24px rgba(0,0,0,0.4)'
                          : '0 8px 24px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      p: { xs: 3, sm: 4 }, 
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ 
                        display: 'inline-flex',
                        p: 2,
                        mb: 3,
                        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                        borderRadius: '12px',
                        border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                      }}>
                        <ValuesIcon 
                          valueName={value.title} 
                          size={isMobile ? "medium" : "large"} 
                          color={darkMode ? '#e8eaed' : '#202124'}
                        />
                      </Box>
                      
                      <Typography 
                        variant="h5" 
                        fontWeight={500} 
                        gutterBottom
                        sx={{ fontSize: getResponsiveTypography('1.1rem', '1.25rem', '1.5rem') }}
                      >
                        {value.title}
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        color={darkMode ? "#9aa0a6" : "#5f6368"}
                        sx={{ 
                          fontWeight: 300,
                          fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                          lineHeight: 1.6
                        }}
                      >
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Fade>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Reviews Section */}
      <HomeReviewsSection 
        reviews={reviews}
        summary={summary}
        loading={loading}
        error={error}
        isAuthenticated={isAuthenticated}
      />

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 8, sm: 10, md: 12 },
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
        <Container maxWidth="md">
          <Fade in>
            <Paper
              sx={{
                p: { xs: 4, sm: 6, md: 8 },
                textAlign: 'center',
                background: darkMode 
                  ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)'
                  : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
                color: 'white',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Chip
                  icon={<RocketLaunch sx={{ fontSize: 16 }} />}
                  label={isAuthenticated ? "Ready to Grow?" : "Start Your Journey"}
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />

                <Typography
                  variant={getResponsiveTypography('h4', 'h3', 'h2') as any}
                  component="h2"
                  fontWeight={500}
                  gutterBottom
                  color="white"
                  sx={{ 
                    fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem'),
                    mb: 3,
                  }}
                >
                  {isAuthenticated 
                    ? ABOUT_CONTENT.cta.authenticated.title 
                    : ABOUT_CONTENT.cta.unauthenticated.title}
                </Typography>
                
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    color: 'white',
                    fontWeight: 300,
                    fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem'),
                    maxWidth: 600,
                    mx: 'auto'
                  }}
                >
                  {isAuthenticated 
                    ? ABOUT_CONTENT.cta.authenticated.subtitle 
                    : ABOUT_CONTENT.cta.unauthenticated.subtitle}
                </Typography>
                
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ 
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    component={Link}
                    href={isAuthenticated ? "/dashboard" : "/signup"}
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: '#34a853',
                      color: 'white',
                      fontWeight: 500,
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#2d9248',
                        boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
                      }
                    }}
                  >
                    {isAuthenticated 
                      ? ABOUT_CONTENT.cta.authenticated.buttonText 
                      : ABOUT_CONTENT.cta.unauthenticated.buttonText}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    component={Link}
                    href="/features"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    {ABOUT_CONTENT.cta.secondaryButton}
                  </Button>
                </Stack>
                
                {!isAuthenticated && !authLoading && (
                  <Typography
                    variant="body2"
                    sx={{ 
                      mt: 2, 
                      opacity: 0.9,
                      fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem')
                    }}
                    color="white"
                  >
                    {ABOUT_CONTENT.cta.unauthenticated.disclaimer}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 4, sm: 5, md: 6 },
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          color: darkMode ? '#e8eaed' : '#202124',
          borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, sm: 6 },
              mb: { xs: 4, sm: 5 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RocketLaunch sx={{ fontSize: 24, color: '#4285f4', mr: 1.5 }} />
                <Typography
                  variant="h6"
                  fontWeight={500}
                  sx={{ 
                    fontSize: getResponsiveTypography('1rem', '1.1rem', '1.25rem'),
                  }}
                >
                  AccumaManage
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ 
                  opacity: 0.8, 
                  mb: 2,
                  maxWidth: 400,
                  fontWeight: 300,
                  fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem'),
                }}
              >
                Streamline your business operations with our all-in-one management platform.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 3, sm: 4 },
                flex: 1,
              }}
            >
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  Product
                </Typography>
                <Stack spacing={1}>
                  {["Features", "Pricing", "API", "Documentation"].map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href={`#${item.toLowerCase()}`}
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        fontWeight: 300,
                        '&:hover': {
                          color: darkMode ? '#e8eaed' : '#202124',
                        }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  Company
                </Typography>
                <Stack spacing={1}>
                  {["About", "Blog", "Careers", "Contact"].map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href="#"
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        fontWeight: 300,
                        '&:hover': {
                          color: darkMode ? '#e8eaed' : '#202124',
                        }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500,
                    fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem'),
                  }}
                >
                  Support
                </Typography>
                <Stack spacing={1}>
                  {["Help Center", "Community", "Status", "Security"].map((item) => (
                    <Typography
                      key={item}
                      component="a"
                      href="#"
                      sx={{
                        textDecoration: 'none',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem'),
                        fontWeight: 300,
                        '&:hover': {
                          color: darkMode ? '#e8eaed' : '#202124',
                        }
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ 
            borderColor: darkMode ? '#3c4043' : '#dadce0', 
            mb: { xs: 3, sm: 4 } 
          }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ 
                opacity: 0.6,
                fontWeight: 300,
                fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem'),
              }}
            >
              © {new Date().getFullYear()} AccumaManage. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}