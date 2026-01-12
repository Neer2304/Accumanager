import { ReviewIcons, Star } from '@/assets/icons/ReviewIcons';
import { SxProps, Theme } from '@mui/material';

export interface ReviewIconProps {
  name: keyof typeof ReviewIcons;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const ReviewIcon = ({ name, size = 'medium', color, sx }: ReviewIconProps) => {
  const IconComponent = ReviewIcons[name];
  return <Star/>;
};

// Helper to get status icon
export const getStatusIcon = (status: string, size: 'small' | 'medium' | 'large' = 'small') => {
  switch (status) {
    case 'approved':
      return <ReviewIcon name="CheckCircle" size={size} color="success" />;
    case 'pending':
      return <ReviewIcon name="Pending" size={size} color="warning" />;
    case 'rejected':
      return <ReviewIcon name="Delete" size={size} color="error" />;
    default:
      return null;
  }
};

// Helper to get status text
export const getStatusText = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'pending':
      return 'Under Review';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
};