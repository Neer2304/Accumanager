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
  Rating
} from '@mui/material'
import {
  RocketLaunch,
  TrendingUp,
  Shield,
  Diversity3,
  CheckCircle,
  ArrowForward,
  Business,
  Star,
  Verified
} from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface Review {
  _id: string
  userName: string
  userCompany: string
  userRole: string
  rating: number
  title: string
  comment: string
  createdAt: string
  featured?: boolean
}

interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{ _id: number; count: number }>
}

export default function AboutPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reviews?limit=4&featured=true')
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews || [])
        setSummary(data.summary || null)
      } else {
        setError(data.error || 'Failed to load reviews')
      }
    } catch (err) {
      setError('Unable to connect to the server')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const companyValues = [
    {
      icon: <RocketLaunch sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: 'Innovation',
      description: 'Continuously evolving to bring cutting-edge solutions to modern business challenges.'
    },
    {
      icon: <Shield sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: 'Security',
      description: 'Enterprise-grade security ensuring your business data is always protected.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: 'Growth',
      description: 'Tools designed to scale with your business as you grow and expand.'
    },
    {
      icon: <Diversity3 sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      title: 'Community',
      description: 'Building a supportive ecosystem for businesses to thrive together.'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, sm: 14, md: 16 },
          pb: { xs: 6, sm: 8, md: 10 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              label="Our Story"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Typography
              variant={isMobile ? "h3" : "h1"}
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ color: 'white' }}
            >
              Empowering Businesses with Intelligent Management
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                opacity: 0.95,
                mb: 4,
                color: 'white'
              }}
            >
              We built AccumaManage to solve the complex challenges faced by modern businesses.
              Our mission is to simplify operations and drive growth through technology.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 6,
            alignItems: 'center' 
          }}>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  height: '100%'
                }}
              >
                <Business sx={{ fontSize: 48, color: 'primary.main', mb: 3 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  To provide businesses with an all-in-one platform that simplifies operations,
                  enhances productivity, and drives sustainable growth through innovative technology.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We believe every business deserves tools that work as hard as they do.
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  height: '100%'
                }}
              >
                <RocketLaunch sx={{ fontSize: 48, color: 'secondary.main', mb: 3 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Our Vision
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  To become the leading business management platform globally,
                  empowering millions of businesses to operate more efficiently
                  and make data-driven decisions.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We're building the future of business management, one feature at a time.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Company Values */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 }, backgroundColor: alpha(theme.palette.grey[100], 0.5) }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              Our Core Values
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              These principles guide everything we do at AccumaManage
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center'
          }}>
            {companyValues.map((value, index) => (
              <Box key={index} sx={{ 
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' },
                minWidth: { xs: '100%', sm: 280 }
              }}>
                <Card
                  sx={{
                    height: '100%',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              What Our Users Say
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Real feedback from businesses using AccumaManage
            </Typography>

            {summary && !loading && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 2,
                mb: 4,
                justifyContent: 'center'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" fontWeight="bold" color="primary.main">
                    {summary.averageRating.toFixed(1)}
                  </Typography>
                  <Rating value={summary.averageRating} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Box>
                <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem sx={{ 
                  width: { xs: '100%', sm: 'auto' },
                  height: { xs: 'auto', sm: '100%' },
                  my: { xs: 2, sm: 0 }
                }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" fontWeight="bold" color="secondary.main">
                    {summary.totalReviews}+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Reviews
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : reviews.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                No reviews yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                Be the first to share your experience with AccumaManage
              </Typography>
              {!isAuthenticated && !authLoading && (
                <Button
                  variant="contained"
                  component={Link}
                  href="/dashboard"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  Start Free Trial
                </Button>
              )}
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              justifyContent: 'center'
            }}>
              {reviews.map((review) => (
                <Box key={review._id} sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(50% - 16px)' },
                  minWidth: { xs: '100%', sm: 280 }
                }}>
                  <Paper
                    sx={{
                      p: { xs: 3, sm: 4 },
                      height: '100%',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          mr: 2,
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 }
                        }}
                      >
                        {review.userName?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {review.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {review.userCompany || review.userRole}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Rating value={review.rating} readOnly size={isMobile ? "small" : "medium"} />
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {review.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        fontStyle: 'italic',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      "{review.comment}"
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={formatDate(review.createdAt)}
                        size="small"
                        variant="outlined"
                      />
                      {review.featured && (
                        <Chip
                          icon={<Verified fontSize="small" />}
                          label="Featured"
                          size="small"
                          color="primary"
                          variant="filled"
                        />
                      )}
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          )}

          {reviews.length > 0 && !loading && (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Button
                variant="outlined"
                component={Link}
                href="/reviews"
                endIcon={<ArrowForward />}
                size={isMobile ? "medium" : "large"}
              >
                Read All Reviews
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              borderRadius: 3
            }}
          >
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              fontWeight="bold"
              gutterBottom
              color="white"
            >
              {isAuthenticated ? 'Continue Your Journey' : 'Ready to Transform Your Business?'}
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{ mb: 4, opacity: 0.95 }}
              color="white"
            >
              {isAuthenticated 
                ? 'Access all features and continue managing your business efficiently.' 
                : 'Join thousands of businesses already using AccumaManage to streamline their operations.'}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                component={Link}
                href="/dashboard"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
              </Button>
              <Button
                variant="outlined"
                size={isMobile ? "medium" : "large"}
                component={Link}
                href="/features"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Explore Features
              </Button>
            </Stack>
            {!isAuthenticated && !authLoading && (
              <Typography
                variant="body2"
                sx={{ 
                  mt: 2, 
                  opacity: 0.9,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
                color="white"
              >
                No credit card required • 14-day free trial • Cancel anytime
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}