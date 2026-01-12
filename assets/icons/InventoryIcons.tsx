import {
  Add,
  Search,
  Inventory as InventoryIcon,
  Warning,
  CheckCircle,
  Error,
  LocalShipping,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  FilterList,
  Download,
  MoreVert,
  TrendingUp,
  TrendingDown,
  BarChart,
  QrCode2,
  Category,
  PriceChange,
  MonetizationOn,
  Store,
  Assessment,
  Receipt,
  AttachMoney,
  Timeline,
  Speed,
  Inventory2,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

interface IconProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

// Main inventory icons
export const Inventory = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <InventoryIcon sx={{ fontSize, color, ...sx }} />;
};

export const AddIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Add sx={{ fontSize, color, ...sx }} />;
};

export const SearchIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Search sx={{ fontSize, color, ...sx }} />;
};

export const WarningIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Warning sx={{ fontSize, color, ...sx }} />;
};

export const CheckCircleIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <CheckCircle sx={{ fontSize, color, ...sx }} />;
};

export const ErrorIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Error sx={{ fontSize, color, ...sx }} />;
};

export const ShippingIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <LocalShipping sx={{ fontSize, color, ...sx }} />;
};

export const RefreshIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Refresh sx={{ fontSize, color, ...sx }} />;
};

export const FilterIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <FilterList sx={{ fontSize, color, ...sx }} />;
};

export const DownloadIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Download sx={{ fontSize, color, ...sx }} />;
};

export const MoreVertIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <MoreVert sx={{ fontSize, color, ...sx }} />;
};

export const TrendingUpIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <TrendingUp sx={{ fontSize, color, ...sx }} />;
};

export const TrendingDownIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <TrendingDown sx={{ fontSize, color, ...sx }} />;
};

export const BarChartIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <BarChart sx={{ fontSize, color, ...sx }} />;
};

export const QrCodeIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <QrCode2 sx={{ fontSize, color, ...sx }} />;
};

export const CategoryIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Category sx={{ fontSize, color, ...sx }} />;
};

export const PriceChangeIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <PriceChange sx={{ fontSize, color, ...sx }} />;
};

export const MonetizationOnIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <MonetizationOn sx={{ fontSize, color, ...sx }} />;
};

export const StoreIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Store sx={{ fontSize, color, ...sx }} />;
};

export const PackageIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <PackageIcon sx={{ fontSize, color, ...sx }} />;
};

export const AssessmentIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Assessment sx={{ fontSize, color, ...sx }} />;
};

export const ReceiptIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Receipt sx={{ fontSize, color, ...sx }} />;
};

export const AttachMoneyIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <AttachMoney sx={{ fontSize, color, ...sx }} />;
};

export const TimelineIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Timeline sx={{ fontSize, color, ...sx }} />;
};

export const SpeedIcon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Speed sx={{ fontSize, color, ...sx }} />;
};

export const Inventory2Icon = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
    extraLarge: 40
  }[size];

  return <Inventory2 sx={{ fontSize, color, ...sx }} />;
};

// Export all icons as an object
export const InventoryIcons = {
  Inventory,
  Add: AddIcon,
  Search: SearchIcon,
  Warning: WarningIcon,
  CheckCircle: CheckCircleIcon,
  Error: ErrorIcon,
  Shipping: ShippingIcon,
  Refresh: RefreshIcon,
  Filter: FilterIcon,
  Download: DownloadIcon,
  MoreVert: MoreVertIcon,
  TrendingUp: TrendingUpIcon,
  TrendingDown: TrendingDownIcon,
  BarChart: BarChartIcon,
  QrCode: QrCodeIcon,
  Category: CategoryIcon,
  PriceChange: PriceChangeIcon,
  MonetizationOn: MonetizationOnIcon,
  Store: StoreIcon,
  Package: PackageIcon,
  Assessment: AssessmentIcon,
  Receipt: ReceiptIcon,
  AttachMoney: AttachMoneyIcon,
  Timeline: TimelineIcon,
  Speed: SpeedIcon,
  Inventory2: Inventory2Icon,
};