export const getGoogleColors = (mode: 'light' | 'dark') => ({
  // Backgrounds
  bg: mode === 'dark' ? '#202124' : '#F6F8FC',
  surface: mode === 'dark' ? '#2B2930' : '#FFFFFF',
  surfaceHov: mode === 'dark' ? '#3C3A43' : '#F1F3F4',
  surfaceVar: mode === 'dark' ? '#38353D' : '#F4F0F9',
  
  // Borders
  border: mode === 'dark' ? 'rgba(202,196,208,0.12)' : 'rgba(73,69,79,0.12)',
  borderHov: mode === 'dark' ? '#A8C7FA' : '#1A73E8',
  
  // Text
  ink: mode === 'dark' ? '#E6E1E5' : '#1C1B1F',
  inkSub: mode === 'dark' ? '#CAC4D0' : '#49454F',
  inkMuted: mode === 'dark' ? '#938F99' : '#79747E',
  
  // Blue - Primary
  blue: mode === 'dark' ? '#A8C7FA' : '#1A73E8',
  blueHov: mode === 'dark' ? '#C4DEFF' : '#1557B0',
  blueSoft: mode === 'dark' ? 'rgba(168,199,250,0.1)' : 'rgba(26,115,232,0.07)',
  blueBorder: mode === 'dark' ? 'rgba(168,199,250,0.2)' : 'rgba(26,115,232,0.2)',
  blueContainer: mode === 'dark' ? '#0F2952' : '#D3E3FD',
  blueShadow: mode === 'dark' ? 'rgba(168,199,250,0.3)' : 'rgba(26,115,232,0.3)',
  blueLight: mode === 'dark' ? '#1a3b5c' : '#e8f0fe',
  blueDark: mode === 'dark' ? '#3367d6' : '#1a66c9',
  // Green - Success
  green: mode === 'dark' ? '#6DD58C' : '#137333',
  greenHov: mode === 'dark' ? '#8BE9A8' : '#0B5E2E',
  greenSoft: mode === 'dark' ? 'rgba(109,213,140,0.1)' : 'rgba(19,115,51,0.07)',
  greenBorder: mode === 'dark' ? 'rgba(109,213,140,0.2)' : 'rgba(19,115,51,0.2)',
  greenContainer: mode === 'dark' ? '#0A3D1F' : '#CEEAD6',
  greenShadow: mode === 'dark' ? 'rgba(109,213,140,0.3)' : 'rgba(19,115,51,0.3)',
  
  // Amber - Warning
  amber: mode === 'dark' ? '#FDD663' : '#B06000',
  amberHov: mode === 'dark' ? '#FEE48C' : '#8F4D00',
  amberSoft: mode === 'dark' ? 'rgba(253,214,99,0.1)' : 'rgba(176,96,0,0.07)',
  amberBorder: mode === 'dark' ? 'rgba(253,214,99,0.2)' : 'rgba(176,96,0,0.2)',
  amberContainer: mode === 'dark' ? '#3D2700' : '#FEF3CD',
  amberShadow: mode === 'dark' ? 'rgba(253,214,99,0.3)' : 'rgba(176,96,0,0.3)',
  
  // Yellow
  yellow: mode === 'dark' ? '#FFE57F' : '#F9AB00',
  yellowHov: mode === 'dark' ? '#FFF0B2' : '#F57C00',
  yellowSoft: mode === 'dark' ? 'rgba(255,229,127,0.1)' : 'rgba(249,171,0,0.07)',
  yellowBorder: mode === 'dark' ? 'rgba(255,229,127,0.2)' : 'rgba(249,171,0,0.2)',
  yellowContainer: mode === 'dark' ? '#5A4500' : '#FEF7E0',
  yellowShadow: mode === 'dark' ? 'rgba(255,229,127,0.3)' : 'rgba(249,171,0,0.3)',
  
  // Red - Error/Danger
  red: mode === 'dark' ? '#FF897D' : '#C5221F',
  redHov: mode === 'dark' ? '#FFA69C' : '#A51E1B',
  redSoft: mode === 'dark' ? 'rgba(255,137,125,0.1)' : 'rgba(197,34,31,0.07)',
  redBorder: mode === 'dark' ? 'rgba(255,137,125,0.2)' : 'rgba(197,34,31,0.2)',
  redContainer: mode === 'dark' ? '#601410' : '#FDECEA',
  redShadow: mode === 'dark' ? 'rgba(255,137,125,0.3)' : 'rgba(197,34,31,0.3)',
  
  // Purple - Accent
  purple: mode === 'dark' ? '#D0BCFF' : '#6750A4',
  purpleHov: mode === 'dark' ? '#E0D4FF' : '#533E82',
  purpleSoft: mode === 'dark' ? 'rgba(208,188,255,0.1)' : 'rgba(103,80,164,0.07)',
  purpleBorder: mode === 'dark' ? 'rgba(208,188,255,0.2)' : 'rgba(103,80,164,0.2)',
  purpleContainer: mode === 'dark' ? '#21005D' : '#EADDFF',
  purpleShadow: mode === 'dark' ? 'rgba(208,188,255,0.3)' : 'rgba(103,80,164,0.3)',
  
  // Indigo
  indigo: mode === 'dark' ? '#89A7F0' : '#3949AB',
  indigoHov: mode === 'dark' ? '#A8C2FF' : '#2E3B8F',
  indigoSoft: mode === 'dark' ? 'rgba(137,167,240,0.1)' : 'rgba(57,73,171,0.07)',
  indigoBorder: mode === 'dark' ? 'rgba(137,167,240,0.2)' : 'rgba(57,73,171,0.2)',
  indigoContainer: mode === 'dark' ? '#1A237E' : '#E8EAF6',
  indigoShadow: mode === 'dark' ? 'rgba(137,167,240,0.3)' : 'rgba(57,73,171,0.3)',
  
  // Teal
  teal: mode === 'dark' ? '#6DD4B6' : '#00796B',
  tealHov: mode === 'dark' ? '#8FE5CC' : '#00635A',
  tealSoft: mode === 'dark' ? 'rgba(109,212,182,0.1)' : 'rgba(0,121,107,0.07)',
  tealBorder: mode === 'dark' ? 'rgba(109,212,182,0.2)' : 'rgba(0,121,107,0.2)',
  tealContainer: mode === 'dark' ? '#004D40' : '#E0F2F1',
  tealShadow: mode === 'dark' ? 'rgba(109,212,182,0.3)' : 'rgba(0,121,107,0.3)',
  
  // Pink
  pink: mode === 'dark' ? '#F48FB1' : '#C2185B',
  pinkHov: mode === 'dark' ? '#F8B0CA' : '#A0154A',
  pinkSoft: mode === 'dark' ? 'rgba(244,143,177,0.1)' : 'rgba(194,24,91,0.07)',
  pinkBorder: mode === 'dark' ? 'rgba(244,143,177,0.2)' : 'rgba(194,24,91,0.2)',
  pinkContainer: mode === 'dark' ? '#880E4F' : '#FCE4EC',
  pinkShadow: mode === 'dark' ? 'rgba(244,143,177,0.3)' : 'rgba(194,24,91,0.3)',
  
  // Orange
  orange: mode === 'dark' ? '#FFB570' : '#E65100',
  orangeHov: mode === 'dark' ? '#FFC98F' : '#BF4C00',
  orangeSoft: mode === 'dark' ? 'rgba(255,181,112,0.1)' : 'rgba(230,81,0,0.07)',
  orangeBorder: mode === 'dark' ? 'rgba(255,181,112,0.2)' : 'rgba(230,81,0,0.2)',
  orangeContainer: mode === 'dark' ? '#BF360C' : '#FFF3E0',
  orangeShadow: mode === 'dark' ? 'rgba(255,181,112,0.3)' : 'rgba(230,81,0,0.3)',
  
  // Cyan
  cyan: mode === 'dark' ? '#77D4E0' : '#00838F',
  cyanHov: mode === 'dark' ? '#9BE2EB' : '#006974',
  cyanSoft: mode === 'dark' ? 'rgba(119,212,224,0.1)' : 'rgba(0,131,143,0.07)',
  cyanBorder: mode === 'dark' ? 'rgba(119,212,224,0.2)' : 'rgba(0,131,143,0.2)',
  cyanContainer: mode === 'dark' ? '#006064' : '#E0F7FA',
  cyanShadow: mode === 'dark' ? 'rgba(119,212,224,0.3)' : 'rgba(0,131,143,0.3)',
  
  // Brown
  brown: mode === 'dark' ? '#B68B7A' : '#5D4037',
  brownHov: mode === 'dark' ? '#CAA596' : '#4A332C',
  brownSoft: mode === 'dark' ? 'rgba(182,139,122,0.1)' : 'rgba(93,64,55,0.07)',
  brownBorder: mode === 'dark' ? 'rgba(182,139,122,0.2)' : 'rgba(93,64,55,0.2)',
  brownContainer: mode === 'dark' ? '#3E2723' : '#EFEBE9',
  brownShadow: mode === 'dark' ? 'rgba(182,139,122,0.3)' : 'rgba(93,64,55,0.3)',
  
  // Gray
  gray: mode === 'dark' ? '#BDC1C6' : '#5F6368',
  grayHov: mode === 'dark' ? '#DADCE0' : '#3C4043',
  graySoft: mode === 'dark' ? 'rgba(189,193,198,0.1)' : 'rgba(95,99,104,0.07)',
  grayBorder: mode === 'dark' ? 'rgba(189,193,198,0.2)' : 'rgba(95,99,104,0.2)',
  grayContainer: mode === 'dark' ? '#3C4043' : '#F1F3F4',
  grayShadow: mode === 'dark' ? 'rgba(189,193,198,0.3)' : 'rgba(95,99,104,0.3)',
  
  //shadows
  shadow: mode === 'dark' ? '#fffafa' : '#878787',
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Chart colors
  chartColors: [
    mode === 'dark' ? '#A8C7FA' : '#1A73E8', // blue
    mode === 'dark' ? '#6DD58C' : '#137333', // green
    mode === 'dark' ? '#FDD663' : '#B06000', // amber
    mode === 'dark' ? '#FF897D' : '#C5221F', // red
    mode === 'dark' ? '#D0BCFF' : '#6750A4', // purple
    mode === 'dark' ? '#FFE57F' : '#F9AB00', // yellow
    mode === 'dark' ? '#89A7F0' : '#3949AB', // indigo
    mode === 'dark' ? '#6DD4B6' : '#00796B', // teal
    mode === 'dark' ? '#F48FB1' : '#C2185B', // pink
    mode === 'dark' ? '#FFB570' : '#E65100', // orange
  ],
  
  // Status colors mapping
  status: {
    success: mode === 'dark' ? '#6DD58C' : '#137333',
    warning: mode === 'dark' ? '#FDD663' : '#B06000',
    error: mode === 'dark' ? '#FF897D' : '#C5221F',
    info: mode === 'dark' ? '#A8C7FA' : '#1A73E8',
    pending: mode === 'dark' ? '#FDD663' : '#B06000',
    active: mode === 'dark' ? '#6DD58C' : '#137333',
    inactive: mode === 'dark' ? '#BDC1C6' : '#5F6368',
    disabled: mode === 'dark' ? '#5F6368' : '#9AA0A6',
    highlight: mode === 'dark' ? '#FFE57F' : '#F9AB00',
  },
});

export const GOOGLE_AVATAR_COLORS = ['#4285F4', '#34A853', '#EA4335', '#FBBC04', '#9334E6', '#00ACC1'];
export const GS = '"Google Sans", Roboto, sans-serif';

export const getAvatarColor = (id?: string) => 
  GOOGLE_AVATAR_COLORS[((id ?? 'a').charCodeAt(0)) % GOOGLE_AVATAR_COLORS.length];

// Type definition for the colors object
export type GoogleColors = ReturnType<typeof getGoogleColors>;