// components/googleadminlayout/components/types.ts
export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  mobileText?: string;
}

export interface GoogleColors {
  primary: '#1a73e8';
  primaryLight: '#8ab4f8';
  primaryDark: '#1669c1';
  secondary: '#34a853';
  warning: '#fbbc04';
  error: '#ea4335';
  grey50: '#f8f9fa';
  grey100: '#f1f3f4';
  grey200: '#e8eaed';
  grey300: '#dadce0';
  grey400: '#bdc1c6';
  grey500: '#9aa0a6';
  grey600: '#80868b';
  grey700: '#5f6368';
  grey800: '#3c4043';
  grey900: '#202124';
  cardBgLight: '#ffffff';
  cardBgDark: '#303134';
}

export const googleColors: GoogleColors = {
  primary: '#1a73e8',
  primaryLight: '#8ab4f8',
  primaryDark: '#1669c1',
  secondary: '#34a853',
  warning: '#fbbc04',
  error: '#ea4335',
  grey50: '#f8f9fa',
  grey100: '#f1f3f4',
  grey200: '#e8eaed',
  grey300: '#dadce0',
  grey400: '#bdc1c6',
  grey500: '#9aa0a6',
  grey600: '#80868b',
  grey700: '#5f6368',
  grey800: '#3c4043',
  grey900: '#202124',
  cardBgLight: '#ffffff',
  cardBgDark: '#303134',
};