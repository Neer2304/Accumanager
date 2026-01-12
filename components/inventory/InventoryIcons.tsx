import { InventoryIcons as Icons } from '@/assets/icons/InventoryIcons';
import { SxProps, Theme } from '@mui/material';

export interface InventoryIconProps {
  name: keyof typeof Icons;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const InventoryIcon = ({ name, size = 'medium', color, sx }: InventoryIconProps) => {
  const IconComponent = Icons[name];
  return IconComponent ? <IconComponent size={size} color={color} sx={sx} /> : null;
};