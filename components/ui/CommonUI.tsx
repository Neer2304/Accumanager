// components/ui/CommonUI.tsx
import React from 'react';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Star,
  Verified,
  TrendingUp,
  NewReleases,
  ThumbUp,
  Add,
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  AccessTime,
  CheckCircle,
  Error,
  Warning,
  Info,
  ArrowForward,
  ArrowBack,
  Close,
  Menu,
  ExpandMore,
  ExpandLess,
  MoreVert,
  Share,
  Favorite,
  Bookmark,
  Download,
  Upload,
  Delete,
  Edit,
  Save,
  Cancel,
  Refresh,
  Help,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  Lock,
  Visibility,
  VisibilityOff,
  Link,
  OpenInNew,
  ContentCopy,
  QrCode,
  Payment,
  Receipt,
  CreditCard,
  AttachMoney,
  TrendingFlat,
  BarChart,
  PieChart,
  ShowChart,
  Dashboard,
  Inventory,
  People,
  ShoppingCart,
  Store,
  LocalOffer,
  Description,
  Folder,
  Image,
  MusicNote,
  Attachment,
  CloudUpload,
  CloudDownload,
  Wifi,
  BatteryFull,
  SignalCellularAlt,
  Bluetooth,
  WifiOff,
  BatteryAlert,
  SignalCellularOff,
  BluetoothDisabled
} from '@mui/icons-material';

// ============ ICON COMPONENTS ============
export { 
  Search, FilterList, Star, Verified, TrendingUp, NewReleases, ThumbUp, Add,
  Person, Business, Email, Phone, LocationOn, CalendarToday, AccessTime,
  CheckCircle, Error, Warning, Info, ArrowForward, ArrowBack, Close, Menu,
  ExpandMore, ExpandLess, MoreVert, Share, Favorite, Bookmark, Download,
  Upload, Delete, Edit, Save, Cancel, Refresh, Help, Settings, Notifications,
  AccountCircle, Logout, Lock, Visibility, VisibilityOff, Link, OpenInNew,
  ContentCopy, QrCode, Payment, Receipt, CreditCard, AttachMoney, TrendingFlat,
  BarChart, PieChart, ShowChart, Dashboard, Inventory, People, ShoppingCart,
  Store, LocalOffer, Description, Folder, Image, MusicNote, Attachment,
  CloudUpload, CloudDownload, Wifi, BatteryFull, SignalCellularAlt, Bluetooth,
  WifiOff, BatteryAlert, SignalCellularOff, BluetoothDisabled
};

// ============ TEXT COMPONENTS ============
interface TextProps {
  children: React.ReactNode;
  className?: string;
  sx?: any;
}

export const H1: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="h1" className={className} sx={{ fontWeight: 'bold', ...sx }}>
    {children}
  </Typography>
);

export const H2: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="h2" className={className} sx={{ fontWeight: 'bold', ...sx }}>
    {children}
  </Typography>
);

export const H3: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="h3" className={className} sx={{ fontWeight: 'bold', ...sx }}>
    {children}
  </Typography>
);

export const H4: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="h4" className={className} sx={{ fontWeight: 'bold', ...sx }}>
    {children}
  </Typography>
);

export const H5: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="h5" className={className} sx={{ fontWeight: 'bold', ...sx }}>
    {children}
  </Typography>
);

export const H6: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="h6" className={className} sx={{ fontWeight: 'bold', ...sx }}>
    {children}
  </Typography>
);

export const Body1: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="body1" className={className} sx={sx}>
    {children}
  </Typography>
);

export const Body2: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="body2" className={className} sx={sx}>
    {children}
  </Typography>
);

export const Caption: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="caption" className={className} sx={sx}>
    {children}
  </Typography>
);

export const Overline: React.FC<TextProps> = ({ children, className = '', sx = {} }) => (
  <Typography variant="overline" className={className} sx={sx}>
    {children}
  </Typography>
);

// ============ SKELETON COMPONENTS ============
interface SkeletonProps {
  width?: string | number;
  height?: number;
  variant?: 'text' | 'rounded' | 'rectangular' | 'circular';
  sx?: any;
}

export const SkeletonText: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  variant = 'text',
  sx = {}
}) => (
  <Skeleton 
    variant={variant} 
    width={width} 
    height={height} 
    sx={{ borderRadius: variant === 'text' ? 1 : 2, ...sx }} 
  />
);

