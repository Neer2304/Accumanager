import {
  Gavel as GavelIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  PrivacyTip as PrivacyIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Update as UpdateIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

interface IconProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const Gavel = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <GavelIcon sx={{ fontSize, color, ...sx }} />;
};

export const Security = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <SecurityIcon sx={{ fontSize, color, ...sx }} />;
};

export const Payment = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <PaymentIcon sx={{ fontSize, color, ...sx }} />;
};

export const Privacy = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <PrivacyIcon sx={{ fontSize, color, ...sx }} />;
};

export const Business = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <BusinessIcon sx={{ fontSize, color, ...sx }} />;
};

export const Description = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <DescriptionIcon sx={{ fontSize, color, ...sx }} />;
};

export const History = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <HistoryIcon sx={{ fontSize, color, ...sx }} />;
};

export const Update = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 20,
    large: 24,
    extraLarge: 32
  }[size];

  return <UpdateIcon sx={{ fontSize, color, ...sx }} />;
};

export const Warning = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <WarningIcon sx={{ fontSize, color, ...sx }} />;
};

export const CheckCircle = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <CheckCircleIcon sx={{ fontSize, color, ...sx }} />;
};

// Export all as object
export const LegalIcons = {
  Gavel,
  Security,
  Payment,
  Privacy,
  Business,
  Description,
  History,
  Update,
  Warning,
  CheckCircle
};