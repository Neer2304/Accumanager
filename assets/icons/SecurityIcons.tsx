import {
  Shield,
  Lock,
  Server,
  Database,
  Globe,
  CheckCircle,
  FileText,
  Users,
  RefreshCw,
  Cpu,
  Cloud,
  ArrowRight,
  Zap,
  Building,
  CreditCard,
  Eye,
  Key,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  Bell,
  Mail,
  HelpCircle,
  ShieldOff,
  Network,
  Code,
  BarChart,
  History,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  FileCode,
  Link,
} from 'lucide-react';
import { SxProps, Theme } from '@mui/material';

interface IconProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  className?: string;
}

// Security icons from lucide-react
export const ShieldIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Shield size={iconSize} color={color} className={className} />;
};

export const LockIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Lock size={iconSize} color={color} className={className} />;
};

export const ServerIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Server size={iconSize} color={color} className={className} />;
};

export const DatabaseIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Database size={iconSize} color={color} className={className} />;
};

export const GlobeIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Globe size={iconSize} color={color} className={className} />;
};

export const CheckCircleIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CheckCircle size={iconSize} color={color} className={className} />;
};

export const FileTextIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <FileText size={iconSize} color={color} className={className} />;
};

export const UsersIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Users size={iconSize} color={color} className={className} />;
};

export const RefreshIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <RefreshCw size={iconSize} color={color} className={className} />;
};

export const CpuIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Cpu size={iconSize} color={color} className={className} />;
};

export const CloudIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Cloud size={iconSize} color={color} className={className} />;
};

export const ArrowRightIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ArrowRight size={iconSize} color={color} className={className} />;
};

export const ZapIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Zap size={iconSize} color={color} className={className} />;
};

export const BuildingIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Building size={iconSize} color={color} className={className} />;
};

export const CreditCardIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CreditCard size={iconSize} color={color} className={className} />;
};

export const EyeIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Eye size={iconSize} color={color} className={className} />;
};

export const KeyIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Key size={iconSize} color={color} className={className} />;
};

export const FingerprintIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Fingerprint size={iconSize} color={color} className={className} />;
};

export const ShieldCheckIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ShieldCheck size={iconSize} color={color} className={className} />;
};

export const AlertCircleIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <AlertCircle size={iconSize} color={color} className={className} />;
};

export const BellIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Bell size={iconSize} color={color} className={className} />;
};

export const MailIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Mail size={iconSize} color={color} className={className} />;
};

export const HelpCircleIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <HelpCircle size={iconSize} color={color} className={className} />;
};

export const NetworkIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Network size={iconSize} color={color} className={className} />;
};

export const CodeIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Code size={iconSize} color={color} className={className} />;
};

export const BarChartIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <BarChart size={iconSize} color={color} className={className} />;
};

export const HistoryIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <History size={iconSize} color={color} className={className} />;
};

export const DownloadIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Download size={iconSize} color={color} className={className} />;
};

export const UploadIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Upload size={iconSize} color={color} className={className} />;
};

export const SettingsIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Settings size={iconSize} color={color} className={className} />;
};

export const AlertTriangleIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <AlertTriangle size={iconSize} color={color} className={className} />;
};

export const FileCodeIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <FileCode size={iconSize} color={color} className={className} />;
};

export const LinkIcon = ({ size = 'medium', color, className }: IconProps) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <Link size={iconSize} color={color} className={className} />;
};

// Export all icons as an object
export const SecurityIcons = {
  Shield: ShieldIcon,
  Lock: LockIcon,
  Server: ServerIcon,
  Database: DatabaseIcon,
  Globe: GlobeIcon,
  CheckCircle: CheckCircleIcon,
  FileText: FileTextIcon,
  Users: UsersIcon,
  Refresh: RefreshIcon,
  Cpu: CpuIcon,
  Cloud: CloudIcon,
  ArrowRight: ArrowRightIcon,
  Zap: ZapIcon,
  Building: BuildingIcon,
  CreditCard: CreditCardIcon,
  Eye: EyeIcon,
  Key: KeyIcon,
  Fingerprint: FingerprintIcon,
  ShieldCheck: ShieldCheckIcon,
  AlertCircle: AlertCircleIcon,
  Bell: BellIcon,
  Mail: MailIcon,
  HelpCircle: HelpCircleIcon,
  Network: NetworkIcon,
  Code: CodeIcon,
  BarChart: BarChartIcon,
  History: HistoryIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Settings: SettingsIcon,
  AlertTriangle: AlertTriangleIcon,
  FileCode: FileCodeIcon,
  Link: LinkIcon,
};