import { LegalIcons } from '@/assets/icons/LegalIcons';
import { SxProps, Theme } from '@mui/material';

export interface LegalIconProps {
  name: keyof typeof LegalIcons;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  sx?: SxProps<Theme>;
}

export const LegalIcon = ({ name, size = 'medium', color, sx }: LegalIconProps) => {
  const IconComponent = LegalIcons[name];
  return <IconComponent size={size} color={color} sx={sx} />;
};

// Specific icon mapping for terms sections
export const getSectionIcon = (iconName: string): keyof typeof LegalIcons => {
  const iconMap: Record<string, keyof typeof LegalIcons> = {
    'Gavel': 'Gavel',
    'Business': 'Business',
    'Privacy': 'Privacy',
    'Security': 'Security',
    'Payment': 'Payment',
    'Description': 'Description',
    'History': 'History',
    'Update': 'Update',
    'Warning': 'Warning'
  };

  return iconMap[iconName] || 'Description';
};