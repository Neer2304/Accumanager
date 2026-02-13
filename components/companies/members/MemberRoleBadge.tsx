'use client';

import { Chip } from "@mui/material";
import { Shield, UserCog, Eye, User } from 'lucide-react';

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  purple: '#7c4dff',
  green: '#1e8e3e',
  grey: '#5f6368',
  darkGrey: '#3c4043'
};

interface MemberRoleBadgeProps {
  role: string;
  darkMode?: boolean;
}

export default function MemberRoleBadge({ role, darkMode = false }: MemberRoleBadgeProps) {
  const getRoleConfig = () => {
    switch(role) {
      case 'admin':
        return {
          icon: Shield,
          label: 'Admin',
          color: GOOGLE_COLORS.purple,
          bgAlpha: darkMode ? 0.2 : 0.1
        };
      case 'manager':
        return {
          icon: UserCog,
          label: 'Manager',
          color: GOOGLE_COLORS.blue,
          bgAlpha: darkMode ? 0.2 : 0.1
        };
      case 'viewer':
        return {
          icon: Eye,
          label: 'Viewer',
          color: GOOGLE_COLORS.grey,
          bgAlpha: darkMode ? 0.2 : 0.1
        };
      case 'member':
      default:
        return {
          icon: User,
          label: 'Member',
          color: GOOGLE_COLORS.green,
          bgAlpha: darkMode ? 0.2 : 0.1
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon size={14} />}
      label={config.label}
      size="small"
      sx={{
        bgcolor: `${config.color}${Math.round(config.bgAlpha * 100).toString(16).padStart(2, '0')}`,
        color: darkMode ? `${config.color}cc` : config.color,
        border: `1px solid ${config.color}${darkMode ? '40' : '20'}`,
        textTransform: 'capitalize',
        fontSize: '0.75rem',
        fontWeight: 500,
        height: '24px',
        borderRadius: '16px',
        '& .MuiChip-icon': { 
          color: 'inherit',
          marginLeft: '4px',
          width: '14px',
          height: '14px'
        },
        '& .MuiChip-label': {
          px: 1.5
        }
      }}
    />
  );
}