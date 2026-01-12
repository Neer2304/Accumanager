import { HelpSupportIcons as Icons } from '@/assets/icons/HelpSupportIcons';
import { SxProps, Theme } from '@mui/material';

export interface HelpSupportIconProps {
  name: keyof typeof Icons;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const HelpSupportIcon = ({ name, size = 'medium', color, sx }: HelpSupportIconProps) => {
  const IconComponent = Icons[name];
  return <IconComponent size={size} color={color} sx={sx} />;
};