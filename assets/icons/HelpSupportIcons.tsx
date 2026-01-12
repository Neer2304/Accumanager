import {
  ExpandMore as ExpandMoreIcon,
  ContactSupport as SupportIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Whatshot as WhatshotIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  SmartToy as AIIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Cloud as CloudIcon,
  Speed as SpeedIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  Forum as ForumIcon,
  LiveHelp as LiveHelpIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  TipsAndUpdates as TipsIcon,
  Lightbulb as LightbulbIcon,
  Flag as FlagIcon,
  BugReport as BugIcon,
  Feedback as FeedbackIcon,
  ThumbUp as ThumbUpIcon,
  VerifiedUser as VerifiedIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material';

interface IconProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const ExpandMore = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ExpandMoreIcon sx={{ fontSize, color, ...sx }} />;
};

export const Support = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <SupportIcon sx={{ fontSize, color, ...sx }} />;
};

export const Article = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ArticleIcon sx={{ fontSize, color, ...sx }} />;
};

export const Video = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <VideoIcon sx={{ fontSize, color, ...sx }} />;
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

export const Message = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <MessageIcon sx={{ fontSize, color, ...sx }} />;
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

export const Inventory = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <InventoryIcon sx={{ fontSize, color, ...sx }} />;
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

export const Event = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <EventIcon sx={{ fontSize, color, ...sx }} />;
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

export const Analytics = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <AnalyticsIcon sx={{ fontSize, color, ...sx }} />;
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

export const Payment = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PaymentIcon sx={{ fontSize, color, ...sx }} />;
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

export const Home = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <HomeIcon sx={{ fontSize, color, ...sx }} />;
};

export const Whatshot = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <WhatshotIcon sx={{ fontSize, color, ...sx }} />;
};

export const Schedule = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ScheduleIcon sx={{ fontSize, color, ...sx }} />;
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

export const AI = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <AIIcon sx={{ fontSize, color, ...sx }} />;
};

export const Close = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CloseIcon sx={{ fontSize, color, ...sx }} />;
};

export const Send = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <SendIcon sx={{ fontSize, color, ...sx }} />;
};

export const Search = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <SearchIcon sx={{ fontSize, color, ...sx }} />;
};

export const Download = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <DownloadIcon sx={{ fontSize, color, ...sx }} />;
};

export const Cloud = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <CloudIcon sx={{ fontSize, color, ...sx }} />;
};

export const Speed = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <SpeedIcon sx={{ fontSize, color, ...sx }} />;
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

export const Chat = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ChatIcon sx={{ fontSize, color, ...sx }} />;
};

export const Forum = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <ForumIcon sx={{ fontSize, color, ...sx }} />;
};

export const LiveHelp = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <LiveHelpIcon sx={{ fontSize, color, ...sx }} />;
};

export const MenuBook = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <MenuBookIcon sx={{ fontSize, color, ...sx }} />;
};

export const School = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <SchoolIcon sx={{ fontSize, color, ...sx }} />;
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

export const Lightbulb = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <LightbulbIcon sx={{ fontSize, color, ...sx }} />;
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

export const Bug = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <BugIcon sx={{ fontSize, color, ...sx }} />;
};

export const Feedback = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <FeedbackIcon sx={{ fontSize, color, ...sx }} />;
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

export const Verified = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <VerifiedIcon sx={{ fontSize, color, ...sx }} />;
};

export const Groups = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <GroupsIcon sx={{ fontSize, color, ...sx }} />;
};

export const Person = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <PersonIcon sx={{ fontSize, color, ...sx }} />;
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

export const AccessTime = ({ size = 'medium', color, sx }: IconProps) => {
  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48
  }[size];

  return <AccessTimeIcon sx={{ fontSize, color, ...sx }} />;
};

// Export all icons as an object
export const HelpSupportIcons = {
  ExpandMore,
  Support,
  Article,
  Video,
  Email,
  Phone,
  Message,
  CheckCircle,
  Inventory,
  Receipt,
  Event,
  People,
  Analytics,
  Security,
  Payment,
  Business,
  Home,
  Whatshot,
  Schedule,
  Star,
  AI,
  Close,
  Send,
  Search,
  Download,
  Cloud,
  Speed,
  Help,
  Chat,
  Forum,
  LiveHelp,
  MenuBook,
  School,
  Tips,
  Lightbulb,
  Flag,
  Bug,
  Feedback,
  ThumbUp,
  Verified,
  Groups,
  Person,
  Location,
  AccessTime,
};