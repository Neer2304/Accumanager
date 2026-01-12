import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { CheckCircle, Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ReviewEmptyStateProps {
  onRefresh: () => void;
}

const ReviewEmptyState: React.FC<ReviewEmptyStateProps> = ({ onRefresh }) => {
  return (
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
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Paper>
    </motion.div>
  );
};

export default ReviewEmptyState;