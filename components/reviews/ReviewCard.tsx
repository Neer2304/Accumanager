import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
  Badge,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import {
  Star,
  Person,
  Business,
  AccessTime,
  ThumbUp,
  ThumbDown,
  Launch,
  CalendarToday,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Common Components
import { StatusChip } from '@/components/common';

interface ReviewCardProps {
  review: {
    _id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    userCompany: string;
    userRole: string;
    rating: number;
    title: string;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    helpful?: number;
  };
  onApprove: (reviewId: string) => void;
  onReject: (review: any) => void;
  onViewUser: (userId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onApprove,
  onReject,
  onViewUser,
}) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#10b981';
    if (rating >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
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
                  <StatusChip 
                    status={review.status === 'pending' ? 'pending' : 
                           review.status === 'approved' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <IconButton 
                size="small" 
                onClick={() => onViewUser(review.userId)}
                sx={{ color: 'primary.main' }}
                title="View user details"
              >
                <Launch />
              </IconButton>
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
            onClick={() => onApprove(review._id)}
            sx={{ flex: 1, minWidth: 120 }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ThumbDown />}
            onClick={() => onReject(review)}
            sx={{ flex: 1, minWidth: 120 }}
          >
            Reject
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ReviewCard;