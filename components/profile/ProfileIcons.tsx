import { ProfileIcons } from '@/assets/icons/ProfileIcons';
import { SxProps, Theme } from '@mui/material';

export interface ProfileIconProps {
  name: keyof typeof ProfileIcons;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const ProfileIcon = ({ name, size = 'medium', color, sx }: ProfileIconProps) => {
  const IconComponent = ProfileIcons[name];
  return <IconComponent size={size} color={color} sx={sx} />;
};