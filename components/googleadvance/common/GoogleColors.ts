// components/googleadvance/common/GoogleColors.ts

import { GoogleColors } from '../types';

export const googleColors: GoogleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
};

export const getCurrentColors = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? googleColors.dark : googleColors.light;
};

export const getButtonColor = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? googleColors.red : googleColors.blue;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'completed':
    case 'success':
      return googleColors.green;
    case 'pending':
    case 'scheduled':
    case 'medium':
      return googleColors.yellow;
    case 'cancelled':
    case 'expired':
    case 'high':
    case 'urgent':
      return googleColors.red;
    case 'draft':
    case 'inactive':
    case 'low':
    default:
      return googleColors.blue;
  }
};

export const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
  switch (impact) {
    case 'high': return googleColors.red;
    case 'medium': return googleColors.yellow;
    case 'low': return googleColors.green;
    default: return googleColors.blue;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
    case 'high':
      return googleColors.red;
    case 'medium':
      return googleColors.yellow;
    case 'low':
      return googleColors.green;
    default:
      return googleColors.blue;
  }
};