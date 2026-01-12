import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface ReviewStatsCardProps {
  totalReviews: number;
  positiveCount: number;
  criticalCount: number;
  onBulkApprove: () => void;
}

const ReviewStatsCard: React.FC<ReviewStatsCardProps> = ({
  totalReviews,
  positiveCount,
  criticalCount,
  onBulkApprove,
}) => {
  return (
    <Card sx={{ 
      mb: 4, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      color: 'white' 
    }}>
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
              {totalReviews} Pending Reviews
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {positiveCount} positive • {criticalCount} critical
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={onBulkApprove}
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
  );
};

export default ReviewStatsCard;