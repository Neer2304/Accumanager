import React from 'react';
import {
  Box,
  Typography,
  Rating as MuiRating,
} from '@mui/material';
import { Review } from '@/hooks/useReviewsData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { Divider } from '@/components/ui/Divider';
import { Tooltip } from '@/components/ui/Tooltip';

interface ReviewListSectionProps {
  reviews: Review[];
  onMarkHelpful: (reviewId: string) => void;
  darkMode?: boolean;
}

export const ReviewListSection = ({ reviews, onMarkHelpful, darkMode = false }: ReviewListSectionProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  if (reviews.length === 0) {
    return (
      <Card
        title="Recent Reviews"
        subtitle="Be the first to share your experience"
        hover={false}
        sx={{ 
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          bgcolor: darkMode ? '#303134' : '#f8f9fa'
        }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          color: darkMode ? "#9aa0a6" : "#5f6368"
        }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: darkMode ? '#3c4043' : '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <Typography variant="h4" color={darkMode ? "#9aa0a6" : "#bdbdbd"}>
              ✍️
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom sx={{ color: darkMode ? "#e8eaed" : "#202124" }}>
            No reviews yet
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 400, mx: 'auto' }}>
            Share your experience and help others make better decisions
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      title="Recent Reviews"
      subtitle={`Showing ${reviews.length} reviews from our community`}
      hover={false}
      sx={{ 
        borderColor: darkMode ? '#3c4043' : '#dadce0',
        bgcolor: 'transparent'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {reviews.map((review, index) => (
          <React.Fragment key={review._id}>
            {/* Review Card */}
            <Box sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #e0e0e0',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: darkMode 
                  ? '0 4px 20px rgba(0,0,0,0.3)' 
                  : '0 4px 20px rgba(0,0,0,0.08)',
                borderColor: darkMode ? '#5f6368' : '#dadce0'
              }
            }}>
              {/* Review Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Tooltip title={review.userName} placement="top">
                    <Avatar
                      src={review.userAvatar}
                      alt={review.userName}
                      // size="medium"
                      sx={{
                        border: darkMode ? '2px solid #3c4043' : '2px solid #e0e0e0',
                        '&:hover': {
                          borderColor: '#1a73e8'
                        }
                      }}
                    >
                      {review.userName.charAt(0)}
                    </Avatar>
                  </Tooltip>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} color={darkMode ? "#e8eaed" : "#202124"}>
                      {review.userName}
                    </Typography>
                    <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                      {review.userRole && `${review.userRole} • `}{review.userCompany || 'Customer'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Chip
                    label={`${review.rating}.0`}
                    color="primary"
                    size="small"
                    sx={{ 
                      bgcolor: '#1a73e8',
                      color: 'white',
                      fontWeight: 600,
                      height: 24,
                      fontSize: '0.75rem'
                    }}
                  />
                  <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
              </Box>

              {/* Rating Display */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MuiRating
                  value={review.rating}
                  readOnly
                  size="small"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#1a73e8',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: darkMode ? '#5f6368' : '#dadce0',
                    },
                  }}
                />
                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  {review.rating} out of 5
                </Typography>
              </Box>

              {/* Review Content */}
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                gutterBottom 
                color={darkMode ? "#e8eaed" : "#202124"}
                sx={{ fontSize: '1rem' }}
              >
                {review.title}
              </Typography>
              <Typography 
                variant="body2" 
                color={darkMode ? "#9aa0a6" : "#5f6368"} 
                sx={{ 
                  mb: 2.5,
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {review.comment}
              </Typography>

              {/* Review Footer */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pt: 2.5,
                borderTop: darkMode ? '1px solid #3c4043' : '1px solid #f0f0f0'
              }}>
                <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                  {review.helpful > 0 
                    ? `${review.helpful} person${review.helpful !== 1 ? 's' : ''} found this helpful`
                    : 'Be the first to find this helpful'
                  }
                </Typography>
                
                <Tooltip title="Mark as helpful" placement="top">
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => onMarkHelpful(review._id)}
                    sx={{ 
                      color: darkMode ? "#8ab4f8" : "#1a73e8",
                      fontWeight: 500,
                      minWidth: 'auto',
                      px: 1.5,
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)'
                      }
                    }}
                  >
                    👍 Helpful
                  </Button>
                </Tooltip>
              </Box>

              {/* Admin Reply */}
              {review.reply && (
                <Box sx={{ 
                  mt: 3, 
                  p: 2.5, 
                  borderRadius: 1,
                  bgcolor: darkMode ? '#0d3064' : '#e8f0fe',
                  borderLeft: '4px solid #1a73e8',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: -8,
                    left: 20,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid',
                    borderBottomColor: darkMode ? '#0d3064' : '#e8f0fe'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: '#1a73e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                        A
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} color="#1a73e8">
                      Response from AccumaManage Team
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={darkMode ? "#e8eaed" : "#202124"} sx={{ mb: 1 }}>
                    {review.reply.message}
                  </Typography>
                  <Typography variant="caption" color={darkMode ? "#8ab4f8" : "#1a73e8"} sx={{ display: 'block' }}>
                    Replied on {new Date(review.reply.repliedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Divider between reviews (except last) */}
            {index < reviews.length - 1 && (
              <Divider sx={{ 
                borderColor: darkMode ? '#3c4043' : '#e0e0e0',
                my: 1 
              }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Card>
  );
};