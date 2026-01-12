'use client'

import React from 'react'
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
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAboutData } from '@/hooks/useAboutData'
import { ABOUT_CONTENT } from './AboutContent'
import { AboutIcon, ValuesIcon } from './AboutIcons'

export default function AboutPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { reviews, summary, loading, error } = useAboutData()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  const getResponsiveTypographyVariant = (mobileVariant: string, desktopVariant: string) => {
    return isMobile ? mobileVariant : desktopVariant
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
              label={ABOUT_CONTENT.hero.tagline}
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Typography
            //   variant={getResponsiveTypographyVariant("h3", "h1")}
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ color: 'white' }}
            >
              {ABOUT_CONTENT.hero.title}
            </Typography>
            <Typography
            //   variant={getResponsiveTypographyVariant("h6", "h5")}
              sx={{
                opacity: 0.95,
                mb: 4,
                color: 'white'
              }}
            >
              {ABOUT_CONTENT.hero.subtitle}
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
                <AboutIcon name="Business" size="extraLarge" color={theme.palette.primary.main} sx={{ mb: 3 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {ABOUT_CONTENT.mission.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  {ABOUT_CONTENT.mission.subtitle}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {ABOUT_CONTENT.mission.description}
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
                <AboutIcon name="Innovation" size="extraLarge" color={theme.palette.secondary.main} sx={{ mb: 3 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {ABOUT_CONTENT.vision.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  {ABOUT_CONTENT.vision.subtitle}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {ABOUT_CONTENT.vision.description}
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
            //   variant={getResponsiveTypographyVariant("h4", "h3")}
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              {ABOUT_CONTENT.values.title}
            </Typography>
            <Typography
            //   variant={getResponsiveTypographyVariant("body1", "h6")}
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
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
                      <ValuesIcon valueName={value.title} size={isMobile ? "medium" : "large"} />
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
            //   variant={getResponsiveTypographyVariant("h4", "h3")}
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              {ABOUT_CONTENT.reviews.title}
            </Typography>
            <Typography
            //   variant={getResponsiveTypographyVariant("body1", "h6")}
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              {ABOUT_CONTENT.reviews.subtitle}
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
                    {ABOUT_CONTENT.reviews.labels.averageRating}
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
                    {ABOUT_CONTENT.reviews.labels.verifiedReviews}
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
                {ABOUT_CONTENT.reviews.noReviews.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                {ABOUT_CONTENT.reviews.noReviews.description}
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
                  {ABOUT_CONTENT.buttons.startFreeTrial}
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
                          icon={<AboutIcon name="Verified" size="small" />}
                          label={ABOUT_CONTENT.reviews.labels.featured}
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
                endIcon={<AboutIcon name="ArrowForward" />}
                size={isMobile ? "medium" : "large"}
              >
                {ABOUT_CONTENT.buttons.readAllReviews}
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
            //   variant={getResponsiveTypographyVariant("h4", "h3")}
              component="h2"
              fontWeight="bold"
              gutterBottom
              color="white"
            >
              {isAuthenticated 
                ? ABOUT_CONTENT.cta.authenticated.title 
                : ABOUT_CONTENT.cta.unauthenticated.title}
            </Typography>
            <Typography
            //   variant={getResponsiveTypographyVariant("body1", "h6")}
              sx={{ mb: 4, opacity: 0.95 }}
              color="white"
            >
              {isAuthenticated 
                ? ABOUT_CONTENT.cta.authenticated.subtitle 
                : ABOUT_CONTENT.cta.unauthenticated.subtitle}
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
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
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
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
                color="white"
              >
                {ABOUT_CONTENT.cta.unauthenticated.disclaimer}
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}