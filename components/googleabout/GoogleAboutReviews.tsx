// components/googleabout/GoogleAboutReviews.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Chip,
  Rating,
  Avatar,
  Paper,
  Button,
  Divider,
  Fade,
  Alert,
  useTheme,
} from '@mui/material'
import Link from 'next/link'
import { Star, Verified } from 'lucide-react'
import { Add, ArrowForward } from '@mui/icons-material'
import { ABOUT_CONTENT } from './AboutContent'
import { Review, Summary, BaseProps } from './types'

interface GoogleAboutReviewsProps extends BaseProps {
  reviews: Review[]
  summary: Summary | null
  error: string
  isAuthenticated: boolean
  getResponsiveTypography: (mobile: string, tablet: string, desktop: string) => string
}

export default function GoogleAboutReviews({ 
  reviews, 
  summary, 
  error, 
  isAuthenticated, 
  isMobile, 
  darkMode, 
  getResponsiveTypography 
}: GoogleAboutReviewsProps) {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
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
    )
  }

  return (
    <Box sx={{ 
      py: { xs: 8, sm: 10, md: 12 },
      backgroundColor: darkMode ? '#202124' : '#ffffff',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
          <Chip
            icon={<Star size={18} />}
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
                <Verified size={48} color="#4285f4" />
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
            reviews.slice(0, 3).map((review: Review) => (
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
                          icon={<Verified size={16} />}
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
  )
}