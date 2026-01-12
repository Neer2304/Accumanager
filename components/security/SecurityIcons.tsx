import { SecurityIcons as Icons } from '@/assets/icons/SecurityIcons';

export interface SecurityIconProps {
  name: keyof typeof Icons;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  className?: string;
}

export const SecurityIcon = ({ name, size = 'medium', color, className }: SecurityIconProps) => {
  const IconComponent = Icons[name];
  return IconComponent ? <IconComponent size={size} color={color} className={className} /> : null;
};