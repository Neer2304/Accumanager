import {
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ThumbUp as ThumbUpIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  RateReview as RateReviewIcon,
  Reviews as ReviewsIcon,
  InsertComment as CommentIcon,
  Title as TitleIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  Help as HelpIcon,
  Lightbulb as LightbulbIcon,
  TipsAndUpdates as TipsIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  EmojiEmotions as EmojiIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

interface IconProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const Star = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <StarIcon sx={{ fontSize, color, ...sx }} />;
};

export const Edit = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <EditIcon sx={{ fontSize, color, ...sx }} />;
};

export const Delete = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <DeleteIcon sx={{ fontSize, color, ...sx }} />;
};

export const CheckCircle = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CheckCircleIcon sx={{ fontSize, color, ...sx }} />;
};

export const Pending = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PendingIcon sx={{ fontSize, color, ...sx }} />;
};

export const ThumbUp = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ThumbUpIcon sx={{ fontSize, color, ...sx }} />;
};

export const Business = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <BusinessIcon sx={{ fontSize, color, ...sx }} />;
};

export const Verified = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <VerifiedIcon sx={{ fontSize, color, ...sx }} />;
};

export const RateReview = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <RateReviewIcon sx={{ fontSize, color, ...sx }} />;
};

export const Reviews = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ReviewsIcon sx={{ fontSize, color, ...sx }} />;
};

export const Comment = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CommentIcon sx={{ fontSize, color, ...sx }} />;
};

export const Title = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <TitleIcon sx={{ fontSize, color, ...sx }} />;
};

export const Sentiment = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <SentimentSatisfiedIcon sx={{ fontSize, color, ...sx }} />;
};

export const Help = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <HelpIcon sx={{ fontSize, color, ...sx }} />;
};

export const Lightbulb = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <LightbulbIcon sx={{ fontSize, color, ...sx }} />;
};

export const Tips = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <TipsIcon sx={{ fontSize, color, ...sx }} />;
};

export const TrendingUp = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <TrendingUpIcon sx={{ fontSize, color, ...sx }} />;
};

export const Security = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <SecurityIcon sx={{ fontSize, color, ...sx }} />;
};

export const Emoji = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <EmojiIcon sx={{ fontSize, color, ...sx }} />;
};

export const Flag = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <FlagIcon sx={{ fontSize, color, ...sx }} />;
};

// Export all icons as an object
export const ReviewIcons = {
  Star,
  Edit,
  Delete,
  CheckCircle,
  Pending,
  ThumbUp,
  Business,
  Verified,
  RateReview,
  Reviews,
  Comment,
  Title,
  Sentiment,
  Help,
  Lightbulb,
  Tips,
  TrendingUp,
  Security,
  Emoji,
  Flag,
};