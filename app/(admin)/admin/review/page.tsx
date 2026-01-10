// app/admin/reviews/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Badge,
  Tooltip,
  IconButton,
  Card,
  CardContent,
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Star,
  Person,
  Business,
  AccessTime,
  ThumbUp,
  ThumbDown,
  Email,
  Phone,
  CalendarToday,
  Launch,
  Refresh,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

interface Review {
  _id: string
  userId: string
  userName: string
  userEmail?: string
  userPhone?: string
  userAvatar?: string
  userCompany: string
  userRole: string
  rating: number
  title: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  helpful?: number
}

interface UserDetails {
  _id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  subscription?: {
    plan: string
    status: string
    joinedDate: string
  }
  stats?: {
    totalOrders?: number
    totalSpent?: number
  }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userDialogOpen, setUserDialogOpen] = useState(false)

  useEffect(() => {
    fetchPendingReviews()
  }, [])

  const fetchPendingReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/reviews?status=pending')
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews || [])
      } else {
        setError(data.error || 'Failed to fetch reviews')
      }
    } catch (err) {
      setError('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()
      
      if (response.ok) {
        setSelectedUser(data.user)
        setUserDialogOpen(true)
      } else {
        setError(data.error || 'Failed to fetch user details')
      }
    } catch (err) {
      setError('Failed to fetch user details')
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewId, 
          status: 'approved' 
        })
      })
      
      if (response.ok) {
        setReviews(reviews.filter(r => r._id !== reviewId))
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to approve review')
      }
    } catch (err) {
      setError('Failed to approve review')
    }
  }

  const handleReject = async () => {
    if (!selectedReview) return
    
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewId: selectedReview._id, 
          status: 'rejected',
          reply: rejectReason ? { message: rejectReason } : undefined
        })
      })
      
      if (response.ok) {
        setReviews(reviews.filter(r => r._id !== selectedReview._id))
        setDialogOpen(false)
        setRejectReason('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to reject review')
      }
    } catch (err) {
      setError('Failed to reject review')
    }
  }

  const handleBulkApprove = async () => {
    try {
      const response = await fetch('/api/admin/reviews/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewIds: reviews.map(r => r._id) 
        })
      })
      
      if (response.ok) {
        setReviews([])
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to bulk approve reviews')
      }
    } catch (err) {
      setError('Failed to bulk approve reviews')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#10b981'
    if (rating >= 3) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          Review Moderation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Approve or reject user reviews. Pending reviews: {reviews.length}
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Stats Card */}
      {reviews.length > 0 && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2
            }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {reviews.length} Pending Reviews
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {reviews.filter(r => r.rating >= 4).length} positive • {reviews.filter(r => r.rating <= 2).length} critical
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleBulkApprove}
                sx={{ 
                  background: 'white', 
                  color: '#10b981',
                  fontWeight: 'bold',
                  '&:hover': { background: '#f0f9ff' }
                }}
              >
                Approve All
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading pending reviews...
          </Typography>
        </Box>
      ) : reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3, opacity: 0.7 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
              All Caught Up! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
              No pending reviews to moderate. All user reviews have been processed.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchPendingReviews}
            >
              Refresh
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 3,
          '& > *': {
            flex: '1 1 calc(50% - 12px)',
            minWidth: 300
          }
        }}>
          {reviews.map((review) => (
            <Box key={review._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }
                }}>
                  {/* Review Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          background: getRatingColor(review.rating),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}>
                          {review.rating}
                        </Box>
                      }
                    >
                      <Avatar
                        src={review.userAvatar}
                        sx={{ 
                          width: 56, 
                          height: 56,
                          bgcolor: 'primary.main',
                          fontSize: 20,
                          fontWeight: 'bold'
                        }}
                      >
                        {review.userName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="text.primary">
                            {review.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Box sx={{ display: 'flex' }}>
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  sx={{ 
                                    fontSize: 16,
                                    color: i < review.rating ? '#FFD700' : '#e0e0e0'
                                  }} 
                                />
                              ))}
                            </Box>
                            <Chip 
                              label="Pending" 
                              size="small" 
                              color="warning"
                              icon={<AccessTime fontSize="small" />}
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </Box>
                        
                        <Tooltip title="View user details">
                          <IconButton 
                            size="small" 
                            onClick={() => fetchUserDetails(review.userId)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Launch />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>

                  {/* Review Comment */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ 
                      fontStyle: 'italic',
                      color: 'text.primary',
                      lineHeight: 1.6,
                      p: 2,
                      background: 'rgba(0,0,0,0.02)',
                      borderRadius: 2
                    }}>
                      "{review.comment}"
                    </Typography>
                  </Box>

                  {/* User Info */}
                  <Box sx={{ mb: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 3,
                      '& > *': {
                        flex: '1 1 calc(50% - 12px)',
                        minWidth: 150
                      }
                    }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16, color: 'primary.main' }} />
                          <Typography variant="body2" fontWeight="500" color="text.primary">
                            {review.userName}
                          </Typography>
                        </Box>
                        {review.userRole && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                            {review.userRole}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business sx={{ fontSize: 16, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {review.userCompany}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      <CalendarToday sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                      Submitted: {formatDate(review.createdAt)}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<ThumbUp />}
                      onClick={() => handleApprove(review._id)}
                      sx={{ flex: 1, minWidth: 120 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<ThumbDown />}
                      onClick={() => {
                        setSelectedReview(review)
                        setDialogOpen(true)
                      }}
                      sx={{ flex: 1, minWidth: 120 }}
                    >
                      Reject
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          ))}
        </Box>
      )}

      {/* Reject Reason Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Cancel color="error" />
            <Typography>Reject Review</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Review by <strong>{selectedReview.userName}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                "{selectedReview.comment.substring(0, 100)}..."
              </Typography>
            </Box>
          )}
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejection. This will be shared with the user..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            color="error"
            variant="contained"
            startIcon={<Cancel />}
            disabled={!rejectReason.trim()}
          >
            Reject Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={selectedUser?.avatar} sx={{ width: 40, height: 40 }}>
              {selectedUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedUser?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                User Details
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 3,
                mb: 3,
                '& > *': {
                  flex: '1 1 calc(50% - 12px)',
                  minWidth: 250
                }
              }}>
                {/* Contact Information */}
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                    Contact Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedUser.email}</Typography>
                    </Box>
                    {selectedUser.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedUser.phone}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>

                {/* Subscription */}
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                    Subscription
                  </Typography>
                  {selectedUser.subscription ? (
                    <Stack spacing={1}>
                      <Chip 
                        label={selectedUser.subscription.plan.toUpperCase()} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={selectedUser.subscription.status.toUpperCase()} 
                        color={
                          selectedUser.subscription.status === 'active' ? 'success' : 
                          selectedUser.subscription.status === 'trial' ? 'info' : 'default'
                        } 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Joined: {formatDate(selectedUser.subscription.joinedDate)}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No subscription data
                    </Typography>
                  )}
                </Paper>
              </Box>

              {/* User Statistics */}
              {selectedUser.stats && (
                <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                    User Statistics
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 3,
                    '& > *': {
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: 150
                    }
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {selectedUser.stats.totalOrders || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Orders
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        ₹{selectedUser.stats.totalSpent?.toLocaleString() || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => window.open(`/admin/users/${selectedUser?._id}`, '_blank')}
          >
            View Full Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}