export const SkeletonButton: React.FC<SkeletonProps & { icon?: boolean }> = ({ 
  width = 120, 
  height = 40,
  icon = false,
  sx = {}
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
    {icon && <Skeleton variant="circular" width={20} height={20} />}
    <Skeleton variant="rectangular" width={width} height={height} sx={{ borderRadius: 2 }} />
  </Box>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton variant="circular" width={size} height={size} />
);

export const SkeletonCard: React.FC<{ 
  showBadge?: boolean;
  showActions?: boolean;
  children?: React.ReactNode;
}> = ({ showBadge = false, showActions = false, children }) => (
  <Card sx={{ height: '100%', position: 'relative' }}>
    <CardContent sx={{ p: 3 }}>
      {showBadge && (
        <Skeleton 
          variant="rectangular" 
          width={100} 
          height={24} 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            borderRadius: 12 
          }} 
        />
      )}
      
      {children || (
        <>
          <Box sx={{ mb: 3 }}>
            <SkeletonText width="60%" height={30} sx={{ mb: 1 }} />
            <SkeletonText width="80%" height={40} sx={{ mb: 1 }} />
            <SkeletonText width="50%" height={20} />
          </Box>

          <Box sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((feature) => (
              <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                <SkeletonText width="80%" height={20} />
              </Box>
            ))}
          </Box>

          {showActions && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <SkeletonButton width={100} />
              <SkeletonButton width={100} />
            </Box>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

// ============ COMMON LAYOUT COMPONENTS ============
export const NavigationSkeleton: React.FC = () => (
  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <SkeletonText width={120} height={40} />
    <Box sx={{ display: 'flex', gap: 2 }}>
      <SkeletonButton width={100} height={40} />
      <SkeletonButton width={100} height={40} />
    </Box>
  </Box>
);

export const HeaderSkeleton: React.FC<{ 
  titleWidth?: string;
  descriptionWidth?: string;
  showButton?: boolean;
}> = ({ 
  titleWidth = "60%",
  descriptionWidth = "80%",
  showButton = true
}) => (
  <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
    <SkeletonText width={titleWidth} height={60} sx={{ mx: 'auto', mb: 2 }} />
    <SkeletonText width={descriptionWidth} height={30} sx={{ mx: 'auto', mb: 4 }} />
    {showButton && <SkeletonButton width={200} height={50} sx={{ mx: 'auto' }} />}
  </Box>
);

export const GridSkeleton: React.FC<{ 
  items?: number;
  cols?: { xs: number; sm: number; md: number; lg?: number };
  cardHeight?: number;
}> = ({ 
  items = 4,
  cols = { xs: 12, sm: 6, md: 3 },
  cardHeight = 300
}) => (
  <Box sx={{ 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: 3,
    justifyContent: 'center'
  }}>
    {Array.from({ length: items }).map((_, index) => (
      <Box key={index} sx={{ 
        width: { 
          xs: '100%', 
          sm: `calc(${100 / cols.sm}% - 12px)`, 
          md: `calc(${100 / cols.md}% - 12px)`,
          lg: cols.lg ? `calc(${100 / cols.lg}% - 12px)` : undefined
        },
        minWidth: { xs: '100%', sm: '300px', md: '250px' }
      }}>
        <SkeletonCard />
      </Box>
    ))}
  </Box>
);

// ============ FORM COMPONENTS ============
export const SearchInput: React.FC<{
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  sx?: any;
}> = ({ placeholder = "Search...", value, onChange, onSubmit, sx = {} }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} style={{ flex: 1 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        size="small"
        sx={sx}
      />
    </form>
  );
};

export const SelectFilter: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  sx?: any;
}> = ({ label, value, onChange, options, sx = {} }) => (
  <FormControl size="small" sx={{ minWidth: 120, ...sx }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

// ============ DATA DISPLAY COMPONENTS ============
export const UserAvatar: React.FC<{
  name?: string;
  email?: string;
  size?: number;
  src?: string;
}> = ({ name, email, size = 40, src }) => {
  const getInitials = () => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Avatar
      sx={{ 
        width: size, 
        height: size,
        bgcolor: src ? undefined : 'primary.main'
      }}
      src={src}
    >
      {getInitials()}
    </Avatar>
  );
};

export const RatingStars: React.FC<{
  value: number;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  onChange?: (value: number) => void;
}> = ({ value, readOnly = true, size = 'small', onChange }) => (
  <Rating 
    value={value} 
    readOnly={readOnly}
    size={size}
    onChange={(_, newValue) => onChange?.(newValue || 0)}
  />
);

export const StatusChip: React.FC<{
  status: 'success' | 'error' | 'warning' | 'info' | 'default';
  label: string;
}> = ({ status, label }) => {
  const colorMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    default: 'default'
  } as const;

  return (
    <Chip 
      label={label}
      color={colorMap[status]}
      variant="outlined"
      size="small"
    />
  );
};

// ============ FEEDBACK COMPONENTS ============
export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
    <CircularProgress size={size} />
  </Box>
);

export const ErrorAlert: React.FC<{
  message: string;
  onRetry?: () => void;
  retryText?: string;
}> = ({ message, onRetry, retryText = 'Retry' }) => (
  <Alert 
    severity="error"
    action={
      onRetry && (
        <Button color="inherit" size="small" onClick={onRetry}>
          {retryText}
        </Button>
      )
    }
  >
    {message}
  </Alert>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, description, icon, action }) => (
  <Paper sx={{ p: 6, textAlign: 'center' }}>
    {icon && (
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </Box>
    )}
    <Typography variant="h5" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {description}
    </Typography>
    {action}
  </Paper>
);