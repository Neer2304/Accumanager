// components/googlecompanydashboard/constants/index.ts
export const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff'
};

export const quickActions = [
  {
    id: 'invite',
    label: 'Add Team Member',
    description: 'Invite new members to your team',
    icon: 'plus',
    color: GOOGLE_COLORS.blue,
    path: 'members/invite'
  },
  {
    id: 'project',
    label: 'Create Project',
    description: 'Start a new project',
    icon: 'chart',
    color: GOOGLE_COLORS.green,
    path: '/projects/create'
  },
  {
    id: 'settings',
    label: 'Company Settings',
    description: 'Update company information',
    icon: 'settings',
    color: GOOGLE_COLORS.grey,
    path: 'settings'
  },
  {
    id: 'billing',
    label: 'Upgrade Plan',
    description: 'Get more features and limits',
    icon: 'card',
    color: GOOGLE_COLORS.purple,
    path: '/billing'
  }
];