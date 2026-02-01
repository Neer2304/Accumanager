"use client";

import React from 'react';
import * as MuiIcons from '@mui/icons-material';
import { Icon, IconName } from '../common/icons/index';
import { SvgIconProps } from '@mui/material';

// Material UI Icons mapped to your icon system
interface MuiIconProps extends SvgIconProps {
  name: keyof typeof MuiIcons;
}

export const MuiIcon = ({ 
  name, 
  fontSize = 'medium',
  color,
  className,
  ...props
}: MuiIconProps) => {
  const IconComponent = MuiIcons[name];
  if (!IconComponent) return null;
  
  return <IconComponent fontSize={fontSize} color={color} className={className} {...props} />;
};

// Combined icon system that can use both your SVG icons and Material UI icons
interface CombinedIconProps extends SvgIconProps {
  name: IconName | keyof typeof MuiIcons;
  size?: number;
}

export const CombinedIcon: React.FC<CombinedIconProps> = ({ 
  name, 
  size = 20, 
  color, 
  className,
  ...props 
}) => {
  // Check if it's a Material UI icon
  if (name in MuiIcons) {
    return (
      <MuiIcon 
        name={name as keyof typeof MuiIcons} 
        sx={{ fontSize: size, color }}
        className={className}
        {...props}
      />
    );
  }
  
  // Otherwise use your SVG icon
  return <Icon name={name as IconName} size={size} color={color} className={className} />;
};