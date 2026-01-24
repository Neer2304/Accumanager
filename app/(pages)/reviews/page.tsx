// app/reviews/page.tsx - UPDATED VERSION WITHOUT MODAL
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  Rating,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Search, 
  FilterList, 
  Star, 
  Verified,
  TrendingUp,
  NewReleases,
  ThumbUp,
  Add
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Reviews Page Component
export default function ReviewsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [filterSort, setFilterSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [page, filterRating, filterSort])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      let url = `/api/reviews?page=${page}&limit=10&sort=${filterSort}`
      if (filterRating !== 'all') url += `&rating=${filterRating}`
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews')
      }

      setReviews(data.reviews)
      setTotalPages(data.pagination.totalPages)
      setTotalReviews(data.pagination.total)
      setAverageRating(data.summary?.averageRating || 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchReviews()
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/reviews/add')
      return
    }
    router.push('/reviews/add')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review: any) => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Customer Reviews
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            Read what our customers say about their experience
          </Typography>

          {/* Stats */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 3,
            mb: 4,
            justifyContent: 'center'
          }}>
            <Paper sx={{ p: 3, borderRadius: 2, minWidth: 120 }}>
              <Typography variant="h2" fontWeight="bold" color="primary.main">
                {averageRating.toFixed(1)}
              </Typography>
              <Rating value={averageRating} readOnly precision={0.1} />
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 2, minWidth: 120 }}>
              <Typography variant="h2" fontWeight="bold" color="secondary.main">
                {totalReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            <form onSubmit={handleSearch} style={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </form>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={filterRating}
                  label="Rating"
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  <MenuItem value="all">All Ratings</MenuItem>
                  <MenuItem value="5">5 Stars</MenuItem>
                  <MenuItem value="4">4 Stars</MenuItem>
                  <MenuItem value="3">3 Stars</MenuItem>
                  <MenuItem value="2">2 Stars</MenuItem>
                  <MenuItem value="1">1 Star</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filterSort}
                  label="Sort By"
                  onChange={(e) => setFilterSort(e.target.value)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="rating">Highest Rating</MenuItem>
                  <MenuItem value="helpful">Most Helpful</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleWriteReview}
                startIcon={<Add />}
                size="small"
              >
                Write Review
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Rating Distribution */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Rating Distribution
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star as keyof typeof ratingDistribution]
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              
              return (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 100 }}>
                    <Typography variant="body1">{star}</Typography>
                    <Star sx={{ fontSize: 16, color: 'gold' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      backgroundColor: 'grey.200',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        sx={{ 
                          height: '100%', 
                          width: `${percentage}%`,
                          backgroundColor: 'primary.main',
                          borderRadius: 4
                        }} 
                      />
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ width: 40, textAlign: 'right' }}>
                    {count}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Reviews List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              {reviews.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    No reviews found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {searchTerm ? 'Try a different search term' : 'Be the first to share your experience!'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleWriteReview}
                    startIcon={<Add />}
                  >
                    Write the First Review
                  </Button>
                </Paper>
              ) : (
                reviews.map((review: any) => (
                  <Paper key={review._id} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                      {/* User Info */}
                      <Box sx={{ display: 'flex', gap: 2, minWidth: 200 }}>
                        <Avatar
                          sx={{ 
                            width: 56, 
                            height: 56,
                            bgcolor: 'primary.main'
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
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(review.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Review Content */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="h5" fontWeight="bold">
                            {review.title}
                          </Typography>
                          {review.featured && (
                            <Chip
                              icon={<Verified fontSize="small" />}
                              label="Featured"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        <Typography variant="body1" color="text.secondary" paragraph>
                          {review.comment}
                        </Typography>

                        {/* Review Stats */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          {review.helpful > 0 && (
                            <Chip
                              icon={<ThumbUp fontSize="small" />}
                              label={`${review.helpful} helpful`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}

        {/* CTA */}
        <Paper sx={{ 
          p: { xs: 4, sm: 6 }, 
          mt: 6, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          textAlign: 'center'
        }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="white">
            Share Your Experience
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }} color="white">
            Your feedback helps us improve and helps other businesses make decisions
          </Typography>
          <Button
            variant="contained"
            onClick={handleWriteReview}
            size="large"
            startIcon={<Add />}
            sx={{ 
              backgroundColor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
          >
            {isAuthenticated ? 'Write a Review' : 'Sign in to Review'}
          </Button>
          {!isAuthenticated && (
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }} color="white">
              You need to be signed in to submit a review
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  )
}