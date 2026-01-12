import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  Upgrade as UpgradeIcon,
  Check as CheckIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Fingerprint as FingerprintIcon,
  History as HistoryIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  CreditCard as CreditCardIcon,
  Star as StarIcon,
  WorkspacePremium as PremiumIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

interface IconProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const Person = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PersonIcon sx={{ fontSize, color, ...sx }} />;
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

export const Notifications = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <NotificationsIcon sx={{ fontSize, color, ...sx }} />;
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

export const Payment = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PaymentIcon sx={{ fontSize, color, ...sx }} />;
};

export const Upgrade = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <UpgradeIcon sx={{ fontSize, color, ...sx }} />;
};

export const Check = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CheckIcon sx={{ fontSize, color, ...sx }} />;
};

export const Email = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <EmailIcon sx={{ fontSize, color, ...sx }} />;
};

export const Phone = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PhoneIcon sx={{ fontSize, color, ...sx }} />;
};

export const Location = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <LocationIcon sx={{ fontSize, color, ...sx }} />;
};

export const Fingerprint = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <FingerprintIcon sx={{ fontSize, color, ...sx }} />;
};

export const History = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <HistoryIcon sx={{ fontSize, color, ...sx }} />;
};

export const Storage = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <StorageIcon sx={{ fontSize, color, ...sx }} />;
};

export const People = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PeopleIcon sx={{ fontSize, color, ...sx }} />;
};

export const Receipt = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ReceiptIcon sx={{ fontSize, color, ...sx }} />;
};

export const Inventory = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <InventoryIcon sx={{ fontSize, color, ...sx }} />;
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

export const Info = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <InfoIcon sx={{ fontSize, color, ...sx }} />;
};

export const Warning = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <WarningIcon sx={{ fontSize, color, ...sx }} />;
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

export const Lock = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <LockIcon sx={{ fontSize, color, ...sx }} />;
};

export const Refresh = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <RefreshIcon sx={{ fontSize, color, ...sx }} />;
};

export const Calendar = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CalendarIcon sx={{ fontSize, color, ...sx }} />;
};

export const CreditCard = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CreditCardIcon sx={{ fontSize, color, ...sx }} />;
};

export const Star = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <StarIcon sx={{ fontSize, color, ...sx }} />;
};

export const Premium = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PremiumIcon sx={{ fontSize, color, ...sx }} />;
};

export const Account = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <AccountIcon sx={{ fontSize, color, ...sx }} />;
};

// Export all icons as an object
export const ProfileIcons = {
  Person,
  Security,
  Notifications,
  Business,
  Payment,
  Upgrade,
  Check,
  Email,
  Phone,
  Location,
  Fingerprint,
  History,
  Storage,
  People,
  Receipt,
  Inventory,
  TrendingUp,
  Info,
  Warning,
  Verified,
  Lock,
  Refresh,
  Calendar,
  CreditCard,
  Star,
  Premium,
  Account,
};