// components/googlecompaniescreate/constants/index.ts
export const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4'
};

export const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Retail',
  'Manufacturing',
  'Construction',
  'Transportation',
  'Hospitality',
  'Media',
  'Consulting',
  'Legal',
  'Marketing',
  'Other'
];

export const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' }
];

export const freePlanFeatures = [
  'Up to 10 team members',
  'Basic project management',
  'Task tracking',
  'Team collaboration'
];

export const initialFormData = {
  name: '',
  email: '',
  phone: '',
  industry: '',
  size: '1-10',
  website: '',
  address: {
    street: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: ''
  }
};